from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.transaction import (
    DepositRequest,
    SpendRequest,
    TransactionResponse,
    TransferRequest,
    WithdrawRequest,
)
from app.services.transaction_service import TransactionService
from app.utils.security import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=list[TransactionResponse], summary="List all transactions for the logged-in user")
def list_transactions(
    limit: int = Query(default=50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TransactionService(db)
    return service.get_user_transactions(current_user, limit=limit)


@router.get("/account/{account_id}", response_model=list[TransactionResponse], summary="List transactions for a specific account")
def list_account_transactions(
    account_id: int,
    limit: int = Query(default=50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TransactionService(db)
    return service.get_account_transactions(current_user, account_id, limit=limit)


@router.post("/spend", response_model=TransactionResponse, summary="Record a spend transaction")
def spend(
    data: SpendRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TransactionService(db)
    return service.spend(current_user, data)


@router.post("/deposit", response_model=TransactionResponse, summary="Deposit money into an account")
def deposit(
    data: DepositRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TransactionService(db)
    return service.deposit(current_user, data)


@router.post("/withdraw", response_model=TransactionResponse, summary="Withdraw money from an account")
def withdraw(
    data: WithdrawRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TransactionService(db)
    return service.withdraw(current_user, data)


@router.post("/transfer", response_model=list[TransactionResponse], summary="Transfer money between your accounts")
def transfer(
    data: TransferRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = TransactionService(db)
    return service.transfer(current_user, data)
