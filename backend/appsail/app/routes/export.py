from fastapi import APIRouter
from fastapi.responses import Response
from app.services.export_service import ExportService

router = APIRouter(tags=["Export"])


@router.post(
    "/export/pdf",
    response_class=Response,
    summary="Export PDF Report",
    description=(
        "Generates and returns a PDF report of the current investigation data. "
        "**[MOCK]** Returns a stub PDF binary. "
        "Requires a PDF generation library (e.g. `reportlab`) to be added to `requirements.txt`."
    ),
    responses={
        200: {
            "content": {"application/pdf": {}},
            "description": "A PDF file download.",
        }
    },
)
async def export_pdf():
    return await ExportService.generate_pdf()
