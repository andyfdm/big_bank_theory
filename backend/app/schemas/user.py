from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from app.models.user import User


class UserResponse(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_user(cls, user: User) -> "UserResponse":
        return cls(
            name=f"{user.first_name} {user.last_name}".strip(),
            email=user.email,
            phone=user.phone,
            address=user.address,
            created_at=user.created_at,
        )


class ProfileUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=20)
    address: str | None = Field(default=None, max_length=500)
