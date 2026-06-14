from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import (
    LoginRequest,
    LogoutResponse,
    RegisterRequest,
    TokenResponse,
    VerifyEmailRequest,
)
from app.services.auth_service import AuthService
from app.utils.security import oauth2_scheme

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", summary="Register and send verification code")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.register(data)


@router.post("/verify", response_model=TokenResponse, summary="Verify email and complete registration")
def verify_email(data: VerifyEmailRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.verify_email(data)


@router.post("/login", response_model=TokenResponse, summary="Login with email and password")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    service = AuthService(db)
    return service.login(data)


@router.post("/token", response_model=TokenResponse, include_in_schema=False)
def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    return service.login(LoginRequest(email=form_data.username, password=form_data.password))


@router.post("/logout", response_model=LogoutResponse, summary="Logout and invalidate token")
def logout(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
):
    service = AuthService(db)
    return service.logout(token)
