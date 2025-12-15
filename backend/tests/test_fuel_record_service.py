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

@pytest.fixture
def sample_fuel_records():
    return [
        {
            "station_identifier": "POST-001",
            "station_name": "Posto Alpha",
            "fuel_type": "Gasolina",
            "vehicle_type": "Carro",
            "sold_volume": 50.0,
            "sale_price": 5.00,  # total: 250.00
            "driver_cpf": fake.cpf().replace(".", "").replace("-", ""),
            "driver_name": "João Silva",
            "vehicle_plate": "ABC1234",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 1, 15, 10, 0)
        },
        {
            "station_identifier": "POST-002",
            "station_name": "Posto Beta",
            "fuel_type": "Gasolina",
            "vehicle_type": "Carro",
            "sold_volume": 30.0,
            "sale_price": 6.00,  # total: 180.00
            "driver_cpf": fake.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Maria Santos",
            "vehicle_plate": "DEF5678",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 1, 15, 11, 0)
        },
        {
            "station_identifier": "POST-003",
            "station_name": "Posto Gamma",
            "fuel_type": "Etanol",
            "vehicle_type": "Carro",
            "sold_volume": 40.0,
            "sale_price": 4.00,  # total: 160.00
            "driver_cpf": fake.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Carlos Oliveira",
            "vehicle_plate": "GHI9012",
            "city": "São Paulo",
            "state": "SP",
            "collection_datetime": datetime(2024, 1, 15, 12, 0)
        }
    ]


def test_weighted_average_price_calculation(db_session, sample_fuel_records):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in sample_fuel_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    summary = FuelRecordService.get_summary(db_session)
    
    assert summary.total_volume == 120.0
    assert summary.total_amount == 590.0
    
    weighted_avg_price = summary.total_amount / summary.total_volume
    assert round(weighted_avg_price, 2) == 4.92


def test_weighted_average_with_fuel_type_filter(db_session, sample_fuel_records):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in sample_fuel_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    summary = FuelRecordService.get_summary(
        db_session,
        fuel_type="Gasolina"
    )
    
    assert summary.total_volume == 80.0
    assert summary.total_amount == 430.0
    
    weighted_avg_price = summary.total_amount / summary.total_volume
    assert round(weighted_avg_price, 3) == 5.375


def test_weighted_average_with_state_filter(db_session, sample_fuel_records):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in sample_fuel_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    summary = FuelRecordService.get_summary(
        db_session,
        state="PE"
    )
    
    assert summary.total_volume == 80.0
    assert summary.total_amount == 430.0
    
    weighted_avg_price = summary.total_amount / summary.total_volume
    assert round(weighted_avg_price, 2) == 5.38


@pytest.mark.parametrize("filter_params,expected_volume,expected_amount", [
    ({"fuel_type": "Gasolina"}, 80.0, 430.0),
    ({"fuel_type": "Etanol"}, 40.0, 160.0),
    ({"state": "PE"}, 80.0, 430.0),
    ({"state": "SP"}, 40.0, 160.0),
    ({"fuel_type": "Gasolina", "state": "PE"}, 80.0, 430.0),
])
def test_summary_with_multiple_filters(
    db_session,
    sample_fuel_records,
    filter_params,
    expected_volume,
    expected_amount
):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in sample_fuel_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    summary = FuelRecordService.get_summary(db_session, **filter_params)
    
    assert summary.total_volume == expected_volume
    assert summary.total_amount == expected_amount
    
    if expected_volume > 0:
        weighted_avg = summary.total_amount / summary.total_volume
        assert weighted_avg > 0


def test_average_price_empty_database(db_session):
    from app.services.fuel_record_service import FuelRecordService
    
    summary = FuelRecordService.get_summary(db_session)
    
    assert summary.total_volume == 0.0
    assert summary.total_amount == 0.0
    assert summary.active_drivers == 0
    assert summary.total_fillings == 0


def test_average_price_single_record(db_session):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    fake = Faker('pt_BR')
    
    single_record = {
        "station_identifier": "POST-SINGLE",
        "station_name": "Posto Único",
        "fuel_type": "Diesel",
        "vehicle_type": "Caminhão",
        "sold_volume": 25.0,
        "sale_price": 5.50,
        "driver_cpf": fake.cpf().replace(".", "").replace("-", ""),
        "driver_name": "Motorista Teste",
        "vehicle_plate": "XYZ9999",
        "city": "Brasília",
        "state": "DF",
        "collection_datetime": datetime(2024, 1, 20, 15, 0)
    }
    
    data = FuelRecordCreate(**single_record)
    FuelRecordService.create(db_session, data)
    
    summary = FuelRecordService.get_summary(db_session)
    
    assert summary.total_volume == 25.0
    assert summary.total_amount == 137.5
    
    weighted_avg_price = summary.total_amount / summary.total_volume
    assert weighted_avg_price == 5.50


def test_average_price_precision(db_session):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    fake = Faker('pt_BR')
    
    precision_records = [
        {
            "station_identifier": "POST-P1",
            "station_name": "Posto Precisão",
            "fuel_type": "Gasolina",
            "vehicle_type": "Carro",
            "sold_volume": 15.75,
            "sale_price": 5.379,
            "driver_cpf": fake.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Teste Precisão 1",
            "vehicle_plate": "PRE1111",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 2, 1, 10, 0)
        },
        {
            "station_identifier": "POST-P2",
            "station_name": "Posto Precisão 2",
            "fuel_type": "Gasolina",
            "vehicle_type": "Carro",
            "sold_volume": 22.33,
            "sale_price": 5.421,
            "driver_cpf": fake.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Teste Precisão 2",
            "vehicle_plate": "PRE2222",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 2, 1, 11, 0)
        }
    ]
    
    for record_data in precision_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    summary = FuelRecordService.get_summary(db_session)
    
    expected_total_volume = 38.08
    expected_total_amount = 205.77 
    
    assert round(summary.total_volume, 2) == expected_total_volume
    assert round(summary.total_amount, 2) == expected_total_amount


def test_average_price_with_city_filter(db_session, sample_fuel_records):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in sample_fuel_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    summary = FuelRecordService.get_summary(
        db_session,
        city="Recife"
    )
    
    assert summary.total_volume == 80.0
    assert summary.total_amount == 430.0
    assert summary.active_drivers == 2 


def test_average_price_consistency_with_filters(db_session, sample_fuel_records):
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in sample_fuel_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    summary_all = FuelRecordService.get_summary(db_session)
    
    summary_gasolina = FuelRecordService.get_summary(
        db_session,
        fuel_type="Gasolina"
    )
    summary_etanol = FuelRecordService.get_summary(
        db_session,
        fuel_type="Etanol"
    )
    
    assert (summary_gasolina.total_volume + summary_etanol.total_volume) == summary_all.total_volume
    assert (summary_gasolina.total_amount + summary_etanol.total_amount) == summary_all.total_amount
