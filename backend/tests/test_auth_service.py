def test_register_user_success(db_session):
    from app.services.auth_service import AuthService
    from app.schemas.user import UserCreate
    
    user_data = UserCreate(
        email="test@example.com",
        full_name="Test User",
        password="strongpassword123"
    )
    
    result = AuthService.register_user(db_session, user_data)
    
    assert result.email == "test@example.com"
    assert result.full_name == "Test User"

def test_register_duplicate_email(db_session):
    from app.services.auth_service import AuthService
    from app.schemas.user import UserCreate
    import pytest
    
    user_data = UserCreate(
        email="duplicate@example.com",
        full_name="User",
        password="pass123"
    )
    
    AuthService.register_user(db_session, user_data)
    
    with pytest.raises(ValueError, match="Email already registered"):
        AuthService.register_user(db_session, user_data)

def test_authenticate_success(db_session):
    from app.services.auth_service import AuthService
    from app.schemas.user import UserCreate
    
    user_data = UserCreate(
        email="auth@example.com",
        full_name="Auth User",
        password="correctpassword"
    )
    AuthService.register_user(db_session, user_data)
    
    user = AuthService.authenticate(db_session, "auth@example.com", "correctpassword")
    
    assert user is not None
    assert user.email == "auth@example.com"

def test_authenticate_wrong_password(db_session):
    from app.services.auth_service import AuthService
    
    user = AuthService.authenticate(db_session, "test@example.com", "wrongpassword")
    
    assert user is None