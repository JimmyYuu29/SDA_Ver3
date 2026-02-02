"""
SDA Evaluation API - Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .routers import services, threats, evaluations, legal_rules

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API for evaluating Non-Audit Services (SDA) compliance with Spanish audit regulations",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(services.router, prefix="/api/services", tags=["Services"])
app.include_router(threats.router, prefix="/api/threats", tags=["Threats"])
app.include_router(evaluations.router, prefix="/api/evaluations", tags=["Evaluations"])
app.include_router(legal_rules.router, prefix="/api/legal-rules", tags=["Legal Rules"])


@app.get("/")
def root():
    return {
        "name": settings.app_name,
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
