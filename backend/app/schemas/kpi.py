from pydantic import BaseModel
from typing import List

class FuelPriceAverage(BaseModel):
    fuel_type: str
    average_price: float
    records_count: int

class VehicleVolumeTotal(BaseModel):
    vehicle_type: str
    total_volume: float
    records_count: int

class FuelPriceAverageList(BaseModel):
    items: List[FuelPriceAverage]

class VehicleVolumeTotalList(BaseModel):
    items: List[VehicleVolumeTotal]

class StateVolume(BaseModel):
    state: str
    total_volume: float

class StateVolumeList(BaseModel):
    items: List[StateVolume]