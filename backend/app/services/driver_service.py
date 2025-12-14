from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional

from app.models.fuel_record import FuelRecord
from app.schemas.driver import Driver, DriverList
from app.schemas.fuel_record import FuelRecordList


class DriverService:
    @staticmethod
    def get_all_drivers(
        db: Session,
        page: int = 1,
        page_size: int = 10,
        search: Optional[str] = None,
    ) -> DriverList:
        query = (
            db.query(
                FuelRecord.driver_cpf.label("driver_cpf"),
                FuelRecord.driver_name.label("driver_name"),
                func.count(FuelRecord.id).label("total_fillings")
            )
            .group_by(FuelRecord.driver_cpf, FuelRecord.driver_name)
        )
        
        if search:
            search_filters = DriverService._build_search_filters(search)
            query = query.filter(or_(*search_filters))
        
        total = query.count()
        
        rows = (
            query
            .order_by(FuelRecord.driver_name)
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        
        drivers = [
            Driver(
                name=row.driver_name, 
                cpf=row.driver_cpf,
                total_fillings=row.total_fillings
            )
            for row in rows
        ]
        
        return DriverList(
            drivers=drivers,
            total=total,
            page=page,
            page_size=page_size
        )
    

    @staticmethod
    def _build_search_filters(search: str) -> list:
        filters = []
        
        search_term = search.strip()
        
        digits = "".join(filter(str.isdigit, search_term))
        
        if digits:
            if len(digits) >= 2:
                filters.append(
                    FuelRecord.driver_cpf.like(f"%{digits}%")
                )
    
        filters.append(
            FuelRecord.driver_name.ilike(f"%{search_term}%")
        )
        
        return filters

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