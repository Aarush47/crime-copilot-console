from app.schemas.chat import ChatRequest, ChatResponse
from app.utils.logger import logger


class ChatService:
    @staticmethod
    async def process_query(request: ChatRequest) -> ChatResponse:
        logger.info(f"Processing chat query: {request.question}")

        # ----------------------------------------------------------------
        # MOCK BLOCK — Replace with QuickML or LLM API call
        # Required env variable: QUICKML_ENDPOINT
        # Required: Zoho QuickML pipeline or OpenAI/Gemini API key
        # ----------------------------------------------------------------
        return ChatResponse(
            answer="Based on the analysis, cybercrime in Bengaluru has shown a 12% increase in the last quarter, primarily clustered around the IT corridors.",
            query="SELECT count(*), location FROM crimes WHERE type = 'cybercrime' AND city = 'Bengaluru' GROUP BY location",
            confidence=0.94,
        )
        # ----------------------------------------------------------------
        # END MOCK BLOCK
        # ----------------------------------------------------------------
