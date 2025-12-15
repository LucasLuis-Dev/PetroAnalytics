from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.config.config import settings
from app.config.redis import redis_client
from app.core.logging_config import setup_logging
from app.core.middleware import request_logger_middleware
from app.dependencies.auth import get_current_active_user
from app.core.exception_handlers import add_exception_handlers

from app.routers.fuel_record import router as fuel_router
from app.routers.kpis import router as kpis_router
from app.routers.drivers import router as drivers_router
from app.routers.auth import router as auth_router

setup_logging()
logger = logging.getLogger("petroanalytics")
logger.info("PetroAnalytics API started")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)
add_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(request_logger_middleware)

app.include_router(fuel_router, prefix="/api/fuel-records", tags=["Fuel Records"], dependencies=[Depends(get_current_active_user)])
app.include_router(kpis_router, prefix="/api/kpis", tags=["KPIs"], dependencies=[Depends(get_current_active_user)])
app.include_router(drivers_router, prefix="/api/drivers", tags=["Drivers"], dependencies=[Depends(get_current_active_user)])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def root():
    return {
        "message": settings.PROJECT_NAME + " API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    try:
        redis_client.ping()
        redis_status = "ok"
    except Exception:
        redis_status = "unavailable"
    
    return {
        "status": "ok",   
        "redis": redis_status  
    }
