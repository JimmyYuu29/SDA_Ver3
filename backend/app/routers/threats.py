"""
Threats and Safeguards API Router
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import get_db
from ..models.threat import Threat, Safeguard, SafeguardLevel

router = APIRouter()


class SafeguardLevelResponse(BaseModel):
    id: int
    code: str
    name: str
    name_es: str

    class Config:
        from_attributes = True


class SafeguardResponse(BaseModel):
    id: int
    threat_id: int
    level_id: int
    description: Optional[str]
    description_es: Optional[str]
    level: Optional[SafeguardLevelResponse]

    class Config:
        from_attributes = True


class ThreatResponse(BaseModel):
    id: int
    code: str
    name: str
    name_es: str
    description: Optional[str]

    class Config:
        from_attributes = True


class ThreatWithSafeguardsResponse(ThreatResponse):
    safeguards: List[SafeguardResponse]


@router.get("/", response_model=List[ThreatResponse])
def get_threats(db: Session = Depends(get_db)):
    """Get all threat types"""
    threats = db.query(Threat).all()
    return threats


@router.get("/safeguard-levels", response_model=List[SafeguardLevelResponse])
def get_safeguard_levels(db: Session = Depends(get_db)):
    """Get all safeguard levels"""
    levels = db.query(SafeguardLevel).all()
    return levels


@router.get("/{threat_id}", response_model=ThreatWithSafeguardsResponse)
def get_threat(threat_id: int, db: Session = Depends(get_db)):
    """Get a specific threat with its safeguards"""
    threat = db.query(Threat).filter(Threat.id == threat_id).first()
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    return threat


@router.get("/{threat_id}/safeguards", response_model=List[SafeguardResponse])
def get_threat_safeguards(
    threat_id: int,
    level_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get safeguards for a specific threat, optionally filtered by level"""
    # Verify threat exists
    threat = db.query(Threat).filter(Threat.id == threat_id).first()
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")

    query = db.query(Safeguard).filter(Safeguard.threat_id == threat_id)

    if level_id:
        query = query.filter(Safeguard.level_id == level_id)

    safeguards = query.all()
    return safeguards


@router.get("/safeguards/all", response_model=List[SafeguardResponse])
def get_all_safeguards(
    level_code: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all safeguards, optionally filtered by level code"""
    query = db.query(Safeguard)

    if level_code:
        level = db.query(SafeguardLevel).filter(SafeguardLevel.code == level_code).first()
        if level:
            query = query.filter(Safeguard.level_id == level.id)

    safeguards = query.all()
    return safeguards
