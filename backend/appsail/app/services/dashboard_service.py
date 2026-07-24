from app.schemas.dashboard import DashboardResponse, Alert, Hotspot, OfficerStats
from app.utils.logger import logger

class DashboardService:
    @staticmethod
    async def get_metrics() -> DashboardResponse:
        logger.info("Fetching dashboard metrics")
        
        # Try to fetch from Catalyst Data Store
        from app.database.repositories.dashboard_repository import DashboardRepository
        db_metrics = await DashboardRepository.get_metrics()
        
        active_investigations = db_metrics.get("active_investigations", 0)
        critical_cases = db_metrics.get("critical_cases", 0)
        todays_fir = db_metrics.get("todays_fir", 0)
        pending_chargesheets = db_metrics.get("pending_chargesheets", 0)
        crime_distribution = db_metrics.get("crime_distribution", {})

        # Generate some alerts dynamically based on the DB if possible, or leave empty if no DB data
        # For a truly dynamic approach, we would query recent high severity cases
        # But for now, we will just return empty if the DB is empty, or maybe 1 generic alert
        
        recent_alerts = []
        if critical_cases > 0:
            recent_alerts.append(Alert(
                id=1,
                message=f"There are {critical_cases} critical cases requiring immediate attention.",
                severity="critical"
            ))

        return DashboardResponse(
            active_investigations=active_investigations,
            critical_cases=critical_cases,
            todays_fir=todays_fir,
            pending_chargesheets=pending_chargesheets,
            crime_distribution=crime_distribution,
            recent_alerts=recent_alerts,
            hotspots=[],
            officer_statistics=[]
        )
