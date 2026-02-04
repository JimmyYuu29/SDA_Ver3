/**
 * Service catalog extracted from "Codigo de servicio.xlsx"
 *
 * Structure: 4 major categories → subcategories (tipo de trabajo) → individual services
 *
 * Each service has restriction codes for 6 scenarios:
 *   NO EIP:  entidadAuditada / cadenaControl / vinculadaSignificativa
 *   EIP:     entidadAuditada / cadenaControl / vinculadaSignificativa
 *
 * Restriction values:
 *   "NO"  → Servicio prohibido
 *   "1"   → Requiere cuestionario, con análisis de amenazas y salvaguardas
 *   "2"   → Servicio limitado a lo marcado; requiere cuestionario, con análisis de amenazas y salvaguardas
 *          (lo marcado = red text in description = limitaciones field)
 */

export const RESTRICTION_LABELS = {
  'NO': 'Servicio prohibido',
  '1': 'Requiere cuestionario, con análisis de amenazas y salvaguardas',
  '2': 'Servicio limitado a lo marcado; requiere cuestionario, con análisis de amenazas y salvaguardas',
}

export const CATEGORIES = [
  {
    id: 'auditores',
    name: 'SERVICIOS MAZARS AUDITORES',
  },
  {
    id: 'asesores',
    name: 'SERVICIOS MAZARS ASESORES Y ABOGADOS',
  },
  {
    id: 'financial',
    name: 'SERVICIOS MAZARS FINANCIAL ADVISORY',
  },
  {
    id: 'profesionales',
    name: 'SERVICIOS MAZARS SERVICIOS PROFESIONALES',
  },
]

// s(code, desc, limitaciones, noEip_ea, noEip_cc, noEip_vs, eip_ea, eip_cc, eip_vs)
function s(code, description, limitaciones, ne_ea, ne_cc, ne_vs, e_ea, e_cc, e_vs) {
  return {
    code,
    description,
    limitaciones: limitaciones || null,
    restrictions: {
      noEip: { entidadAuditada: ne_ea, cadenaControl: ne_cc, vinculadaSignificativa: ne_vs },
      eip:   { entidadAuditada: e_ea,  cadenaControl: e_cc,  vinculadaSignificativa: e_vs },
    },
  }
}

export const SERVICE_CATALOG = {
  // ═══════════════════════════════════════════════
  // SERVICIOS MAZARS AUDITORES
  // ═══════════════════════════════════════════════
  auditores: [
    {
      tipo: '00. SUST',
      descripcion: 'Sostenibilidad',
      services: [
        s('SUS_ASSU', 'Sustainability reporting and Assurance', null, '1','1','1','1','1','1'),
        s('SUS_STRA', 'Estrategy & Due Diligence', null, '1','1','1','1','1','1'),
        s('SUS_TRA', 'Implementation and Transformation', null, 'NO','NO','NO','NO','NO','NO'),
      ],
    },
    {
      tipo: '01. AUD',
      descripcion: 'Auditoria Financiera',
      services: [
        s('AUD_IFH', 'Auditoria Información Financiera Histórica NO LAC', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: '02. ECO',
      descripcion: 'Ecoembes',
      services: [
        s('ECO_ECOEM', 'Ecoembes', null, '1','1','1','1','1','1'),
        s('ECO_ECOTIC', 'Ecotic', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: '03. GRC',
      descripcion: 'Gestión de Riesgos y Control Interno',
      services: [
        s('GRC_ASDEAI', 'Asesoría en el Desarrollo de Auditoria Interna', null, 'NO','NO','1','NO','NO','1'),
        s('GRC_CGSR', 'Corporate Gobernance & Social Responsibility', '( con requisitos  16.1.b 3º )', '2','2','1','NO','NO','1'),
        s('GRC_ICM', 'Internal Control Management', '( con requisitos  16.1.b 3º)', '2','2','1','NO','NO','1'),
        s('GRC_OPRM', 'Operational Risk Management', '( con requisitos  16.1.b 3º)', '2','2','1','NO','NO','1'),
        s('GRC_SAI', 'Servicios Auditoria Interna', '( con requisitos  16.1.b 3º)', '2','2','1','NO','NO','1'),
        s('GRC_SOX', 'SOX', '( con requisitos  16.1.b 3º)', '2','2','1','NO','NO','1'),
      ],
    },
    {
      tipo: '04. CONS',
      descripcion: 'Consulting',
      services: [
        s('AUD_CONSUL', 'Consulting', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: '04. IES',
      descripcion: 'Informes especiales',
      services: [
        s('IES_CAPCRE', 'Capitalización de Créditos', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: '05. SUB',
      descripcion: 'Subvenciones',
      services: [
        s('SUB', 'Subvenciones', null, '1','1','1','NO','NO','1'),
        s('SUB_RSUB', 'Revisión de Subvenciones', null, '1','1','1','1','1','1'),
        s('SUB_RSUB LAC', 'Revisión de Subvenciones (bajo independencia LAC)', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: '06. COM',
      descripcion: 'Compliance',
      services: [
        s('COM_LOPD', 'Revisión LOPD', null, '1','1','1','1','1','1'),
        s('COM_RPE', 'Responsabilidad Penal de Empresas', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: '07. IT',
      descripcion: 'IT',
      services: [
        s('IT_AUDIT', 'IT Audit', '( con requisitos  16.1.b 5º)', '2','2','1','NO','NO','1'),
        s('IT_RI&SEC', 'IT Risk & Security', '( con requisitos  16.1.b 5º)', '2','2','1','NO','NO','1'),
      ],
    },
    {
      tipo: '08. OTROS',
      descripcion: 'Otros Servicios',
      services: [
        s('OTA_AIFH', 'Auditoria Información Financiera Histórica - Colaboración', null, '1','1','1','1','1','1'),
        s('OTA_CHC', 'Certificación de Hechos Concretos', null, '1','1','1','1','1','1'),
        s('OTA_CTAC', 'Consultas Técnicas Sobre Aspectos Contables', null, '1','1','1','1','1','1'),
        s('OTA_ICREQ', 'Informes Complementarios a los de Auditoria de Cuentas Requeridos por Supervisores', null, '1','1','1','1','1','1'),
        s('OTA_OTEI', 'Otros Trabajos Como Experto Independiente', null, '1','1','1','1','1','1'),
        s('OTA_PAIF', 'Procedimientos Acordados Sobre Información Financiera', null, '1','1','1','1','1','1'),
        s('OTA_PAINF', 'Procedimientos Acordados Sobre Información NO Financiera', null, '1','1','1','1','1','1'),
        s('OTA_RLIFH', 'Revisión Limitada Información Financiera Histórica', null, '1','1','1','1','1','1'),
        s('OTA_TADIFH', 'Trabajos de Aseguramiento Distintos a los de Información Financiera Histórica', null, '1','1','1','1','1','1'),
        s('OTA_TEIRL', 'Trabajos Como Expertos Independientes Requeridos Por Ley', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: '10. FORM',
      descripcion: 'Formación',
      services: [
        s('FORMACIÓN', 'FORMACIÓN', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: '11. ACT',
      descripcion: 'Servicios Actuariales',
      services: [
        s('ACT_ACT', 'Servicios Actuariales', '( con requisitos  16.1.b 2º y/o  5.3 RUE)', '2','2','1','2','2','1'),
      ],
    },
  ],

  // ═══════════════════════════════════════════════
  // SERVICIOS MAZARS ASESORES Y ABOGADOS
  // ═══════════════════════════════════════════════
  asesores: [
    {
      tipo: 'AF',
      descripcion: 'Asesoramiento fiscal',
      services: [
        s('AF_NO REC', 'Asesoramiento Fiscal No Recurrente', '( con requisitos  5.3 RUE)', '1','1','1','2','2','1'),
        s('AF_CTF', 'Consultas Técnicas Fiscales', '( con requisitos  5.3 RUE)', '1','1','1','2','2','1'),
        s('AF_RECUR', 'Asesoramiento Fiscal Recurrente', '( con requisitos  5.3 RUE)', '1','1','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'AL',
      descripcion: 'Asesoría Laboral',
      services: [
        s('ASE_L_DESD', 'Despido Disciplinario', null, 'NO','NO','1','NO','NO','1'),
        s('ASE_L_DESO', 'Despido Objetivo', null, 'NO','NO','1','NO','NO','1'),
        s('ASE_L_ERE', 'Expediente Regulación Empleo', null, 'NO','NO','1','NO','NO','1'),
        s('ASE_L_INST', 'Inspección de Trabajo', '(asesoría, no representación)( con requisitos  5.3 RUE)', '2','2','1','NO','NO','1'),
        s('ASE_L_MCT', 'Modificación Condiciones de Trabajo', '(asesoría, no representación)', '2','2','1','NO','NO','1'),
        s('ASE_L_NEGC', 'Negociación Colectiva', null, 'NO','NO','1','NO','NO','1'),
        s('ASE_L_OEXC', 'Otras Extinciones Contractuales', null, 'NO','NO','1','NO','NO','1'),
        s('ASE_L_PU', 'Asesoramiento Laboral Puntual', '(asesoría, no representación)', '1','1','1','NO','NO','1'),
        s('ASE_L_RE', 'Asesoramiento Laboral Recurrente', '(asesoría, no representación)', '1','1','1','NO','NO','1'),
        s('ASE_L_REL', 'Revisión Laboral', null, '1','1','1','NO','NO','1'),
        s('ASE_L_SS', 'Seguridad Social', null, '1','1','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'COC',
      descripcion: 'Concursal',
      services: [
        s('COC_REF', 'Refinanciación', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'CON',
      descripcion: 'Contractual',
      services: [
        s('CON_AGE', 'Agencia', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_CINT', 'Carta de Intenciones', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_COM AC', 'Compra Acciones/Participaciones', '(procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_COMACT', 'Compra Activos/Rama de Actividad', '(procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_CONFI', 'Confidencialidad', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_DIST', 'Distribución', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_FRAN', 'Franquicia', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_OTRCON', 'Otros Contratos', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_PREPAR', 'Préstamo Participativo', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_PRSE', 'Prestación Servicios', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('CON_SUM', 'Suministro', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'DD',
      descripcion: 'Due diligence',
      services: [
        s('DD_DDA', 'Due Diligence Administrativa', null, '1','1','1','1','1','1'),
        s('DD_DDF', 'Due Diligence Fiscal', null, '1','1','1','1','1','1'),
        s('DD_DDL', 'Due Diligence Laboral', null, '1','1','1','1','1','1'),
        s('DD_DDM', 'Due Diligence Mercantil', null, '1','1','1','1','1','1'),
        s('DD_DDMAFL', 'Due Diligence M+A+F+L', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: 'OTF',
      descripcion: 'Otros fiscal',
      services: [
        s('OTF_CDGT', 'Consultas Dirección General de Tributos', null, '1','1','1','1','1','1'),
        s('OTF_DRENT', 'Declaraciones de Renta', null, 'NO','NO','1','NO','NO','1'),
        s('OTF_INFEXP', 'Informes expatriados/impatriados', null, '1','1','1','NO','NO','1'),
        s('OTF_INFTEC', 'Informes técnicos', '( con requisitos  5.3 RUE)', '1','1','1','2','2','1'),
        s('OTF_OTDETR', 'Otras Declaraciones Tributarias', '( con requisitos  5.3 RUE)', '1','1','1','2','2','1'),
      ],
    },
    {
      tipo: 'PEC',
      descripcion: 'Procedimiento Económicos y Contenciosos',
      services: [
        s('PEC_CON_AD', 'Procedimientos Contencioso Administrativos', '( litigios no significativos)', '2','2','1','NO','NO','1'),
        s('PEC_ECO_AD', 'Procedimientos Económico Administrativos', '( litigios no significativos)', '2','2','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'PF',
      descripcion: 'Planificación Fiscal',
      services: [
        s('PF__OTPLFI', 'Otra Planificación Fiscal', null, 'NO','NO','1','NO','NO','1'),
        s('PF_OPREEST', 'Operaciones de restructuración', null, 'NO','NO','1','NO','NO','1'),
        s('PT_DOC', 'Documentación Precios de Transferencia', '(Revisión y procedimientos formales) ( con requisitos  5.3 RUE)', '2','2','1','2','2','1'),
      ],
    },
    {
      tipo: 'PRO',
      descripcion: 'Procesal',
      services: [
        s('Civil', 'Civil', '( litigios no significativos/procedimientos formales)', '2','2','1','NO','NO','1'),
        s('Mercantil', 'Mercantil', '( litigios no significativos/procedimientos formales)', '2','2','1','NO','NO','1'),
        s('Penal', 'Penal', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'PT',
      descripcion: 'Precios de Transferencia',
      services: [
        s('PT_ACT', 'Actualización Precios de Transferencia', '( con requisitos  5.3 RUE)', '1','1','1','2','2','1'),
      ],
    },
    {
      tipo: 'RF',
      descripcion: 'Revisión fiscal',
      services: [
        s('RF_OTREVFI', 'Otras Revisiones Fiscales', '( con requisitos  5.3 RUE)', '1','1','1','2','2','1'),
      ],
    },
    {
      tipo: 'SOC',
      descripcion: 'Societario',
      services: [
        s('COC_ADMCON', 'Administración Concursal', null, 'NO','NO','NO','NO','NO','NO'),
        s('COC_CONAC', 'Concurso Acreedores', null, 'NO','NO','NO','NO','NO','NO'),
        s('SOC_ASPUNT', 'Asesoramiento Mercantil Puntual', null, '1','1','1','NO','NO','1'),
        s('SOC_CTJ', 'Consultas Técnicas Jurídicas', '(revisión y procedimientos formales)', '1','1','1','2','2','1'),
        s('SOC_ASREC', 'Asesoramiento Mercantil Recurrente', null, '1','1','1','NO','NO','1'),
        s('SOC_COSOC', 'Constitución Sociedad', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('SOC_DI/LI', 'Disolución/Liquidación', null, 'NO','NO','1','NO','NO','1'),
        s('SOC_ESC', 'Escisión', '(procedimientos formales)', '2','2','1','NO','NO','1'),
        s('SOC_FUS', 'Fusión', '(procedimientos formales)', '2','2','1','NO','NO','1'),
        s('SOC_MODE', 'Modificación Estatutos', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('SOC_MOS', 'Modificación Órganos Societarios', '(revisión y procedimientos formales)', '2','2','1','NO','NO','1'),
        s('SOC_PSOC', 'Pacto de Socios', '( procedimientos formales)', '2','2','1','NO','NO','NO'),
        s('SOC_RECP', 'Recomposición Patrimonial', '( procedimientos formales)', '2','2','1','NO','NO','NO'),
        s('SOC_SECJ', 'Secretario Jurídico', null, 'NO','NO','NO','NO','NO','NO'),
        s('SOC_TRA', 'Transformación', '( procedimientos formales)', '2','2','1','NO','NO','NO'),
      ],
    },
  ],

  // ═══════════════════════════════════════════════
  // SERVICIOS MAZARS FINANCIAL ADVISORY
  // ═══════════════════════════════════════════════
  financial: [
    {
      tipo: 'CF',
      descripcion: 'Corporate Finance',
      services: [
        s('CF_ACQM', 'Acquisition Mandate', null, 'NO','NO','1','NO','NO','1'),
        s('CF_DIM', 'Disposal Mandate', null, 'NO','NO','1','NO','NO','1'),
        s('CF_FR', 'Fund Raising', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'CM',
      descripcion: 'Capital Markets (IPO)',
      services: [
        s('CM_OTAS', 'Otros Asesoramientos', null, '1','1','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'DD',
      descripcion: 'Due diligence',
      services: [
        s('DD_BUY', 'Due Diligence Buyer', null, '1','1','1','1','1','1'),
        s('DD_SEL', 'Due Diligence Seller', null, '1','1','1','1','1','1'),
      ],
    },
    {
      tipo: 'FI',
      descripcion: 'Forensic Investigation',
      services: [
        s('FI_AOPIC', 'Auditing on Paid-In Capital', null, 'NO','NO','1','NO','NO','1'),
        s('FI_LSFI', 'Litigation Support & Forensic Investigations', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'PF',
      descripcion: 'Project Finance',
      services: [
        s('PF_PF', 'Project Finance', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'RS',
      descripcion: 'Restructuring Services',
      services: [
        s('RS_AUPB&CR', 'Assistance to Under-Performing Business & Corporate Restructuring', null, 'NO','NO','1','NO','NO','1'),
        s('RS_IBR', 'Independent Business Review', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'VAL',
      descripcion: 'Valuations',
      services: [
        s('VAL_BV', 'Business Valuation', null, 'NO','NO','1','NO','NO','1'),
        s('VAL_CF/FFA', 'Certification of Fairness/Financial Fairness Appraisal', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
  ],

  // ═══════════════════════════════════════════════
  // SERVICIOS MAZARS SERVICIOS PROFESIONALES
  // ═══════════════════════════════════════════════
  profesionales: [
    {
      tipo: 'ACC',
      descripcion: 'Accounting',
      services: [
        s('ACC_GCF', 'Gestión Contable y Fiscal', null, 'NO','NO','1','NO','NO','1'),
        s('ACC_IA', 'Interim Accounting', null, 'NO','NO','1','NO','NO','1'),
        s('ACC_RF', 'Representación Fiscal', null, 'NO','NO','1','NO','NO','1'),
        s('ACC_SUP', 'Supervisión', '(revision)', '2','2','1','NO','NO','1'),
        s('ACC_TC', 'Teneduría Contable', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'MIX',
      descripcion: 'Mixto',
      services: [
        s('MIX_GCF+PA', 'Gestión Contable y Fiscal + Payroll', null, 'NO','NO','1','NO','NO','1'),
        s('MIX_SU+PA', 'Supervisión + Payroll', null, 'NO','NO','1','NO','NO','1'),
        s('MIX_TC+PA', 'Teneduría Contable + Payroll', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
    {
      tipo: 'PR',
      descripcion: 'Payroll',
      services: [
        s('PR_EXLA', 'Externalización Laboral', null, 'NO','NO','1','NO','NO','1'),
      ],
    },
  ],
}

/**
 * Determine which restriction applies based on form answers.
 *
 * @param {object} service - A service object from the catalog
 * @param {object} formData - The current form state
 * @returns {{ code: string, label: string, limitaciones: string|null }}
 */
/**
 * Determine the current entity-type scenario from form data.
 * This is the single source of truth used by both ServiceSelector and generateWord.
 *
 * Logic:
 *  1. EIP / No EIP  →  formData.eip === 'SI'
 *  2. Entity type column:
 *     - VINCULADA SIGNIFICATIVA  if linkedJointControl='SI' OR linkedSignificantInfluence='SI'
 *     - CADENA DE CONTROL        if linkedInControlChain='SI'
 *     - ENTIDAD AUDITADA         otherwise (default)
 *
 *  Priority: vinculada significativa > cadena control > entidad auditada
 *  (a linked entity that is both in control chain AND significant → use vinculada significativa,
 *   which is always the least restrictive column)
 */
export function getScenario(formData) {
  const isEip = formData.eip === 'SI'
  const isInControlChain = formData.linkedInControlChain === 'SI'
  const isVinculadaSignificativa =
    formData.linkedJointControl === 'SI' || formData.linkedSignificantInfluence === 'SI'

  let entityType = 'entidadAuditada'
  let entityTypeLabel = 'ENTIDAD AUDITADA'

  if (isVinculadaSignificativa) {
    entityType = 'vinculadaSignificativa'
    entityTypeLabel = 'VINCULADA SIGNIFICATIVA DE AUDITADA'
  } else if (isInControlChain) {
    entityType = 'cadenaControl'
    entityTypeLabel = 'CADENA DE CONTROL DE AUDITADA'
  }

  return {
    isEip,
    entityType,
    entityTypeLabel,
    eipLabel: isEip ? 'EIP' : 'NO EIP',
    scenarioLabel: `${isEip ? 'EIP' : 'NO EIP'} → ${entityTypeLabel}`,
  }
}

export function getServiceRestriction(service, formData) {
  const { isEip, entityType } = getScenario(formData)
  const bucket = isEip ? service.restrictions.eip : service.restrictions.noEip
  const restrictionCode = bucket[entityType]

  return {
    code: restrictionCode,
    label: RESTRICTION_LABELS[restrictionCode] || restrictionCode,
    limitaciones: restrictionCode === '2' ? service.limitaciones : null,
  }
}
