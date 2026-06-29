from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field

from app.models.transaction import TransactionType


class SpendRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    account_id: int
    amount: Decimal = Field(gt=0)
    description: str = Field(min_length=1, max_length=500, alias="for")


class DepositRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    account_id: int
    amount: Decimal = Field(gt=0)
    description: str = Field(min_length=1, max_length=500, alias="for")


class WithdrawRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    account_id: int
    amount: Decimal = Field(gt=0)
    description: str = Field(min_length=1, max_length=500, alias="for")


class TransferRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    from_account_id: int
    to_account_id: int
    amount: Decimal = Field(gt=0)
    description: str = Field(min_length=1, max_length=500, alias="for")


class TransactionResponse(BaseModel):
    id: int
    account_id: int
    amount: Decimal
    description: str
    transaction_type: TransactionType
    related_account_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
