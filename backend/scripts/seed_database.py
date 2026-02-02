"""
Database seeding script for SDA Evaluation App.
Creates tables and populates with data from Excel files.
"""
import sys
from pathlib import Path

# Add the app to the path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.database import engine, SessionLocal, Base
from app.models.service import Category, Service
from app.models.threat import Threat, SafeguardLevel, Safeguard, ServiceThreat
from app.models.legal_rule import LegalRule
from scripts.extract_data import extract_services, extract_threats_and_safeguards, extract_legal_rules


def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")


def seed_categories_and_services(db: Session):
    """Seed categories and services from Excel"""
    print("\nSeeding categories and services...")
    data = extract_services()

    # Create categories
    category_map = {}
    for cat_data in data['categories']:
        category = Category(
            code=cat_data['code'],
            name=cat_data['name'],
            parent_category=cat_data['parent_category']
        )
        db.add(category)
        db.flush()
        category_map[cat_data['code']] = category.id

    # Create services
    for svc_data in data['services']:
        category_id = category_map.get(svc_data['category_code'])
        service = Service(
            code=svc_data['code'],
            name=svc_data['name'],
            category_id=category_id,
            no_eip_auditada=svc_data['no_eip_auditada'],
            no_eip_cadena=svc_data['no_eip_cadena'],
            no_eip_vinculada=svc_data['no_eip_vinculada'],
            eip_auditada=svc_data['eip_auditada'],
            eip_cadena=svc_data['eip_cadena'],
            eip_vinculada=svc_data['eip_vinculada'],
        )
        db.add(service)

    db.commit()
    print(f"  Created {len(data['categories'])} categories")
    print(f"  Created {len(data['services'])} services")


def seed_threats_and_safeguards(db: Session):
    """Seed threats, safeguard levels, and safeguards from Excel"""
    print("\nSeeding threats and safeguards...")
    data = extract_threats_and_safeguards()

    # Create threats
    threat_map = {}
    for threat_data in data['threats']:
        threat = Threat(
            code=threat_data['code'],
            name=threat_data['name'],
            name_es=threat_data['name_es'],
            description=f"{threat_data['name']} threat"
        )
        db.add(threat)
        db.flush()
        threat_map[threat_data['code']] = threat.id

    # Create safeguard levels
    level_map = {}
    for level_data in data['safeguard_levels']:
        level = SafeguardLevel(
            code=level_data['code'],
            name=level_data['name'],
            name_es=level_data['name_es']
        )
        db.add(level)
        db.flush()
        level_map[level_data['code']] = level.id

    # Create safeguards
    for safeguard_data in data['safeguards']:
        threat_id = threat_map.get(safeguard_data['threat_code'])
        level_id = level_map.get(safeguard_data['level_code'])
        if threat_id and level_id:
            safeguard = Safeguard(
                threat_id=threat_id,
                level_id=level_id,
                description=safeguard_data.get('description', ''),
                description_es=safeguard_data.get('description_es', '')
            )
            db.add(safeguard)

    db.commit()
    print(f"  Created {len(data['threats'])} threats")
    print(f"  Created {len(data['safeguard_levels'])} safeguard levels")
    print(f"  Created {len(data['safeguards'])} safeguards")


def seed_legal_rules(db: Session):
    """Seed legal rules from Excel"""
    print("\nSeeding legal rules...")
    rules = extract_legal_rules()

    for rule_data in rules:
        rule = LegalRule(
            rule_type=rule_data['rule_type'],
            article=rule_data['article'],
            description=rule_data['description'],
            applies_to_eip=rule_data['applies_to_eip'],
            applies_to_no_eip=rule_data['applies_to_no_eip'],
            safeguard_text=rule_data.get('safeguard_text')
        )
        db.add(rule)

    db.commit()
    print(f"  Created {len(rules)} legal rules")


def create_service_threat_mappings(db: Session):
    """Create default mappings between services and threats"""
    print("\nCreating service-threat mappings...")

    # Get all services and threats
    services = db.query(Service).all()
    threats = db.query(Threat).all()

    # By default, map all services to self-review and self-interest threats
    # This is a simplified approach - in production, this would be based on service type
    default_threats = ['SELF_REVIEW', 'SELF_INTEREST']
    threat_map = {t.code: t.id for t in threats}

    count = 0
    for service in services:
        for threat_code in default_threats:
            threat_id = threat_map.get(threat_code)
            if threat_id:
                mapping = ServiceThreat(
                    service_id=service.id,
                    threat_id=threat_id
                )
                db.add(mapping)
                count += 1

    db.commit()
    print(f"  Created {count} service-threat mappings")


def main():
    """Main seeding function"""
    print("=" * 50)
    print("SDA Evaluation App - Database Seeding")
    print("=" * 50)

    # Create tables
    create_tables()

    # Create session
    db = SessionLocal()

    try:
        # Clear existing data (for re-seeding)
        print("\nClearing existing data...")
        db.query(ServiceThreat).delete()
        db.query(Safeguard).delete()
        db.query(SafeguardLevel).delete()
        db.query(Threat).delete()
        db.query(Service).delete()
        db.query(Category).delete()
        db.query(LegalRule).delete()
        db.commit()

        # Seed data
        seed_categories_and_services(db)
        seed_threats_and_safeguards(db)
        seed_legal_rules(db)
        create_service_threat_mappings(db)

        print("\n" + "=" * 50)
        print("Database seeding completed successfully!")
        print("=" * 50)

    except Exception as e:
        print(f"\nError during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
