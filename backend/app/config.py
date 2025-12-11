from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str
    CORS_ORIGINS: str
    ENVIRONMENT: str
    PROJECT_NAME: str
    VERSION: str
    
    class Config:
        env_file = ".env"


settings = Settings()
