from app.schemas.account import AccountResponse
from app.schemas.transaction import TransactionResponse
from pydantic import BaseModel


class HomeResponse(BaseModel):
    accounts: list[AccountResponse]
    recent_transactions: list[TransactionResponse]
