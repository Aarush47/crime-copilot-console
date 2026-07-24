from fastapi import APIRouter
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(tags=["Analytics"])

@router.get(
    "/analytics",
    response_model=AnalyticsResponse,
    summary="Crime Analytics",
    description=(
        "Returns comprehensive crime statistics: monthly trends, district-wise distribution, "
        "crime category breakdown, and officer performance. "
        "**[MOCK]** All data is hardcoded. Requires Catalyst `Cases` Data Store table."
    ),
)
async def get_analytics_data():
    return await AnalyticsService.get_analytics()
