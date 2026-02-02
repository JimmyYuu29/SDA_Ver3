"""
Business logic for determining evaluation conclusions.

Conclusion Types:
- C1: Approved without safeguards (no significant threats)
- C2: Approved with safeguards (threats mitigated)
- C3: Needs Ethics Partner approval
- C4: Conditional approval
- C5: Legally prohibited
- C6: Unmitigable threat (cannot proceed)
- C7: Needs more analysis
"""
from typing import List
from ..models.evaluation import ConclusionType


def determine_conclusion(
    threats: List,
    safeguards: List,
    permission_code: str
) -> ConclusionType:
    """
    Determine the conclusion based on threats, safeguards, and permission code.

    Business rules:
    1. If permission_code is "NO" -> C5 (legally prohibited)
    2. If no threats identified -> C1 (approved without safeguards)
    3. If threats with HIGH significance and no safeguards -> C6 (unmitigable)
    4. If threats with HIGH significance -> C3 (needs Ethics Partner)
    5. If threats with safeguards -> C2 (approved with safeguards)
    6. If permission_code is "2" (conditional) -> C4 (conditional approval)
    7. Otherwise -> C7 (needs more analysis)
    """
    # Rule 1: Legally prohibited
    if permission_code == "NO":
        return ConclusionType.C5

    # Rule 2: No threats identified
    if not threats:
        if permission_code == "2":
            return ConclusionType.C4  # Conditional due to permission type
        return ConclusionType.C1  # Approved without safeguards

    # Analyze threat significance
    high_threats = [t for t in threats if t.significance == "HIGH"]
    medium_threats = [t for t in threats if t.significance == "MEDIUM"]

    # Rule 3: High threats without safeguards
    if high_threats and not safeguards:
        return ConclusionType.C6  # Unmitigable

    # Rule 4: High threats with safeguards need Ethics Partner
    if high_threats and safeguards:
        return ConclusionType.C3  # Needs Ethics Partner approval

    # Rule 5: Medium/Low threats with safeguards
    if threats and safeguards:
        if permission_code == "2":
            return ConclusionType.C4  # Conditional due to permission type
        return ConclusionType.C2  # Approved with safeguards

    # Rule 6: Conditional permission
    if permission_code == "2":
        return ConclusionType.C4

    # Rule 7: Default - needs more analysis
    return ConclusionType.C7


def get_conclusion_description(conclusion: ConclusionType) -> dict:
    """Get the description and color for a conclusion type"""
    descriptions = {
        ConclusionType.C1: {
            "title": "Aprobado sin salvaguardas",
            "description": "El servicio puede prestarse sin necesidad de medidas de salvaguarda adicionales.",
            "color": "green",
            "icon": "check-circle"
        },
        ConclusionType.C2: {
            "title": "Aprobado con salvaguardas",
            "description": "El servicio puede prestarse implementando las medidas de salvaguarda seleccionadas.",
            "color": "blue",
            "icon": "shield-check"
        },
        ConclusionType.C3: {
            "title": "Requiere aprobación del Socio de Ética",
            "description": "Debido a la significatividad de las amenazas identificadas, se requiere la aprobación del Socio de Ética antes de proceder.",
            "color": "yellow",
            "icon": "user-check"
        },
        ConclusionType.C4: {
            "title": "Aprobación condicional",
            "description": "El servicio está sujeto a condiciones específicas del artículo 16.1.b 3º LAC.",
            "color": "orange",
            "icon": "alert-triangle"
        },
        ConclusionType.C5: {
            "title": "Prohibido legalmente",
            "description": "El servicio no puede prestarse por estar expresamente prohibido por la normativa aplicable (LAC/RUE).",
            "color": "red",
            "icon": "x-circle"
        },
        ConclusionType.C6: {
            "title": "Amenaza no mitigable",
            "description": "Las amenazas identificadas no pueden ser mitigadas adecuadamente. No se puede prestar el servicio.",
            "color": "red",
            "icon": "alert-octagon"
        },
        ConclusionType.C7: {
            "title": "Requiere análisis adicional",
            "description": "Se necesita un análisis más detallado para determinar si el servicio puede prestarse.",
            "color": "gray",
            "icon": "help-circle"
        }
    }
    return descriptions.get(conclusion, descriptions[ConclusionType.C7])
