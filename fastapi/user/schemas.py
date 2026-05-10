from typing import Optional

from email_validator import EmailNotValidError, validate_email
from pydantic import BaseModel, field_validator


def normalize_email(value: str) -> str:
    try:
        return validate_email(
            value,
            check_deliverability=False,
            test_environment=True,
        ).normalized
    except EmailNotValidError as exc:
        raise ValueError(str(exc)) from exc

# Base model for user creation and response
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str

    @field_validator("email")
    @classmethod
    def validate_email_address(cls, value: str) -> str:
        return normalize_email(value)

# Model for user creation (input)
class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[int] = None

    @field_validator("email")
    @classmethod
    def validate_optional_email_address(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        return normalize_email(value)

class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_login_email_address(cls, value: str) -> str:
        return normalize_email(value)

# Model for user response (output)
class User(UserBase):
    id: int
    role: int
    
    class Config:
        from_attributes = True
