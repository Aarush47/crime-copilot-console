from fastapi import APIRouter, HTTPException
from app.schemas.network import NetworkResponse
from app.services.network_service import NetworkService

router = APIRouter(tags=["Network Graph"])


@router.get(
    "/network/{caseId}",
    response_model=NetworkResponse,
    summary="Entity Network Graph",
    description=(
        "Returns nodes (suspects, phones, accounts, locations) and edges (relationships) "
        "for a specific case, suitable for rendering with Cytoscape.js. "
        "**[MOCK]** Returns hardcoded graph. Requires Catalyst `Entities` and `Relationships` Data Store tables."
    ),
    responses={404: {"description": "Case not found"}},
)
async def get_network_graph(caseId: str):
    if not caseId or not caseId.strip():
        raise HTTPException(status_code=400, detail="caseId cannot be empty.")
    return await NetworkService.get_network(caseId)
