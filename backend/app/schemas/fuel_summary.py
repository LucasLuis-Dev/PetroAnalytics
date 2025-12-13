from pydantic import BaseModel

class FuelSummary(BaseModel):
    total_volume: float
    total_amount: float
    active_drivers: int
    total_fillings: int