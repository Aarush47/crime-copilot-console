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
            # Query the new normalized schema
            query = """
                SELECT 
                    CaseMaster.ROWID, 
                    CaseMaster.CrimeNo, 
                    CaseMaster.latitude, 
                    CaseMaster.longitude, 
                    CaseMaster.BriefFacts, 
                    CaseMaster.CrimeRegisteredDate,
                    GravityOffence.LookupValue,
                    CaseStatusMaster.CaseStatusName
                FROM CaseMaster
                LEFT JOIN GravityOffence ON CaseMaster.GravityOffenceID = GravityOffence.ROWID
                LEFT JOIN CaseStatusMaster ON CaseMaster.CaseStatusID = CaseStatusMaster.ROWID
            """
            result = zcql.execute_query(query)
            
            cases_list = []
            for row in result:
                cm = row.get("CaseMaster", {})
                go = row.get("GravityOffence", {})
                csm = row.get("CaseStatusMaster", {})
                
                # Catalyst ZCQL returns decimals as strings or floats.
                lat = float(cm.get("latitude", 12.9716) or 12.9716)
                lng = float(cm.get("longitude", 77.5946) or 77.5946)
                
                case_data = {
                    "ROWID": cm.get("ROWID"),
                    "fir_no": cm.get("CrimeNo"),
                    "latitude": lat,
                    "longitude": lng,
                    "brief_facts": cm.get("BriefFacts"),
                    "registered_at": cm.get("CrimeRegisteredDate"),
                    "severity": go.get("LookupValue", "low"),
                    "status": csm.get("CaseStatusName", "Unknown"),
                    # Hardcode district/ps for now since those require deep joins to Unit/District tables
                    "district": "Bengaluru City",
                    "ps_jurisdiction": "Central",
                    "crime_type": "Various"
                }
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
            query = f"""
                SELECT 
                    CaseMaster.ROWID, 
                    CaseMaster.CrimeNo, 
                    CaseMaster.latitude, 
                    CaseMaster.longitude, 
                    CaseMaster.BriefFacts, 
                    CaseMaster.CrimeRegisteredDate,
                    GravityOffence.LookupValue,
                    CaseStatusMaster.CaseStatusName
                FROM CaseMaster
                LEFT JOIN GravityOffence ON CaseMaster.GravityOffenceID = GravityOffence.ROWID
                LEFT JOIN CaseStatusMaster ON CaseMaster.CaseStatusID = CaseStatusMaster.ROWID
                WHERE CaseMaster.ROWID = '{case_id}'
            """
            result = zcql.execute_query(query)
            if result and len(result) > 0:
                row = result[0]
                cm = row.get("CaseMaster", {})
                go = row.get("GravityOffence", {})
                csm = row.get("CaseStatusMaster", {})
                
                lat = float(cm.get("latitude", 12.9716) or 12.9716)
                lng = float(cm.get("longitude", 77.5946) or 77.5946)
                    
                case_data = {
                    "ROWID": cm.get("ROWID"),
                    "fir_no": cm.get("CrimeNo"),
                    "latitude": lat,
                    "longitude": lng,
                    "brief_facts": cm.get("BriefFacts"),
                    "registered_at": cm.get("CrimeRegisteredDate"),
                    "severity": go.get("LookupValue", "low"),
                    "status": csm.get("CaseStatusName", "Unknown"),
                    "district": "Bengaluru City",
                    "ps_jurisdiction": "Central",
                    "crime_type": "Various"
                }
                
                # Fetch accused
                accused_query = f"SELECT ROWID, AccusedName, AgeYear FROM Accused WHERE CaseMasterID = '{case_id}'"
                try:
                    accused_res = zcql.execute_query(accused_query)
                    accused_list = []
                    for a_row in accused_res:
                        a = a_row.get("Accused", {})
                        accused_list.append({
                            "accused_id": str(a.get("ROWID", "")),
                            "name": str(a.get("AccusedName", "Unknown")),
                            "age": str(a.get("AgeYear", ""))
                        })
                    case_data["accused"] = accused_list
                except Exception as ae:
                    logger.warning(f"Failed to fetch accused for {case_id}: {ae}")
                    case_data["accused"] = []
                    
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
            # We can't easily group by JOIN results in simple ZCQL sometimes, but let's try.
            # If group by fails, we just select all and group in Python.
            query = """
                SELECT 
                    CaseMaster.latitude,
                    CaseMaster.longitude,
                    GravityOffence.LookupValue
                FROM CaseMaster
                LEFT JOIN GravityOffence ON CaseMaster.GravityOffenceID = GravityOffence.ROWID
            """
            result = zcql.execute_query(query)
            
            # Grouping in memory since ZCQL has strict rules about GROUP BY with JOINs
            from collections import defaultdict
            spots = defaultdict(int)
            
            for row in result:
                cm = row.get("CaseMaster", {})
                go = row.get("GravityOffence", {})
                
                lat = float(cm.get("latitude", 12.9716) or 12.9716)
                lng = float(cm.get("longitude", 77.5946) or 77.5946)
                sev = go.get("LookupValue", "low")
                
                # Create a composite key
                key = (lat, lng, sev)
                spots[key] += 1
                
            hotspots = []
            for (lat, lng, sev), count in spots.items():
                hotspots.append({
                    "latitude": lat,
                    "longitude": lng,
                    "severity": sev,
                    "crime_count": count
                })
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
