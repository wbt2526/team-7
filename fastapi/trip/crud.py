from http.client import HTTPException
from sqlalchemy.orm import Session
from fastapi import HTTPException, Depends
from .models import TripDB
from .schemas import TripCreate
from user.models import UserDB

def get_trips(db: Session, skip: int = 0, limit: int = 100):
    return db.query(TripDB).offset(skip).limit(limit).all()

def get_trip(db: Session, trip_id: int):
    db_trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    return db_trip

def delete_trip(db: Session, trip_id: int):
    db_trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    try:
        db.delete(db_trip)
        db.commit()
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    
def update_trip(db: Session, trip_id: int, trip: TripCreate):
    db_trip = db.query(TripDB).filter(TripDB.id == trip_id).first()
    if db_trip is None:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    db_trip.title = trip.title
    db_trip.description = trip.description
    db_trip.date = trip.date
    db_trip.duration = trip.duration
    db_trip.image = trip.image
    db_trip.price = trip.price
    db_trip.total_places = trip.total_places
    db_trip.remaining_places = trip.total_places

    try:
        db.commit()
        db.refresh(db_trip)
        return db_trip
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

def create_trip(db: Session, trip: TripCreate, user_id: int):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    
    # only create trip if user exists
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_trip = TripDB(
        title=trip.title,
        description=trip.description,
        date=trip.date,
        duration=trip.duration,
        image=trip.image,
        price=trip.price,
        total_places=trip.total_places,
        remaining_places=trip.total_places,
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
    