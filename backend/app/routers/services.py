"""
Services API Router
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models.service import Service, Category
from ..models.threat import Threat, ServiceThreat

router = APIRouter()


class CategoryResponse(BaseModel):
    id: int
    code: str
    name: str
    parent_category: Optional[str]

    class Config:
        from_attributes = True


class ServiceResponse(BaseModel):
    id: int
    code: str
    name: str
    category_id: Optional[int]
    no_eip_auditada: Optional[str]
    no_eip_cadena: Optional[str]
    no_eip_vinculada: Optional[str]
    eip_auditada: Optional[str]
    eip_cadena: Optional[str]
    eip_vinculada: Optional[str]

    class Config:
        from_attributes = True


class ServiceWithCategoryResponse(ServiceResponse):
    category: Optional[CategoryResponse]


class ThreatResponse(BaseModel):
    id: int
    code: str
    name: str
    name_es: str
    description: Optional[str]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[ServiceWithCategoryResponse])
def get_services(
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all services with optional filtering by category and search term"""
    query = db.query(Service)

    if category_id:
        query = query.filter(Service.category_id == category_id)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Service.name.ilike(search_term)) | (Service.code.ilike(search_term))
        )

    services = query.all()
    return services


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Get all service categories"""
    categories = db.query(Category).all()
    return categories


@router.get("/{service_id}", response_model=ServiceWithCategoryResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    """Get a specific service by ID"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service


@router.get("/{service_id}/threats", response_model=List[ThreatResponse])
def get_service_threats(service_id: int, db: Session = Depends(get_db)):
    """Get all threats associated with a service"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Get threats through the service_threats mapping
    threats = db.query(Threat).join(ServiceThreat).filter(
        ServiceThreat.service_id == service_id
    ).all()

    return threats


@router.get("/{service_id}/permission")
def check_service_permission(
    service_id: int,
    entity_type: str,
    relation_type: str = "AUDITADA",
    db: Session = Depends(get_db)
):
    """Check if a service is permitted for a given entity type and relation"""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Validate parameters
    if entity_type not in ["EIP", "NO_EIP"]:
        raise HTTPException(status_code=400, detail="Invalid entity_type. Must be 'EIP' or 'NO_EIP'")
    if relation_type not in ["AUDITADA", "CADENA", "VINCULADA"]:
        raise HTTPException(status_code=400, detail="Invalid relation_type")

    # Get the appropriate permission field
    field_map = {
        ("EIP", "AUDITADA"): service.eip_auditada,
        ("EIP", "CADENA"): service.eip_cadena,
        ("EIP", "VINCULADA"): service.eip_vinculada,
        ("NO_EIP", "AUDITADA"): service.no_eip_auditada,
        ("NO_EIP", "CADENA"): service.no_eip_cadena,
        ("NO_EIP", "VINCULADA"): service.no_eip_vinculada,
    }

    permission = field_map.get((entity_type, relation_type))

    # Determine result
    if permission == "NO":
        return {
            "permitted": False,
            "permission_code": "NO",
            "message": "Service is legally prohibited for this entity type",
            "conclusion": "C5"
        }
    elif permission == "2":
        return {
            "permitted": True,
            "permission_code": "2",
            "message": "Service permitted with conditions (requires 16.1.b 3º compliance)",
            "conclusion": None
        }
    elif permission == "1":
        return {
            "permitted": True,
            "permission_code": "1",
            "message": "Service permitted - proceed with questionnaire",
            "conclusion": None
        }
    else:
        return {
            "permitted": False,
            "permission_code": None,
            "message": "Permission status unknown",
            "conclusion": "C7"
        }
