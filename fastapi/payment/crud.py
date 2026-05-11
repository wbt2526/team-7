from datetime import datetime
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy.orm import Session

from booking.models import BookingDB
from payment.models import PaymentDB
from payment.schemas import PaymentCreate
from trip.models import TripDB, TripStatus


def create_payment(db: Session, booking_id: int, user_id: int, payment: PaymentCreate):
    try:
        # Lock the booking row first, then the trip row, so concurrent payment attempts
        # cannot both validate and spend the same seats.
        db_booking = (
            db.query(BookingDB)
            .filter(BookingDB.id == booking_id)
            .with_for_update()
            .first()
        )
        if db_booking is None:
            raise HTTPException(status_code=404, detail="Booking not found")

        if db_booking.user_id != user_id:
            raise HTTPException(status_code=403, detail="You can only pay for your own bookings")

        existing_payment = (
            db.query(PaymentDB)
            .filter(
                PaymentDB.booking_id == booking_id,
                PaymentDB.idempotency_key == payment.idempotency_key,
            )
            .first()
        )
        if existing_payment is not None:
            db_trip = (
                db.query(TripDB)
                .filter(TripDB.id == db_booking.trip_id)
                .with_for_update()
                .first()
            )
            return {
                "payment_id": existing_payment.id,
                "booking_id": db_booking.id,
                "provider_reference": existing_payment.provider_reference,
                "payment_status": existing_payment.payment_status,
                "payment_date": existing_payment.payment_date,
                "booking_status": db_booking.booking_status,
                "remaining_places": db_trip.remaining_places,
                "trip_status": db_trip.status,
                "message": "Returning existing payment result for idempotency key",
            }

        if db_booking.booking_status == "confirmed":
            raise HTTPException(status_code=400, detail="Booking is already confirmed")

        if db_booking.booking_status == "cancelled":
            raise HTTPException(status_code=400, detail="Cancelled bookings cannot be paid")

        db_trip = (
            db.query(TripDB)
            .filter(TripDB.id == db_booking.trip_id)
            .with_for_update()
            .first()
        )
        if db_trip is None:
            raise HTTPException(status_code=404, detail="Trip not found")

        if db_trip.status == TripStatus.cancelled.value:
            raise HTTPException(status_code=400, detail="Trip is cancelled")

        if db_trip.status == TripStatus.full.value or db_trip.remaining_places <= 0:
            raise HTTPException(status_code=400, detail="Trip is full")

        if db_trip.remaining_places < db_booking.total_seats:
            raise HTTPException(status_code=400, detail="Not enough remaining places")

        payment_outcome = _simulate_gateway_charge()
        db_payment = PaymentDB(
            booking_id=booking_id,
            idempotency_key=payment.idempotency_key,
            provider_reference=payment_outcome["provider_reference"],
            card_last4=payment.card_number[-4:],
            payment_status=payment_outcome["status"],
            payment_date=datetime.utcnow(),
        )
        db.add(db_payment)

        if payment_outcome["status"] != "succeeded":
            db.commit()
            raise HTTPException(
                status_code=402,
                detail="Payment failed. Booking remains pending",
            )

        db_trip.remaining_places -= db_booking.total_seats
        if db_trip.remaining_places == 0:
            db_trip.status = TripStatus.full.value

        db_booking.booking_status = "confirmed"

        db.commit()
        db.refresh(db_payment)
        db.refresh(db_booking)
        db.refresh(db_trip)
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "payment_id": db_payment.id,
        "booking_id": db_booking.id,
        "provider_reference": db_payment.provider_reference,
        "payment_status": db_payment.payment_status,
        "payment_date": db_payment.payment_date,
        "booking_status": db_booking.booking_status,
        "remaining_places": db_trip.remaining_places,
        "trip_status": db_trip.status,
        "message": "Payment successful. Booking confirmed and trip availability updated",
    }


def _simulate_gateway_charge() -> dict:
    provider_reference = f"pay_{uuid4().hex[:20]}"

    return {
        "status": "succeeded",
        "provider_reference": provider_reference,
    }
