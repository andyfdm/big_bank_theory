from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, migrate_schema
from app.routers import accounts, auth, home, payid, transactions, users

Base.metadata.create_all(bind=engine)
migrate_schema()

app = FastAPI(
    title=settings.app_name,
    description="Banking API for Big Bank Theory — user auth, accounts, transactions, and PayID payments.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(home.router)
app.include_router(accounts.router)
app.include_router(transactions.router)
app.include_router(payid.router)
app.include_router(users.router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
