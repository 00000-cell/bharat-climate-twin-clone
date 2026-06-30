from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api import admin, auth, climate, copilot, predictions, risk, simulations
from app.core.config import get_settings
from app.db.base import Base
from app.db.init_db import init_db
from app.db.session import SessionLocal, engine

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI-powered digital twin API for India's climate risk system.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.backend_cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    import logging
    logger = logging.getLogger(__name__)
    from app.services.gemini import gemini_service
    try:
        gemini_service.initialize()
        if not gemini_service.validate_key():
            logger.error("[STARTUP ERROR] GEMINI_API_KEY validation failed during startup! Live API requests may fail.")
        else:
            logger.info("[STARTUP] GEMINI_API_KEY validated successfully.")
    except Exception as e:
        logger.error(f"[STARTUP ERROR] Gemini service initialization failed: {e}")

    if settings.seed_database:
        with engine.begin() as connection:
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            init_db(db)
        finally:
            db.close()


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "bharat-climate-twin-api"}


app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(climate.router, prefix=settings.api_v1_prefix)
app.include_router(risk.router, prefix=settings.api_v1_prefix)
app.include_router(predictions.router, prefix=settings.api_v1_prefix)
app.include_router(simulations.router, prefix=settings.api_v1_prefix)
app.include_router(copilot.router, prefix=settings.api_v1_prefix)
app.include_router(admin.router, prefix=settings.api_v1_prefix)
