from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.home import HomeResponse
from app.services.account_service import AccountService
from app.services.transaction_service import TransactionService
from app.utils.security import get_current_user

router = APIRouter(prefix="/home", tags=["Home"])


@router.get("", response_model=HomeResponse, summary="Home page: accounts and recent transactions")
def get_home(
    limit: int = Query(default=50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    account_service = AccountService(db)
    transaction_service = TransactionService(db)
    return HomeResponse(
        accounts=account_service.get_user_accounts(current_user),
        recent_transactions=transaction_service.get_user_transactions(current_user, limit=limit),
    )
