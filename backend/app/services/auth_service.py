from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.token_blacklist import TokenBlacklist
from app.models.user import User
from app.models.verification_code import VerificationCode
from app.schemas.auth import LoginRequest, RegisterRequest, VerifyEmailRequest
from app.schemas.user import UserResponse
from app.services.email_service import EmailService
from app.utils.security import create_access_token, hash_password, verify_password


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.email_service = EmailService(db)

    def register(self, data: RegisterRequest) -> dict:
        existing_user = self.db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )

        self.db.query(VerificationCode).filter(
            VerificationCode.email == data.email,
            VerificationCode.is_used.is_(False),
        ).update({"is_used": True})

        code = self.email_service.generate_verification_code()
        verification = VerificationCode(
            email=data.email,
            code=code,
            # full_name=data.name,
            first_name=data.first_name,
            last_name=data.last_name,
            phone=data.phone,
            password_hash=hash_password(data.password),
            expires_at=self.email_service.get_code_expiry(),
        )
        self.db.add(verification)
        self.db.commit()

        self.email_service.send_verification_code(data.email, code)
        return {"message": "Verification code sent to your email"}

    def verify_email(self, data: VerifyEmailRequest) -> dict:
        verification = (
            self.db.query(VerificationCode)
            .filter(
                VerificationCode.email == data.email,
                VerificationCode.code == data.code,
                VerificationCode.is_used.is_(False),
            )
            .order_by(VerificationCode.created_at.desc())
            .first()
        )
        if not verification:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code",
            )
        if verification.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Verification code has expired",
            )

        existing_user = self.db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )

        user = User(
            email=verification.email,
            password_hash=verification.password_hash,
            # full_name=verification.full_name,
            first_name=verification.first_name,
            last_name=verification.last_name,
            phone=verification.phone,
            is_verified=True,
        )
        verification.is_used = True
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        token = create_access_token(user.id)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": UserResponse.from_user(user),
        }

    def login(self, data: LoginRequest) -> dict:
        user = self.db.query(User).filter(User.email == data.email).first()
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email not verified. Please complete registration.",
            )

        token = create_access_token(user.id)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": UserResponse.from_user(user),
        }

    def logout(self, token: str) -> dict:
        existing = self.db.query(TokenBlacklist).filter(TokenBlacklist.token == token).first()
        if not existing:
            self.db.add(TokenBlacklist(token=token))
            self.db.commit()
        return {"message": "Successfully logged out"}
