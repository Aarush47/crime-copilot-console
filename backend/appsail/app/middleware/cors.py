from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

def add_cors_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173", 
            "https://divyadristi-60077537428.development.catalystserverless.in"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
