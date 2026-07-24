from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter(tags=["AI Copilot"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    summary="AI Crime Copilot Query",
    description=(
        "Submit a natural language question about crime data and receive an AI-generated answer with "
        "a supporting ZCQL query. "
        "**[MOCK]** Returns a fixed hardcoded response. "
        "Requires Zoho QuickML pipeline or external LLM (e.g. Gemini/OpenAI) configured via `QUICKML_ENDPOINT` env variable."
    ),
)
async def chat_endpoint(request: ChatRequest):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    return await ChatService.process_query(request)
