from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.schemas.fuel_record import FuelRecordCreate, FuelRecordResponse, FuelRecordList
from app.schemas.driver_history import DriverHistoryFilter
from app.services.fuel_record_service import FuelRecordService

router = APIRouter()


@router.post("/", response_model=FuelRecordResponse, status_code=201)
def create_fuel_record(
    payload: FuelRecordCreate,
    db: Session = Depends(get_db),
):
    record = FuelRecordService.create(db, payload)
    return record


@router.get("/", response_model=FuelRecordList)
def list_fuel_records(
    page: int = 1,
    page_size: int = 10,
    fuel_type: Optional[str] = None,
    city: Optional[str] = None,
    vehicle_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return FuelRecordService.list(
        db=db,
        page=page,
        page_size=page_size,
        fuel_type=fuel_type,
        city=city,
        vehicle_type=vehicle_type,
    )

@router.get("/drivers-history", response_model=list[FuelRecordResponse], summary="Driver fueling history report")
def get_driver_history(
    filters: DriverHistoryFilter = Depends(),
    db: Session = Depends(get_db)
):
    records = FuelRecordService.get_driver_history(
        db=db,
        cpf=filters.cpf,
        name=filters.name,
    )
    return records