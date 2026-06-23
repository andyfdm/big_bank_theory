from datetime import datetime

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    token: Mapped[str] = mapped_column(String(512), unique=True, nullable=False, index=True)
    blacklisted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
