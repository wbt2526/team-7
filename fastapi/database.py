from sqlalchemy import create_engine, ForeignKey, DateTime, Enum as SQLEnum, Text, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, Integer, String
from enum import Enum
from datetime import datetime

# Database configuration - REPLACE WITH YOUR PASSWORD
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://root:viper''@localhost/webapp"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()