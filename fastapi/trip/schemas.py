from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class TripBase(BaseModel):
    title: str
    description: str
    date: datetime
    duration: int
    image: Optional[str] = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000"
    price: float
    total_places: int
    status: str = "available"

class TripCreate(TripBase):
    pass

class Trip(TripBase):
    created_by: int
    id: int
    remaining_places: int

    class Config:
        from_attributes = True

