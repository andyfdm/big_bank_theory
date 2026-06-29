from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.transaction import Transaction, TransactionType
from app.models.user import User
from sqlalchemy.orm import joinedload
from app.schemas.payid import PayIdLookupRequest, PayIdPaymentRequest


class PayIdService:
    def __init__(self, db: Session):
        self.db = db

    def lookup(self, user: User, data: PayIdLookupRequest) -> dict:
        account = (
            self.db.query(Account)
            .options(joinedload(Account.user))
            .filter(Account.payid_phone == data.phone_number)
            .first()
        )
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account linked to this PayID phone number",
            )
        if account.user_id == user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot pay to your own account",
            )
        return {
            "phone": data.phone_number,
            "recipient_name": account.user.full_name,
            "account_id": account.id,
            "account_type": account.account_type.value,
        }

    def pay(self, user: User, data: PayIdPaymentRequest) -> list[Transaction]:
        if data.amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Amount must be greater than zero",
            )

        from_account = (
            self.db.query(Account)
            .filter(Account.id == data.from_account_id, Account.user_id == user.id)
            .first()
        )
        if not from_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Source account not found",
            )
        if from_account.balance < data.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient funds",
            )

        to_account = (
            self.db.query(Account)
            .filter(Account.payid_phone == data.phone_number)
            .first()
        )
        if not to_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account linked to this PayID phone number",
            )
        if to_account.id == from_account.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot pay to the same account",
            )
        if to_account.user_id == user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot pay to your own account",
            )

        from_account.balance -= data.amount
        to_account.balance += data.amount

        out_transaction = Transaction(
            account_id=from_account.id,
            amount=-data.amount,
            description=f"PayID payment: {data.description}",
            transaction_type=TransactionType.PAYID_OUT,
            related_account_id=to_account.id,
        )
        in_transaction = Transaction(
            account_id=to_account.id,
            amount=data.amount,
            description=f"PayID received: {data.description}",
            transaction_type=TransactionType.PAYID_IN,
            related_account_id=from_account.id,
        )
        self.db.add(out_transaction)
        self.db.add(in_transaction)
        self.db.commit()
        self.db.refresh(out_transaction)
        self.db.refresh(in_transaction)
        return [out_transaction, in_transaction]
