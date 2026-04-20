from sqlalchemy import create_engine, ForeignKey, DateTime, Enum as SQLEnum, Text, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, Integer, String
from enum import Enum
from datetime import datetime

# Database configuration - REPLACE WITH YOUR PASSWORD
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://webapp:viper''@localhost/webapp"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Enums
class UserRole(str, Enum):
    user = "user"
    admin = "admin"

class TripStatus(str, Enum):
    available = "available"
    full = "full"
    cancelled = "cancelled"
    reported = "reported"

class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"

class PaymentStatus(str, Enum):
    pending = "pending"
    success = "success"
    failed = "failed"

# SQLAlchemy Models
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(256), nullable=False)
    role = Column(String(20), nullable=False, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bookings = relationship("BookingDB", back_populates="user")
    created_trips = relationship("TripDB", back_populates="creator")

class TripDB(Base):
    __tablename__ = "trips" 
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    image = Column(Text, nullable=True)
    date = Column(DateTime, nullable=False)
    duration = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    total_places = Column(Integer, nullable=False)
    remaining_places = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default="available")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    creator = relationship("UserDB", back_populates="created_trips")
    bookings = relationship("BookingDB", back_populates="trip")

class BookingDB(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    adults = Column(Integer, nullable=False, default=1)
    children = Column(Integer, nullable=False, default=0)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    booking_status = Column(String(20), nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("UserDB", back_populates="bookings")
    trip = relationship("TripDB", back_populates="bookings")
    payment = relationship("PaymentDB", back_populates="booking", uselist=False)

class PaymentDB(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    card_last4 = Column(String(4), nullable=False)
    payment_status = Column(String(20), nullable=False, default="pending")
    payment_date = Column(DateTime, default=datetime.utcnow)
    
    booking = relationship("BookingDB", back_populates="payment")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()