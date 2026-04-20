from fastapi import HTTPException
from sqlalchemy.orm import Session

from booking.models import BookingDB
from payment.models import PaymentDB
from payment.schemas import PaymentCreate
from trip.models import TripDB, TripStatus


def create_payment(db: Session, booking_id: int, user_id: int, payment: PaymentCreate):
    db_booking = db.query(BookingDB).filter(BookingDB.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    if db_booking.user_id != user_id:
        raise HTTPException(status_code=403, detail="You can only pay for your own bookings")

    if db_booking.booking_status == "paid":
        raise HTTPException(status_code=400, detail="Booking is already paid")

    db_trip = db.query(TripDB).filter(TripDB.id == db_booking.trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")

    if db_trip.status == TripStatus.cancelled.value:
        raise HTTPException(status_code=400, detail="Trip is cancelled")

    if db_trip.status == TripStatus.full.value or db_trip.remaining_places <= 0:
        raise HTTPException(status_code=400, detail="Trip is full")

    if db_trip.remaining_places < db_booking.total_seats:
        raise HTTPException(status_code=400, detail="Not enough remaining places")

    db_payment = PaymentDB(
        booking_id=booking_id,
        card_last4=payment.card_number[-4:],
        payment_status="success",
    )

    db_trip.remaining_places -= db_booking.total_seats
    if db_trip.remaining_places == 0:
        db_trip.status = TripStatus.full.value

    db_booking.booking_status = "paid"

    try:
        db.add(db_payment)
        db.commit()
        db.refresh(db_payment)
        db.refresh(db_trip)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "payment_id": db_payment.id,
        "booking_id": db_booking.id,
        "payment_status": db_payment.payment_status,
        "payment_date": db_payment.payment_date,
        "remaining_places": db_trip.remaining_places,
        "trip_status": db_trip.status,
        "message": "Payment successful and trip availability updated",
    }
