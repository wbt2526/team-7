from datetime import datetime

from sqlalchemy import DECIMAL, Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from database import Base


class BookingDB(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, nullable=False)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    adults = Column(Integer, nullable=False)
    children = Column(Integer, nullable=False)
    total_seats = Column(Integer, nullable=False)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    trip = relationship("TripDB", back_populates="bookings")
    user = relationship("UserDB", back_populates="bookings")
