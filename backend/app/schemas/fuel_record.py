from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import List
from validate_docbr import CPF

class FuelRecordCreate(BaseModel):
    station_identifier: str = Field(..., max_length=20)
    station_name: str = Field(..., max_length=200)
    city: str = Field(..., max_length=100)
    state: str = Field(..., min_length=2, max_length=2)

    collection_datetime: datetime
    fuel_type: str = Field(..., max_length=50)
    sale_price: float = Field(..., gt=0)
    sold_volume: float = Field(..., gt=0)

    driver_name: str = Field(..., max_length=200)
    driver_cpf: str = Field(..., min_length=11, max_length=14)

    vehicle_plate: str = Field(..., min_length=7, max_length=8)
    vehicle_type: str = Field(..., max_length=50)

    @field_validator("driver_cpf")
    @classmethod
    def validade_cpf(cls, v: str) -> str:
        cpf = CPF()
        digits = "".join(filter(str.isdigit, v))
        if not cpf.validade(digits):
            raise ValueError("Invalid CPF")
        return digits
    
    @field_validator("state")
    @classmethod
    def upper_state(cls, v: str) -> str:
        return v.upper()
    

class FuelRecordResponse(BaseModel):
    id: int
    station_identifier: str
    station_name: str
    city: str
    state: str
    collection_datetime: datetime
    fuel_type: str
    sale_price: float
    sold_volume: float
    driver_name: str
    driver_cpf: str
    vehicle_plate: str
    vehicle_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class FuelRecordList(BaseModel):
    total: int
    page: int
    page_size: int
    records: List[FuelRecordResponse]