from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.kpi import FuelPriceAverageList, VehicleVolumeTotalList, StateVolumeList, TopStationVolumeList
from app.services.kpi_service import KPIService

router = APIRouter()

@router.get("/fuel-price-averages", response_model=FuelPriceAverageList, summary="Average fuel price by fuel type")
def fuel_price_averages(db: Session = Depends(get_db)):
    items = KPIService.get_fuel_price_averages(db)
    return FuelPriceAverageList(items=items)

@router.get("/vehicle-volume-totals", response_model=VehicleVolumeTotalList, summary="Total volume consumed by vehicle type")
def vehicle_volume_totals(db: Session = Depends(get_db)):
    items = KPIService.get_vehicle_volume_totals(db)
    return VehicleVolumeTotalList(items=items)

@router.get("/state-volumes", response_model=StateVolumeList, summary="Total volume consumed per state")
def state_volumes(db: Session = Depends(get_db)):
    return KPIService.get_state_volumes(db)

@router.get("/top-stations-by-volume", response_model=TopStationVolumeList, summary="Top 5 stations by total volume")
def top_stations_by_volume(db: Session = Depends(get_db)):
    return KPIService.get_top_stations_by_volume(db)