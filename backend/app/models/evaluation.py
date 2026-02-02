from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from ..database import Base


class EntityType(str, enum.Enum):
    EIP = "EIP"
    NO_EIP = "NO_EIP"


class RelationType(str, enum.Enum):
    AUDITADA = "AUDITADA"
    CADENA = "CADENA"
    VINCULADA = "VINCULADA"


class ConclusionType(str, enum.Enum):
    C1 = "C1"  # Approved without safeguards
    C2 = "C2"  # Approved with safeguards
    C3 = "C3"  # Needs Ethics Partner approval
    C4 = "C4"  # Conditional approval
    C5 = "C5"  # Legally prohibited
    C6 = "C6"  # Unmitigable threat
    C7 = "C7"  # Needs more analysis


class SignificanceLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    reference_number = Column(String(50), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Entity information
    entity_name = Column(String(200))
    entity_type = Column(Enum(EntityType))
    relation_type = Column(Enum(RelationType))

    # Service
    service_id = Column(Integer, ForeignKey("services.id"))
    service = relationship("Service", back_populates="evaluations")

    # Legal gate result
    legal_gate_passed = Column(Integer)  # 1 = passed, 0 = blocked
    legal_gate_reason = Column(Text, nullable=True)

    # Conclusion
    conclusion = Column(Enum(ConclusionType), nullable=True)
    conclusion_notes = Column(Text, nullable=True)

    # Auditor info
    auditor_name = Column(String(200), nullable=True)

    # Relationships
    evaluation_threats = relationship("EvaluationThreat", back_populates="evaluation")
    evaluation_safeguards = relationship("EvaluationSafeguard", back_populates="evaluation")


class EvaluationThreat(Base):
    __tablename__ = "evaluation_threats"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("evaluations.id"))
    threat_id = Column(Integer, ForeignKey("threats.id"))
    significance = Column(Enum(SignificanceLevel))
    notes = Column(Text, nullable=True)

    evaluation = relationship("Evaluation", back_populates="evaluation_threats")


class EvaluationSafeguard(Base):
    __tablename__ = "evaluation_safeguards"

    id = Column(Integer, primary_key=True, index=True)
    evaluation_id = Column(Integer, ForeignKey("evaluations.id"))
    safeguard_id = Column(Integer, ForeignKey("safeguards.id"))
    applied = Column(Integer, default=1)
    notes = Column(Text, nullable=True)

    evaluation = relationship("Evaluation", back_populates="evaluation_safeguards")
