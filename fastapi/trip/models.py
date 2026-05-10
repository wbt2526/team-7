from enum import Enum
from database import Base
from sqlalchemy import DECIMAL, Column, DateTime, ForeignKey, Integer, String, Text, Text
from sqlalchemy.orm import relationship

class TripStatus(str, Enum):
    available = "available"
    full = "full"
    cancelled = "cancelled"
    reported = "reported"

class TripDB(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String(120), nullable=False)
    date = Column(DateTime, nullable=False)
    duration = Column(Integer, nullable=False)
    image = Column(String(255), nullable=True)
    price = Column(DECIMAL(10, 2), nullable=False)
    child_price = Column(DECIMAL(10, 2), nullable=False)
    total_places = Column(Integer, nullable=False)
    remaining_places = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default="available")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    creator = relationship("UserDB", back_populates="created_trips")
    bookings = relationship("BookingDB", back_populates="trip")
