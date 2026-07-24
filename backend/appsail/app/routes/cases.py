from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.cases import CaseResponse, HotspotResponse
from app.services.case_service import CaseService

router = APIRouter(tags=["Cases & Maps"])


@router.get(
    "/cases",
    response_model=List[CaseResponse],
    summary="List All Cases",
    description=(
        "Returns all FIRs and active investigations. "
        "**[MOCK]** Returns hardcoded cases until the Catalyst `Cases` Data Store table is configured."
    ),
)
async def get_cases():
    return await CaseService.get_all_cases()


@router.get(
    "/case/{caseId}",
    response_model=CaseResponse,
    summary="Get Case Details",
    description=(
        "Returns detailed information for a specific case by ID. "
        "**[MOCK]** Returns mock data. Requires Catalyst `Cases` table."
    ),
    responses={404: {"description": "Case not found"}},
)
async def get_case_details(caseId: str):
    if not caseId or not caseId.strip():
        raise HTTPException(status_code=400, detail="caseId cannot be empty.")
    result = await CaseService.get_case_by_id(caseId)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Case '{caseId}' not found.")
    return result


@router.get(
    "/hotspots",
    response_model=HotspotResponse,
    summary="Crime Hotspots",
    description=(
        "Returns geocoded crime hotspot data for map rendering. "
        "**[MOCK]** Returns hardcoded hotspots. Requires Catalyst `Cases` table with lat/lng columns."
    ),
)
async def get_hotspots():
    return await CaseService.get_hotspots()

