from sqlalchemy import create_engine, Column, Integer, String, Float, Date, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Connection String for Mac
# Replace 'root' and 'password' with your credentials
SQLALCHEMY_DATABASE_URL = "mysql+mariadbconnector://root:viper''@127.0.0.1:3306/travel_agency_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Trip Model (Matches US-4, US-9)
class TripDB(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100))
    description = Column(String(500))
    date = Column(Date)
    price = Column(Float)
    total_places = Column(Integer)
    remaining_places = Column(Integer)
    status = Column(Enum('Available', 'Full', 'Cancelled', 'Reported'))

# 3. User Model (Matches US-1, US-2)
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True)
    password = Column(String(255))
    role = Column(String(20), default="user")