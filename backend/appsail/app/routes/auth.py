from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["Authentication"])


class LoginRequest(BaseModel):
    username: str
    password: str

    model_config = {
        "json_schema_extra": {
            "example": {"username": "inspector.raj@ksp.gov.in", "password": "securepassword"}
        }
    }


class LoginResponse(BaseModel):
    token: str
    token_type: str = "bearer"


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="User Login",
    description=(
        "Authenticate a KSP officer and return a session token. "
        "**[MOCK]** Currently returns a placeholder token. "
        "Requires Catalyst Advanced Auth configuration before going live."
    ),
)
async def login(request: LoginRequest):
    # ----------------------------------------------------------------
    # MOCK BLOCK — Replace with Catalyst Auth SDK call when configured
    # Required: Catalyst Advanced Auth with User Store enabled
    # Catalyst docs: https://docs.catalyst.zoho.com/en/user-management/overview/
    # ----------------------------------------------------------------
    if not request.username or not request.password:
        raise HTTPException(status_code=400, detail="Username and password are required.")

    # Placeholder: accept any non-empty credentials
    return LoginResponse(token="mock-jwt-token-12345", token_type="bearer")
    # ----------------------------------------------------------------
    # END MOCK BLOCK
    # ----------------------------------------------------------------

