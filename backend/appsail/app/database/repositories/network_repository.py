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
            query_case = f"SELECT ROWID, CrimeNo FROM CaseMaster WHERE ROWID = '{case_id}'"
            case_res = zcql.execute_query(query_case)
            
            if case_res and len(case_res) > 0:
                case_data = case_res[0].get("CaseMaster", {})
                fir = case_data.get("CrimeNo", "Unknown FIR")
                
                nodes.append({
                    "data": {
                        "id": f"case_{case_id}",
                        "label": f"FIR: {fir}",
                        "type": "case"
                    }
                })
            
            # 2. Add Accused nodes linked to this case
            query_accused = f"SELECT ROWID, AccusedName FROM Accused WHERE CaseMasterID = '{case_id}'"
            try:
                accused_res = zcql.execute_query(query_accused)
                for row in accused_res:
                    acc_data = row.get("Accused", {})
                    acc_id = acc_data.get("ROWID", "")
                    name = acc_data.get("AccusedName", "Unknown Accused")
                    
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
            except Exception as e:
                logger.warning(f"Failed to fetch accused for network: {e}")

            # 3. Add Victim nodes linked to this case
            query_victim = f"SELECT ROWID, VictimName FROM Victim WHERE CaseMasterID = '{case_id}'"
            try:
                victim_res = zcql.execute_query(query_victim)
                for row in victim_res:
                    vic_data = row.get("Victim", {})
                    vic_id = vic_data.get("ROWID", "")
                    name = vic_data.get("VictimName", "Unknown Victim")
                    
                    if vic_id:
                        nodes.append({
                            "data": {
                                "id": f"victim_{vic_id}",
                                "label": f"Victim: {name}",
                                "type": "person"
                            }
                        })
                        edges.append({
                            "data": {
                                "source": f"case_{case_id}",
                                "target": f"victim_{vic_id}",
                                "label": "victim of"
                            }
                        })
            except Exception as e:
                logger.warning(f"Failed to fetch victims for network: {e}")
            
            return {"nodes": nodes, "edges": edges}
            
        except Exception as e:
            logger.error(f"Failed to fetch network graph for case {case_id}: {e}")
            return {"nodes": [], "edges": []}
