from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore", 
    )

    DATABASE_URL: str
    CORS_ORIGINS: str
    ENVIRONMENT: str
    PROJECT_NAME: str
    VERSION: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    SEED_EMAIL: str
    SEED_PASSWORD: str
    REDIS_URL: str
    ENABLE_REDIS: bool

settings = Settings()
