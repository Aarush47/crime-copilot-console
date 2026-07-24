from app.database.connection import db
from app.utils.logger import logger
from typing import Dict, Any, List

class NetworkRepository:
    @staticmethod
    async def get_network_for_case(case_id: str) -> Dict[str, Any]:
        zcql = db.get_zcql()
        if not zcql:
            return {"nodes": [], "edges": []}
            
        nodes = []
        edges = []
        
        try:
            # 1. Add the Case node
            query_case = f"SELECT ROWID, fir_no, district FROM cases WHERE ROWID = '{case_id}'"
            case_res = zcql.execute_query(query_case)
            
            if case_res and len(case_res) > 0:
                case_data = case_res[0].get("cases", {})
                fir = case_data.get("fir_no", "Unknown FIR")
                
                nodes.append({
                    "data": {
                        "id": f"case_{case_id}",
                        "label": f"FIR: {fir}",
                        "type": "case"
                    }
                })
                
                # Add location node if it exists
                dist = case_data.get("district", "")
                if dist:
                    nodes.append({
                        "data": {
                            "id": f"dist_{dist}",
                            "label": f"Dist: {dist}",
                            "type": "location"
                        }
                    })
                    edges.append({
                        "data": {
                            "source": f"case_{case_id}",
                            "target": f"dist_{dist}",
                            "label": "occurred in"
                        }
                    })
            
            # 2. Add Accused nodes linked to this case
            # Since Accused.csv had AccusedMasterID, CaseMasterID
            # Note: We need to see if CaseMasterID in Accused matches ROWID of Cases or fir_no. 
            # Often they use the external ID. We'll query where case_master_id matches case_id.
            query_accused = f"SELECT ROWID, accused_name, person_id FROM accused WHERE case_master_id = '{case_id}'"
            accused_res = []
            try:
                accused_res = zcql.execute_query(query_accused)
            except Exception as e:
                logger.warning(f"Failed to fetch accused (table might be missing or empty): {e}")
                
            for row in accused_res:
                acc_data = row.get("accused", {})
                acc_id = acc_data.get("ROWID", "")
                name = acc_data.get("accused_name", "Unknown Accused")
                
                if acc_id:
                    nodes.append({
                        "data": {
                            "id": f"accused_{acc_id}",
                            "label": f"Accused: {name}",
                            "type": "person"
                        }
                    })
                    edges.append({
                        "data": {
                            "source": f"accused_{acc_id}",
                            "target": f"case_{case_id}",
                            "label": "accused in"
                        }
                    })
            
            return {"nodes": nodes, "edges": edges}
            
        except Exception as e:
            logger.error(f"Failed to fetch network graph for case {case_id}: {e}")
            return {"nodes": [], "edges": []}
