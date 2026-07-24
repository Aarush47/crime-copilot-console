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
    records_to_insert: List[Dict[str, Any]] = []
    target_table = "cases"
    
    for file in files:
        if not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail=f"Only .csv files are supported. Found: {file.filename}")
            
        try:
            content = await file.read()
            text_content = content.decode("utf-8")
            csv_reader = csv.DictReader(io.StringIO(text_content))
            
            actual_columns = set(csv_reader.fieldnames or [])
            expected_case_cols = {"fir_no", "district", "crime_type"}
            is_accused = "AccusedMasterID" in actual_columns or "AccusedName" in actual_columns
            is_case = expected_case_cols.issubset(actual_columns) or "fir_no" in actual_columns
            
            if is_accused:
                target_table = "accused"
                for row in csv_reader:
                    records_to_insert.append({
                        "accused_master_id": row.get("AccusedMasterID", "").strip(),
                        "case_master_id": row.get("CaseMasterID", "").strip(),
                        "accused_name": row.get("AccusedName", "").strip(),
                        "age_year": row.get("AgeYear", "").strip(),
                        "person_id": row.get("PersonID", "").strip(),
                    })
            elif is_case:
                target_table = "cases"
                for row in csv_reader:
                    records_to_insert.append({
                        "fir_no": row.get("fir_no", "").strip(),
                        "district": row.get("district", "").strip(),
                        "ps_jurisdiction": row.get("ps_jurisdiction", "").strip(),
                        "crime_type": row.get("crime_type", "").strip(),
                        "status": row.get("status", "Pending").strip(),
                        "location": f"{row.get('latitude', 12.9716) or 12.9716},{row.get('longitude', 77.5946) or 77.5946}",
                        "severity": row.get("severity", "low").strip(),
                        "brief_facts": row.get("brief_facts", "").strip(),
                        "registered_at": row.get("registered_at", "").strip(),
                    })
            else:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Unrecognized CSV format in {file.filename}. Columns: {actual_columns}"
                )
        except Exception as e:
            logger.error(f"Error parsing CSV upload ({file.filename}): {e}")
            raise HTTPException(status_code=500, detail=f"Failed to process {file.filename}: {str(e)}")

    if not records_to_insert:
        raise HTTPException(status_code=400, detail="No data found in uploaded files.")
        
    try:
        from app.database.connection import db
        datastore = db.get_datastore()
        if not datastore:
            raise HTTPException(status_code=500, detail="Datastore SDK unavailable")
            
        try:
            table = datastore.table_meta(target_table)
        except Exception:
            table = datastore.table(target_table)
            
        chunk_size = 100
        inserted_count = 0
        for i in range(0, len(records_to_insert), chunk_size):
            chunk = records_to_insert[i:i + chunk_size]
            res = table.insert_rows(chunk)
            inserted_count += len(res) if isinstance(res, list) else len(chunk)

        return {
            "message": f"Successfully parsed and inserted {inserted_count} records into '{target_table}' table.",
            "target_table": target_table,
            "inserted": inserted_count,
        }
    except Exception as e:
        logger.error(f"Error inserting records into {target_table}: {e}")
        raise HTTPException(status_code=500, detail=f"Database insertion failed into '{target_table}': {str(e)}")
