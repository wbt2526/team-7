from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class TripBase(BaseModel):
    title: str
    description: str
    location: str = Field(min_length=2, max_length=120)
    date: datetime
    duration: int
    image: Optional[str] = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000"
    price: float
    child_price: float
    total_places: int
    status: str = "available"

class TripCreate(TripBase):
    pass


class TripStatusUpdate(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        normalized = value.lower()
        allowed_statuses = {"available", "cancelled", "reported"}
        if normalized not in allowed_statuses:
            raise ValueError("Status must be one of: available, cancelled, reported")
        return normalized

class Trip(TripBase):
    created_by: int
    id: int
    remaining_places: int

    class Config:
        from_attributes = True
