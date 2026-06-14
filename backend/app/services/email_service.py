import logging
import random
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText

from sqlalchemy.orm import Session

from app.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self, db: Session):
        self.db = db

    def generate_verification_code(self) -> str:
        return f"{random.randint(0, 999999):06d}"

    def send_verification_code(self, email: str, code: str) -> None:
        subject = "Your Big Bank Theory verification code"
        body = (
            f"Your verification code is: {code}\n\n"
            f"This code expires in {settings.verification_code_expire_minutes} minutes."
        )

        if not settings.smtp_host:
            logger.info("SMTP not configured. Verification code for %s: %s", email, code)
            print(f"[DEV] Verification code for {email}: {code}")
            return

        message = MIMEText(body)
        message["Subject"] = subject
        message["From"] = settings.smtp_from_email
        message["To"] = email

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_from_email, email, message.as_string())

    def get_code_expiry(self) -> datetime:
        return datetime.utcnow() + timedelta(minutes=settings.verification_code_expire_minutes)
