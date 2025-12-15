from datetime import datetime, timedelta
import os
import random
from dotenv import load_dotenv

import httpx
from faker import Faker

load_dotenv()
fake = Faker("pt_BR")

API_URL = os.getenv("API_URL", "http://localhost:8000").rstrip("/")
LOGIN_ENDPOINT = f"{API_URL}/api/auth/login"         
FUEL_ENDPOINT  = f"{API_URL}/api/fuel-records/"       

EMAIL = os.getenv("SEED_EMAIL")
PASSWORD = os.getenv("SEED_PASSWORD")

FUEL_TYPES = ["Gasolina", "Etanol", "Diesel S10"]
VEHICLE_TYPES = ["Carro", "Moto", "Caminhão Leve", "Carreta", "Ônibus"]
CITY_STATE = {
    "São Paulo": "SP",
    "Rio de Janeiro": "RJ",
    "Belo Horizonte": "MG",
    "Recife": "PE",
    "Brasília": "DF",
}

def generate_payload() -> dict:
    days_ago = random.randint(0, 30)
    collection_datetime = datetime.now() - timedelta(days=days_ago)

    city = random.choice(list(CITY_STATE.keys()))
    state = CITY_STATE[city]

    return {
        "station_identifier": fake.cnpj(),
        "station_name": f"Posto {fake.company()}",
        "city": city,
        "state": state,
        "collection_datetime": collection_datetime.isoformat(),
        "fuel_type": random.choice(FUEL_TYPES),
        "sale_price": round(random.uniform(4.5, 7.0), 2),
        "sold_volume": round(random.uniform(10, 150), 2),
        "driver_name": fake.name(),
        "driver_cpf": fake.cpf().replace(".", "").replace("-", ""),
        "vehicle_plate": fake.license_plate().replace("-", "")[:8],
        "vehicle_type": random.choice(VEHICLE_TYPES),
    }

def login_and_get_token(client: httpx.Client) -> str:
    if not EMAIL or not PASSWORD:
        raise RuntimeError("Defina SEED_EMAIL e SEED_PASSWORD no ambiente.")

    resp = client.post(LOGIN_ENDPOINT, json={"email": EMAIL, "password": PASSWORD})
    resp.raise_for_status()

    data = resp.json()

    token = data.get("access_token") or data.get("token")
    if not token:
        raise RuntimeError(f"Resposta de login não trouxe token: {data}")

    return token

def seed(quantity: int = 150) -> None:
    with httpx.Client(timeout=30) as client:
        token = login_and_get_token(client)

        client.headers.update({"Authorization": f"Bearer {token}"})

        for i in range(quantity):
            payload = generate_payload()
            r = client.post(FUEL_ENDPOINT, json=payload)
            if r.status_code not in (200, 201):
                print(f"[{i+1}] Erro {r.status_code}: {r.text}")
            elif (i + 1) % 20 == 0:
                print(f"{i+1} registros enviados...")

if __name__ == "__main__":
    seed(150)
