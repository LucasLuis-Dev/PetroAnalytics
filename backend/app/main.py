from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine

from app.routers.fuel_record import router as fuel_router
from app.routers.kpis import router as kpis_router
from app.routers.drivers import router as drivers_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fuel_router, prefix="/api/fuel-records", tags=["Fuel Records"])
app.include_router(kpis_router, prefix="/api/kpis", tags=["KPIs"])
app.include_router(drivers_router, prefix="/api", tags=["Drivers"])



@app.get("/")
def root():
    return {
        "message": settings.PROJECT_NAME + " API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
