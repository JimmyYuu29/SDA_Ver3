"""
Evaluations API Router
"""
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from ..database import get_db
from ..models.evaluation import Evaluation, EvaluationThreat, EvaluationSafeguard, EntityType, RelationType, ConclusionType, SignificanceLevel
from ..models.service import Service
from ..models.threat import Threat, Safeguard
from ..services.conclusion import determine_conclusion
from ..services.document import generate_evaluation_document

router = APIRouter()


class EvaluationThreatCreate(BaseModel):
    threat_id: int
    significance: str  # LOW, MEDIUM, HIGH
    notes: Optional[str] = None


class EvaluationSafeguardCreate(BaseModel):
    safeguard_id: int
    notes: Optional[str] = None


class EvaluationCreate(BaseModel):
    entity_name: str
    entity_type: str  # EIP or NO_EIP
    relation_type: str = "AUDITADA"  # AUDITADA, CADENA, VINCULADA
    service_id: int
    threats: List[EvaluationThreatCreate] = []
    safeguards: List[EvaluationSafeguardCreate] = []
    auditor_name: Optional[str] = None
    notes: Optional[str] = None


class EvaluationThreatResponse(BaseModel):
    id: int
    threat_id: int
    significance: str
    notes: Optional[str]

    class Config:
        from_attributes = True


class EvaluationSafeguardResponse(BaseModel):
    id: int
    safeguard_id: int
    applied: int
    notes: Optional[str]

    class Config:
        from_attributes = True


class EvaluationResponse(BaseModel):
    id: int
    reference_number: str
    created_at: datetime
    entity_name: str
    entity_type: str
    relation_type: str
    service_id: int
    legal_gate_passed: Optional[int]
    legal_gate_reason: Optional[str]
    conclusion: Optional[str]
    conclusion_notes: Optional[str]
    auditor_name: Optional[str]

    class Config:
        from_attributes = True


class EvaluationDetailResponse(EvaluationResponse):
    evaluation_threats: List[EvaluationThreatResponse]
    evaluation_safeguards: List[EvaluationSafeguardResponse]


def generate_reference_number() -> str:
    """Generate a unique reference number for the evaluation"""
    timestamp = datetime.now().strftime("%Y%m%d")
    unique_id = str(uuid.uuid4())[:8].upper()
    return f"SDA-{timestamp}-{unique_id}"


@router.post("/", response_model=EvaluationResponse)
def create_evaluation(
    evaluation_data: EvaluationCreate,
    db: Session = Depends(get_db)
):
    """Create a new SDA evaluation"""
    # Validate service exists
    service = db.query(Service).filter(Service.id == evaluation_data.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Validate entity_type
    try:
        entity_type = EntityType(evaluation_data.entity_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid entity_type")

    # Validate relation_type
    try:
        relation_type = RelationType(evaluation_data.relation_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid relation_type")

    # Check legal gate
    field_map = {
        ("EIP", "AUDITADA"): service.eip_auditada,
        ("EIP", "CADENA"): service.eip_cadena,
        ("EIP", "VINCULADA"): service.eip_vinculada,
        ("NO_EIP", "AUDITADA"): service.no_eip_auditada,
        ("NO_EIP", "CADENA"): service.no_eip_cadena,
        ("NO_EIP", "VINCULADA"): service.no_eip_vinculada,
    }

    permission = field_map.get((evaluation_data.entity_type, evaluation_data.relation_type))

    legal_gate_passed = permission != "NO"
    legal_gate_reason = ""

    if permission == "NO":
        legal_gate_reason = "Servicio legalmente prohibido"
        conclusion = ConclusionType.C5
    else:
        # Determine conclusion based on threats and safeguards
        conclusion = determine_conclusion(
            evaluation_data.threats,
            evaluation_data.safeguards,
            permission
        )
        if permission == "2":
            legal_gate_reason = "Servicio permitido con condiciones (art. 16.1.b 3º LAC)"
        else:
            legal_gate_reason = "Servicio permitido"

    # Create evaluation
    evaluation = Evaluation(
        reference_number=generate_reference_number(),
        entity_name=evaluation_data.entity_name,
        entity_type=entity_type,
        relation_type=relation_type,
        service_id=evaluation_data.service_id,
        legal_gate_passed=1 if legal_gate_passed else 0,
        legal_gate_reason=legal_gate_reason,
        conclusion=conclusion,
        conclusion_notes=evaluation_data.notes,
        auditor_name=evaluation_data.auditor_name
    )
    db.add(evaluation)
    db.flush()

    # Add threats
    for threat_data in evaluation_data.threats:
        try:
            significance = SignificanceLevel(threat_data.significance)
        except ValueError:
            significance = SignificanceLevel.MEDIUM

        eval_threat = EvaluationThreat(
            evaluation_id=evaluation.id,
            threat_id=threat_data.threat_id,
            significance=significance,
            notes=threat_data.notes
        )
        db.add(eval_threat)

    # Add safeguards
    for safeguard_data in evaluation_data.safeguards:
        eval_safeguard = EvaluationSafeguard(
            evaluation_id=evaluation.id,
            safeguard_id=safeguard_data.safeguard_id,
            applied=1,
            notes=safeguard_data.notes
        )
        db.add(eval_safeguard)

    db.commit()
    db.refresh(evaluation)

    return evaluation


@router.get("/", response_model=List[EvaluationResponse])
def get_evaluations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all evaluations"""
    evaluations = db.query(Evaluation).offset(skip).limit(limit).all()
    return evaluations


@router.get("/{evaluation_id}", response_model=EvaluationDetailResponse)
def get_evaluation(evaluation_id: int, db: Session = Depends(get_db)):
    """Get a specific evaluation with all details"""
    evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return evaluation


@router.get("/{evaluation_id}/export")
def export_evaluation(evaluation_id: int, db: Session = Depends(get_db)):
    """Export evaluation as Word document"""
    evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    # Get related data
    service = db.query(Service).filter(Service.id == evaluation.service_id).first()
    threats_data = []
    for et in evaluation.evaluation_threats:
        threat = db.query(Threat).filter(Threat.id == et.threat_id).first()
        if threat:
            threats_data.append({
                'name': threat.name_es or threat.name,
                'significance': et.significance.value if et.significance else 'MEDIUM',
                'notes': et.notes
            })

    safeguards_data = []
    for es in evaluation.evaluation_safeguards:
        safeguard = db.query(Safeguard).filter(Safeguard.id == es.safeguard_id).first()
        if safeguard:
            safeguards_data.append({
                'description': safeguard.description_es or safeguard.description,
                'notes': es.notes
            })

    # Generate document
    doc_path = generate_evaluation_document(
        evaluation=evaluation,
        service=service,
        threats=threats_data,
        safeguards=safeguards_data
    )

    return FileResponse(
        path=doc_path,
        filename=f"SDA_Evaluation_{evaluation.reference_number}.docx",
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


@router.delete("/{evaluation_id}")
def delete_evaluation(evaluation_id: int, db: Session = Depends(get_db)):
    """Delete an evaluation"""
    evaluation = db.query(Evaluation).filter(Evaluation.id == evaluation_id).first()
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found")

    # Delete related records
    db.query(EvaluationThreat).filter(EvaluationThreat.evaluation_id == evaluation_id).delete()
    db.query(EvaluationSafeguard).filter(EvaluationSafeguard.evaluation_id == evaluation_id).delete()
    db.delete(evaluation)
    db.commit()

    return {"message": "Evaluation deleted successfully"}
