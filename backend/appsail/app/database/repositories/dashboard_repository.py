from app.database.connection import db
from app.database.repositories.case_repository import CaseRepository
from app.utils.logger import logger
from typing import Dict, Any

class DashboardRepository:
    """
    Handles Dashboard Metrics computed from Catalyst Data Store.
    """
    
    @staticmethod
    async def get_metrics() -> Dict[str, Any]:
        try:
            cases = await CaseRepository.get_all_cases()
            
            active_count = 0
            critical_count = 0
            crime_distribution = {}
            
            for c in cases:
                status = str(c.get("status", "")).strip().lower()
                severity = str(c.get("severity", "")).strip().lower()
                crime_type = str(c.get("crime_type", "")).strip()
                
                if status != "closed":
                    active_count += 1
                    if severity == "critical":
                        critical_count += 1
                        
                if crime_type:
                    crime_distribution[crime_type] = crime_distribution.get(crime_type, 0) + 1
                    
            total_cases = len(cases)
            
            return {
                "active_investigations": active_count,
                "critical_cases": critical_count,
                "todays_fir": total_cases,
                "crime_distribution": crime_distribution,
                "pending_chargesheets": active_count
            }
        except Exception as e:
            logger.error(f"Failed to compute dashboard metrics: {e}")
            return {
                "active_investigations": 0,
                "critical_cases": 0,
                "todays_fir": 0,
                "crime_distribution": {},
                "pending_chargesheets": 0
            }
