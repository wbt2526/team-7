from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import bcrypt
from database import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    role: str = "user"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

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
    id: int
    remaining_places: int
    created_by: int
    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    trip_id: int
    adults: int = 1
    children: int = 0

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    user_id: int
    total_price: float
    booking_status: str
    created_at: datetime
    class Config:
        from_attributes = True

class PaymentBase(BaseModel):
    booking_id: int
    card_last4: str

class PaymentCreate(PaymentBase):
    pass

class Payment(PaymentBase):
    id: int
    payment_status: str
    payment_date: datetime
    class Config:
        from_attributes = True

# ========== PASSWORD HELPERS ==========

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# ========== USER ENDPOINTS ==========

@app.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = UserDB(
        first_name=user.first_name, last_name=user.last_name,
        email=user.email, password=hash_password(user.password), role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(UserDB).offset(skip).limit(limit).all()

@app.post("/login/")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == credentials.email).first()
    if not db_user or not verify_password(credentials.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": db_user.id, "email": db_user.email, "role": db_user.role}

# ========== TRIP ENDPOINTS ==========

@app.get("/trips/", response_model=List[Trip])
def read_trips(db: Session = Depends(get_db)):
    return db.query(TripDB).all()

@app.get("/trips/{trip_id}", response_model=Trip)
def read_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if not trip: raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@app.post("/trips/", response_model=Trip)
def create_trip(trip: TripCreate, user_id: int, db: Session = Depends(get_db)):
    db_trip = TripDB(
        **trip.dict(), remaining_places=trip.total_places, created_by=user_id
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

@app.put("/trips/{trip_id}", response_model=Trip)
def update_trip(trip_id: int, trip_update: TripCreate, user_id: int, db: Session = Depends(get_db)):
    db_trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if not db_trip: raise HTTPException(status_code=404, detail="Trip not found")
    for key, value in trip_update.dict().items():
        setattr(db_trip, key, value)
    db.commit()
    db.refresh(db_trip)
    return db_trip

# ========== BOOKING ENDPOINTS (Sada uključeni!) ==========

@app.post("/bookings/", response_model=Booking)
def create_booking(booking: BookingCreate, user_id: int, db: Session = Depends(get_db)):
    trip = db.query(TripDB).filter(TripDB.id == booking.trip_id).first()
    if not trip: raise HTTPException(status_code=404, detail="Trip not found")
    
    total_seats = booking.adults + booking.children
    if trip.remaining_places < total_seats:
        raise HTTPException(status_code=400, detail="Not enough seats available")

    db_booking = BookingDB(
        user_id=user_id,
        trip_id=booking.trip_id,
        adults=booking.adults,
        children=booking.children,
        total_price=float(trip.price) * total_seats,
        booking_status="pending"
    )
    
    # Smanjujemo broj mesta u bazi
    trip.remaining_places -= total_seats
    if trip.remaining_places == 0:
        trip.status = "full"
        
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.get("/bookings/", response_model=List[Booking])
def read_user_bookings(user_id: int, db: Session = Depends(get_db)):
    return db.query(BookingDB).filter(BookingDB.user_id == user_id).all()

# ========== PAYMENT ENDPOINTS (Sada uključeni!) ==========

@app.post("/payments/", response_model=Payment)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    booking = db.query(BookingDB).filter(BookingDB.id == payment.booking_id).first()
    if not booking: raise HTTPException(status_code=404, detail="Booking not found")
    
    db_payment = PaymentDB(
        booking_id=payment.booking_id,
        card_last4=payment.card_last4,
        payment_status="success"
    )
    # Automatski potvrđujemo rezervaciju čim je plaćena
    booking.booking_status = "confirmed"
    
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

# ========== ADMIN ENDPOINTS ==========

@app.get("/admin/bookings/", response_model=List[Booking])
def get_all_bookings(db: Session = Depends(get_db)):
    return db.query(BookingDB).all()

@app.patch("/bookings/{booking_id}/status")
def update_booking_status(booking_id: int, status_update: dict, db: Session = Depends(get_db)):
    booking = db.query(BookingDB).filter(BookingDB.id == booking_id).first()
    if not booking: raise HTTPException(status_code=404, detail="Booking not found")
    
    old_status = booking.booking_status
    new_status = status_update.get("status")
    
    trip = db.query(TripDB).filter(TripDB.id == booking.trip_id).first()
    if trip:
        seats = booking.adults + booking.children
        if new_status == "cancelled" and old_status != "cancelled":
            trip.remaining_places += seats
            trip.status = "available"
        elif new_status != "cancelled" and old_status == "cancelled":
            trip.remaining_places -= seats

    booking.booking_status = new_status
    db.commit()
    return {"message": "Status updated"}

@app.get("/")
def read_root():
    return {"message": "TravelBox API is fully operational!"}