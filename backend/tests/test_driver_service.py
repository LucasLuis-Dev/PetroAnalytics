def test_get_all_drivers(db_session):
    from app.services.driver_service import DriverService
    
    result = DriverService.get_all_drivers(db_session, page=1, page_size=10)
    
    assert result.page == 1
    assert isinstance(result.drivers, list)

def test_search_drivers_by_name(db_session):
    from app.services.driver_service import DriverService
    
    result = DriverService.get_all_drivers(
        db_session,
        page=1,
        page_size=10,
        search="João"
    )
    
    assert result.total >= 0

def test_get_driver_history(db_session):
    from app.services.driver_service import DriverService
    
    result = DriverService.get_driver_history(
        db_session,
        cpf="12345678900",
        page=1,
        page_size=10
    )
    
    assert result.page == 1
    assert isinstance(result.records, list)