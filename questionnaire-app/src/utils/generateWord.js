import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
} from 'docx'
import { saveAs } from 'file-saver'
import { CONCLUSIONS } from '../components/Step4Section'
import { DOC_ITEMS } from '../components/DocumentationSection'
import { SERVICE_CATALOG, CATEGORIES, getServiceRestriction, getScenario } from '../data/serviceData'

// ── Colors ──
const BLUE_FILL   = { type: ShadingType.SOLID, color: 'B4C6E7' }
const GRAY_FILL   = { type: ShadingType.SOLID, color: 'D9D9D9' }
const WHITE_FILL  = { type: ShadingType.SOLID, color: 'FFFFFF' }
const GREEN_FILL  = { type: ShadingType.SOLID, color: 'C6EFCE' }

const DARK_BLUE  = '002060'
const BLUE_TEXT  = '0000FF'
const DARK_GREEN = '375623'
const DARK_TEAL  = '1F4E79'

// ── Borders ──
const THIN = { style: BorderStyle.SINGLE, size: 1, color: 'auto' }
const MED  = { style: BorderStyle.SINGLE, size: 3, color: 'auto' }
const DOT  = { style: BorderStyle.DOTTED, size: 1, color: 'auto' }
const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }

const THIN_ALL = { top: THIN, bottom: THIN, left: THIN, right: THIN }
const MED_ALL  = { top: MED, bottom: MED, left: MED, right: MED }

// ── Widths ──
const TABLE_W = 10200
const COL_L = 6800   // left column (questions/labels) ~67%
const COL_R = 3400   // right column (answers)         ~33%

// ── Helpers ──
function t(text, opts = {}) {
  return new TextRun({
    text: text || '',
    font: 'Calibri',
    size: opts.size || 22,
    bold: !!opts.bold,
    italic: !!opts.italic,
    color: opts.color,
  })
}

function p(runs, opts = {}) {
  return new Paragraph({
    children: Array.isArray(runs) ? runs : [runs],
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: 0, before: 0 },
  })
}

function c(content, opts = {}) {
  return new TableCell({
    children: Array.isArray(content) ? content : [content],
    width: opts.w ? { size: opts.w, type: WidthType.DXA } : undefined,
    columnSpan: opts.span || 1,
    borders: opts.bdr || THIN_ALL,
    shading: opts.fill || WHITE_FILL,
    verticalAlign: opts.va || VerticalAlign.CENTER,
  })
}

function makeTable(rows) {
  return new Table({
    rows: rows.filter(Boolean),
    width: { size: TABLE_W, type: WidthType.DXA },
  })
}

function spacer(pts = 10) {
  return new Paragraph({ spacing: { after: pts * 20 } })
}

// ═══════════════════════════════════════════════
// Section builders — each returns a Table
// ═══════════════════════════════════════════════

// ── Section header (gray banner) ──
function sectionHeaderRow(text) {
  return new TableRow({
    children: [
      c([p([t(text, { bold: true, color: DARK_GREEN })])],
        { span: 2, bdr: MED_ALL, fill: GRAY_FILL }),
    ],
  })
}

// ── 2-col: left label, right value (text) ──
function infoRow(label, value, opts = {}) {
  return new TableRow({
    children: [
      c([p([t(label, { bold: opts.boldLabel !== false })])],
        { w: COL_L, bdr: THIN_ALL, fill: WHITE_FILL }),
      c([p([t(value || '')])],
        { w: COL_R, bdr: THIN_ALL, fill: WHITE_FILL }),
    ],
  })
}

// ── 2-col: left label, right SI/NO (blue fill) ──
function toggleRow(label, value, opts = {}) {
  return new TableRow({
    children: [
      c([p([t(label, { bold: opts.boldLabel !== false })])],
        { w: COL_L, bdr: THIN_ALL, fill: WHITE_FILL }),
      c([p([t(value || '', { bold: true })], { align: AlignmentType.CENTER })],
        { w: COL_R, bdr: THIN_ALL, fill: BLUE_FILL }),
    ],
  })
}

// ── Step sub-title row (blue text, full width) ──
function stepTitleRow(text) {
  return new TableRow({
    children: [
      c([p([t(text, { bold: true, color: BLUE_TEXT })])],
        { span: 2, bdr: MED_ALL, fill: WHITE_FILL, va: VerticalAlign.TOP }),
    ],
  })
}

// ── Step question + answer: left=question, right=SI/NO ──
function stepQARow(question, answer) {
  return new TableRow({
    children: [
      c([p([t(question)])],
        { w: COL_L, bdr: THIN_ALL, fill: WHITE_FILL, va: VerticalAlign.TOP }),
      c([p([t(answer || '', { bold: true })], { align: AlignmentType.CENTER })],
        { w: COL_R, bdr: THIN_ALL, fill: BLUE_FILL }),
    ],
  })
}

// ── Full-width text row (user-entered text) ──
function textRow(text) {
  if (!text) return null
  return new TableRow({
    children: [
      c([p([t(text)])],
        { span: 2, bdr: THIN_ALL, fill: WHITE_FILL, va: VerticalAlign.TOP }),
    ],
  })
}

// ═══════════════════════════════════════════════
// Build all sections
// ═══════════════════════════════════════════════
export async function generateWord(formData) {
  const children = []

  // ──────────────── TITLE ────────────────
  children.push(
    p([t('ANALISIS DE AMENAZAS-MEDIDAS DE SALVAGUARDA A LA INDEPENDENCIA DEL AUDITOR', { bold: true, color: DARK_BLUE, size: 26 })], { align: AlignmentType.CENTER }),
  )
  children.push(
    p([t('PLANTILLA PARA SU DOCUMENTACION', { bold: true, color: DARK_BLUE, size: 22 })], { align: AlignmentType.CENTER }),
  )
  children.push(
    p([t('Esquema del Procedimiento en MAZARS', { bold: true, size: 22 })]),
  )
  children.push(spacer(8))

  // ──────────────── INFO GENERAL (Table 1) ────────────────
  {
    const rows = []
    rows.push(infoRow('NOMBRE de la Entidad Auditada', formData.entityName))
    rows.push(infoRow('NOMBRE DEL AUDITOR DE CUENTAS RESPONSABLE (FIRMANTE)', formData.auditorName))
    rows.push(toggleRow('EIP (segun legislacion espanola)', formData.eip))
    rows.push(infoRow('NOMBRE DEL GRUPO al que pertenece la Entidad Auditada', formData.groupName))
    rows.push(toggleRow('La Entidad Dominante de la Entidad Auditada es una EIP segun su legislacion especifica?', formData.parentEIP, { boldLabel: false }))
    rows.push(toggleRow('La Entidad Dominante esta radicada en la UE?', formData.parentInEU, { boldLabel: false }))
    rows.push(toggleRow('La Entidad Dominante o el grupo es auditado por alguna firma de la red MAZARS?', formData.parentAuditedByMazars, { boldLabel: false }))
    rows.push(infoRow('NOMBRE DEL SOCIO auditoria de la entidad Dominante y/o GRUPO', formData.partnerName))
    rows.push(toggleRow('LOS SERVICIOS ESTAN SUJETOS A AUTORIZACION PREVIA POR PARTE DE LA COMISION DE AUDITORIA/DIRECCION DEL CLIENTE AUDITADO O POR LA COMISION DE AUDITORIA O DIRECCION DE SU ENTIDAD DOMINANTE?', formData.servicesAuthorized))
    rows.push(infoRow('Si el SDA se presta a una entidad vinculada a la Entidad Auditada, indicar NOMBRE de la ENTIDAD VINCULADA', formData.linkedEntityName))
    rows.push(toggleRow('Esta la Entidad Vinculada en la cadena de control de la Entidad Auditada?', formData.linkedInControlChain, { boldLabel: false }))
    rows.push(toggleRow('Es la Entidad Vinculada una entidad que ejerce control conjunto o influencia significativa en la Entidad Auditada?', formData.linkedJointControl, { boldLabel: false }))
    rows.push(toggleRow('Es la Entidad Vinculada una entidad sobre la que la Entidad Auditada ejerce influencia significativa?', formData.linkedSignificantInfluence, { boldLabel: false }))
    rows.push(infoRow('ENTIDAD DE LA RED MAZARS prestadora del SDA', formData.mazarsEntity))
    rows.push(infoRow('Nombre del SOCIO RESPONSABLE del SDA', formData.sdaPartnerName))
    rows.push(infoRow('HONORARIOS SDA', formData.sdaFees))
    children.push(makeTable(rows))
  }
  children.push(spacer(12))

  // ──────────────── SERVICIO SELECCIONADO (Table 1b) ────────────────
  if (formData.selectedServiceCode) {
    const allServices = []
    for (const cat of CATEGORIES) {
      const subcats = SERVICE_CATALOG[cat.id] || []
      for (const subcat of subcats) {
        for (const svc of subcat.services) {
          allServices.push({ ...svc, categoryId: cat.id, categoryName: cat.name, tipo: subcat.tipo, subcatDescripcion: subcat.descripcion })
        }
      }
    }
    const selectedSvc = allServices.find(s => s.code === formData.selectedServiceCode)
    if (selectedSvc) {
      const restriction = getServiceRestriction(selectedSvc, formData)
      const scenario = getScenario(formData)
      const rows = []
      rows.push(sectionHeaderRow('SERVICIO SELECCIONADO'))
      rows.push(infoRow('Categoría', selectedSvc.categoryName))
      rows.push(infoRow('Tipo de trabajo', `${selectedSvc.tipo} - ${selectedSvc.subcatDescripcion}`))
      rows.push(infoRow('Código de servicio', selectedSvc.code))
      rows.push(infoRow('Descripción del servicio', selectedSvc.description))
      rows.push(infoRow('Escenario aplicable', scenario.scenarioLabel))
      if (selectedSvc.limitaciones) {
        rows.push(new TableRow({
          children: [
            c([p([t('Limitaciones', { bold: true })])],
              { w: COL_L, bdr: THIN_ALL, fill: WHITE_FILL }),
            c([p([t(selectedSvc.limitaciones, { color: 'FF0000', italic: true })])],
              { w: COL_R, bdr: THIN_ALL, fill: WHITE_FILL }),
          ],
        }))
      }
      // Restriction result
      const restrictionFill = restriction.code === 'NO'
        ? { type: ShadingType.SOLID, color: 'FFCCCC' }
        : restriction.code === '2'
          ? { type: ShadingType.SOLID, color: 'FFF2CC' }
          : GREEN_FILL
      rows.push(new TableRow({
        children: [
          c([p([t('Resultado', { bold: true })])],
            { w: COL_L, bdr: MED_ALL, fill: WHITE_FILL }),
          c([p([t(restriction.label, { bold: true, color: restriction.code === 'NO' ? 'FF0000' : restriction.code === '2' ? 'E65100' : '2E7D32' })])],
            { w: COL_R, bdr: MED_ALL, fill: restrictionFill }),
        ],
      }))
      if (restriction.limitaciones) {
        rows.push(new TableRow({
          children: [
            c([p([t('Limitado a:', { bold: true })])],
              { w: COL_L, bdr: THIN_ALL, fill: WHITE_FILL }),
            c([p([t(restriction.limitaciones, { color: 'FF0000', italic: true })])],
              { w: COL_R, bdr: THIN_ALL, fill: WHITE_FILL }),
          ],
        }))
      }
      children.push(makeTable(rows))
      children.push(spacer(12))
    }
  }

  // ──────────────── PASO 1 (Table 2) ────────────────
  {
    const rows = []
    rows.push(sectionHeaderRow('PASO 1.- IDENTIFICACION DE AMENAZAS A LA INDEPENDENCIA'))

    // 1.1
    rows.push(stepTitleRow('1.1. Identificacion del servicio o situacion y si se trata de una incompatibilidad o prohibicion'))
    rows.push(textRow(formData.step1_1_description))

    // 1.2
    rows.push(stepTitleRow('1.2. Es una de las incompatibilidades o prohibiciones resultantes de los articulos 14, 15.2, 16 a 20, 23, 24.1, 25 y, para EIP, los arts. 39 a 41 de la LAC y los arts. 4, 5, 17 y 41 del RUE?'))
    if (formData.step1_2_answer) {
      rows.push(stepQARow(
        'Es una de las incompatibilidades o prohibiciones?',
        formData.step1_2_answer
      ))
    }

    // 1.3
    if (formData.step1_3_answer) {
      rows.push(stepTitleRow('1.3. Caso de prestarse a una entidad auditada que no es EIP alguno de los servicios indicados en el articulo 16.1.b) 2, 3, 4 y 5 de la LAC, indicar si se dispone de, o se pueden aplicar, las medidas de salvaguarda requeridas por la legislacion'))
      rows.push(stepQARow(
        'Se trata de alguno de los servicios indicados en el art. 16.1.b) de la LAC que, pudiendo ser una causa de incompatibilidad, la legislacion permite aplicar medidas de salvaguarda y determina las mismas, para que no sea considerada como tal?',
        formData.step1_3_answer
      ))
      rows.push(textRow(formData.step1_3_detail))
    }

    // 1.4
    if (formData.step1_4_answer) {
      rows.push(stepTitleRow('1.4. Caso de prestarse a una empresa constituida en un tercer pais y controlada por la EIP auditada alguno de los servicios indicados en el articulo 5.5 b) del RUE, indicar si se dispone de, o se pueden aplicar, medidas de salvaguarda que mitiguen las correspondientes amenazas'))
      rows.push(stepQARow(
        'La situacion analizada consiste en la prestacion de servicios ajenos a los de auditoria a los que se refiere el articulo 5.1, parrafo segundo, del RUE a una empresa constituida en un tercer pais y controlada por la EIP auditada?',
        formData.step1_4_answer
      ))
      rows.push(textRow(formData.step1_4_detail))
    }

    // 1.5
    if (formData.step1_5_answer) {
      rows.push(stepTitleRow('1.5. Analizar si la situacion o servicio implica participacion en la gestion o toma de decisiones (art. 14.2 LAC y 37 RLAC)'))
      rows.push(stepQARow(
        'Se trata de una situacion o servicio que implica participacion en la gestion o toma de decisiones?',
        formData.step1_5_answer
      ))
      rows.push(textRow(formData.step1_5_detail))
    }

    // 1.6
    if (formData.step1_6_answer) {
      rows.push(stepTitleRow('1.6. Es una de las incompatibilidades o prohibiciones absolutas?'))
      rows.push(stepQARow(
        'En base a lo anterior, concluir si estamos ante una de las incompatibilidades o prohibiciones absolutas porque no se contemplan medidas de salvaguarda.',
        formData.step1_6_answer
      ))
      rows.push(textRow(formData.step1_6_detail))
    }

    children.push(makeTable(rows))
  }
  children.push(spacer(12))

  // ──────────────── PASO 2 (Table 3) ────────────────
  const hasAnyThreatAnswer = ['threat_selfInterest', 'threat_selfReview', 'threat_decisionMaking', 'threat_advocacy', 'threat_familiarity', 'threat_intimidation'].some(k => formData[k])

  if (hasAnyThreatAnswer || formData.step2_1_description) {
    const rows = []
    rows.push(sectionHeaderRow('PASO 2. IDENTIFICACION DE AMENAZAS Y EVALUACION DE LA IMPORTANCIA DE LAS AMENAZAS IDENTIFICADAS'))

    // 2.1
    rows.push(stepTitleRow('2.1. Si no es una Incompatibilidad o prohibicion, indicar las posibles amenazas a la independencia y explicar por que se consideran como tales'))
    rows.push(textRow(formData.step2_1_description))

    // Threat list — same 2-col: left=type, right=SI/NO
    rows.push(toggleRow('- Interes propio', formData.threat_selfInterest, { boldLabel: true }))
    rows.push(toggleRow('- Autorrevision', formData.threat_selfReview, { boldLabel: true }))
    rows.push(toggleRow('- Participacion proceso toma de decisiones', formData.threat_decisionMaking, { boldLabel: true }))
    rows.push(toggleRow('- Abogacia', formData.threat_advocacy, { boldLabel: true }))
    rows.push(toggleRow('- Familiaridad o confianza', formData.threat_familiarity, { boldLabel: true }))
    rows.push(toggleRow('- Intimidacion', formData.threat_intimidation, { boldLabel: true }))

    // 2.2
    if (formData.step2_2_evaluation) {
      rows.push(stepTitleRow('2.2. Evaluar la importancia de las amenazas identificadas'))
      rows.push(textRow(formData.step2_2_evaluation))
    }

    children.push(makeTable(rows))
    children.push(spacer(12))
  }

  // ──────────────── PASO 3 (Table 4) ────────────────
  {
    let measuresItems = []
    const rawMeasures = formData.step3_measures
    if (rawMeasures) {
      try {
        const parsed = JSON.parse(rawMeasures)
        if (Array.isArray(parsed)) measuresItems = parsed
      } catch {
        // Legacy plain string
        if (typeof rawMeasures === 'string' && rawMeasures.trim()) {
          measuresItems = [{ text: rawMeasures }]
        }
      }
    }
    if (measuresItems.length > 0) {
      const rows = []
      rows.push(sectionHeaderRow('PASO 3. MEDIDAS DE SALVAGUARDA A APLICAR'))
      measuresItems.forEach((item, idx) => {
        const prefix = `${idx + 1}. `
        rows.push(textRow(prefix + (item.text || '')))
      })
      children.push(makeTable(rows))
      children.push(spacer(12))
    }
  }

  // ──────────────── PASO 4 (Table 5) ── only selected conclusion ────────────────
  {
    const selectedConclusion = CONCLUSIONS.find(cc => cc.id === formData.step4_conclusion)
    const rows = []
    rows.push(sectionHeaderRow('PASO 4: CONCLUSION FINAL'))

    if (selectedConclusion) {
      rows.push(new TableRow({
        children: [
          c(
            [p([t(selectedConclusion.text, { color: DARK_TEAL })])],
            { span: 2, bdr: MED_ALL, fill: GREEN_FILL, va: VerticalAlign.TOP }
          ),
        ],
      }))
    } else if (formData.step4_conclusion === 'conclusion_custom' && formData.step4_conclusion_custom) {
      rows.push(new TableRow({
        children: [
          c(
            [p([t(formData.step4_conclusion_custom, { color: DARK_TEAL })])],
            { span: 2, bdr: MED_ALL, fill: GREEN_FILL, va: VerticalAlign.TOP }
          ),
        ],
      }))
    } else {
      rows.push(new TableRow({
        children: [
          c(
            [p([t('(No se ha seleccionado ninguna conclusion)', { italic: true })])],
            { span: 2, bdr: THIN_ALL, fill: WHITE_FILL }
          ),
        ],
      }))
    }

    children.push(makeTable(rows))
  }
  children.push(spacer(12))

  // ──────────────── FIRMAS (Table 6) ────────────────
  {
    const rows = []

    // Audit partner
    rows.push(new TableRow({
      children: [
        c([p([t('Fecha del analisis:', { bold: true })], { align: AlignmentType.RIGHT })],
          { w: COL_L, bdr: { ...THIN_ALL, bottom: NONE }, fill: WHITE_FILL }),
        c([p([t(formData.analysisDate || '')])],
          { w: COL_R, bdr: { ...THIN_ALL, bottom: NONE }, fill: WHITE_FILL }),
      ],
    }))
    rows.push(new TableRow({
      children: [
        c([p([t('Firma del socio responsable de la auditoria:', { bold: true })], { align: AlignmentType.RIGHT })],
          { w: COL_L, bdr: { ...THIN_ALL, top: NONE }, fill: WHITE_FILL }),
        c([p([t(formData.auditPartnerSignature || '')])],
          { w: COL_R, bdr: { ...THIN_ALL, top: NONE }, fill: WHITE_FILL }),
      ],
    }))

    children.push(makeTable(rows))
  }
  children.push(spacer(8))

  // ──────────────── SDA Partner signature (Table 7) ────────────────
  {
    const rows = []
    rows.push(sectionHeaderRow('Firma del socio responsable del servicio distinto al de auditoria, aceptando la descripcion del servicio y, en su caso, las conclusiones y medidas de salvaguarda a aplicar'))

    rows.push(new TableRow({
      children: [
        c([p([t('Fecha:', { bold: true })], { align: AlignmentType.RIGHT })],
          { w: COL_L, bdr: THIN_ALL, fill: WHITE_FILL }),
        c([p([t(formData.sdaPartnerDate || '')])],
          { w: COL_R, bdr: THIN_ALL, fill: WHITE_FILL }),
      ],
    }))
    rows.push(new TableRow({
      children: [
        c([p([t('Firma del socio responsable del SDA:', { bold: true })], { align: AlignmentType.RIGHT })],
          { w: COL_L, bdr: THIN_ALL, fill: WHITE_FILL }),
        c([p([t(formData.sdaPartnerSignature || '')])],
          { w: COL_R, bdr: THIN_ALL, fill: WHITE_FILL }),
      ],
    }))
    rows.push(new TableRow({
      children: [
        c([p([t('Firma del socio responsable de los servicios distintos a los de auditoria:', { bold: true })], { align: AlignmentType.RIGHT })],
          { w: COL_L, bdr: THIN_ALL, fill: WHITE_FILL }),
        c([p([t(formData.sdaResponsibleSignature || '')])],
          { w: COL_R, bdr: THIN_ALL, fill: WHITE_FILL }),
      ],
    }))

    children.push(makeTable(rows))
  }
  children.push(spacer(12))

  // ──────────────── DOCUMENTACION (Table 8) ────────────────
  {
    const rows = []
    // Header: label | X-REF
    rows.push(new TableRow({
      children: [
        c([p([t('DOCUMENTACION A ADJUNTAR', { bold: true, color: DARK_GREEN })])],
          { w: COL_L, bdr: MED_ALL, fill: GRAY_FILL }),
        c([p([t('X-REF', { bold: true, color: DARK_GREEN })], { align: AlignmentType.CENTER })],
          { w: COL_R, bdr: MED_ALL, fill: GRAY_FILL }),
      ],
    }))

    for (const item of DOC_ITEMS) {
      rows.push(new TableRow({
        children: [
          c([p([t(item.label)])],
            { w: COL_L, bdr: { top: DOT, bottom: DOT, left: MED, right: MED }, fill: WHITE_FILL }),
          c([p([t(formData[item.key] || '')], { align: AlignmentType.CENTER })],
            { w: COL_R, bdr: { top: DOT, bottom: DOT, left: MED, right: MED }, fill: WHITE_FILL }),
        ],
      }))
    }

    children.push(makeTable(rows))
  }

  // ──────────────── Build Document ────────────────
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
          size: { width: 11906, height: 16838 },
        },
      },
      children,
    }],
  })

  const blob = await Packer.toBlob(doc)
  const entityStr = (formData.entityName || 'sin_nombre').replace(/[^a-zA-Z0-9_-]/g, '_')
  saveAs(blob, `SDA_Cuestionario_${entityStr}_${new Date().toISOString().slice(0, 10)}.docx`)
}
