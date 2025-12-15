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
