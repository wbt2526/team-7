from typing import Optional

from pydantic import BaseModel, EmailStr

# Base model for user creation and response
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr

# Model for user creation (input)
class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Model for user response (output)
class User(UserBase):
    id: int
    role: int
    
    class Config:
        from_attributes = True
