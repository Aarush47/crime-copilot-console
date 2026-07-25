from app.database.connection import db
from app.utils.logger import logger
from typing import Dict, Any
import datetime

# Global in-memory audit log store for P1
# Storing: question, generated query, tables touched, timestamp
audit_logs = []

class ChatRepository:
    @staticmethod
    async def process_natural_language(question: str) -> Dict[str, Any]:
        zcql = db.get_zcql()
        if not zcql:
            return {"answer": "ZCQL not initialized.", "query": ""}
            
        q = question.lower()
        
        try:
            # P0.2 - LLM-driven NL->SQL pipeline
            # Generate the prompt
            system_prompt = f"""
You are a query-generation assistant for a police case database.
Given a question, output ONLY a single SQL SELECT statement — no explanation, no markdown formatting.

Schema:
CaseMaster (
  ROWID: string — The unique primary key of the case,
  CrimeNo: string — The FIR number,
  CrimeRegisteredDate: string — The date the crime was registered,
  PoliceStationID: string — Foreign key to the Unit table representing the police station,
  CrimeMajorHeadID: string — Foreign key to the CrimeHead table
)
District (
  ROWID: string — The unique primary key of the district,
  DistrictName: string — The plain-English name of the district
)
Unit (
  ROWID: string — The unique primary key of the unit (police station),
  DistrictID: string — Foreign key linking the unit to a District
)

Relationships:
CaseMaster.PoliceStationID → Unit.ROWID
Unit.DistrictID → District.ROWID

Examples:
Q: How many cases were registered in Bengaluru City?
SQL: SELECT COUNT(CaseMaster.ROWID) FROM CaseMaster LEFT JOIN Unit ON CaseMaster.PoliceStationID = Unit.ROWID LEFT JOIN District ON Unit.DistrictID = District.ROWID WHERE District.DistrictName = 'Bengaluru City'

Q: Which cases were registered in the last 6 months?
SQL: SELECT * FROM CaseMaster WHERE CrimeRegisteredDate >= '2026-01-01'

Q: Show me cases from Indiranagar police station
SQL: SELECT CaseMaster.CrimeNo FROM CaseMaster LEFT JOIN Unit ON CaseMaster.PoliceStationID = Unit.ROWID WHERE Unit.UnitName = 'Indiranagar'

Only output the SQL. Never include destructive statements.
"""
            user_prompt = f"Q: {question}\nSQL:"
            
            # Call QuickML API
            import os
            import httpx
            import re
            
            url = os.environ.get("QUICKML_ENDPOINT", "https://api.catalyst.zoho.com/quickml/v1/qwen")
            api_key = os.environ.get("QUICKML_API_KEY", "")
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "Qwen2.5-14B-Instruct",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            }
            
            sql_query = ""
            try:
                # We do a sync request since httpx sync client is easier to manage inside try/catch without importing async httpx globally, wait httpx.AsyncClient is fine
                async with httpx.AsyncClient() as client:
                    resp = await client.post(url, json=payload, headers=headers, timeout=10.0)
                    if resp.status_code == 200:
                        data = resp.json()
                        sql_query = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            except Exception as e:
                logger.error(f"LLM API Call failed: {e}")
                
            # If API fails or returns nothing (like no key configured), fallback gracefully
            if not sql_query:
                # Mock a query generation if LLM is unavailable so the demo doesn't just show an error.
                # Actually, the user specifically requested: "if the LLM call fails... return a clear plain-language message ('I couldn't find results for that — try rephrasing')"
                return {
                    "answer": "I couldn't find results for that — try rephrasing.",
                    "query": ""
                }
                
            # Clean up markdown formatting if the LLM hallucinated it
            sql_query = re.sub(r'```sql\n?', '', sql_query)
            sql_query = re.sub(r'```\n?', '', sql_query).strip()
            
            # Safety validation
            upper_query = sql_query.upper()
            if not upper_query.startswith("SELECT"):
                return {"answer": "I can only process read-only queries. Please rephrase.", "query": sql_query}
                
            destructive = ["DELETE", "DROP", "UPDATE", "INSERT", "ALTER", "TRUNCATE"]
            if any(d in upper_query for d in destructive):
                return {"answer": "I cannot execute destructive queries. Please rephrase.", "query": sql_query}
                
            # Execute ZCQL
            res = zcql.execute_query(sql_query)
            
            if not res or len(res) == 0:
                return {
                    "answer": "I couldn't find results for that — try rephrasing.",
                    "query": sql_query
                }
                
            # Formatting a generic answer since we don't have an LLM to formulate the response
            # Just return the count or the first few results as a string
            first_row = res[0]
            answer_text = f"Found {len(res)} results. Here is the first record: {str(first_row)}"
            
            # Check if it was a COUNT query
            if len(res) == 1:
                tables_in_res = list(first_row.keys())
                if tables_in_res:
                    first_table_data = first_row[tables_in_res[0]]
                    if "count" in first_table_data or "COUNT" in first_table_data or len(first_table_data) == 1:
                        val = list(first_table_data.values())[0]
                        answer_text = f"The answer is: {val}"
                        
            # Capture audit log
            import uuid
            tables_touched = []
            for t in ["CaseMaster", "District", "Unit", "GravityOffence", "CaseStatusMaster", "Accused", "Victim", "CrimeHead"]:
                if t.lower() in sql_query.lower():
                    tables_touched.append(t)
            
            audit_logs.append({
                "id": str(uuid.uuid4())[:8],
                "action": "LLM NL->SQL",
                "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "user": "Officer",
                "details": f"Q: {question}\nSQL: {sql_query}",
                "tables": tables_touched
            })
            
            return {
                "answer": answer_text,
                "query": sql_query
            }
        except Exception as e:
            logger.error(f"Chat DB Error: {e}")
            return {
                "answer": "I'm having trouble querying the database right now.",
                "query": ""
            }
