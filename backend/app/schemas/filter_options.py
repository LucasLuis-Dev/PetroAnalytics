from pydantic import BaseModel
from typing import List


class FilterOptions(BaseModel):
    fuel_types: List[str]
    vehicle_types: List[str]
    cities: List[str]