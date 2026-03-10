from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, TripDB, UserDB

app = FastAPI()

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/trips")
def get_all_trips(db: Session = Depends(get_db)):
    # This is the "Read" operation identified in Guide 03
    return db.query(TripDB).all()


