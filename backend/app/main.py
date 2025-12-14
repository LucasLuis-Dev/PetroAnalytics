from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.dependencies.auth import get_current_active_user

from app.routers.fuel_record import router as fuel_router
from app.routers.kpis import router as kpis_router
from app.routers.drivers import router as drivers_router
from app.routers.auth import router as auth_router

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
    return {"status": "healthy"}
