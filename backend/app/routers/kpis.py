from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.utils.cache import cache_response
from app.db.database import get_db
from app.schemas.kpi import FuelPriceAverageList, VehicleVolumeTotalList, StateVolumeList, TopStationVolumeList
from app.services.kpi_service import KPIService

router = APIRouter()

@router.get(
    "/fuel-price-averages",
    response_model=FuelPriceAverageList,
    summary="Average fuel price by fuel type",
)
@cache_response("kpi:fuel-price-averages", ttl=300)
def fuel_price_averages(
    fuel_type: str | None = None,
    state: str | None = None,
    city: str | None = None,
    vehicle_type: str | None = None,
    db: Session = Depends(get_db),
):
    items = KPIService.get_fuel_price_averages(
        db, fuel_type=fuel_type, state=state, city=city, vehicle_type=vehicle_type
    )
    return FuelPriceAverageList(items=items)


@router.get(
    "/vehicle-volume-totals",
    response_model=VehicleVolumeTotalList,
    summary="Total volume consumed by vehicle type",
)
@cache_response("kpi:vehicle-volume-totals", ttl=300)
def vehicle_volume_totals(
    fuel_type: str | None = None,
    state: str | None = None,
    city: str | None = None,
    vehicle_type: str | None = None,
    db: Session = Depends(get_db),
):
    items = KPIService.get_vehicle_volume_totals(
        db, fuel_type=fuel_type, state=state, city=city, vehicle_type=vehicle_type
    )
    return VehicleVolumeTotalList(items=items)


@router.get(
    "/state-volumes",
    response_model=StateVolumeList,
    summary="Total volume consumed per state",
)
@cache_response("kpi:state-volumes", ttl=300)
def state_volumes(
    fuel_type: str | None = None,
    state: str | None = None,
    city: str | None = None,
    vehicle_type: str | None = None,
    db: Session = Depends(get_db),
):
    return KPIService.get_state_volumes(
        db, fuel_type=fuel_type, state=state, city=city, vehicle_type=vehicle_type
    )


@router.get(
    "/top-stations-by-volume",
    response_model=TopStationVolumeList,
    summary="Top 5 stations by total volume",
)
@cache_response("kpi:top-stations-by-volume", ttl=300)
def top_stations_by_volume(
    fuel_type: str | None = None,
    state: str | None = None,
    city: str | None = None,
    vehicle_type: str | None = None,
    db: Session = Depends(get_db),
):
    return KPIService.get_top_stations_by_volume(
        db,
        fuel_type=fuel_type,
        state=state,
        city=city,
        vehicle_type=vehicle_type,
    )
