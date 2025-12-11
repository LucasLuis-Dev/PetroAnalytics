from datetime import datetime, timedelta
import random

from faker import Faker
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.fuel_record import FuelRecord

fake = Faker("pt_BR")

FUEL_TYPES = ["Gasoline", "Ethanol", "Diesel S10"]
VEHICLE_TYPES = ["Car", "Motorcycle", "Light Truck", "Truck", "Bus"]
CITIES = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Recife", "Brasília"]

def generate_record() -> FuelRecord:
    days_ago = random.randint(0, 30)
    collection_datetime = datetime.now() - timedelta(days=days_ago)

    return FuelRecord(
        station_identifier=fake.cnpj(),
        station_name=f"Posto {fake.company()}",
        city=random.choice(CITIES),
        state="SP",
        collection_datetime=collection_datetime,
        fuel_type=random.choice(FUEL_TYPES),
        sale_price=round(random.uniform(4.5, 7.0), 2),
        sold_volume=round(random.uniform(10, 150), 2),
        driver_name=fake.name(),
        driver_cpf=fake.cpf().replace(".", "").replace("-", ""),
        vehicle_plate=fake.license_plate().replace("-", "")[:8],
        vehicle_type=random.choice(VEHICLE_TYPES),
    )


def seed_fuel_records(quantity: int = 100) -> None:
    db: Session = SessionLocal()
    try:
        for i in range(quantity):
            record = generate_record()
            db.add(record)
            if (i + 1) % 20 == 0:
                db.commit()
                print(f"{i+1} entered records...")
        db.commit()
        print(f"Seed completed with {quantity} records.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_fuel_records(150)