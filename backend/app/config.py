from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Big Bank Theory API"
    secret_key: str = "change-me-in-production-use-a-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    database_url: str = "mysql+pymysql://root:password@localhost:3306/big_bank_theory"
    bsb: str = "123456"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    smtp_from_email: str = "noreply@bigbanktheory.com"
    verification_code_expire_minutes: int = 15


settings = Settings()
