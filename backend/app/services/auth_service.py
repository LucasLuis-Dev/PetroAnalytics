from datetime import timedelta
from typing import Optional

from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserRead, Token
from app.core.security import hash_password, verify_password, create_access_token
from app.config import settings


class AuthService:
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def register_user(db: Session, data: UserCreate) -> UserRead:
        existing = AuthService.get_by_email(db, data.email)
        if existing:
            raise ValueError("Email already registered")

        user = User(
            email=data.email,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return UserRead.model_validate(user)

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> Optional[User]:
        user = AuthService.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
        return user

    @staticmethod
    def create_access_token_for_user(user: User) -> Token:
        expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token_str = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=expires,
        )
        return Token(access_token=token_str, token_type="bearer")