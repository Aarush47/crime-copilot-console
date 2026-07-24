from app.schemas.analytics import AnalyticsResponse, TrendPoint
from app.utils.logger import logger

class AnalyticsService:
    @staticmethod
    async def get_analytics() -> AnalyticsResponse:
        logger.info("Fetching analytics data from ZCQL")
        
        try:
            from app.database.repositories.analytics_repository import AnalyticsRepository
            db_data = await AnalyticsRepository.get_analytics_data()
            
            # Map trend points
            trend_points = []
            for item in db_data.get("crime_trend", []):
                trend_points.append(TrendPoint(month=item["month"], count=item["count"]))
                
            # If no data, use some fallback or empty
            monthly_fir = sum(t.count for t in trend_points) if trend_points else 0
            
            return AnalyticsResponse(
                crime_trend=trend_points,
                monthly_fir=monthly_fir,
                district_wise_crime=db_data.get("district_wise_crime", {}),
                crime_head_distribution=db_data.get("crime_head_distribution", {}),
                officer_performance=db_data.get("officer_performance", {})
            )
        except Exception as e:
            logger.error(f"Error in get_analytics: {e}")
            return AnalyticsResponse(
                crime_trend=[],
                monthly_fir=0,
                district_wise_crime={},
                crime_head_distribution={},
                officer_performance={}
            )
