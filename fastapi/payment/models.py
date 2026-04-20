from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class PaymentDB(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    card_last4 = Column(String(4), nullable=False)
    payment_status = Column(String(20), nullable=False, default="success")
    payment_date = Column(DateTime, nullable=False, default=datetime.utcnow)

    booking = relationship("BookingDB", back_populates="payments")
