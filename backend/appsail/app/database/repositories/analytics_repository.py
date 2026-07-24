from app.database.connection import db
from app.utils.logger import logger
from typing import Dict, Any, List

class AnalyticsRepository:
    @staticmethod
    async def get_analytics_data() -> Dict[str, Any]:
        zcql = db.get_zcql()
        if not zcql:
            return {}

        result_data = {
            "crime_trend": [],
            "district_wise_crime": {},
            "crime_head_distribution": {},
            "officer_performance": {}
        }
        
        try:
            # Monthly trend (approximate with ZCQL)
            # Since ZCQL doesn't have advanced DATE formatting easily, we group by registered_at
            query_trend = "SELECT registered_at, count(ROWID) as crime_count FROM cases GROUP BY registered_at"
            trend_res = zcql.execute_query(query_trend)
            
            # Simple aggregate by month manually
            month_counts = {}
            for row in trend_res:
                data = row.get("cases", {})
                date_str = data.get("registered_at", "")
                if date_str and len(date_str) >= 7:
                    month = date_str[:7] # YYYY-MM
                    month_counts[month] = month_counts.get(month, 0) + int(data.get("crime_count", 1))
                    
            sorted_months = sorted(month_counts.keys())
            for m in sorted_months:
                result_data["crime_trend"].append({"month": m, "count": month_counts[m]})
                
            # District wise crime
            query_district = "SELECT district, count(ROWID) as crime_count FROM cases GROUP BY district"
            dist_res = zcql.execute_query(query_district)
            for row in dist_res:
                data = row.get("cases", {})
                dist = data.get("district", "Unknown")
                result_data["district_wise_crime"][dist] = int(data.get("crime_count", 0))
                
            # Crime head distribution
            query_crime = "SELECT crime_type, count(ROWID) as crime_count FROM cases GROUP BY crime_type"
            crime_res = zcql.execute_query(query_crime)
            for row in crime_res:
                data = row.get("cases", {})
                crime = data.get("crime_type", "Unknown")
                result_data["crime_head_distribution"][crime] = int(data.get("crime_count", 0))
                
            # For officer performance we mock it as `cases` table doesn't have officer data right now
            result_data["officer_performance"] = {
                "Inspector Kulkarni": 92.5,
                "SI Ramesh": 88.0,
                "DSP Sharma": 95.0
            }
            
            return result_data
        except Exception as e:
            logger.error(f"Failed to fetch analytics from DB: {e}")
            return result_data
