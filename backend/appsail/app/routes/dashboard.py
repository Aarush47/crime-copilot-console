from fastapi import APIRouter
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(tags=["Dashboard"])

@router.get(
    "/dashboard",
    response_model=DashboardResponse,
    summary="Dashboard Metrics",
    description=(
        "Returns high-level operational metrics: active investigations, critical cases, "
        "today's FIR count, crime distribution, hotspots, alerts, and officer stats. "
        "**[MOCK]** Most fields are hardcoded. Requires Catalyst `Cases` Data Store table."
    ),
)
async def get_dashboard_metrics():
    return await DashboardService.get_metrics()
