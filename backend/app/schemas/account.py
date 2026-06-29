from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, ValidationInfo, field_validator

from app.models.account import AccountType


class AccountCreate(BaseModel):
    account_type: AccountType
    interest_rate: Decimal | None = Field(default=None, ge=0)

    @field_validator("interest_rate")
    @classmethod
    def validate_interest_rate(cls, value: Decimal | None, info: ValidationInfo) -> Decimal | None:
        account_type = info.data.get("account_type")
        if account_type == AccountType.SAVINGS:
            if value is None:
                return Decimal("2.50")
            if value < 0:
                raise ValueError("Interest rate cannot be negative")
        elif value is not None:
            raise ValueError("Interest rate is only applicable to savings accounts")
        return value


class AccountResponse(BaseModel):
    id: int
    account_type: AccountType
    account_number: str
    bsb: str
    balance: Decimal
    interest_rate: Decimal | None
    payid_phone: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class AccountLookupRequest(BaseModel):
    bsb: str = Field(min_length=6, max_length=7)
    account_number: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


class AccountLookupResponse(BaseModel):
    recipient_name: str
    bsb: str
    account_number: str
    account_type: str
    account_id: int


class PayIdUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    phone_number: str = Field(min_length=8, max_length=20, pattern=r"^\+?\d+$", alias="phone")
