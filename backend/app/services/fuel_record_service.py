import logging
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import distinct, func
from app.utils.query_filters import apply_fuel_record_filters

from app.models.fuel_record import FuelRecord
from app.schemas.fuel_record import FuelRecordCreate, FuelRecordList
from app.schemas.filter_options import FilterOptions
from app.schemas.fuel_summary import FuelSummary

logger = logging.getLogger("petroanalytics.fuel")

class FuelRecordService:
    @staticmethod
    def create(db: Session, data: FuelRecordCreate) -> FuelRecord:
        logger.info(
            "Creating fuel record",
            extra={
                "station_identifier": data.station_identifier,
                "fuel_type": data.fuel_type,
                "vehicle_type": data.vehicle_type,
            },
        )
        record = FuelRecord(**data.model_dump())
        db.add(record)
        db.commit()
        db.refresh(record)
        logger.info(f"Fuel record created id={record.id}")
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
        logger.debug(
            f"Listing fuel records page={page} size={page_size} "
            f"filters fuel_type={fuel_type} state={state} city={city} vehicle_type={vehicle_type}"
        )
        query = db.query(FuelRecord)
        query = apply_fuel_record_filters(query, fuel_type, city, state, vehicle_type)

        total = query.count()
        records = (
            query.order_by(FuelRecord.collection_datetime.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
            .all()
        )
        logger.info(f"Listed {len(records)} fuel records (total={total})")
        return FuelRecordList(
            total=total,
            page=page,
            page_size=page_size,
            records=records,
        )
    
    @staticmethod
    def get_filter_options(db: Session) -> FilterOptions:
        logger.debug("Fetching filter options for fuel records")
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
        logger.info(
            "Filter options loaded "
            f"(fuel_types={fuel_types}, vehicle_types={vehicle_types}, "
            f"cities={cities}, states={states})"
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
        logger.debug(
            "Calculating fuel summary with filters "
            f"fuel_type={fuel_type} state={state} city={city} vehicle_type={vehicle_type}"
        )
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
        
        logger.info(
            f"Fuel summary calculated total_volume={total_volume} "
            f"total_amount={total_amount} active_drivers={active_drivers} "
            f"total_fillings={total_fillings}"
        )
        return FuelSummary(
            total_volume=float(total_volume),
            total_amount=float(total_amount),
            active_drivers=int(active_drivers),
            total_fillings=int(total_fillings),
        )
    