"""
Data extraction script for SDA Evaluation App.
Reads Excel files and extracts structured data for database seeding.
"""
import pandas as pd
import json
from pathlib import Path
from typing import Dict, List, Any

DATA_DIR = Path(__file__).parent.parent.parent / "data"


def extract_services() -> List[Dict[str, Any]]:
    """Extract services from Codigo de servicio.xlsx"""
    file_path = DATA_DIR / "Codigo de servicio.xlsx"
    df = pd.read_excel(file_path, sheet_name='4_Codigos servicios Mazars', header=None, skiprows=5)

    df.columns = ['Tipo', 'Descripcion', 'Codigo', 'Descripcion_Servicio',
                  'NO_EIP_Auditada', 'NO_EIP_Cadena', 'NO_EIP_Vinculada',
                  'EIP_Auditada', 'EIP_Cadena', 'EIP_Vinculada']

    services = []
    categories = {}
    current_parent = None

    parent_markers = [
        'SERVICIOS MAZARS AUDITORES',
        'SERVICIOS MAZARS ASESORES Y ABOGADOS',
        'SERVICIOS MAZARS FINANCIAL ADVISORY',
        'SERVICIOS MAZARS SERVICIOS PROFESIONALES'
    ]

    for _, row in df.iterrows():
        tipo = str(row['Tipo']).strip() if pd.notna(row['Tipo']) else ''
        codigo = str(row['Codigo']).strip() if pd.notna(row['Codigo']) else ''
        descripcion = str(row['Descripcion_Servicio']).strip() if pd.notna(row['Descripcion_Servicio']) else ''

        # Check if this is a parent category marker
        if tipo in parent_markers:
            current_parent = tipo
            continue

        # Skip header rows
        if tipo == 'Tipo de trabajo' or codigo == 'Servicio':
            continue

        # If we have a category code (like 01. AUD, 02. ECO, etc.)
        if tipo and not codigo and not descripcion:
            continue

        # If we have a valid service
        if codigo and descripcion and codigo != 'nan':
            # Determine the category
            cat_code = tipo if tipo and tipo != 'nan' else 'OTHER'

            if cat_code not in categories:
                categories[cat_code] = {
                    'code': cat_code,
                    'name': tipo,
                    'parent_category': current_parent or 'UNKNOWN'
                }

            # Clean permission values
            def clean_permission(val):
                if pd.isna(val):
                    return None
                val_str = str(val).strip().upper()
                if val_str in ['1', '1.0']:
                    return '1'
                elif val_str in ['2', '2.0']:
                    return '2'
                elif val_str in ['NO', 'N']:
                    return 'NO'
                return None

            service = {
                'code': codigo,
                'name': descripcion,
                'category_code': cat_code,
                'no_eip_auditada': clean_permission(row['NO_EIP_Auditada']),
                'no_eip_cadena': clean_permission(row['NO_EIP_Cadena']),
                'no_eip_vinculada': clean_permission(row['NO_EIP_Vinculada']),
                'eip_auditada': clean_permission(row['EIP_Auditada']),
                'eip_cadena': clean_permission(row['EIP_Cadena']),
                'eip_vinculada': clean_permission(row['EIP_Vinculada']),
            }
            services.append(service)

    return {
        'categories': list(categories.values()),
        'services': services
    }


def extract_threats_and_safeguards() -> Dict[str, Any]:
    """Extract threats and safeguards from Amenanzas.xlsx"""
    file_path = DATA_DIR / "Amenanzas.xlsx"

    # Define the 6 threat types
    threat_types = [
        {'code': 'ADVOCACY', 'name': 'Advocacy', 'name_es': 'Abogacía'},
        {'code': 'SELF_REVIEW', 'name': 'Self-review', 'name_es': 'Autorrevisión'},
        {'code': 'FAMILIARITY', 'name': 'Familiarity', 'name_es': 'Familiaridad'},
        {'code': 'SELF_INTEREST', 'name': 'Self-interest', 'name_es': 'Interés propio'},
        {'code': 'INTIMIDATION', 'name': 'Intimidation', 'name_es': 'Intimidación'},
        {'code': 'MANAGEMENT', 'name': 'Management participation', 'name_es': 'Participación en la dirección'},
    ]

    # Define safeguard levels
    safeguard_levels = [
        {'code': 'FIRM', 'name': 'Firm level', 'name_es': 'Nivel de firma'},
        {'code': 'SITUATION', 'name': 'Situation level', 'name_es': 'Nivel de situación'},
        {'code': 'ENTITY', 'name': 'Entity level', 'name_es': 'Nivel de entidad auditada'},
    ]

    # Read examples sheet
    df = pd.read_excel(file_path, sheet_name='6_Ejemplos Amz y Salv', skiprows=0)

    # Map Spanish threat names to codes
    threat_name_map = {
        'Abogacía': 'ADVOCACY',
        'Autorrevisión': 'SELF_REVIEW',
        'Familiaridad': 'FAMILIARITY',
        'Interés propio': 'SELF_INTEREST',
        'Intimidación': 'INTIMIDATION',
        'Participación en la toma de decisiones de la Dirección': 'MANAGEMENT',
    }

    safeguards = []
    safeguard_id = 1

    for _, row in df.iterrows():
        threat_name = str(row.iloc[0]).strip() if pd.notna(row.iloc[0]) else ''

        if threat_name in threat_name_map:
            threat_code = threat_name_map[threat_name]

            # Firm level safeguard (column 2)
            if pd.notna(row.iloc[2]) and str(row.iloc[2]).strip():
                safeguards.append({
                    'id': safeguard_id,
                    'threat_code': threat_code,
                    'level_code': 'FIRM',
                    'description_es': str(row.iloc[2]).strip()
                })
                safeguard_id += 1

            # Situation level safeguard (column 3)
            if pd.notna(row.iloc[3]) and str(row.iloc[3]).strip():
                safeguards.append({
                    'id': safeguard_id,
                    'threat_code': threat_code,
                    'level_code': 'SITUATION',
                    'description_es': str(row.iloc[3]).strip()
                })
                safeguard_id += 1

            # Entity level safeguard (column 4)
            if pd.notna(row.iloc[4]) and str(row.iloc[4]).strip():
                safeguards.append({
                    'id': safeguard_id,
                    'threat_code': threat_code,
                    'level_code': 'ENTITY',
                    'description_es': str(row.iloc[4]).strip()
                })
                safeguard_id += 1

    return {
        'threats': threat_types,
        'safeguard_levels': safeguard_levels,
        'safeguards': safeguards
    }


def extract_legal_rules() -> List[Dict[str, Any]]:
    """Extract legal rules from Gate_legal.xlsx"""
    file_path = DATA_DIR / "Gate legal.xlsx"
    rules = []

    # Sheet 1: LAC 16 Incompatibilities (NO EIP)
    try:
        df_lac16 = pd.read_excel(file_path, sheet_name='1_Incompatibilidades (LAC 16)')
        for _, row in df_lac16.iterrows():
            if pd.notna(row.iloc[0]):
                rules.append({
                    'rule_type': 'LAC16',
                    'article': str(row.iloc[0]) if pd.notna(row.iloc[0]) else '',
                    'description': str(row.iloc[1]) if len(row) > 1 and pd.notna(row.iloc[1]) else '',
                    'applies_to_eip': False,
                    'applies_to_no_eip': True,
                })
    except Exception as e:
        print(f"Warning: Could not read LAC16 sheet: {e}")

    # Sheet 2: EIP Prohibitions
    try:
        df_eip = pd.read_excel(file_path, sheet_name='2_Prohibiciones-EIP')
        for _, row in df_eip.iterrows():
            if pd.notna(row.iloc[0]):
                rules.append({
                    'rule_type': 'EIP_PROHIBITION',
                    'article': str(row.iloc[0]) if pd.notna(row.iloc[0]) else '',
                    'description': str(row.iloc[1]) if len(row) > 1 and pd.notna(row.iloc[1]) else '',
                    'applies_to_eip': True,
                    'applies_to_no_eip': False,
                })
    except Exception as e:
        print(f"Warning: Could not read EIP prohibitions sheet: {e}")

    # Sheet 3: Legislative Safeguards
    try:
        df_safeguards = pd.read_excel(file_path, sheet_name='3_salvaguardas legisl')
        for _, row in df_safeguards.iterrows():
            if pd.notna(row.iloc[0]):
                rules.append({
                    'rule_type': 'SAFEGUARD',
                    'article': str(row.iloc[0]) if pd.notna(row.iloc[0]) else '',
                    'description': str(row.iloc[1]) if len(row) > 1 and pd.notna(row.iloc[1]) else '',
                    'applies_to_eip': True,
                    'applies_to_no_eip': True,
                    'safeguard_text': str(row.iloc[2]) if len(row) > 2 and pd.notna(row.iloc[2]) else None,
                })
    except Exception as e:
        print(f"Warning: Could not read safeguards sheet: {e}")

    return rules


def main():
    """Main extraction function - outputs JSON for verification"""
    print("Extracting services...")
    services_data = extract_services()
    print(f"  Found {len(services_data['categories'])} categories")
    print(f"  Found {len(services_data['services'])} services")

    print("\nExtracting threats and safeguards...")
    threats_data = extract_threats_and_safeguards()
    print(f"  Found {len(threats_data['threats'])} threat types")
    print(f"  Found {len(threats_data['safeguard_levels'])} safeguard levels")
    print(f"  Found {len(threats_data['safeguards'])} safeguards")

    print("\nExtracting legal rules...")
    legal_rules = extract_legal_rules()
    print(f"  Found {len(legal_rules)} legal rules")

    # Save to JSON for verification
    output = {
        'services': services_data,
        'threats': threats_data,
        'legal_rules': legal_rules
    }

    output_path = Path(__file__).parent / "extracted_data.json"
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\nData saved to {output_path}")
    return output


if __name__ == "__main__":
    main()
