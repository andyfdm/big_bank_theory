from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.payid import PayIdLookupRequest, PayIdLookupResponse, PayIdPaymentRequest
from app.schemas.transaction import TransactionResponse
from app.services.payid_service import PayIdService
from app.utils.security import get_current_user

router = APIRouter(prefix="/payid", tags=["PayID"])


@router.post("/lookup", response_model=PayIdLookupResponse, summary="Look up a PayID recipient by phone number")
def lookup_payid(
    data: PayIdLookupRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = PayIdService(db)
    return service.lookup(data)


@router.post("/pay", response_model=list[TransactionResponse], summary="Pay a recipient via PayID")
def pay_via_payid(
    data: PayIdPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = PayIdService(db)
    return service.pay(current_user, data)
