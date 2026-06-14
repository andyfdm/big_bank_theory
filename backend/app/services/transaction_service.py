from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.transaction import Transaction, TransactionType
from app.models.user import User
from app.schemas.transaction import SpendRequest, TransferRequest


class TransactionService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_transactions(self, user: User, limit: int = 50) -> list[Transaction]:
        account_ids = [account.id for account in user.accounts]
        if not account_ids:
            return []
        return (
            self.db.query(Transaction)
            .filter(Transaction.account_id.in_(account_ids))
            .order_by(Transaction.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_account_transactions(self, user: User, account_id: int, limit: int = 50) -> list[Transaction]:
        account = (
            self.db.query(Account)
            .filter(Account.id == account_id, Account.user_id == user.id)
            .first()
        )
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found",
            )
        return (
            self.db.query(Transaction)
            .filter(Transaction.account_id == account_id)
            .order_by(Transaction.created_at.desc())
            .limit(limit)
            .all()
        )

    def spend(self, user: User, data: SpendRequest) -> Transaction:
        account = (
            self.db.query(Account)
            .filter(Account.id == data.account_id, Account.user_id == user.id)
            .first()
        )
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Account not found",
            )
        if data.amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Amount must be greater than zero",
            )
        if account.balance < data.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient funds",
            )

        account.balance -= data.amount
        transaction = Transaction(
            account_id=account.id,
            amount=-data.amount,
            description=data.description,
            transaction_type=TransactionType.SPEND,
        )
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def transfer(self, user: User, data: TransferRequest) -> list[Transaction]:
        if data.from_account_id == data.to_account_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot transfer to the same account",
            )
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
        to_account = (
            self.db.query(Account)
            .filter(Account.id == data.to_account_id, Account.user_id == user.id)
            .first()
        )
        if not from_account or not to_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or both accounts not found",
            )
        if from_account.balance < data.amount:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient funds",
            )

        from_account.balance -= data.amount
        to_account.balance += data.amount

        out_transaction = Transaction(
            account_id=from_account.id,
            amount=-data.amount,
            description=data.description,
            transaction_type=TransactionType.TRANSFER_OUT,
            related_account_id=to_account.id,
        )
        in_transaction = Transaction(
            account_id=to_account.id,
            amount=data.amount,
            description=data.description,
            transaction_type=TransactionType.TRANSFER_IN,
            related_account_id=from_account.id,
        )
        self.db.add(out_transaction)
        self.db.add(in_transaction)
        self.db.commit()
        self.db.refresh(out_transaction)
        self.db.refresh(in_transaction)
        return [out_transaction, in_transaction]
