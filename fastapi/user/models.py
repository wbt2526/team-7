from sqlalchemy import Column, Integer, String, SmallInteger, SmallInteger, create_engine, ForeignKey, DateTime, Enum as SQLEnum, Text, DECIMAL 
from enum import Enum
from database import Base
from datetime import datetime

class UserRole(str, Enum):
    user = "user"
    admin = "admin"

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(256), nullable=False)
    role = Column(SmallInteger, nullable=False, default=0)
    # created_at = Column(DateTime, default=datetime.utcnow) 
    # role = Column(SmallInteger, nullable=False, default=0)
    
    # bookings = relationship("BookingDB", back_populates="user")
    # created_trips = relationship("TripDB", back_populates="creator")
