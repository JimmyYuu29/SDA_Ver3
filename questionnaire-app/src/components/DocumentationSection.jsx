const DOC_ITEMS = [
  { key: 'doc_ethics', label: 'Consultas realizadas al Responsable de Etica e Independencia' },
  { key: 'doc_riskManager', label: 'Decision del Risk Manager Local (solo Entidades de Interes Publico)' },
  { key: 'doc_dominantPartner', label: 'Decision del socio responsable de la auditoria de la entidad dominante y/o del Grupo' },
  { key: 'doc_auditCommission', label: 'Autorizacion de la Comision de auditoria / direccion del cliente y/o de la dominante de la entidad' },
  { key: 'doc_engagementLetter', label: 'Carta de encargo de servicios no auditoria firmada por el cliente' },
  { key: 'doc_wecheck', label: 'WeCheck' },
  { key: 'doc_deliverables', label: 'Entregables del SDA analizados en el curso de la prestacion del SDA, en el marco del proceso de revision y seguimiento del SDA' },
]

function DocumentationSection({ formData, updateField }) {
  return (
    <div className="section">
      <h2 className="section-title">Documentacion a Adjuntar</h2>

      <div className="step-description">
        Indique la referencia cruzada (X-REF) para cada documento adjunto, si corresponde.
      </div>

      <div>
        {DOC_ITEMS.map(item => (
          <div className="checklist-item" key={item.key}>
            <label>{item.label}</label>
            <input
              type="text"
              value={formData[item.key]}
              onChange={e => updateField(item.key, e.target.value)}
              placeholder="X-REF"
              style={{ maxWidth: 180 }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export { DOC_ITEMS }
export default DocumentationSection
