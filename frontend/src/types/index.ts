export type EntityType = 'EIP' | 'NO_EIP';
export type RelationType = 'AUDITADA' | 'CADENA' | 'VINCULADA';
export type SignificanceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type ConclusionType = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7';

export interface Category {
  id: number;
  code: string;
  name: string;
  parent_category: string | null;
}

export interface Service {
  id: number;
  code: string;
  name: string;
  category_id: number | null;
  category?: Category;
  no_eip_auditada: string | null;
  no_eip_cadena: string | null;
  no_eip_vinculada: string | null;
  eip_auditada: string | null;
  eip_cadena: string | null;
  eip_vinculada: string | null;
}

export interface Threat {
  id: number;
  code: string;
  name: string;
  name_es: string;
  description: string | null;
}

export interface SafeguardLevel {
  id: number;
  code: string;
  name: string;
  name_es: string;
}

export interface Safeguard {
  id: number;
  threat_id: number;
  level_id: number;
  description: string | null;
  description_es: string | null;
  level?: SafeguardLevel;
}

export interface ThreatWithSafeguards extends Threat {
  safeguards: Safeguard[];
}

export interface LegalRule {
  id: number;
  rule_type: string;
  article: string | null;
  description: string | null;
  applies_to_eip: boolean;
  applies_to_no_eip: boolean;
  safeguard_text: string | null;
}

export interface LegalGateCheck {
  passed: boolean;
  permission_code: string | null;
  conclusion: ConclusionType | null;
  reason: string;
  applicable_rules: LegalRule[];
}

export interface EvaluationThreat {
  threat_id: number;
  significance: SignificanceLevel;
  notes?: string;
}

export interface EvaluationSafeguard {
  safeguard_id: number;
  notes?: string;
}

export interface EvaluationCreate {
  entity_name: string;
  entity_type: EntityType;
  relation_type: RelationType;
  service_id: number;
  threats: EvaluationThreat[];
  safeguards: EvaluationSafeguard[];
  auditor_name?: string;
  notes?: string;
}

export interface Evaluation {
  id: number;
  reference_number: string;
  created_at: string;
  entity_name: string;
  entity_type: EntityType;
  relation_type: RelationType;
  service_id: number;
  legal_gate_passed: number;
  legal_gate_reason: string | null;
  conclusion: ConclusionType | null;
  conclusion_notes: string | null;
  auditor_name: string | null;
}

export interface WizardState {
  step: number;
  entityName: string;
  entityType: EntityType;
  relationType: RelationType;
  selectedService: Service | null;
  legalGateResult: LegalGateCheck | null;
  selectedThreats: Map<number, { threat: Threat; significance: SignificanceLevel; notes?: string }>;
  selectedSafeguards: Map<number, { safeguard: Safeguard; notes?: string }>;
  conclusion: ConclusionType | null;
  auditorName: string;
  notes: string;
}

export interface ConclusionInfo {
  title: string;
  description: string;
  color: string;
  icon: string;
}

export const CONCLUSION_INFO: Record<ConclusionType, ConclusionInfo> = {
  C1: {
    title: 'Aprobado sin salvaguardas',
    description: 'El servicio puede prestarse sin necesidad de medidas de salvaguarda adicionales.',
    color: 'green',
    icon: 'check-circle',
  },
  C2: {
    title: 'Aprobado con salvaguardas',
    description: 'El servicio puede prestarse implementando las medidas de salvaguarda seleccionadas.',
    color: 'blue',
    icon: 'shield-check',
  },
  C3: {
    title: 'Requiere aprobación del Socio de Ética',
    description: 'Debido a la significatividad de las amenazas identificadas, se requiere la aprobación del Socio de Ética antes de proceder.',
    color: 'yellow',
    icon: 'user-check',
  },
  C4: {
    title: 'Aprobación condicional',
    description: 'El servicio está sujeto a condiciones específicas del artículo 16.1.b 3º LAC.',
    color: 'orange',
    icon: 'alert-triangle',
  },
  C5: {
    title: 'Prohibido legalmente',
    description: 'El servicio no puede prestarse por estar expresamente prohibido por la normativa aplicable (LAC/RUE).',
    color: 'red',
    icon: 'x-circle',
  },
  C6: {
    title: 'Amenaza no mitigable',
    description: 'Las amenazas identificadas no pueden ser mitigadas adecuadamente. No se puede prestar el servicio.',
    color: 'red',
    icon: 'alert-octagon',
  },
  C7: {
    title: 'Requiere análisis adicional',
    description: 'Se necesita un análisis más detallado para determinar si el servicio puede prestarse.',
    color: 'gray',
    icon: 'help-circle',
  },
};
