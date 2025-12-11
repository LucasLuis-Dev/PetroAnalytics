from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.fuel_record import FuelRecord
from app.schemas.fuel_record import FuelRecordCreate, FuelRecordList, FuelRecordResponse


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
