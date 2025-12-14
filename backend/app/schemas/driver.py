from pydantic import BaseModel, model_validator, field_validator, Field
from typing import List, Optional
from app.utils.validators import validate_cpf, normalize_string


class Driver(BaseModel):
    name: str
    cpf: str
    total_fillings: int


class DriverList(BaseModel):
    drivers: List[Driver]
    total: int
    page: int
    page_size: int


class DriverHistoryFilter(BaseModel):
    cpf: Optional[str] = None
    name: Optional[str] = None

    @model_validator(mode="after")
    def validate_filters(self):
        if not self.cpf and not self.name:
            raise ValueError("You must provide at least one filter: cpf or name")
        
        if self.cpf:
            self.cpf = validate_cpf(self.cpf)
        
        if self.name:
            self.name = normalize_string(self.name)
        
        return self