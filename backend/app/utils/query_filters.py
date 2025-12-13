from sqlalchemy.orm import Query
from app.models.fuel_record import FuelRecord


def apply_fuel_record_filters(
    query: Query,
    fuel_type: str | None = None,
    city: str | None = None,
    state: str | None = None,
    vehicle_type: str | None = None
) -> Query:
    if fuel_type:
        query = query.filter(FuelRecord.fuel_type == fuel_type)
    if city:
        query = query.filter(FuelRecord.city == city)
    if state:
        query = query.filter(FuelRecord.state == state)
    if vehicle_type:
        query = query.filter(FuelRecord.vehicle_type == vehicle_type)
    
    return query
