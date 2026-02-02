"""
Legal Rules API Router
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models.legal_rule import LegalRule
from ..models.service import Service

router = APIRouter()


class LegalRuleResponse(BaseModel):
    id: int
    rule_type: str
    article: Optional[str]
    description: Optional[str]
    applies_to_eip: bool
    applies_to_no_eip: bool
    safeguard_text: Optional[str]

    class Config:
        from_attributes = True


class LegalGateCheckResponse(BaseModel):
    passed: bool
    permission_code: Optional[str]
    conclusion: Optional[str]
    reason: str
    applicable_rules: List[LegalRuleResponse]


@router.get("/", response_model=List[LegalRuleResponse])
def get_legal_rules(
    entity_type: Optional[str] = None,
    rule_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all legal rules with optional filtering"""
    query = db.query(LegalRule)

    if entity_type == "EIP":
        query = query.filter(LegalRule.applies_to_eip == True)
    elif entity_type == "NO_EIP":
        query = query.filter(LegalRule.applies_to_no_eip == True)

    if rule_type:
        query = query.filter(LegalRule.rule_type == rule_type)

    rules = query.all()
    return rules


@router.get("/check", response_model=LegalGateCheckResponse)
def check_legal_gate(
    service_id: int,
    entity_type: str,
    relation_type: str = "AUDITADA",
    db: Session = Depends(get_db)
):
    """
    Check if a service passes the legal gate for the given entity type.
    Returns the legal gate status and any applicable rules.
    """
    # Validate parameters
    if entity_type not in ["EIP", "NO_EIP"]:
        raise HTTPException(status_code=400, detail="Invalid entity_type. Must be 'EIP' or 'NO_EIP'")
    if relation_type not in ["AUDITADA", "CADENA", "VINCULADA"]:
        raise HTTPException(status_code=400, detail="Invalid relation_type")

    # Get the service
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

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

    # Get applicable rules
    if entity_type == "EIP":
        applicable_rules = db.query(LegalRule).filter(
            LegalRule.applies_to_eip == True
        ).all()
    else:
        applicable_rules = db.query(LegalRule).filter(
            LegalRule.applies_to_no_eip == True
        ).all()

    # Determine result based on permission code
    if permission == "NO":
        return LegalGateCheckResponse(
            passed=False,
            permission_code="NO",
            conclusion="C5",
            reason=f"El servicio '{service.name}' está legalmente prohibido para entidades {entity_type}. "
                   f"No se puede prestar este servicio según la normativa vigente (LAC/RUE).",
            applicable_rules=applicable_rules
        )
    elif permission == "2":
        return LegalGateCheckResponse(
            passed=True,
            permission_code="2",
            conclusion=None,
            reason=f"El servicio '{service.name}' está permitido con condiciones para entidades {entity_type}. "
                   f"Requiere cumplimiento de los requisitos del artículo 16.1.b 3º LAC. "
                   f"Proceda con el análisis de amenazas.",
            applicable_rules=applicable_rules
        )
    elif permission == "1":
        return LegalGateCheckResponse(
            passed=True,
            permission_code="1",
            conclusion=None,
            reason=f"El servicio '{service.name}' está permitido para entidades {entity_type}. "
                   f"Proceda con el cuestionario de evaluación de amenazas.",
            applicable_rules=applicable_rules
        )
    else:
        return LegalGateCheckResponse(
            passed=False,
            permission_code=None,
            conclusion="C7",
            reason=f"No se ha podido determinar el estado de permiso para el servicio '{service.name}'. "
                   f"Requiere análisis adicional.",
            applicable_rules=applicable_rules
        )
