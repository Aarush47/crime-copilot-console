from fastapi import APIRouter
from typing import List, Dict, Any
from app.database.repositories.audit_repository import AuditRepository
from app.utils.logger import logger

router = APIRouter(tags=["Audit"])

@router.get(
    "/audit",
    response_model=List[Dict[str, Any]],
    summary="Get Audit Logs",
    description="Returns recent system audit logs from Catalyst Data Store."
)
async def get_audit_logs():
    logger.info("Fetching audit logs")
    return await AuditRepository.get_audit_logs()
