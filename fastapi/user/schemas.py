from pydantic import BaseModel, EmailStr

# Base model for user creation and response
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: int = 0

# Model for user creation (input)
class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Model for user response (output)
class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True
