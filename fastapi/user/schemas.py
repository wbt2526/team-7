from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional

# Base model for user creation and response
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: str = "user"

# Model for user creation (input)
class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Model for user response (output)
class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
