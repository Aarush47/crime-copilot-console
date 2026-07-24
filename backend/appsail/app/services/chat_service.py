from app.schemas.chat import ChatRequest, ChatResponse
from app.utils.logger import logger


class ChatService:
    @staticmethod
    async def process_query(request: ChatRequest) -> ChatResponse:
        logger.info(f"Processing chat query: {request.question}")

        try:
            from app.database.repositories.chat_repository import ChatRepository
            res = await ChatRepository.process_natural_language(request.question)
            return ChatResponse(
                answer=res["answer"],
                query=res["query"],
                confidence=0.85
            )
        except Exception as e:
            logger.error(f"ChatService error: {e}")
            return ChatResponse(
                answer="Error connecting to database.",
                query="",
                confidence=0.0
            )
