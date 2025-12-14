from sqlalchemy.orm import Session
from sqlalchemy import distinct
from typing import List, Optional

from app.models.fuel_record import FuelRecord
from app.schemas.driver import Driver, DriverList
from app.schemas.fuel_record import FuelRecordList


class DriverService:
    @staticmethod
    def get_all_drivers(db: Session) -> DriverList:
        rows = (
            db.query(
                distinct(FuelRecord.driver_cpf).label("driver_cpf"),
                FuelRecord.driver_name.label("driver_name"),
            )
            .order_by(FuelRecord.driver_name)
            .all()
        )

        drivers = [
            Driver(name=row.driver_name, cpf=row.driver_cpf)
            for row in rows
        ]
        return DriverList(drivers=drivers)
    

    @staticmethod
    def get_driver_history(
        db: Session,
        page: int = 1,
        page_size: int = 10,
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