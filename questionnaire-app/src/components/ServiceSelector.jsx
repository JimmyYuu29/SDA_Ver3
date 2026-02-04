import { useState, useMemo } from 'react'
import { CATEGORIES, SERVICE_CATALOG, getServiceRestriction, getScenario } from '../data/serviceData'

function ServiceSelector({ formData, updateField }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [expandedSubcategory, setExpandedSubcategory] = useState(null)

  const selectedCode = formData.selectedServiceCode || ''

  const scenario = useMemo(() => getScenario(formData), [
    formData.eip,
    formData.linkedInControlChain,
    formData.linkedJointControl,
    formData.linkedSignificantInfluence,
  ])

  // Flatten all services for search
  const allServices = useMemo(() => {
    const result = []
    for (const cat of CATEGORIES) {
      const subcats = SERVICE_CATALOG[cat.id] || []
      for (const subcat of subcats) {
        for (const svc of subcat.services) {
          result.push({
            ...svc,
            categoryId: cat.id,
            categoryName: cat.name,
            tipo: subcat.tipo,
            subcatDescripcion: subcat.descripcion,
          })
        }
      }
    }
    return result
  }, [])

  // Search results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return []
    const term = searchTerm.toLowerCase().trim()
    return allServices.filter(svc =>
      svc.code.toLowerCase().includes(term) ||
      svc.description.toLowerCase().includes(term) ||
      svc.subcatDescripcion.toLowerCase().includes(term) ||
      svc.tipo.toLowerCase().includes(term) ||
      (svc.limitaciones && svc.limitaciones.toLowerCase().includes(term))
    )
  }, [searchTerm, allServices])

  const isSearching = searchTerm.trim().length > 0

  // Get current selected service info
  const selectedService = useMemo(() => {
    if (!selectedCode) return null
    return allServices.find(s => s.code === selectedCode) || null
  }, [selectedCode, allServices])

  const selectedRestriction = useMemo(() => {
    if (!selectedService) return null
    return getServiceRestriction(selectedService, formData)
  }, [selectedService, formData])

  function selectService(svc) {
    updateField('selectedServiceCode', svc.code)
    updateField('selectedCategoryId', svc.categoryId)
    updateField('selectedServiceDescription', svc.description)
    updateField('selectedServiceTipo', svc.tipo)
    updateField('selectedServiceSubcat', svc.subcatDescripcion)
    updateField('selectedServiceLimitaciones', svc.limitaciones || '')
    updateField('selectedServiceCategoryName', svc.categoryName)
    setSearchTerm('')
  }

  function clearSelection() {
    updateField('selectedServiceCode', '')
    updateField('selectedCategoryId', '')
    updateField('selectedServiceDescription', '')
    updateField('selectedServiceTipo', '')
    updateField('selectedServiceSubcat', '')
    updateField('selectedServiceLimitaciones', '')
    updateField('selectedServiceCategoryName', '')
  }

  function toggleCategory(catId) {
    if (expandedCategory === catId) {
      setExpandedCategory(null)
      setExpandedSubcategory(null)
    } else {
      setExpandedCategory(catId)
      setExpandedSubcategory(null)
    }
  }

  function toggleSubcategory(key) {
    setExpandedSubcategory(expandedSubcategory === key ? null : key)
  }

  // Build inline restriction text for a service
  function getRestrictionDisplay(svc) {
    const restriction = getServiceRestriction(svc, formData)
    if (restriction.code === 'NO') {
      return { type: 'no', text: 'Servicio prohibido' }
    }
    if (restriction.code === '2') {
      const limText = restriction.limitaciones || svc.limitaciones || ''
      return {
        type: '2',
        text: 'Requiere cuestionario',
        subtext: limText ? `Limitado a: ${limText}` : 'Servicio limitado',
      }
    }
    // code === '1'
    return { type: '1', text: 'Requiere cuestionario' }
  }

  // Render a service row with inline restriction info
  function renderServiceItem(svc, showPath = false) {
    const isSelected = selectedCode === svc.code
    const display = getRestrictionDisplay(svc)
    const isProhibited = display.type === 'no'

    return (
      <div
        key={`${svc.categoryId}-${svc.code}`}
        className={`service-item ${isSelected ? 'selected' : ''} ${isProhibited ? 'prohibited' : ''}`}
        onClick={() => !isProhibited ? selectService(svc) : null}
      >
        <div className="service-item-main">
          {showPath && (
            <div className="service-path">
              {svc.categoryName} → {svc.tipo} - {svc.subcatDescripcion}
            </div>
          )}
          <div className="service-item-row">
            <div className="service-item-left">
              <span className="service-code">{svc.code}</span>
              <span className="service-desc">{svc.description}</span>
            </div>
            <div className={`service-inline-restriction restriction-inline-${display.type}`}>
              {display.type === 'no' && <span className="restriction-inline-icon">⛔</span>}
              {display.type === '1' && <span className="restriction-inline-icon">✅</span>}
              {display.type === '2' && <span className="restriction-inline-icon">⚠️</span>}
              <div className="restriction-inline-texts">
                <span className="restriction-inline-main">{display.text}</span>
                {display.subtext && (
                  <span className="restriction-inline-sub">{display.subtext}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if info general is incomplete
  const isInfoIncomplete = !formData.eip

  return (
    <div className="section">
      <h2 className="section-title">Selección de Servicio</h2>

      {/* Scenario banner - shows current conditions from Información General */}
      <div className="scenario-banner">
        <div className="scenario-banner-title">Condiciones actuales (según Información General):</div>
        {isInfoIncomplete ? (
          <div className="scenario-incomplete">
            ⚠️ Complete la sección "Información General" primero (al menos el campo EIP) para ver las restricciones aplicables.
          </div>
        ) : (
          <div className="scenario-details">
            <div className="scenario-chip-row">
              <span className={`scenario-chip ${scenario.isEip ? 'chip-eip' : 'chip-no-eip'}`}>
                {scenario.eipLabel}
              </span>
              <span className="scenario-arrow-sep">→</span>
              <span className="scenario-chip chip-entity">
                {scenario.entityTypeLabel}
              </span>
            </div>
            <div className="scenario-explanation">
              {!scenario.isEip && 'La entidad auditada NO es EIP. '}
              {scenario.isEip && 'La entidad auditada ES EIP. '}
              {scenario.entityType === 'entidadAuditada' && 'El servicio se presta directamente a la entidad auditada.'}
              {scenario.entityType === 'cadenaControl' && 'El servicio se presta a una entidad vinculada en la cadena de control.'}
              {scenario.entityType === 'vinculadaSignificativa' && 'El servicio se presta a una entidad vinculada significativa.'}
            </div>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="service-search-container">
        <div className="service-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="service-search-input"
            placeholder="Buscar servicio por código, descripción o tipo de trabajo..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>
      </div>

      {/* Search results */}
      {isSearching && (
        <div className="search-results">
          <div className="search-results-header">
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
          </div>
          {searchResults.length > 0 ? (
            <div className="service-list">
              {searchResults.map(svc => renderServiceItem(svc, true))}
            </div>
          ) : (
            <div className="no-results">No se encontraron servicios que coincidan con la búsqueda.</div>
          )}
        </div>
      )}

      {/* Category tree browser */}
      {!isSearching && (
        <div className="category-tree">
          {CATEGORIES.map(cat => {
            const subcats = SERVICE_CATALOG[cat.id] || []
            const isExpanded = expandedCategory === cat.id
            const totalServices = subcats.reduce((sum, sc) => sum + sc.services.length, 0)

            return (
              <div key={cat.id} className="category-node">
                <div
                  className={`category-header ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <span className="category-arrow">{isExpanded ? '▼' : '▶'}</span>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{totalServices} servicios</span>
                </div>

                {isExpanded && (
                  <div className="subcategory-list">
                    {subcats.map(subcat => {
                      const subKey = `${cat.id}-${subcat.tipo}`
                      const isSubExpanded = expandedSubcategory === subKey

                      return (
                        <div key={subKey} className="subcategory-node">
                          <div
                            className={`subcategory-header ${isSubExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleSubcategory(subKey)}
                          >
                            <span className="subcategory-arrow">{isSubExpanded ? '▼' : '▶'}</span>
                            <span className="subcategory-tipo">{subcat.tipo}</span>
                            <span className="subcategory-desc">{subcat.descripcion}</span>
                            <span className="subcategory-count">{subcat.services.length}</span>
                          </div>

                          {isSubExpanded && (
                            <div className="service-list">
                              {subcat.services.map(svc =>
                                renderServiceItem({
                                  ...svc,
                                  categoryId: cat.id,
                                  categoryName: cat.name,
                                  tipo: subcat.tipo,
                                  subcatDescripcion: subcat.descripcion,
                                })
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Selected service summary */}
      {selectedService && selectedRestriction && (
        <div className="selected-service-summary">
          <div className="summary-header">
            <h3>Servicio Seleccionado</h3>
            <button className="btn-clear-service" onClick={clearSelection}>Cambiar servicio</button>
          </div>
          <div className="summary-body">
            <div className="summary-row">
              <span className="summary-label">Categoría:</span>
              <span className="summary-value">{selectedService.categoryName}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tipo de trabajo:</span>
              <span className="summary-value">{selectedService.tipo} - {selectedService.subcatDescripcion}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Código:</span>
              <span className="summary-value">{selectedService.code}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Descripción:</span>
              <span className="summary-value">{selectedService.description}</span>
            </div>
            {selectedService.limitaciones && (
              <div className="summary-row">
                <span className="summary-label">Limitaciones:</span>
                <span className="summary-value limitaciones-text">{selectedService.limitaciones}</span>
              </div>
            )}
            <div className="summary-row">
              <span className="summary-label">Escenario:</span>
              <span className="summary-value">{scenario.scenarioLabel}</span>
            </div>
            <div className={`restriction-result restriction-${selectedRestriction.code === 'NO' ? 'no' : selectedRestriction.code}`}>
              <div className="restriction-icon">
                {selectedRestriction.code === 'NO' ? '⛔' : selectedRestriction.code === '2' ? '⚠️' : '✅'}
              </div>
              <div className="restriction-detail">
                <div className="restriction-title">{selectedRestriction.label}</div>
                {selectedRestriction.limitaciones && (
                  <div className="restriction-limitaciones">
                    Limitado a: {selectedRestriction.limitaciones}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Show the full restriction matrix */}
          <div className="restriction-matrix">
            <h4>Matriz de restricciones completa</h4>
            <table className="matrix-table">
              <thead>
                <tr>
                  <th></th>
                  <th colSpan="3">NO EIP</th>
                  <th colSpan="3">EIP</th>
                </tr>
                <tr>
                  <th></th>
                  <th>Ent. Auditada</th>
                  <th>Cadena Control</th>
                  <th>Vinculada Sig.</th>
                  <th>Ent. Auditada</th>
                  <th>Cadena Control</th>
                  <th>Vinculada Sig.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedService.code}</td>
                  {['noEip', 'eip'].map(bucket =>
                    ['entidadAuditada', 'cadenaControl', 'vinculadaSignificativa'].map(field => {
                      const val = selectedService.restrictions[bucket][field]
                      const isActive =
                        (bucket === (scenario.isEip ? 'eip' : 'noEip')) &&
                        field === scenario.entityType
                      return (
                        <td
                          key={`${bucket}-${field}`}
                          className={`matrix-cell matrix-${val === 'NO' ? 'no' : val} ${isActive ? 'matrix-active' : ''}`}
                        >
                          {val}
                        </td>
                      )
                    })
                  )}
                </tr>
              </tbody>
            </table>
            <div className="matrix-legend">
              <span className="legend-item"><span className="legend-dot legend-no"></span> NO = Servicio prohibido</span>
              <span className="legend-item"><span className="legend-dot legend-1"></span> 1 = Requiere cuestionario</span>
              <span className="legend-item"><span className="legend-dot legend-2"></span> 2 = Servicio limitado</span>
              <span className="legend-item"><span className="legend-dot legend-active"></span> = Escenario actual</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceSelector
