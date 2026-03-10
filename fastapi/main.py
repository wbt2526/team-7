from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
import bcrypt
from database import *

app = FastAPI()

# ========== PYDANTIC MODELS ==========

# User Models
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

# Trip Models
class TripBase(BaseModel):
    title: str
    description: str
    date: datetime
    duration: int
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

# Booking Models
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

# Payment Models
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
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# ========== USER ENDPOINTS ==========

@app.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    
    db_user = UserDB(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password=hashed_password,
        role=user.role
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/users/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(UserDB).offset(skip).limit(limit).all()

@app.get("/users/{user_id}", response_model=User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/login/")
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == credentials.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role
    }

# ========== TRIP ENDPOINTS ==========

@app.post("/trips/", response_model=Trip)
def create_trip(trip: TripCreate, user_id: int, db: Session = Depends(get_db)):
    # Check if user is admin
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_trip = TripDB(
        title=trip.title,
        description=trip.description,
        date=trip.date,
        duration=trip.duration,
        price=trip.price,
        total_places=trip.total_places,
        remaining_places=trip.total_places,
        status=trip.status,
        created_by=user_id
    )
    
    try:
        db.add(db_trip)
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/trips/", response_model=List[Trip])
def read_trips(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(TripDB)
    if status:
        query = query.filter(TripDB.status == status)
    return query.offset(skip).limit(limit).all()

@app.get("/trips/{trip_id}", response_model=Trip)
def read_trip(trip_id: int, db: Session = Depends(get_db)):
    db_trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

@app.put("/trips/{trip_id}", response_model=Trip)
def update_trip(trip_id: int, trip_update: TripCreate, user_id: int, db: Session = Depends(get_db)):
    # Check if user is admin
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Update fields
    for key, value in trip_update.dict().items():
        setattr(db_trip, key, value)
    
    try:
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: int, user_id: int, db: Session = Depends(get_db)):
    # Check if user is admin
    user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    db_trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    # Soft delete - change status to cancelled
    db_trip.status = "cancelled"
    db.commit()
    
    return {"message": "Trip cancelled successfully"}

# ========== BOOKING ENDPOINTS ==========

@app.post("/bookings/", response_model=Booking)
def create_booking(booking: BookingCreate, user_id: int, db: Session = Depends(get_db)):
    # Check if trip exists and is available
    trip = db.query(TripDB).filter(TripDB.id == booking.trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    if trip.status != "available":
        raise HTTPException(status_code=400, detail="Trip is not available for booking")
    
    # Calculate total seats requested
    total_seats = booking.adults + booking.children
    
    # Check if enough places available
    if trip.remaining_places < total_seats:
        raise HTTPException(status_code=400, detail="Not enough places available")
    
    # Calculate total price
    total_price = float(trip.price) * total_seats
    
    # Create booking
    db_booking = BookingDB(
        user_id=user_id,
        trip_id=booking.trip_id,
        adults=booking.adults,
        children=booking.children,
        total_price=total_price,
        booking_status="pending"
    )
    
    try:
        db.add(db_booking)
        
        # Update remaining places
        trip.remaining_places -= total_seats
        
        # If no places left, mark as full
        if trip.remaining_places == 0:
            trip.status = "full"
        
        db.commit()
        db.refresh(db_booking)
        return db_booking
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/bookings/", response_model=List[Booking])
def read_bookings(user_id: Optional[int] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(BookingDB)
    if user_id:
        query = query.filter(BookingDB.user_id == user_id)
    return query.offset(skip).limit(limit).all()

@app.get("/bookings/{booking_id}", response_model=Booking)
def read_booking(booking_id: int, db: Session = Depends(get_db)):
    db_booking = db.query(BookingDB).filter(BookingDB.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return db_booking

# ========== PAYMENT ENDPOINTS ==========

@app.post("/payments/", response_model=Payment)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    # Check if booking exists
    booking = db.query(BookingDB).filter(BookingDB.id == payment.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Create payment
    db_payment = PaymentDB(
        booking_id=payment.booking_id,
        card_last4=payment.card_last4,
        payment_status="success"
    )
    
    try:
        db.add(db_payment)
        
        # Update booking status to confirmed
        booking.booking_status = "confirmed"
        
        db.commit()
        db.refresh(db_payment)
        return db_payment
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/payments/", response_model=List[Payment])
def read_payments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(PaymentDB).offset(skip).limit(limit).all()

# ========== ROOT ENDPOINT ==========

@app.get("/")
def read_root():
    return {"message": "Welcome to Travel Agency API"}