from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class FuelRecord(Base):
    __tablename__ = "fuel_records"

    id = Column(Integer, primary_key=True, index=True)

    station_identifier = Column(String(20), nullable=False, index=True)
    station_name = Column(String(200), nullable=False)
    city = Column(String(100), nullable=False, index=True)
    state = Column(String(2), nullable=False, index=True)

    collection_datetime = Column(DateTime, nullable=False, index=True)
    fuel_type = Column(String(50), nullable=False, index=True)
    sale_price = Column(Float, nullable=False)
    sold_volume = Column(Float, nullable=False)

    driver_name = Column(String(200), nullable=False)
    driver_cpf = Column(String(14), nullable=False, index=True)

    vehicle_plate = Column(String(8), nullable=False)
    vehicle_type = Column(String(50), nullable=False, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())