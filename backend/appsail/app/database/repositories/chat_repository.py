from app.database.connection import db
from app.utils.logger import logger
from typing import Dict, Any

class ChatRepository:
    @staticmethod
    async def process_natural_language(question: str) -> Dict[str, Any]:
        zcql = db.get_zcql()
        if not zcql:
            return {"answer": "ZCQL not initialized.", "query": ""}
            
        q = question.lower()
        
        try:
            if "count" in q or "how many" in q:
                if "critical" in q:
                    res = zcql.execute_query("SELECT count(ROWID) as count FROM cases WHERE severity = 'critical'")
                    count = res[0].get("cases", {}).get("count", 0) if res else 0
                    return {
                        "answer": f"There are {count} critical cases currently logged in the database.",
                        "query": "SELECT count(ROWID) FROM cases WHERE severity = 'critical'"
                    }
                else:
                    res = zcql.execute_query("SELECT count(ROWID) as count FROM cases")
                    count = res[0].get("cases", {}).get("count", 0) if res else 0
                    return {
                        "answer": f"There are {count} total FIRs currently logged in the database.",
                        "query": "SELECT count(ROWID) FROM cases"
                    }
            elif "district" in q:
                res = zcql.execute_query("SELECT district, count(ROWID) as count FROM cases GROUP BY district")
                districts = [f"{r['cases'].get('district', 'Unknown')}: {r['cases'].get('count', 0)}" for r in res]
                ans = "Here is the breakdown by district: " + ", ".join(districts)
                return {
                    "answer": ans,
                    "query": "SELECT district, count(ROWID) FROM cases GROUP BY district"
                }
            else:
                # Default response using real data from DB to show it's connected
                res = zcql.execute_query("SELECT count(ROWID) as count FROM cases")
                count = res[0].get("cases", {}).get("count", 0) if res else 0
                return {
                    "answer": f"Based on our Catalyst Data Store, we have {count} active cases. Try asking 'how many critical cases' or 'breakdown by district'.",
                    "query": "SELECT count(ROWID) FROM cases"
                }
        except Exception as e:
            logger.error(f"Chat DB Error: {e}")
            return {
                "answer": "I'm having trouble querying the database right now.",
                "query": ""
            }
