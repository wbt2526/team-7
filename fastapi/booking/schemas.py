from datetime import datetime

from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    adults: int = Field(ge=0)
    children: int = Field(ge=0)


class BookingConfirmation(BaseModel):
    booking_id: int
    trip_id: int
    user_id: int
    adults: int
    children: int
    adult_price: float
    child_price: float
    total_seats: int
    total_price: float
    remaining_places: int
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
