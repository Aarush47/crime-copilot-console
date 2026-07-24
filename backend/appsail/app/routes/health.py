from fastapi import APIRouter
from app.schemas.health import HealthResponse

router = APIRouter(tags=["System"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        service="crime-copilot-backend",
        version="1.0.0"
    )
