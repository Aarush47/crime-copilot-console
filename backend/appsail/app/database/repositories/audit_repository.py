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
            # First fetch the global in-memory logs captured from LLM queries
            from app.database.repositories.chat_repository import audit_logs
            logs = []
            
            # Add our in-memory logs first
            # Make sure we copy the list so we don't accidentally modify the global
            for al in reversed(audit_logs):
                logs.append(al)
                
            # Then try to fetch any static DB logs (if the table exists)
            query = "SELECT ROWID, action_type, user_id, action_details, created_at FROM audit_logs"
            try:
                result = zcql.execute_query(query)
                for row in result:
                    data = row.get("audit_logs", {})
                    logs.append({
                        "id": data.get("ROWID"),
                        "action": data.get("action_type"),
                        "user": data.get("user_id"),
                        "details": data.get("action_details"),
                        "timestamp": data.get("created_at")
                    })
            except Exception as dbe:
                # Table might not exist yet
                pass
                
            return logs
        except Exception as e:
            logger.warning(f"Failed to fetch audit logs: {e}")
            from app.database.repositories.chat_repository import audit_logs
            return list(reversed(audit_logs))
