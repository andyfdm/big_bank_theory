from pydantic import BaseModel, EmailStr, Field, field_validator

from app.schemas.user import UserResponse
from app.utils.security import validate_password


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1, max_length=255)
    phone: str | None = Field(default=None, max_length=20)

    @field_validator("password")
    @classmethod
    def check_password_strength(cls, value: str) -> str:
        validate_password(value)
        return value


class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class LogoutResponse(BaseModel):
    message: str
