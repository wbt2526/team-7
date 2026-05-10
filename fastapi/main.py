from pprint import pp
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import *

from booking import crud as booking_crud, schemas as booking_schemas, models as booking_models
from payment import crud as payment_crud, schemas as payment_schemas, models as payment_models
from trip import crud as trip_crud, schemas as trip_schemas, models as trip_models
from user import models as user_models, crud as user_crud, schemas as user_schemas
# Authentication
from auth import Token, is_admin_user, is_valid_user, login_user
from fastapi.security import OAuth2PasswordRequestForm  

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== PYDANTIC MODELS ==========

def require_owner_or_admin(resource_user_id: int, current_user: user_schemas.User):
    if current_user.role != 1 and current_user.id != resource_user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

# User CRUD Operations
@app.post("/user/", response_model=user_schemas.User)
def create_user(user: user_schemas.UserCreate, db: Session = Depends(get_db)):
    return user_crud.create_user(db, user)

@app.get("/users/", response_model=List[user_schemas.User])
def read_users(
    skip: int = 0,
    limit: int = 100,
    current_user: user_schemas.User = Depends(is_admin_user),
    db: Session = Depends(get_db),
):
    return user_crud.get_users(db, skip, limit)

@app.get("/users/{user_id}", response_model=user_schemas.User)
def read_user(
    user_id: int,
    current_user: user_schemas.User = Depends(is_valid_user),
    db: Session = Depends(get_db),
):
    require_owner_or_admin(user_id, current_user)
    return user_crud.get_user(db, user_id)

@app.get("/users/email/{email}", response_model=user_schemas.User)
def read_user_by_email(
    email: str,
    current_user: user_schemas.User = Depends(is_admin_user),
    db: Session = Depends(get_db),
):
    db_user = user_crud.get_user_by_email(db, email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.put("/users/{user_id}", response_model=user_schemas.User)
def update_user(
    user_id: int,
    user: user_schemas.UserUpdate,
    current_user: user_schemas.User = Depends(is_valid_user),
    db: Session = Depends(get_db),
):
    require_owner_or_admin(user_id, current_user)
    if user.role is not None and user.role not in (0, 1):
        raise HTTPException(status_code=400, detail="User role must be 0 or 1")
    if current_user.role != 1 and user.role is not None:
        raise HTTPException(status_code=403, detail="Only admins can change user roles")
    return user_crud.update_user(db, user_id, user)

@app.delete("/users/{user_id}", response_model=user_schemas.User)
def delete_user(
    user_id: int,
    current_user: user_schemas.User = Depends(is_admin_user),
    db: Session = Depends(get_db),
):
    return user_crud.delete_user(db, user_id)

@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login_user(db, form_data.username, form_data.password)

@app.put("/login", response_model=Token)
def refresh_login(token: str, db: Session = Depends(get_db)):
    return login_user(db, token, None)

# # ========== TRIP ENDPOINTS ==========
@app.post("/trips/")
def create_trip(
    trip: trip_schemas.TripCreate,
    current_user: user_schemas.User = Depends(is_admin_user),
    db: Session = Depends(get_db),
):
    return trip_crud.create_trip(db, trip, current_user.id)

@app.get("/trips/", response_model=List[trip_schemas.Trip])
def read_trips(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return trip_crud.get_trips(db, skip, limit)

@app.get("/trips/{trip_id}", response_model=trip_schemas.Trip)
def read_trip(trip_id: int, db: Session = Depends(get_db)):
    return trip_crud.get_trip(db, trip_id)

@app.put("/trips/{trip_id}", response_model=trip_schemas.Trip)
def update_trip(
    trip_id: int,
    trip: trip_schemas.TripCreate,
    current_user: user_schemas.User = Depends(is_admin_user),
    db: Session = Depends(get_db),
):
    return trip_crud.update_trip(db, trip_id, trip)


@app.patch("/trips/{trip_id}/status", response_model=trip_schemas.Trip)
def update_trip_status(
    trip_id: int,
    status_update: trip_schemas.TripStatusUpdate,
    current_user: user_schemas.User = Depends(is_admin_user),
    db: Session = Depends(get_db),
):
    return trip_crud.update_trip_status(db, trip_id, status_update)

@app.delete("/trips/{trip_id}", response_model=trip_schemas.Trip)
def delete_trip(
    trip_id: int,
    current_user: user_schemas.User = Depends(is_admin_user),
    db: Session = Depends(get_db),
):
    return trip_crud.delete_trip(db, trip_id)


@app.post("/trips/{trip_id}/book", response_model=booking_schemas.BookingConfirmation)
def book_trip(
    trip_id: int,
    booking: booking_schemas.BookingCreate,
    current_user: user_schemas.User = Depends(is_valid_user),
    db: Session = Depends(get_db),
):
    return booking_crud.create_booking(db, trip_id, current_user.id, booking)


@app.get("/bookings/me", response_model=List[booking_schemas.Booking])
def read_my_bookings(
    current_user: user_schemas.User = Depends(is_valid_user),
    db: Session = Depends(get_db),
):
    return booking_crud.get_user_bookings(db, current_user.id)


@app.patch("/bookings/{booking_id}/cancel", response_model=booking_schemas.Booking)
def cancel_my_booking(
    booking_id: int,
    current_user: user_schemas.User = Depends(is_valid_user),
    db: Session = Depends(get_db),
):
    return booking_crud.cancel_pending_booking(db, booking_id, current_user.id)


@app.get("/admin/bookings", response_model=List[booking_schemas.Booking])
def read_all_bookings(
    current_user: user_schemas.User = Depends(is_admin_user),
    db: Session = Depends(get_db),
):
    return booking_crud.get_all_bookings(db)


@app.post("/bookings/{booking_id}/pay", response_model=payment_schemas.PaymentConfirmation)
def pay_booking(
    booking_id: int,
    payment: payment_schemas.PaymentCreate,
    current_user: user_schemas.User = Depends(is_valid_user),
    db: Session = Depends(get_db),
):
    return payment_crud.create_payment(db, booking_id, current_user.id, payment)

# # ========== ROOT ENDPOINT ==========

@app.get("/")
def read_root():
    return {"message": "Welcome to Travel Agency API"}
