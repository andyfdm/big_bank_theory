from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import ProfileUpdateRequest, UserResponse


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_profile(self, user: User) -> UserResponse:
        return UserResponse.from_user(user)

    def update_profile(self, user: User, data: ProfileUpdateRequest) -> UserResponse:
        if data.email and data.email != user.email:
            existing = self.db.query(User).filter(User.email == data.email, User.id != user.id).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email is already registered",
                )
            user.email = data.email

        if data.name is not None:
            parts = data.name.strip().split(None, 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ""
        if data.phone is not None:
            user.phone = data.phone
        if data.address is not None:
            user.address = data.address

        self.db.commit()
        self.db.refresh(user)
        return UserResponse.from_user(user)
