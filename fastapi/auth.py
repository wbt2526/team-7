from datetime import datetime, timedelta, timezone
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, ExpiredSignatureError, jwt
from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from pydantic import BaseModel

from config import ACCESS_TOKEN_EXPIRE_MINUTES, JWT_ALGORITHM, JWT_SECRET_KEY
from database import get_db
from user.models import UserDB
from user.schemas import User
from user.crud import get_user_by_email

# DTO for token
class Token(BaseModel):
    access_token: str
    token_type: str

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

# Authentication
def login_user(db: Session, email_or_token: str, password: str = None):
    if password is not None:
        # Login with email and password
        user = get_user_by_email(db, email_or_token)
        if user:
            try:
                if pwd_context.verify(password, user.password):
                    access_token = create_access_token(
                        data={"email": user.email, "role": user.role, "id": user.id}
                    )
                    return Token(access_token=access_token, token_type="bearer")
            except UnknownHashError:
                if password == user.password:
                    access_token = create_access_token(
                        data={"email": user.email, "role": user.role, "id": user.id}
                    )
                    return Token(access_token=access_token, token_type="bearer")
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    else:
        # Refresh token
        try:
            payload = jwt.decode(email_or_token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            user_info = payload
            if user_info.get('email') is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            user = get_user_by_email(db, user_info.get('email'))
            if user is None:
                raise HTTPException(status_code=401, detail="User not found")
            access_token = create_access_token(
                data={"email": user.email, "role": user.role, "id": user.id}
            )
            return Token(access_token=access_token, token_type="bearer")
        except ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid token")



async def is_valid_user(
    db: Annotated[Session, Depends(get_db)],
    token: Annotated[str, Depends(oauth2_scheme)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_info = payload
        if user_info.get('email') is None or user_info.get('role') is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, user_info.get('email'))
    if user is None:
        raise credentials_exception
    return User(**user.__dict__)

async def is_admin_user( current_user: Annotated[User, Depends(is_valid_user)],):
    if current_user.role != 1:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user
