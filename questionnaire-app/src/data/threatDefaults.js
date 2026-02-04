/**
 * Threat defaults per service type, from "5_Amenazas según NAS" sheet.
 *
 * Each service type maps to default SI/NO values for 6 threat categories.
 * These are initial presets that users can override.
 *
 * The 6 threat keys match the formData fields:
 *   threat_selfReview       = Autorrevisión
 *   threat_decisionMaking   = Participación proceso toma de decisiones (NEW)
 *   threat_advocacy         = Abogacía
 *   threat_selfInterest     = Interés Propio
 *   threat_familiarity      = Familiaridad
 *   threat_intimidation     = Intimidación
 */

// Keys used in formData for threats (order matches Excel columns 2-7)
export const THREAT_KEYS = [
  'threat_selfReview',
  'threat_decisionMaking',
  'threat_advocacy',
  'threat_selfInterest',
  'threat_familiarity',
  'threat_intimidation',
]

export const THREAT_LABELS = {
  threat_selfReview: 'Autorrevisión',
  threat_decisionMaking: 'Participación proceso toma de decisiones',
  threat_advocacy: 'Abogacía',
  threat_selfInterest: 'Interés Propio',
  threat_familiarity: 'Familiaridad',
  threat_intimidation: 'Intimidación',
}

/**
 * Service type categories from the Excel.
 * Each has a name (matching the Excel row), a list of service code prefixes
 * (to match against the selected service code), and default threat values.
 */
const DEFAULT_THREAT_MAP = [
  {
    serviceType: 'Servicios fiscales',
    prefixes: ['AF_', 'OTF_', 'PF_', 'PT_', 'RF_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'SI', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Servicios contables',
    prefixes: ['ACC_', 'MIX_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'NO', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Servicios de selección de personal y política de remuneraciones',
    prefixes: ['PR_'],
    defaults: { threat_selfReview: 'NO', threat_decisionMaking: 'SI', threat_advocacy: 'NO', threat_selfInterest: 'SI', threat_familiarity: 'SI', threat_intimidation: 'SI' },
  },
  {
    serviceType: 'Servicios legales',
    prefixes: ['ASE_L_', 'COC_', 'CON_', 'PRO', 'SOC_', 'Civil', 'Mercantil', 'Penal', 'PEC_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'SI', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Servicios relacionados con Sistemas de Información',
    prefixes: ['IT_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'NO', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Servicios de valoración',
    prefixes: ['VAL_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'NO', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Servicios actuariales',
    prefixes: ['ACT_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'NO', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Servicios de soporte en litigios y servicios periciales',
    prefixes: ['FI_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'SI', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Transaction services',
    prefixes: ['DD_'],
    defaults: { threat_selfReview: 'NO', threat_decisionMaking: 'SI', threat_advocacy: 'NO', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Servicios de finanzas corporativas',
    prefixes: ['CF_', 'CM_', 'PF_PF', 'RS_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'SI', threat_selfInterest: 'SI', threat_familiarity: 'NO', threat_intimidation: 'NO' },
  },
  {
    serviceType: 'Servicios de auditoría interna',
    prefixes: ['GRC_'],
    defaults: { threat_selfReview: 'SI', threat_decisionMaking: 'SI', threat_advocacy: 'NO', threat_selfInterest: 'SI', threat_familiarity: 'SI', threat_intimidation: 'NO' },
  },
]

// Persistent storage key for user-customized defaults
const STORAGE_KEY = 'sda_threat_defaults_custom'

/**
 * Load customized threat defaults from localStorage.
 * Returns null if no customizations exist.
 */
export function loadCustomDefaults() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return null
}

/**
 * Save customized threat defaults to localStorage.
 */
export function saveCustomDefaults(customMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customMap))
  } catch { /* ignore */ }
}

/**
 * Get the current threat defaults map (custom overrides or built-in).
 */
export function getThreatDefaultsMap() {
  const custom = loadCustomDefaults()
  if (custom) return custom
  return DEFAULT_THREAT_MAP
}

/**
 * Find the matching service type for a given service code.
 * Returns { serviceType, defaults } or null if no match.
 */
export function getThreatDefaultsForService(serviceCode) {
  if (!serviceCode) return null
  const map = getThreatDefaultsMap()
  for (const entry of map) {
    if (entry.prefixes.some(p => serviceCode.startsWith(p) || serviceCode === p.replace(/_$/, ''))) {
      return entry
    }
  }
  // Fallback: general services (SUS_, AUD_, ECO_, SUB_, COM_, FORM, OTA_)
  return {
    serviceType: 'Otros servicios',
    prefixes: [],
    defaults: {
      threat_selfReview: 'NO',
      threat_decisionMaking: 'NO',
      threat_advocacy: 'NO',
      threat_selfInterest: 'NO',
      threat_familiarity: 'NO',
      threat_intimidation: 'NO',
    },
  }
}

/**
 * Reset custom defaults to built-in values.
 */
export function resetCustomDefaults() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
}

export { DEFAULT_THREAT_MAP }
