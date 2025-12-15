import pytest
from datetime import datetime
from faker import Faker

fake = Faker('pt_BR')


@pytest.fixture
def kpi_sample_records():
    faker_cpf = Faker('pt_BR')
    
    return [
        # Gasolina - 3 registros
        {
            "station_identifier": "POST-001",
            "station_name": "Posto Alpha",
            "fuel_type": "Gasolina",
            "vehicle_type": "Carro",
            "sold_volume": 50.0,
            "sale_price": 5.00,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
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
            "sale_price": 6.00,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Maria Santos",
            "vehicle_plate": "DEF5678",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 1, 15, 11, 0)
        },
        {
            "station_identifier": "POST-003",
            "station_name": "Posto Gamma",
            "fuel_type": "Gasolina",
            "vehicle_type": "Moto",
            "sold_volume": 20.0,
            "sale_price": 5.50,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Pedro Costa",
            "vehicle_plate": "GHI9012",
            "city": "São Paulo",
            "state": "SP",
            "collection_datetime": datetime(2024, 1, 15, 12, 0)
        },
        # Etanol - 2 registros
        {
            "station_identifier": "POST-004",
            "station_name": "Posto Delta",
            "fuel_type": "Etanol",
            "vehicle_type": "Carro",
            "sold_volume": 40.0,
            "sale_price": 4.00,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Carlos Oliveira",
            "vehicle_plate": "JKL3456",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 1, 15, 13, 0)
        },
        {
            "station_identifier": "POST-005",
            "station_name": "Posto Epsilon",
            "fuel_type": "Etanol",
            "vehicle_type": "Carro",
            "sold_volume": 35.0,
            "sale_price": 3.80,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Ana Souza",
            "vehicle_plate": "MNO7890",
            "city": "São Paulo",
            "state": "SP",
            "collection_datetime": datetime(2024, 1, 15, 14, 0)
        },
        # Diesel - 1 registro
        {
            "station_identifier": "POST-006",
            "station_name": "Posto Zeta",
            "fuel_type": "Diesel",
            "vehicle_type": "Caminhão",
            "sold_volume": 100.0,
            "sale_price": 4.50,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Roberto Lima",
            "vehicle_plate": "PQR1234",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 1, 15, 15, 0)
        }
    ]


def test_get_fuel_price_averages(db_session):
    from app.services.kpi_service import KPIService
    
    result = KPIService.get_fuel_price_averages(db_session)
    
    assert isinstance(result, list)


def test_get_vehicle_volume_totals(db_session):
    from app.services.kpi_service import KPIService
    
    result = KPIService.get_vehicle_volume_totals(db_session, fuel_type="Gasolina")
    
    assert isinstance(result, list)


def test_get_top_stations_by_volume(db_session):
    from app.services.kpi_service import KPIService
    
    result = KPIService.get_top_stations_by_volume(db_session, limit=5)
    
    assert len(result.items) <= 5

def test_simple_average_price_calculation(db_session, kpi_sample_records):
    """
    Testa cálculo da média SIMPLES de preços por tipo de combustível.
    
    Gasolina: (5.00 + 6.00 + 5.50) / 3 = 5.50
    Etanol: (4.00 + 3.80) / 2 = 3.90
    Diesel: 4.50 / 1 = 4.50
    """
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    averages = KPIService.get_fuel_price_averages(db_session)
    
    averages_dict = {item.fuel_type: item for item in averages}
    
    assert "Gasolina" in averages_dict
    assert averages_dict["Gasolina"].average_price == 5.50
    assert averages_dict["Gasolina"].records_count == 3
    
    assert "Etanol" in averages_dict
    assert averages_dict["Etanol"].average_price == 3.90
    assert averages_dict["Etanol"].records_count == 2
    
    assert "Diesel" in averages_dict
    assert averages_dict["Diesel"].average_price == 4.50
    assert averages_dict["Diesel"].records_count == 1


def test_fuel_price_average_with_filter(db_session, kpi_sample_records):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    averages = KPIService.get_fuel_price_averages(db_session, state="PE")
    averages_dict = {item.fuel_type: item for item in averages}
    
    assert "Gasolina" in averages_dict
    assert averages_dict["Gasolina"].average_price == 5.50
    assert averages_dict["Gasolina"].records_count == 2
    
    assert "Etanol" in averages_dict
    assert averages_dict["Etanol"].average_price == 4.00
    assert averages_dict["Etanol"].records_count == 1
    
    assert "Diesel" in averages_dict
    assert averages_dict["Diesel"].average_price == 4.50


def test_fuel_price_average_with_city_filter(db_session, kpi_sample_records):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    averages = KPIService.get_fuel_price_averages(db_session, city="Recife")
    averages_dict = {item.fuel_type: item for item in averages}
    
    assert "Gasolina" in averages_dict
    assert averages_dict["Gasolina"].average_price == 5.50


def test_fuel_price_average_single_fuel_type(db_session, kpi_sample_records):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    averages = KPIService.get_fuel_price_averages(db_session, fuel_type="Etanol")
    
    assert len(averages) == 1
    assert averages[0].fuel_type == "Etanol"
    assert averages[0].average_price == 3.90
    assert averages[0].records_count == 2


def test_fuel_price_average_precision(db_session):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    faker_cpf = Faker('pt_BR')
    
    precision_records = [
        {
            "station_identifier": "POST-P1",
            "station_name": "Posto Teste 1",
            "fuel_type": "Gasolina",
            "vehicle_type": "Carro",
            "sold_volume": 10.0,
            "sale_price": 5.379,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Teste 1",
            "vehicle_plate": "TST1111",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 2, 1, 10, 0)
        },
        {
            "station_identifier": "POST-P2",
            "station_name": "Posto Teste 2",
            "fuel_type": "Gasolina",
            "vehicle_type": "Carro",
            "sold_volume": 15.0,
            "sale_price": 5.421,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Teste 2",
            "vehicle_plate": "TST2222",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 2, 1, 11, 0)
        },
        {
            "station_identifier": "POST-P3",
            "station_name": "Posto Teste 3",
            "fuel_type": "Gasolina",
            "vehicle_type": "Carro",
            "sold_volume": 20.0,
            "sale_price": 5.500,
            "driver_cpf": faker_cpf.cpf().replace(".", "").replace("-", ""),
            "driver_name": "Teste 3",
            "vehicle_plate": "TST3333",
            "city": "Recife",
            "state": "PE",
            "collection_datetime": datetime(2024, 2, 1, 12, 0)
        }
    ]
    
    for record_data in precision_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    averages = KPIService.get_fuel_price_averages(db_session)
    
    assert len(averages) == 1
    assert averages[0].fuel_type == "Gasolina"
    assert averages[0].average_price == 5.43
    assert averages[0].records_count == 3


def test_vehicle_volume_totals_calculation(db_session, kpi_sample_records):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    volumes = KPIService.get_vehicle_volume_totals(db_session)
    volumes_dict = {item.vehicle_type: item for item in volumes}
    
    assert "Carro" in volumes_dict
    assert volumes_dict["Carro"].total_volume == 155.0
    assert volumes_dict["Carro"].records_count == 4
    
    assert "Moto" in volumes_dict
    assert volumes_dict["Moto"].total_volume == 20.0
    assert volumes_dict["Moto"].records_count == 1
    
    assert "Caminhão" in volumes_dict
    assert volumes_dict["Caminhão"].total_volume == 100.0
    assert volumes_dict["Caminhão"].records_count == 1


def test_vehicle_volume_with_fuel_type_filter(db_session, kpi_sample_records):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    volumes = KPIService.get_vehicle_volume_totals(db_session, fuel_type="Gasolina")
    volumes_dict = {item.vehicle_type: item for item in volumes}
    
    assert "Carro" in volumes_dict
    assert volumes_dict["Carro"].total_volume == 80.0
    
    assert "Moto" in volumes_dict
    assert volumes_dict["Moto"].total_volume == 20.0
    
    assert "Caminhão" not in volumes_dict 


def test_state_volumes_calculation(db_session, kpi_sample_records):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    state_volumes = KPIService.get_state_volumes(db_session)
    volumes_dict = {item.state: item.total_volume for item in state_volumes.items}
    
    assert volumes_dict["PE"] == 220.0
    assert volumes_dict["SP"] == 55.0


def test_top_stations_by_volume(db_session, kpi_sample_records):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    top_stations = KPIService.get_top_stations_by_volume(db_session, limit=5)
    
    assert len(top_stations.items) == 5

    assert top_stations.items[0].station_identifier == "POST-006"
    assert top_stations.items[0].total_volume == 100.0
    
    assert top_stations.items[1].station_identifier == "POST-001"
    assert top_stations.items[1].total_volume == 50.0
    
    assert top_stations.items[2].station_identifier == "POST-004"
    assert top_stations.items[2].total_volume == 40.0


def test_top_stations_with_limit(db_session, kpi_sample_records):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    top_stations = KPIService.get_top_stations_by_volume(db_session, limit=3)
    
    assert len(top_stations.items) == 3
    assert top_stations.items[0].total_volume >= top_stations.items[1].total_volume
    assert top_stations.items[1].total_volume >= top_stations.items[2].total_volume


def test_empty_database_kpis(db_session):
    from app.services.kpi_service import KPIService
    
    averages = KPIService.get_fuel_price_averages(db_session)
    assert averages == []
    
    volumes = KPIService.get_vehicle_volume_totals(db_session)
    assert volumes == []
    
    state_volumes = KPIService.get_state_volumes(db_session)
    assert len(state_volumes.items) == 0
    
    top_stations = KPIService.get_top_stations_by_volume(db_session)
    assert len(top_stations.items) == 0


@pytest.mark.parametrize("fuel_type,expected_avg", [
    ("Gasolina", 5.50),
    ("Etanol", 3.90),
    ("Diesel", 4.50),
])
def test_fuel_price_averages_parametrized(
    db_session,
    kpi_sample_records,
    fuel_type,
    expected_avg
):
    from app.services.kpi_service import KPIService
    from app.services.fuel_record_service import FuelRecordService
    from app.schemas.fuel_record import FuelRecordCreate
    
    for record_data in kpi_sample_records:
        data = FuelRecordCreate(**record_data)
        FuelRecordService.create(db_session, data)
    
    averages = KPIService.get_fuel_price_averages(db_session, fuel_type=fuel_type)
    
    assert len(averages) == 1
    assert averages[0].fuel_type == fuel_type
    assert averages[0].average_price == expected_avg
