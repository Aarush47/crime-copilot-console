from fastapi import APIRouter, UploadFile, File, HTTPException
import csv
import io
from typing import List, Dict, Any
from app.database.repositories.case_repository import CaseRepository
from app.utils.logger import logger

router = APIRouter(tags=["Upload"])

@router.post(
    "/upload/cases",
    summary="Upload Cases via CSV",
    description="Parses a CSV file containing case records and inserts them into the Catalyst Data Store.",
    responses={
        200: {"description": "Upload successful"},
        400: {"description": "Invalid file format or missing columns"},
    }
)
async def upload_cases(files: List[UploadFile] = File(...)):
    results = []
    
    from app.database.connection import db
    datastore = db.get_datastore()
    if not datastore:
        raise HTTPException(status_code=500, detail="Datastore SDK unavailable")

    for file in files:
        if not file.filename.endswith(".csv"):
            results.append({"file": file.filename, "error": "Only .csv files are supported."})
            continue
            
        target_table = file.filename.rsplit('.', 1)[0]
        
        try:
            content = await file.read()
            text_content = content.decode("utf-8")
            csv_reader = csv.DictReader(io.StringIO(text_content))
            
            records_to_insert = []
            for row in csv_reader:
                # Keep only non-empty keys and strip whitespace
                clean_row = {k.strip(): v.strip() for k, v in row.items() if k and k.strip()}
                if clean_row:
                    records_to_insert.append(clean_row)
                    
            if not records_to_insert:
                results.append({"file": file.filename, "error": "No data found in CSV."})
                continue
                
            table = datastore.table(target_table)
            
            chunk_size = 50
            inserted_count = 0
            failed_rows = 0
            error_details = []
            
            for i in range(0, len(records_to_insert), chunk_size):
                chunk = records_to_insert[i:i + chunk_size]
                try:
                    res = table.insert_rows(chunk)
                    inserted_count += len(res) if isinstance(res, list) else len(chunk)
                except Exception as chunk_e:
                    logger.warning(f"Chunk insert failed for {target_table}, trying row by row. Error: {chunk_e}")
                    # Try row by row to detect duplicates or specific validation failures
                    for row_data in chunk:
                        try:
                            table.insert_rows([row_data])
                            inserted_count += 1
                        except Exception as row_e:
                            failed_rows += 1
                            err_msg = str(row_e)
                            if err_msg not in error_details:
                                error_details.append(err_msg)
            
            res_dict = {
                "file": file.filename,
                "target_table": target_table,
                "inserted": inserted_count,
            }
            if failed_rows > 0:
                res_dict["failed"] = failed_rows
                res_dict["errors"] = error_details
                
            results.append(res_dict)
            
        except Exception as e:
            logger.error(f"Error parsing CSV upload ({file.filename}): {e}")
            results.append({"file": file.filename, "error": str(e)})

    return {"message": "Upload process completed.", "results": results}

@router.get("/schema/{table_name}")
async def get_schema(table_name: str):
    try:
        from app.database.connection import db
        datastore = db.get_datastore()
        if not datastore:
            raise HTTPException(status_code=500, detail="Datastore SDK unavailable")
            
        meta = datastore.table_meta(table_name)
        return {
            "table_name": table_name,
            "columns": [
                {
                    "name": c.column_name,
                    "type": c.data_type,
                    "max_length": c.max_length,
                    "is_mandatory": c.is_mandatory,
                    "is_unique": c.is_unique
                }
                for c in meta.column_details
            ]
        }
    except Exception as e:
        logger.error(f"Error getting schema for {table_name}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get schema: {str(e)}")

from pydantic import BaseModel
class ChunkPayload(BaseModel):
    table_name: str
    rows: List[Dict[str, Any]]

@router.post(
    "/upload/chunk",
    summary="Upload Chunk of Records",
    description="Inserts a JSON array of rows into a specific Catalyst Data Store table.",
)
async def upload_chunk(payload: ChunkPayload):
    try:
        from app.database.connection import db
        datastore = db.get_datastore()
        if not datastore:
            raise HTTPException(status_code=500, detail="Datastore SDK unavailable")
            
        table = datastore.table(payload.table_name)
        
        inserted_count = 0
        failed_rows = 0
        error_details = []
        
        # Inject Active: True and ensure strings are handled gracefully
        processed_rows = []
        for row in payload.rows:
            new_row = dict(row)
            if "Active" not in new_row:
                new_row["Active"] = True
            processed_rows.append(new_row)
        
        # We assume the frontend chunked it, but we can safely insert the whole payload.rows
        # Catalyst limit per insert_rows is usually around 100-200.
        try:
            res = table.insert_rows(processed_rows)
            inserted_count = len(res) if isinstance(res, list) else len(processed_rows)
        except Exception as chunk_e:
            logger.warning(f"Chunk bulk insert failed for {payload.table_name}, trying row by row. Error: {chunk_e}")
            for row_data in processed_rows:
                try:
                    table.insert_rows([row_data])
                    inserted_count += 1
                except Exception as row_e:
                    failed_rows += 1
                    err_msg = str(row_e)
                    if err_msg not in error_details:
                        error_details.append(err_msg)
                        
        return {
            "inserted": inserted_count,
            "failed": failed_rows,
            "errors": error_details
        }
    except Exception as e:
        logger.error(f"Chunk upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
