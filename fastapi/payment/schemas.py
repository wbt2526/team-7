from datetime import datetime

from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    card_number: str = Field(min_length=12, max_length=19)
    expiry: str
    cvv: str = Field(min_length=3, max_length=4)


class PaymentConfirmation(BaseModel):
    payment_id: int
    booking_id: int
    payment_status: str
    payment_date: datetime
    remaining_places: int
    trip_status: str
    message: str

    class Config:
        from_attributes = True
