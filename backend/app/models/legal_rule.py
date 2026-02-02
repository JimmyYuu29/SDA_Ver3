from sqlalchemy import Column, Integer, String, Text, Boolean
from ..database import Base


class LegalRule(Base):
    __tablename__ = "legal_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_type = Column(String(50))  # LAC16, EIP_PROHIBITION, SAFEGUARD
    article = Column(String(50))
    description = Column(Text)
    applies_to_eip = Column(Boolean, default=False)
    applies_to_no_eip = Column(Boolean, default=False)
    safeguard_text = Column(Text, nullable=True)
