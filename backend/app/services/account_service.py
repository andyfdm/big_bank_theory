import random
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.config import settings
from app.models.account import Account, AccountType
from app.models.user import User
from app.schemas.account import AccountCreate, AccountLookupRequest


def normalize_bsb(bsb: str) -> str:
    return bsb.replace(" ", "").replace("-", "")


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

    def set_payid(self, user: User, account_id: int) -> Account:
        if not user.phone or not user.phone.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Add a phone number to your profile before linking PayID",
            )

        phone = user.phone.replace(" ", "")
        account = self.get_account_for_user(user, account_id)

        existing_other_user = (
            self.db.query(Account)
            .filter(Account.payid_phone == phone, Account.user_id != user.id)
            .first()
        )
        if existing_other_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This phone number is already linked to another user's account",
            )

        other_linked_accounts = (
            self.db.query(Account)
            .filter(
                Account.user_id == user.id,
                Account.payid_phone.isnot(None),
                Account.id != account_id,
            )
            .all()
        )
        for other_account in other_linked_accounts:
            other_account.payid_phone = None

        account.payid_phone = phone
        self.db.commit()
        self.db.refresh(account)
        return account

    def lookup_account(self, user: User, data: AccountLookupRequest) -> dict:
        bsb = normalize_bsb(data.bsb)
        account_number = data.account_number.replace(" ", "")

        account = (
            self.db.query(Account)
            .options(joinedload(Account.user))
            .filter(Account.bsb == bsb, Account.account_number == account_number)
            .first()
        )
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account found with this BSB and account number",
            )
        if account.user_id == user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot pay to your own account",
            )

        return {
            "recipient_name": account.user.first_name + " " + account.user.last_name,
            "bsb": account.bsb,
            "account_number": account.account_number,
            "account_type": account.account_type.value,
            "account_id": account.id,
        }
