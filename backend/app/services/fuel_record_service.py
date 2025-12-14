from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import distinct, func
from app.utils.query_filters import apply_fuel_record_filters

from app.models.fuel_record import FuelRecord
from app.schemas.fuel_record import FuelRecordCreate, FuelRecordList
from app.schemas.filter_options import FilterOptions
from app.schemas.fuel_summary import FuelSummary


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
        state: Optional[str] = None,
        city: Optional[str] = None,
        vehicle_type: Optional[str] = None,
    ) -> FuelRecordList:
        query = db.query(FuelRecord)
        query = apply_fuel_record_filters(query, fuel_type, city, state, vehicle_type)

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

        states = (
            db.query(distinct(FuelRecord.state))
            .order_by(FuelRecord.state)
            .all()
        )
        
        return FilterOptions(
            fuel_types=[row[0] for row in fuel_types],
            vehicle_types=[row[0] for row in vehicle_types],
            cities=[row[0] for row in cities],
            states=[row[0] for row in states],
        )
    

    @staticmethod
    def get_summary(
        db: Session,
        fuel_type: Optional[str] = None,
        state: Optional[str] = None,
        city: Optional[str] = None,
        vehicle_type: Optional[str] = None,
    ) -> FuelSummary:
        base_query = db.query(FuelRecord)
        base_query = apply_fuel_record_filters(base_query, fuel_type=fuel_type, city=city, state=state, vehicle_type=vehicle_type)

        subq = base_query.subquery()

        total_volume = (
            db.query(func.coalesce(func.sum(subq.c.sold_volume), 0.0))
            .scalar()
        )

        total_amount = (
            db.query(
                func.coalesce(
                    func.sum(subq.c.sold_volume * subq.c.sale_price),
                    0.0,
                )
            )
            .scalar()
        )

        active_drivers = (
            db.query(func.count(distinct(subq.c.driver_cpf)))
            .scalar()
        )

        total_fillings = db.query(func.count(subq.c.id)).scalar()

        return FuelSummary(
            total_volume=float(total_volume),
            total_amount=float(total_amount),
            active_drivers=int(active_drivers),
            total_fillings=int(total_fillings),
        )
    