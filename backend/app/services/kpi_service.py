import logging
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List

from app.utils.query_filters import apply_fuel_record_filters
from app.models.fuel_record import FuelRecord
from app.schemas.kpi import FuelPriceAverage, VehicleVolumeTotal, StateVolume, StateVolumeList, TopStationVolume, TopStationVolumeList

logger = logging.getLogger("petroanalytics.kpi")

class KPIService:

    @staticmethod
    def get_fuel_price_averages(
        db: Session,
        fuel_type: str | None = None,
        city: str | None = None,
        state: str | None = None,
        vehicle_type: str | None = None,
    ) -> List[FuelPriceAverage]:
        logger.debug(
            "Calculating fuel price averages "
            f"filters fuel_type={fuel_type} state={state} city={city} vehicle_type={vehicle_type}"
        )
        query = db.query(
            FuelRecord.fuel_type,
            func.avg(FuelRecord.sale_price).label("average_price"),
            func.count(FuelRecord.id).label("records_count"),
        )
        query = apply_fuel_record_filters(query, fuel_type, city, state, vehicle_type)
        results = query.group_by(FuelRecord.fuel_type).all()
        logger.info(f"Fuel price averages computed groups={len(results)}")
        return [
            FuelPriceAverage(
                fuel_type=row.fuel_type,
                average_price=round(row.average_price, 2),
                records_count=row.records_count,
            )
            for row in results
        ]

    @staticmethod
    def get_vehicle_volume_totals(
        db: Session,
        fuel_type: str | None = None,
        city: str | None = None,
        state: str | None = None,
        vehicle_type: str | None = None,
    ) -> List[VehicleVolumeTotal]:
        logger.debug(
            "Calculating vehicle volume totals "
            f"filters fuel_type={fuel_type} state={state} city={city} vehicle_type={vehicle_type}"
        )
        query = db.query(
            FuelRecord.vehicle_type,
            func.sum(FuelRecord.sold_volume).label("total_volume"),
            func.count(FuelRecord.id).label("records_count"),
        )
        query = apply_fuel_record_filters(query, fuel_type, city, state, vehicle_type)
        results = query.group_by(FuelRecord.vehicle_type).all()
        logger.info(f"Vehicle volume totals computed groups={len(results)}")
        return [
            VehicleVolumeTotal(
                vehicle_type=row.vehicle_type,
                total_volume=round(row.total_volume, 2),
                records_count=row.records_count,
            )
            for row in results
        ]

    @staticmethod
    def get_state_volumes(
        db: Session,
        fuel_type: str | None = None,
        city: str | None = None,
        state: str | None = None,
        vehicle_type: str | None = None,
    ) -> StateVolumeList:
        logger.debug(
            "Calculating state volumes "
            f"filters fuel_type={fuel_type} state={state} city={city} vehicle_type={vehicle_type}"
        )
        query = db.query(
            FuelRecord.state,
            func.sum(FuelRecord.sold_volume).label("total_volume"),
        )
        query = apply_fuel_record_filters(query, fuel_type, city, state, vehicle_type)
        results = (
            query.group_by(FuelRecord.state)
            .order_by(FuelRecord.state)
            .all()
        )
        logger.info(f"State volumes computed states={len(results)}")
        items = [
            StateVolume(
                state=row.state,
                total_volume=float(row.total_volume),
            )
            for row in results
        ]
        return StateVolumeList(items=items)

    @staticmethod
    def get_top_stations_by_volume(
        db: Session,
        fuel_type: str | None = None,
        city: str | None = None,
        state: str | None = None,
        vehicle_type: str | None = None,
        limit: int = 5,
    ) -> TopStationVolumeList:
        logger.debug(
            "Calculating top stations by volume "
            f"filters fuel_type={fuel_type} state={state} city={city} vehicle_type={vehicle_type} limit={limit}"
        )
        query = db.query(
            FuelRecord.station_identifier,
            FuelRecord.station_name,
            func.sum(FuelRecord.sold_volume).label("total_volume"),
        )
        query = apply_fuel_record_filters(query, fuel_type, city, state, vehicle_type)
        results = (
            query.group_by(FuelRecord.station_identifier, FuelRecord.station_name)
            .order_by(desc("total_volume"))
            .limit(limit)
            .all()
        )
        logger.info(f"Top stations computed count={len(results)}")
        items = [
            TopStationVolume(
                station_identifier=row.station_identifier,
                station_name=row.station_name,
                total_volume=float(row.total_volume),
            )
            for row in results
        ]
        return TopStationVolumeList(items=items)