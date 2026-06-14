from decimal import Decimal

from pydantic import BaseModel, Field


class PayIdLookupRequest(BaseModel):
    phone_number: str = Field(min_length=8, max_length=20, pattern=r"^\+?\d+$")


class PayIdLookupResponse(BaseModel):
    phone_number: str
    recipient_name: str
    account_id: int


class PayIdPaymentRequest(BaseModel):
    from_account_id: int
    phone_number: str = Field(min_length=8, max_length=20, pattern=r"^\+?\d+$")
    amount: Decimal = Field(gt=0)
    description: str = Field(min_length=1, max_length=500)
