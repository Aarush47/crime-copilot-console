from app.schemas.analytics import AnalyticsResponse, TrendPoint
from app.utils.logger import logger

class AnalyticsService:
    @staticmethod
    async def get_analytics() -> AnalyticsResponse:
        logger.info("Fetching analytics data")
        
        return AnalyticsResponse(
            crime_trend=[
                TrendPoint(month="Jan", count=120),
                TrendPoint(month="Feb", count=145),
                TrendPoint(month="Mar", count=110),
                TrendPoint(month="Apr", count=155)
            ],
            monthly_fir=155,
            district_wise_crime={
                "Bengaluru Urban": 500,
                "Bengaluru Rural": 150,
                "Mysuru": 300,
                "Mangaluru": 250
            },
            crime_head_distribution={
                "Cybercrime": 35,
                "Theft": 25,
                "Fraud": 20,
                "Assault": 20
            },
            officer_performance={
                "Inspector Raj": 85.5,
                "Sub-Inspector Priya": 92.0,
                "Inspector Kumar": 78.5
            }
        )
