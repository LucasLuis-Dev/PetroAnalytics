from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import distinct
from typing import List

from app.models.fuel_record import FuelRecord
from app.schemas.fuel_record import FuelRecordCreate, FuelRecordList
from app.schemas.filter_options import FilterOptions


class FuelRecordService:
    @staticmethod
    def create(db: Session, data: FuelRecordCreate) -> FuelRecord:
        record = FuelRecord(**data.model_dump())
        db.add(record)
        db.commit()
        db.refresh(record)
        return record

    @staticmethod
    def list(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        fuel_type: Optional[str] = None,
        city: Optional[str] = None,
        vehicle_type: Optional[str] = None,
    ) -> FuelRecordList:
        query = db.query(FuelRecord)

        if fuel_type:
            query = query.filter(FuelRecord.fuel_type == fuel_type)
        if city:
            query = query.filter(FuelRecord.city == city)
        if vehicle_type:
            query = query.filter(FuelRecord.vehicle_type == vehicle_type)

        total = query.count()
        records = (
            query.order_by(FuelRecord.collection_datetime.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )

        return FuelRecordList(
            total=total,
            page=page,
            page_size=page_size,
            records=records,
        )

    @staticmethod
    def get_driver_history(
        db: Session,
        cpf: Optional[str] = None,
        name: Optional[str] = None,
    ) -> List[FuelRecord]:
        query = db.query(FuelRecord)

        if cpf:
            digits = "".join(filter(str.isdigit, cpf))
            query = query.filter(FuelRecord.driver_cpf == digits)

        if name:
            ilike_pattern = f"%{name}%"
            query = query.filter(FuelRecord.driver_name.ilike(ilike_pattern))

        return (
            query.order_by(FuelRecord.collection_datetime.desc())
            .all()
        )
    
    @staticmethod
    def get_filter_options(db: Session) -> FilterOptions:
            
        fuel_types = (
            db.query(distinct(FuelRecord.fuel_type))
            .order_by(FuelRecord.fuel_type)
            .all()
        )
        
        vehicle_types = (
            db.query(distinct(FuelRecord.vehicle_type))
            .order_by(FuelRecord.vehicle_type)
            .all()
        )
        
        cities = (
            db.query(distinct(FuelRecord.city))
            .order_by(FuelRecord.city)
            .all()
        )
        
        return FilterOptions(
            fuel_types=[row[0] for row in fuel_types],
            vehicle_types=[row[0] for row in vehicle_types],
            cities=[row[0] for row in cities],
        )
    