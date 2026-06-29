from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.account import AccountCreate, AccountResponse, PayIdUpdate
from app.services.account_service import AccountService
from app.utils.security import get_current_user

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.get("/{account_id}", response_model=AccountResponse, summary="Get a single account")
def get_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AccountService(db)
    return service.get_account_for_user(current_user, account_id)


@router.get("", response_model=list[AccountResponse], summary="List all accounts for the logged-in user")
def list_accounts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AccountService(db)
    return service.get_user_accounts(current_user)


@router.post("", response_model=AccountResponse, status_code=201, summary="Create a checking or savings account")
def create_account(
    data: AccountCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AccountService(db)
    return service.create_account(current_user, data)


@router.delete("/{account_id}", status_code=204, summary="Delete an account (balance must be $0)")
def delete_account(
    account_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AccountService(db)
    service.delete_account(current_user, account_id)


@router.put("/{account_id}/payid", response_model=AccountResponse, summary="Link a PayID phone number to an account")
def set_payid(
    account_id: int,
    data: PayIdUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = AccountService(db)
    return service.set_payid(current_user, account_id, data)
