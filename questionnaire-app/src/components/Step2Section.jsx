import { useState, useEffect, useMemo } from 'react'
import SiNoToggle from './SiNoToggle'
import {
  THREAT_KEYS,
  THREAT_LABELS,
  getThreatDefaultsForService,
  getThreatDefaultsMap,
  saveCustomDefaults,
  resetCustomDefaults,
  DEFAULT_THREAT_MAP,
} from '../data/threatDefaults'

function Step2Section({ formData, updateField }) {
  const [showHelp, setShowHelp] = useState(false)
  const [editingDefaults, setEditingDefaults] = useState(false)
  const [editableMap, setEditableMap] = useState(null)
  const [autoApplied, setAutoApplied] = useState(false)

  const threats = THREAT_KEYS.map(key => ({
    key,
    label: THREAT_LABELS[key],
  }))

  const hasAnyThreat = threats.some(t => formData[t.key] === 'SI')

  // Auto-apply defaults when service code changes
  const serviceCode = formData.selectedServiceCode
  const match = useMemo(() => getThreatDefaultsForService(serviceCode), [serviceCode])

  useEffect(() => {
    if (!serviceCode || !match) return
    // Only auto-apply if threats haven't been manually set yet
    const allEmpty = THREAT_KEYS.every(k => formData[k] === '')
    if (allEmpty) {
      THREAT_KEYS.forEach(k => {
        updateField(k, match.defaults[k] || 'NO')
      })
      setAutoApplied(true)
    }
  }, [serviceCode]) // eslint-disable-line react-hooks/exhaustive-deps

  function applyDefaults() {
    if (!match) return
    THREAT_KEYS.forEach(k => {
      updateField(k, match.defaults[k] || 'NO')
    })
    setAutoApplied(true)
  }

  // Help panel: editable defaults
  function openEditDefaults() {
    const currentMap = getThreatDefaultsMap()
    setEditableMap(JSON.parse(JSON.stringify(currentMap)))
    setEditingDefaults(true)
  }

  function toggleEditableDefault(idx, threatKey) {
    setEditableMap(prev => {
      const next = [...prev]
      next[idx] = {
        ...next[idx],
        defaults: {
          ...next[idx].defaults,
          [threatKey]: next[idx].defaults[threatKey] === 'SI' ? 'NO' : 'SI',
        },
      }
      return next
    })
  }

  function saveEditedDefaults() {
    saveCustomDefaults(editableMap)
    setEditingDefaults(false)
    setEditableMap(null)
  }

  function resetDefaults() {
    resetCustomDefaults()
    setEditingDefaults(false)
    setEditableMap(null)
  }

  return (
    <div className="section">
      <h2 className="section-title">PASO 2 - Identificacion de Amenazas y Evaluacion</h2>

      {/* 2.1 */}
      <div className="subsection">
        <h3 className="subsection-title">2.1. Identificar posibles amenazas a la independencia</h3>
        <div className="form-group">
          <label>Si no es una incompatibilidad o prohibicion, indicar las posibles amenazas a la independencia y explicar por que se consideran como tales.</label>
          <span className="hint">
            Si la situacion analizada no es una causa de incompatibilidad o prohibicion, segun los pasos 1.2 y 1.6 anteriores, indicar las amenazas al cumplimiento del deber de independencia, incluidas las originadas por la existencia de conflictos de intereses, que el servicio o la situacion concreta genera y las razones para considerar su existencia. Caso de no identificar amenazas a la independencia, indicar para cada tipo de amenaza por que no aplica y concluir al respecto.
          </span>
        </div>

        <div className="form-group">
          <label>Descripcion general de las amenazas identificadas:</label>
          <textarea
            className="large"
            value={formData.step2_1_description}
            onChange={e => updateField('step2_1_description', e.target.value)}
            placeholder="Describa las amenazas identificadas o explique por que no aplican..."
          />
        </div>

        <div className="form-group">
          <div className="threat-header-row">
            <label style={{ marginBottom: 0 }}>Se ha identificado amenaza?</label>
            <div className="threat-header-actions">
              {match && (
                <button
                  className="btn-link btn-apply-defaults"
                  onClick={applyDefaults}
                  title={`Aplicar valores predeterminados para: ${match.serviceType}`}
                >
                  Aplicar predeterminados ({match.serviceType})
                </button>
              )}
              <button
                className="btn-help-icon"
                onClick={() => setShowHelp(!showHelp)}
                title="Ver tabla de amenazas predeterminadas por tipo de servicio"
              >
                ?
              </button>
            </div>
          </div>

          {autoApplied && match && (
            <div className="auto-applied-notice">
              Valores predeterminados aplicados automaticamente segun el tipo de servicio: <strong>{match.serviceType}</strong>. Puede modificarlos manualmente.
            </div>
          )}

          <div className="threat-items">
            {threats.map(t => (
              <div className="threat-item" key={t.key}>
                <span className="threat-label">{t.label}</span>
                <SiNoToggle
                  value={formData[t.key]}
                  onChange={v => {
                    updateField(t.key, v)
                    setAutoApplied(false)
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Help panel: threat defaults table */}
        {showHelp && (
          <div className="threat-help-panel">
            <div className="threat-help-header">
              <h4>Amenazas predeterminadas por tipo de servicio</h4>
              <div className="threat-help-actions">
                {!editingDefaults ? (
                  <button className="btn-link" onClick={openEditDefaults}>
                    Editar predeterminados
                  </button>
                ) : (
                  <>
                    <button className="btn btn-sm btn-primary" onClick={saveEditedDefaults}>
                      Guardar
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={resetDefaults}>
                      Restaurar originales
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={() => { setEditingDefaults(false); setEditableMap(null) }}>
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="threat-help-table-container">
              <table className="threat-defaults-table">
                <thead>
                  <tr>
                    <th>Tipo de Servicio</th>
                    {THREAT_KEYS.map(k => (
                      <th key={k} title={THREAT_LABELS[k]}>
                        {THREAT_LABELS[k].length > 15
                          ? THREAT_LABELS[k].substring(0, 12) + '...'
                          : THREAT_LABELS[k]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(editingDefaults ? editableMap : getThreatDefaultsMap()).map((entry, idx) => {
                    const isCurrentMatch = match && entry.serviceType === match.serviceType
                    return (
                      <tr key={idx} className={isCurrentMatch ? 'current-service-type' : ''}>
                        <td className="service-type-cell">
                          {entry.serviceType}
                          {isCurrentMatch && <span className="current-badge">actual</span>}
                        </td>
                        {THREAT_KEYS.map(k => (
                          <td
                            key={k}
                            className={`threat-cell ${entry.defaults[k] === 'SI' ? 'threat-si' : 'threat-no'} ${editingDefaults ? 'threat-editable' : ''}`}
                            onClick={editingDefaults ? () => toggleEditableDefault(idx, k) : undefined}
                          >
                            {entry.defaults[k]}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="threat-help-footer">
              Los valores personalizados se guardan en el navegador. Use "Restaurar originales" para volver a los valores del Excel.
            </div>
          </div>
        )}

        {!hasAnyThreat && threats.every(t => formData[t.key] !== '') && (
          <div className="nav-info">
            No se han identificado amenazas. Se pasara directamente al Paso 4 (Conclusion Final).
          </div>
        )}
        {hasAnyThreat && (
          <div className="nav-info">
            Se han identificado amenazas. Continuar con la evaluacion en el paso 2.2.
          </div>
        )}
      </div>

      {/* 2.2 - Show if threats identified */}
      {hasAnyThreat && (
        <div className="subsection">
          <h3 className="subsection-title">2.2. Evaluar la importancia de las amenazas identificadas</h3>
          <div className="form-group">
            <label>Evaluar la importancia de las amenazas a la independencia identificadas en el paso 2.1 anterior.</label>
            <span className="hint">
              Para cada amenaza a la independencia identificada en el paso 2.1 anterior, documentar el analisis de las evaluaciones realizadas y las conclusiones alcanzadas respecto a si las mismas son significativas o no, indicando los factores considerados y las razones por las que se ha alcanzado para cada amenaza evaluada una conclusion u otra (art. 42.1 y 42.2 RLAC).
              {'\n\n'}NOTA: En la evaluacion sobre la significatividad de la amenaza el equipo tiene que considerar y explicar si las decisiones que toma la entidad auditada derivadas del objeto del SDA tienen un impacto significativo en los EEFF y, en dicho caso, si los resultados, juicios y criterios emitidos por el equipo pueden tener efecto significativo en dichas decisiones.
            </span>
            <textarea
              className="large"
              value={formData.step2_2_evaluation}
              onChange={e => updateField('step2_2_evaluation', e.target.value)}
              placeholder="Documente la evaluacion de la importancia de cada amenaza identificada..."
            />
          </div>

          <div className="step-description">
            Si se ha evaluado alguna amenaza como significativa, pasar al Paso 3.
            Si se ha concluido que ninguna de las amenazas es significativa, pasar directamente al Paso 4.
          </div>
        </div>
      )}
    </div>
  )
}

export default Step2Section
