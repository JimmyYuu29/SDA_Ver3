from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base


class Threat(Base):
    __tablename__ = "threats"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(200))
    name_es = Column(String(200))  # Spanish name
    description = Column(Text)

    safeguards = relationship("Safeguard", back_populates="threat")
    service_threats = relationship("ServiceThreat", back_populates="threat")


class SafeguardLevel(Base):
    """Levels: firm, situation, entity"""
    __tablename__ = "safeguard_levels"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True)
    name = Column(String(100))
    name_es = Column(String(100))

    safeguards = relationship("Safeguard", back_populates="level")


class Safeguard(Base):
    __tablename__ = "safeguards"

    id = Column(Integer, primary_key=True, index=True)
    threat_id = Column(Integer, ForeignKey("threats.id"))
    level_id = Column(Integer, ForeignKey("safeguard_levels.id"))
    description = Column(Text)
    description_es = Column(Text)

    threat = relationship("Threat", back_populates="safeguards")
    level = relationship("SafeguardLevel", back_populates="safeguards")


class ServiceThreat(Base):
    """Mapping between services and applicable threats"""
    __tablename__ = "service_threats"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"))
    threat_id = Column(Integer, ForeignKey("threats.id"))

    service = relationship("Service", back_populates="service_threats")
    threat = relationship("Threat", back_populates="service_threats")
