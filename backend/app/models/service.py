from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from ..database import Base


class PermissionType(str, enum.Enum):
    ALLOWED = "1"  # Requires questionnaire
    LIMITED = "2"  # Limited with conditions
    PROHIBITED = "NO"  # Prohibited


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(200))
    parent_category = Column(String(100))  # MAZARS AUDITORES, ASESORES, FINANCIAL ADVISORY, etc.

    services = relationship("Service", back_populates="category")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(500))
    category_id = Column(Integer, ForeignKey("categories.id"))

    # Permissions for NO EIP entities
    no_eip_auditada = Column(String(10))
    no_eip_cadena = Column(String(10))
    no_eip_vinculada = Column(String(10))

    # Permissions for EIP entities
    eip_auditada = Column(String(10))
    eip_cadena = Column(String(10))
    eip_vinculada = Column(String(10))

    category = relationship("Category", back_populates="services")
    service_threats = relationship("ServiceThreat", back_populates="service")
    evaluations = relationship("Evaluation", back_populates="service")
