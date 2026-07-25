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
            # Fetch all lookup tables first (they are small)
            try:
                crime_heads = {str(r.get("CrimeHead", {}).get("CrimeHeadID")): r.get("CrimeHead", {}).get("CrimeGroupName") for r in zcql.execute_query("SELECT CrimeHeadID, CrimeGroupName FROM CrimeHead")}
            except Exception:
                crime_heads = {}
                
            try:
                statuses = {str(r.get("CaseStatusMaster", {}).get("CaseStatusID")): r.get("CaseStatusMaster", {}).get("CaseStatusName") for r in zcql.execute_query("SELECT CaseStatusID, CaseStatusName FROM CaseStatusMaster")}
            except Exception:
                statuses = {}
                
            try:
                units = {str(r.get("Unit", {}).get("UnitID")): r.get("Unit", {}).get("UnitName") for r in zcql.execute_query("SELECT UnitID, UnitName FROM Unit")}
            except Exception:
                units = {}

            # Select ONLY columns that actually exist in the Catalyst Datastore
            query = """
                SELECT 
                    CaseMaster.ROWID, 
                    CaseMaster.latitude, 
                    CaseMaster.longitude, 
                    CaseMaster.BriefFacts, 
                    CaseMaster.CrimeRegisteredDate,
                    CaseMaster.CaseStatus,
                    CaseMaster.PoliceStationID
                FROM CaseMaster
            """
            result = zcql.execute_query(query)
            
            cases_list = []
            for row in result:
                cm = row.get("CaseMaster", {})
                
                lat = float(cm.get("latitude", 12.9716) or 12.9716)
                lng = float(cm.get("longitude", 77.5946) or 77.5946)
                
                case_data = {
                    "ROWID": cm.get("ROWID"),
                    "fir_no": f"FIR-{cm.get('ROWID', 'UNKNOWN')[-5:]}" if cm.get("ROWID") else "FIR-UNKNOWN", # Mock CrimeNo since it is missing
                    "latitude": lat,
                    "longitude": lng,
                    "brief_facts": cm.get("BriefFacts"),
                    "registered_at": cm.get("CrimeRegisteredDate"),
                    "severity": "high",
                    "status": statuses.get(str(cm.get("CaseStatus")), "Unknown"),
                    "district": "Unknown", # District mapping requires an extra hop through Unit
                    "ps_jurisdiction": units.get(str(cm.get("PoliceStationID")), "Unknown"),
                    "crime_type": "Unknown" # CrimeMajorHeadID is missing from schema
                }
                cases_list.append(case_data)
            
            return cases_list
        except Exception as e:
            logger.error(f"Failed to execute ZCQL query for cases: {e}")
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=f"ZCQL ERROR: {str(e)}")
            
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
                    CrimeHead.CrimeGroupName,
                    CaseStatusMaster.CaseStatusName,
                    Unit.UnitName,
                    District.DistrictName
                FROM CaseMaster
                LEFT JOIN CrimeHead ON CaseMaster.CrimeMajorHeadID = CrimeHead.ROWID
                LEFT JOIN CaseStatusMaster ON CaseMaster.CaseStatusID = CaseStatusMaster.ROWID
                LEFT JOIN Unit ON CaseMaster.PoliceStationID = Unit.ROWID
                LEFT JOIN District ON Unit.DistrictID = District.ROWID
                WHERE CaseMaster.ROWID = '{case_id}'
            """
            result = zcql.execute_query(query)
            if not result or len(result) == 0:
                return {}
                
            row = result[0]
            cm = row.get("CaseMaster", {})
            ch = row.get("CrimeHead", {})
            csm = row.get("CaseStatusMaster", {})
            un = row.get("Unit", {})
            dist = row.get("District", {})
            
            lat = float(cm.get("latitude", 12.9716) or 12.9716)
            lng = float(cm.get("longitude", 77.5946) or 77.5946)
                
            case_data = {
                "ROWID": cm.get("ROWID"),
                "fir_no": cm.get("CrimeNo"),
                "latitude": lat,
                "longitude": lng,
                "brief_facts": cm.get("BriefFacts"),
                "registered_at": cm.get("CrimeRegisteredDate"),
                "severity": "high",
                "status": csm.get("CaseStatusName", "Unknown"),
                "district": dist.get("DistrictName", "Unknown"),
                "ps_jurisdiction": un.get("UnitName", "Unknown"),
                "crime_type": ch.get("CrimeGroupName", "Various")
            }
            
            # Fetch Accused
            try:
                acc_query = f"SELECT ROWID, AccusedName, AgeYear FROM Accused WHERE CaseMasterID = '{case_id}'"
                acc_res = zcql.execute_query(acc_query)
                case_data["accused"] = [
                    {
                        "accused_id": str(r.get("Accused", {}).get("ROWID", "")),
                        "name": str(r.get("Accused", {}).get("AccusedName", "Unknown")),
                        "age": str(r.get("Accused", {}).get("AgeYear", ""))
                    } for r in acc_res
                ]
            except Exception as e:
                case_data["accused"] = []

            # Fetch Victims
            try:
                vic_query = f"SELECT ROWID, VictimName FROM Victim WHERE CaseMasterID = '{case_id}'"
                vic_res = zcql.execute_query(vic_query)
                case_data["victims"] = [
                    {
                        "victim_id": str(r.get("Victim", {}).get("ROWID", "")),
                        "name": str(r.get("Victim", {}).get("VictimName", "Unknown"))
                    } for r in vic_res
                ]
            except Exception as e:
                case_data["victims"] = []

            # Fetch Complainant
            try:
                comp_query = f"SELECT ROWID, ComplainantName FROM ComplainantDetails WHERE CaseMasterID = '{case_id}'"
                comp_res = zcql.execute_query(comp_query)
                case_data["complainants"] = [
                    {
                        "complainant_id": str(r.get("ComplainantDetails", {}).get("ROWID", "")),
                        "name": str(r.get("ComplainantDetails", {}).get("ComplainantName", "Unknown"))
                    } for r in comp_res
                ]
            except Exception as e:
                case_data["complainants"] = []
                
            # Fetch Chargesheet Details
            try:
                cs_query = f"SELECT ROWID, ChargeSheetNumber, ChargeSheetDate FROM ChargesheetDetails WHERE CaseMasterID = '{case_id}'"
                cs_res = zcql.execute_query(cs_query)
                case_data["chargesheets"] = [
                    {
                        "chargesheet_id": str(r.get("ChargesheetDetails", {}).get("ROWID", "")),
                        "number": str(r.get("ChargesheetDetails", {}).get("ChargeSheetNumber", "")),
                        "date": str(r.get("ChargesheetDetails", {}).get("ChargeSheetDate", ""))
                    } for r in cs_res
                ]
            except Exception as e:
                case_data["chargesheets"] = []

            # Fetch ArrestSurrender Details
            try:
                ar_query = f"SELECT ROWID, ArrestDate FROM ArrestSurrender WHERE CaseMasterID = '{case_id}'"
                ar_res = zcql.execute_query(ar_query)
                case_data["arrests"] = [
                    {
                        "arrest_id": str(r.get("ArrestSurrender", {}).get("ROWID", "")),
                        "date": str(r.get("ArrestSurrender", {}).get("ArrestDate", ""))
                    } for r in ar_res
                ]
            except Exception as e:
                case_data["arrests"] = []

            # Fetch ActSection Details
            try:
                act_query = f"SELECT ROWID, ActSectionName FROM ActSectionAssociation WHERE CaseMasterID = '{case_id}'"
                act_res = zcql.execute_query(act_query)
                case_data["act_sections"] = [
                    {
                        "act_id": str(r.get("ActSectionAssociation", {}).get("ROWID", "")),
                        "name": str(r.get("ActSectionAssociation", {}).get("ActSectionName", ""))
                    } for r in act_res
                ]
            except Exception as e:
                case_data["act_sections"] = []

            return case_data
        except Exception as e:
            logger.error(f"Failed to fetch case {case_id}: {e}")
            return {}
            
    @staticmethod
    async def get_hotspots() -> List[Dict[str, Any]]:
        zcql = db.get_zcql()
        if not zcql:
            return []
            
        try:
            query = """
                SELECT 
                    CaseMaster.latitude,
                    CaseMaster.longitude,
                    CrimeHead.CrimeGroupName
                FROM CaseMaster
                LEFT JOIN CrimeHead ON CaseMaster.CrimeMajorHeadID = CrimeHead.ROWID
            """
            result = zcql.execute_query(query)
            
            from collections import defaultdict
            spots = defaultdict(int)
            
            for row in result:
                cm = row.get("CaseMaster", {})
                ch = row.get("CrimeHead", {})
                
                lat = float(cm.get("latitude", 12.9716) or 12.9716)
                lng = float(cm.get("longitude", 77.5946) or 77.5946)
                sev = ch.get("CrimeGroupName", "Various")
                
                key = (lat, lng, sev)
                spots[key] += 1
                
            hotspots = []
            for (lat, lng, sev), count in spots.items():
                hotspots.append({
                    "latitude": lat,
                    "longitude": lng,
                    "severity": "high",
                    "crime_count": count,
                    "crime_type": sev
                })
            return hotspots
        except Exception as e:
            logger.error(f"Failed to execute ZCQL query for hotspots: {e}")
            return []
