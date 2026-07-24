from app.database.connection import db
from app.utils.logger import logger
from typing import Dict, Any

class DashboardRepository:
    """
    Handles ZCQL queries for Dashboard Metrics in the Catalyst Data Store.
    """
    
    @staticmethod
    async def get_metrics() -> Dict[str, Any]:
        zcql = db.get_zcql()
        if not zcql:
            return {}
            
        try:
            query_active = "SELECT count(ROWID) as count FROM cases WHERE status != 'Closed'"
            res_active = zcql.execute_query(query_active)
            active_count = res_active[0].get("cases", {}).get("count", 0) if res_active else 0
            
            query_critical = "SELECT count(ROWID) as count FROM cases WHERE severity = 'critical' AND status != 'Closed'"
            res_critical = zcql.execute_query(query_critical)
            critical_count = res_critical[0].get("cases", {}).get("count", 0) if res_critical else 0
            
            query_today = "SELECT count(ROWID) as count FROM cases" # ZCQL date functions can be limited, keeping it simple for now, or just return total
            res_today = zcql.execute_query(query_today)
            total_cases = res_today[0].get("cases", {}).get("count", 0) if res_today else 0

            query_dist = "SELECT crime_type, count(ROWID) as count FROM cases GROUP BY crime_type"
            res_dist = zcql.execute_query(query_dist)
            crime_distribution = {}
            if res_dist:
                for row in res_dist:
                    data = row.get("cases", {})
                    ct = data.get("crime_type")
                    if ct:
                        crime_distribution[ct] = int(data.get("count", 0))

            return {
                "active_investigations": int(active_count),
                "critical_cases": int(critical_count),
                "todays_fir": int(total_cases), # Approximation for now
                "crime_distribution": crime_distribution,
                "pending_chargesheets": int(active_count) # Approximation
            }
        except Exception as e:
            logger.error(f"Failed to execute ZCQL query for dashboard metrics: {e}")
            return {}
