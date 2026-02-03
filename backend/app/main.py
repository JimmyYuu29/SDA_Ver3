"""
SDA Evaluation API - Main FastAPI Application
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .database import engine, Base, SessionLocal
from .models import (
    Category, Service, Threat, Safeguard, SafeguardLevel,
    ServiceThreat, LegalRule, Evaluation, EvaluationThreat, EvaluationSafeguard
)
from .routers import services, threats, evaluations, legal_rules

logger = logging.getLogger(__name__)
settings = get_settings()


def _seed_database():
    """Seed the database with data from Excel files if tables are empty."""
    import sys
    from pathlib import Path

    # Add backend dir to path so scripts module can be imported
    backend_dir = str(Path(__file__).parent.parent)
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    from scripts.extract_data import (
        extract_services,
        extract_threats_and_safeguards,
        extract_legal_rules,
    )

    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(Service).first() is not None:
            logger.info("Database already seeded, skipping.")
            return

        logger.info("Seeding database from Excel files...")

        # --- Categories & Services ---
        data = extract_services()
        category_map = {}
        for cat_data in data["categories"]:
            category = Category(
                code=cat_data["code"],
                name=cat_data["name"],
                parent_category=cat_data["parent_category"],
            )
            db.add(category)
            db.flush()
            category_map[cat_data["code"]] = category.id

        for svc_data in data["services"]:
            category_id = category_map.get(svc_data["category_code"])
            service = Service(
                code=svc_data["code"],
                name=svc_data["name"],
                category_id=category_id,
                no_eip_auditada=svc_data["no_eip_auditada"],
                no_eip_cadena=svc_data["no_eip_cadena"],
                no_eip_vinculada=svc_data["no_eip_vinculada"],
                eip_auditada=svc_data["eip_auditada"],
                eip_cadena=svc_data["eip_cadena"],
                eip_vinculada=svc_data["eip_vinculada"],
            )
            db.add(service)
        db.commit()
        logger.info(
            "  Seeded %d categories and %d services",
            len(data["categories"]),
            len(data["services"]),
        )

        # --- Threats & Safeguards ---
        threat_data = extract_threats_and_safeguards()
        threat_map = {}
        for t in threat_data["threats"]:
            threat = Threat(
                code=t["code"], name=t["name"], name_es=t["name_es"],
                description=f"{t['name']} threat",
            )
            db.add(threat)
            db.flush()
            threat_map[t["code"]] = threat.id

        level_map = {}
        for lv in threat_data["safeguard_levels"]:
            level = SafeguardLevel(
                code=lv["code"], name=lv["name"], name_es=lv["name_es"],
            )
            db.add(level)
            db.flush()
            level_map[lv["code"]] = level.id

        for sg in threat_data["safeguards"]:
            tid = threat_map.get(sg["threat_code"])
            lid = level_map.get(sg["level_code"])
            if tid and lid:
                db.add(Safeguard(
                    threat_id=tid, level_id=lid,
                    description=sg.get("description", ""),
                    description_es=sg.get("description_es", ""),
                ))
        db.commit()
        logger.info(
            "  Seeded %d threats, %d safeguard levels, %d safeguards",
            len(threat_data["threats"]),
            len(threat_data["safeguard_levels"]),
            len(threat_data["safeguards"]),
        )

        # --- Legal Rules ---
        rules = extract_legal_rules()
        for r in rules:
            db.add(LegalRule(
                rule_type=r["rule_type"],
                article=r["article"],
                description=r["description"],
                applies_to_eip=r["applies_to_eip"],
                applies_to_no_eip=r["applies_to_no_eip"],
                safeguard_text=r.get("safeguard_text"),
            ))
        db.commit()
        logger.info("  Seeded %d legal rules", len(rules))

        # --- Service-Threat Mappings ---
        all_services = db.query(Service).all()
        default_threats = ["SELF_REVIEW", "SELF_INTEREST"]
        count = 0
        for svc in all_services:
            for tc in default_threats:
                tid = threat_map.get(tc)
                if tid:
                    db.add(ServiceThreat(service_id=svc.id, threat_id=tid))
                    count += 1
        db.commit()
        logger.info("  Seeded %d service-threat mappings", count)
        logger.info("Database seeding completed successfully!")

    except Exception as e:
        logger.error("Error seeding database: %s", e)
        db.rollback()
        raise
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create tables and seed data on startup."""
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Tables created.")
    _seed_database()
    yield


app = FastAPI(
    title=settings.app_name,
    description="API for evaluating Non-Audit Services (SDA) compliance with Spanish audit regulations",
    version="1.0.0",
    lifespan=lifespan,
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
