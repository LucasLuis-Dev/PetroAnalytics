from typing import Optional
from validate_docbr import CPF as CPFValidator


def normalize_cpf(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    return "".join(filter(str.isdigit, value))

def validate_cpf(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    
    digits = normalize_cpf(value)
    
    if len(digits) != 11:
        raise ValueError("CPF must have exactly 11 digits")
    
    cpf_validator = CPFValidator()
    if not cpf_validator.validate(digits):
        raise ValueError("Invalid CPF")
    
    return digits

def normalize_string(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    return value.strip()