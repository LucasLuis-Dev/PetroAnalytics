from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.driver import DriverList, DriverHistoryFilter
from app.services.driver_service import DriverService
from app.schemas.fuel_record import FuelRecordResponse, FuelRecordList

router = APIRouter()

@router.get(
    "/drivers",
    response_model=DriverList,
    summary="List all drivers",
)
def list_drivers(db: Session = Depends(get_db)) -> DriverList:
    return DriverService.get_all_drivers(db)

@router.get(
    "/drivers-history", 
    response_model=FuelRecordList, 
    summary="Driver fueling history report"
)
def get_driver_history(
    filters: DriverHistoryFilter = Depends(),
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db)
) -> list[FuelRecordResponse]:
    records = DriverService.get_driver_history(
        db=db,
        page=page,
        page_size=page_size,
        cpf=filters.cpf,
        name=filters.name,
    )
    return records