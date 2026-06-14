from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.transaction import TransactionType


class SpendRequest(BaseModel):
    account_id: int
    amount: Decimal = Field(gt=0)
    description: str = Field(min_length=1, max_length=500)


class TransferRequest(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: Decimal = Field(gt=0)
    description: str = Field(min_length=1, max_length=500)


class TransactionResponse(BaseModel):
    id: int
    account_id: int
    amount: Decimal
    description: str
    transaction_type: TransactionType
    related_account_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
