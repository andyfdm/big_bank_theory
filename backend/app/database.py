from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

connect_args = {}
if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def migrate_schema() -> None:
    inspector = inspect(engine)
    if "users" in inspector.get_table_names():
        user_columns = {column["name"] for column in inspector.get_columns("users")}
        with engine.begin() as connection:
            if "phone" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL"))
            if "address" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN address VARCHAR(500) NULL"))

    if "verification_codes" in inspector.get_table_names():
        code_columns = {column["name"] for column in inspector.get_columns("verification_codes")}
        with engine.begin() as connection:
            if "phone" not in code_columns:
                connection.execute(text("ALTER TABLE verification_codes ADD COLUMN phone VARCHAR(20) NULL"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
