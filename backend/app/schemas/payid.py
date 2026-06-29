from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class PayIdLookupRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    phone_number: str = Field(min_length=8, max_length=20, pattern=r"^\+?\d+$", alias="phone")


class PayIdLookupResponse(BaseModel):
    phone: str
    recipient_name: str
    account_id: int
    account_type: str

    model_config = ConfigDict(from_attributes=True)


class PayIdPaymentRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    from_account_id: int
    phone_number: str = Field(min_length=8, max_length=20, pattern=r"^\+?\d+$", alias="phone")
    amount: Decimal = Field(gt=0)
    description: str = Field(min_length=1, max_length=500, alias="for")
