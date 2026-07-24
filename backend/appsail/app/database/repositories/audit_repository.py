from app.database.connection import db
from app.utils.logger import logger
from typing import Dict, Any, List

class AuditRepository:
    @staticmethod
    async def get_audit_logs() -> List[Dict[str, Any]]:
        zcql = db.get_zcql()
        if not zcql:
            return []
            
        try:
            query = "SELECT ROWID, action_type, user_id, action_details, created_at FROM audit_logs"
            result = zcql.execute_query(query)
            
            logs = []
            for row in result:
                data = row.get("audit_logs", {})
                logs.append({
                    "id": data.get("ROWID"),
                    "action": data.get("action_type"),
                    "user": data.get("user_id"),
                    "details": data.get("action_details"),
                    "timestamp": data.get("created_at")
                })
            return logs
        except Exception as e:
            logger.warning(f"Failed to fetch audit logs (table might be missing): {e}")
            return []
