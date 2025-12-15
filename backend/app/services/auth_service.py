import logging
from datetime import timedelta
from typing import Optional

from app.schemas.auth import AuthResponse
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserRead, Token
from app.core.security import hash_password, verify_password, create_access_token
from app.config.config import settings

logger = logging.getLogger("petroanalytics.auth")

class AuthService:
    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        logger.debug(f"Fetching user by email={email}")
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def register_user(db: Session, data: UserCreate) -> UserRead:
        logger.info(f"Registering new user email={data.email}")
        existing = AuthService.get_by_email(db, data.email)
        if existing:
            logger.warning(f"Attempt to register already used email={data.email}")
            raise ValueError("Email already registered")

        user = User(
            email=data.email,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"User registered id={user.id} email={user.email}")
        return UserRead.model_validate(user)

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> Optional[User]:
        logger.info(f"Authenticating user email={email}")
        user = AuthService.get_by_email(db, email)
        if not user:
            logger.warning(f"Authentication failed: user not found email={email}")
            return None
        if not verify_password(password, user.hashed_password):
            logger.warning(f"Authentication failed: wrong password email={email}")
            return None
        if not user.is_active:
            logger.warning(f"Authentication failed: inactive user id={user.id}")
            return None
        logger.info(f"Authentication successful id={user.id}")
        return user

    @staticmethod
    def create_access_token_for_user(user: User) -> Token:
        expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        token_str = create_access_token(
            data={"sub": str(user.id)},
            expires_delta=expires,
        )
        logger.debug(f"Access token created for user id={user.id}")
        return Token(access_token=token_str, token_type="bearer")
    
    @staticmethod
    def build_auth_response(user: User) -> AuthResponse:
        token_str = AuthService.create_access_token_for_user(user).access_token
        logger.info(f"Login response built for user id={user.id}")
        return AuthResponse(
            access_token=token_str,
            token_type="bearer",
            user=UserRead.model_validate(user),
        )