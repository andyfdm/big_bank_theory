import random
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.models.account import Account, AccountType
from app.models.user import User
from app.schemas.account import AccountCreate, PayIdUpdate


class AccountService:
    def __init__(self, db: Session):
        self.db = db

    def _generate_account_number(self) -> str:
        for _ in range(100):
            number = f"{random.randint(0, 999999):06d}"
            exists = self.db.query(Account).filter(Account.account_number == number).first()
            if not exists:
                return number
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate unique account number",
        )

    def get_user_accounts(self, user: User) -> list[Account]:
        return self.db.query(Account).filter(Account.user_id == user.id).all()

    def get_account_for_user(self, user: User, account_id: int) -> Account:
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
        return account

    def create_account(self, user: User, data: AccountCreate) -> Account:
        account = Account(
            user_id=user.id,
            account_type=data.account_type,
            account_number=self._generate_account_number(),
            bsb=settings.bsb,
            balance=Decimal("0.00"),
            interest_rate=data.interest_rate if data.account_type == AccountType.SAVINGS else None,
        )
        self.db.add(account)
        self.db.commit()
        self.db.refresh(account)
        return account

    def delete_account(self, user: User, account_id: int) -> None:
        account = self.get_account_for_user(user, account_id)
        if account.balance != Decimal("0.00"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account balance must be $0.00 before deletion",
            )
        self.db.delete(account)
        self.db.commit()

    def set_payid(self, user: User, account_id: int, data: PayIdUpdate) -> Account:
        account = self.get_account_for_user(user, account_id)
        existing = (
            self.db.query(Account)
            .filter(Account.payid_phone == data.phone_number, Account.id != account_id)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number is already linked to another account",
            )
        account.payid_phone = data.phone_number
        self.db.commit()
        self.db.refresh(account)
        return account
