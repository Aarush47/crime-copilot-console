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
                    res = zcql.execute_query("SELECT count(CaseMaster.ROWID) as count FROM CaseMaster LEFT JOIN GravityOffence ON CaseMaster.GravityOffenceID = GravityOffence.ROWID WHERE GravityOffence.LookupValue = 'critical'")
                    count = res[0].get("CaseMaster", {}).get("count", 0) if res else 0
                    return {
                        "answer": f"There are {count} critical cases currently logged in the database.",
                        "query": "SELECT count(CaseMaster.ROWID) FROM CaseMaster LEFT JOIN GravityOffence ON CaseMaster.GravityOffenceID = GravityOffence.ROWID WHERE GravityOffence.LookupValue = 'critical'"
                    }
                else:
                    res = zcql.execute_query("SELECT count(ROWID) as count FROM CaseMaster")
                    count = res[0].get("CaseMaster", {}).get("count", 0) if res else 0
                    return {
                        "answer": f"There are {count} total FIRs currently logged in the database.",
                        "query": "SELECT count(ROWID) FROM CaseMaster"
                    }
            elif "district" in q:
                res = zcql.execute_query("SELECT District.DistrictName, count(CaseMaster.ROWID) as count FROM CaseMaster LEFT JOIN Unit ON CaseMaster.PoliceStationID = Unit.ROWID LEFT JOIN District ON Unit.DistrictID = District.ROWID")
                districts = [f"{r['District'].get('DistrictName', 'Unknown')}: {r['CaseMaster'].get('count', 0)}" for r in res if r.get('District', {}).get('DistrictName')]
                ans = "Here is the breakdown by district: " + ", ".join(districts)
                return {
                    "answer": ans,
                    "query": "SELECT District.DistrictName, count(CaseMaster.ROWID) FROM CaseMaster LEFT JOIN Unit ON CaseMaster.PoliceStationID = Unit.ROWID LEFT JOIN District ON Unit.DistrictID = District.ROWID"
                }
            else:
                # Default response using real data from DB to show it's connected
                res = zcql.execute_query("SELECT count(ROWID) as count FROM CaseMaster")
                count = res[0].get("CaseMaster", {}).get("count", 0) if res else 0
                return {
                    "answer": f"Based on our Catalyst Data Store, we have {count} active cases. Try asking 'how many critical cases' or 'breakdown by district'.",
                    "query": "SELECT count(ROWID) FROM CaseMaster"
                }
        except Exception as e:
            logger.error(f"Chat DB Error: {e}")
            return {
                "answer": "I'm having trouble querying the database right now.",
                "query": ""
            }
