from pprint import pp
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
from database import *
from user import models as use_models, crud as user_crud, schemas as user_schemas

app = FastAPI()

# ========== PYDANTIC MODELS ==========

# User CRUD Operations
@app.post("/user/", response_model=user_schemas.User)
def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user)

@app.get("/users/", response_model=List[user_schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(use_models.UserDB).offset(skip).limit(limit).all()

@app.get("/users/{user_id}", response_model=user_schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(use_models.UserDB).filter(use_models.UserDB.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/users/email/{email}", response_model=user_schemas.User)
def read_user_by_email(email: str, db: Session = Depends(get_db)):
    return user_crud.get_user_by_email(db, email)

@app.put("/users/{user_id}", response_model=user_schemas.User)
def update_user(user_id: int, user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    return user_crud.update_user(db, user_id, user)

@app.delete("/users/{user_id}", response_model=user_schemas.User)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return user_crud.delete_user(db, user_id)
# # ========== ROOT ENDPOINT ==========

@app.get("/")
def read_root():
    return {"message": "Welcome to Travel Agency API"}