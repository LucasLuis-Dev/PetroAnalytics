from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.models.fuel_record import FuelRecord
from app.schemas.kpi import FuelPriceAverage, VehicleVolumeTotal, StateVolume, StateVolumeList

class KPIService:

    @staticmethod
    def get_fuel_price_averages(db: Session) -> List[FuelPriceAverage]:
        results = (
            db.query(
                FuelRecord.fuel_type,
                func.avg(FuelRecord.sale_price).label("average_price"),
                func.count(FuelRecord.id).label("records_count")
            ).group_by(FuelRecord.fuel_type).all()
        )

        return [
            FuelPriceAverage(fuel_type=row.fuel_type, average_price=round(row.average_price, 2), records_count=row.records_count)
            for row in results
        ]
    
    @staticmethod
    def get_vehicle_volume_totals(db: Session) -> List[VehicleVolumeTotal]:
        results = (
            db.query(
                FuelRecord.vehicle_type,
                func.sum(FuelRecord.sold_volume).label("total_volume"),
                func.count(FuelRecord.id).label('records_count')
            ).group_by(FuelRecord.vehicle_type).all()
        )

        return [
            VehicleVolumeTotal(vehicle_type=row.vehicle_type, total_volume=round(row.total_volume, 2), records_count=row.records_count)
            for row in results
        ]
    
    @staticmethod
    def get_state_volumes(db: Session) -> StateVolumeList:
        results = (
            db.query(
                FuelRecord.state,
                func.sum(FuelRecord.sold_volume).label("total_volume"),
            )
            .group_by(FuelRecord.state)
            .order_by(FuelRecord.state)
            .all()
        )

        items = [
            StateVolume(
                state=row.state,
                total_volume=float(row.total_volume),
            )
            for row in results
        ]

        return StateVolumeList(items=items)