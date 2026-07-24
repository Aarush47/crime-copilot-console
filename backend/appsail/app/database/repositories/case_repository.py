from app.database.connection import db
from app.utils.logger import logger
from typing import List, Dict, Any

class CaseRepository:
    """
    Handles ZCQL queries for Cases (FIRs) in the Catalyst Data Store.
    """
    
    @staticmethod
    async def get_all_cases() -> List[Dict[str, Any]]:
        zcql = db.get_zcql()
        if not zcql:
            logger.warning("ZCQL not available. Catalyst SDK likely not initialized.")
            return []
            
        try:
            query = "SELECT ROWID, fir_no, district, ps_jurisdiction, crime_type, status, registered_at, brief_facts, location, severity FROM cases ORDER BY registered_at DESC"
            result = zcql.execute_query(query)
            
            # The result from zcql.execute_query is typically a list of dictionaries 
            # nested under the table name: [{"cases": {"fir_no": "...", ...}}, ...]
            cases_list = []
            for row in result:
                case_data = row.get("cases", {})
                
                location = case_data.get("location", "")
                if location and "," in location:
                    try:
                        lat, lng = location.split(",", 1)
                        case_data["latitude"] = float(lat.strip())
                        case_data["longitude"] = float(lng.strip())
                    except ValueError:
                        case_data["latitude"] = 12.9716
                        case_data["longitude"] = 77.5946
                else:
                    case_data["latitude"] = 12.9716
                    case_data["longitude"] = 77.5946
                    
                cases_list.append(case_data)
            
            return cases_list
        except Exception as e:
            logger.error(f"Failed to execute ZCQL query for cases: {e}")
            return []
            
    @staticmethod
    async def get_case_by_id(case_id: str) -> Dict[str, Any]:
        zcql = db.get_zcql()
        if not zcql:
            return {}
            
        try:
            # Note: ROWID is often queried specifically, but for standard WHERE it needs to be CAST or handled carefully depending on Catalyst.
            query = f"SELECT ROWID, fir_no, district, ps_jurisdiction, crime_type, status, registered_at, brief_facts, location, severity FROM cases WHERE ROWID = '{case_id}'"
            result = zcql.execute_query(query)
            if result and len(result) > 0:
                case_data = result[0].get("cases", {})
                location = case_data.get("location", "")
                if location and "," in location:
                    try:
                        lat, lng = location.split(",", 1)
                        case_data["latitude"] = float(lat.strip())
                        case_data["longitude"] = float(lng.strip())
                    except ValueError:
                        case_data["latitude"] = 12.9716
                        case_data["longitude"] = 77.5946
                else:
                    case_data["latitude"] = 12.9716
                    case_data["longitude"] = 77.5946
                return case_data
            return {}
        except Exception as e:
            logger.error(f"Failed to fetch case {case_id}: {e}")
            return {}
            
    @staticmethod
    async def get_hotspots() -> List[Dict[str, Any]]:
        zcql = db.get_zcql()
        if not zcql:
            return []
            
        try:
            query = "SELECT location, severity, count(ROWID) as crime_count FROM cases GROUP BY location, severity"
            result = zcql.execute_query(query)
            
            hotspots = []
            for row in result:
                data = row.get("cases", {})
                location = data.get("location", "")
                if location and "," in location:
                    try:
                        lat, lng = location.split(",", 1)
                        data["latitude"] = float(lat.strip())
                        data["longitude"] = float(lng.strip())
                    except ValueError:
                        data["latitude"] = 12.9716
                        data["longitude"] = 77.5946
                else:
                    data["latitude"] = 12.9716
                    data["longitude"] = 77.5946
                hotspots.append(data)
            return hotspots
        except Exception as e:
            logger.error(f"Failed to execute ZCQL query for hotspots: {e}")
            return []

    @staticmethod
    async def insert_cases(cases_to_insert: List[Dict[str, Any]]) -> int:
        datastore = db.get_datastore()
        if not datastore:
            logger.warning("Datastore not available. Cannot insert cases.")
            return 0
            
        try:
            table = datastore.table_meta("cases")
            # Insert in chunks of 50 to avoid any limits
            chunk_size = 50
            inserted = 0
            for i in range(0, len(cases_to_insert), chunk_size):
                chunk = cases_to_insert[i:i + chunk_size]
                # Catalyst SDK usually takes a list of dictionaries
                res = table.insert_rows(chunk)
                inserted += len(res) if isinstance(res, list) else len(chunk)
            return inserted
        except Exception as e:
            logger.error(f"Failed to insert cases: {e}")
            # If the specific table_meta doesn't work, maybe just .table('cases').insert_rows(chunk)
            try:
                table = datastore.table("cases")
                res = table.insert_rows(cases_to_insert)
                return len(res) if isinstance(res, list) else len(cases_to_insert)
            except Exception as e2:
                logger.error(f"Fallback insert also failed: {e2}")
                raise e2
