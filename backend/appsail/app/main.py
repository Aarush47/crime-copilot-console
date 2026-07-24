from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.routes import health, chat, dashboard, cases, network, analytics, export, auth, upload, audit
from app.middleware.cors import add_cors_middleware
from app.middleware.logging import LoggingMiddleware
from app.middleware.auth import AuthMiddleware
from app.middleware.exceptions import add_exception_handlers
from app.middleware.context import request_context
from fastapi import Request

def create_app() -> FastAPI:
    app = FastAPI(
        title="KSP Crime Copilot API",
        description=(
            "Backend API for the Karnataka State Police Crime Copilot Investigator Console. "
            "Provides endpoints for case management, analytics, AI-assisted querying, "
            "geospatial hotspot analysis, and network graph generation."
        ),
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        contact={
            "name": "Crime Copilot Development Team",
        },
        license_info={
            "name": "Restricted - KSP Internal Use Only",
        },
    )

    # Middleware setup (Order matters)
    add_cors_middleware(app)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(AuthMiddleware)

    # Global Exception Handlers
    add_exception_handlers(app)

    @app.middleware("http")
    async def set_request_context_middleware(request: Request, call_next):
        request_context.set(request)
        response = await call_next(request)
        return response

    # Root endpoint — service info
    @app.get(
        "/",
        tags=["System"],
        summary="Service Info",
        description="Returns basic information about the API service, its status, and useful links.",
    )
    async def root():
        return JSONResponse(content={
            "service": "Crime Copilot Backend",
            "status": "running",
            "version": "1.0.0",
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc",
        })

    # API Routers
    app.include_router(health.router)
    app.include_router(auth.router, prefix="/api")
    app.include_router(chat.router, prefix="/api")
    app.include_router(dashboard.router, prefix="/api")
    app.include_router(cases.router, prefix="/api")
    app.include_router(network.router, prefix="/api")
    app.include_router(analytics.router, prefix="/api")
    app.include_router(export.router, prefix="/api")
    app.include_router(upload.router, prefix="/api")
    app.include_router(audit.router, prefix="/api")

    return app

app = create_app()

