import pytest
from datetime import datetime
from faker import Faker

fake = Faker('pt_BR') 

@pytest.fixture
def valid_fuel_record_data():
    return {
        "station_identifier": fake.bothify(text='POST-###'),
        "station_name": fake.company(),
        "fuel_type": fake.random_element(["Gasolina", "Etanol", "Diesel"]),
        "vehicle_type": fake.random_element(["Carro", "Moto", "Caminhão"]),
        "sold_volume": round(fake.random.uniform(10.0, 100.0), 2),
        "sale_price": round(fake.random.uniform(4.0, 7.0), 2),
        "driver_cpf": "12345678909", 
        "driver_name": fake.name(),
        "vehicle_plate": fake.license_plate(),
        "city": fake.city(),
        "state": fake.estado_sigla(),
        "collection_datetime": fake.date_time_this_year()
    }

def test_create_fuel_record(db_session, valid_fuel_record_data):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    data = FuelRecordCreate(**valid_fuel_record_data)
    record = FuelRecordService.create(db_session, data)
    
    assert record.id is not None
    assert record.fuel_type == valid_fuel_record_data["fuel_type"]
    assert record.sold_volume == valid_fuel_record_data["sold_volume"]
    assert record.station_name == valid_fuel_record_data["station_name"]

def test_list_fuel_records_with_filters(db_session):
    from app.services.fuel_record_service import FuelRecordService
    
    result = FuelRecordService.list(
        db_session,
        page=1,
        page_size=10,
        fuel_type="Gasolina",
        state="PE"
    )
    
    assert result.page == 1
    assert result.page_size == 10
    assert isinstance(result.records, list)

def test_get_filter_options(db_session):
    from app.services.fuel_record_service import FuelRecordService
    
    options = FuelRecordService.get_filter_options(db_session)
    
    assert hasattr(options, 'fuel_types')
    assert hasattr(options, 'vehicle_types')
    assert hasattr(options, 'cities')
    assert hasattr(options, 'states')