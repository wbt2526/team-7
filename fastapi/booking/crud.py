from decimal import Decimal

from fastapi import HTTPException
from sqlalchemy.orm import Session

from booking.models import BookingDB
from booking.schemas import BookingCreate
from trip.models import TripDB, TripStatus
from user.models import UserDB


def create_booking(db: Session, trip_id: int, user_id: int, booking: BookingCreate):
    total_seats = booking.adults + booking.children

    if total_seats <= 0:
        raise HTTPException(
            status_code=400,
            detail="At least one traveler is required to create a booking",
        )

    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db_trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    if db_trip.status == TripStatus.cancelled.value:
        raise HTTPException(status_code=400, detail="Trip is cancelled")

    if db_trip.status == TripStatus.full.value or db_trip.remaining_places <= 0:
        raise HTTPException(status_code=400, detail="Trip is full")

    if db_trip.remaining_places < total_seats:
        raise HTTPException(status_code=400, detail="Not enough remaining places")

    adult_price = Decimal(str(db_trip.price))
    child_price = Decimal(str(db_trip.child_price))
    total_price = (adult_price * booking.adults) + (child_price * booking.children)

    db_booking = BookingDB(
        trip_id=trip_id,
        user_id=user_id,
        adults=booking.adults,
        children=booking.children,
        total_seats=total_seats,
        total_price=total_price,
    )

    db_trip.remaining_places -= total_seats
    if db_trip.remaining_places == 0:
        db_trip.status = TripStatus.full.value

    try:
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        db.refresh(db_trip)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "booking_id": db_booking.id,
        "trip_id": db_booking.trip_id,
        "user_id": db_booking.user_id,
        "adults": db_booking.adults,
        "children": db_booking.children,
        "adult_price": float(adult_price),
        "child_price": float(child_price),
        "total_seats": db_booking.total_seats,
        "total_price": float(db_booking.total_price),
        "remaining_places": db_trip.remaining_places,
        "message": "Booking confirmed",
        "created_at": db_booking.created_at,
    }
