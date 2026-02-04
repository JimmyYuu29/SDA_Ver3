import { useState, useMemo } from 'react'
import { THREAT_KEYS, THREAT_LABELS } from '../data/threatDefaults'
import { getSafeguardExamples, SAFEGUARD_LEVEL_LABELS } from '../data/safeguardExamples'

/**
 * step3_measures is stored as a JSON string in formData.
 * It represents an array of safeguard items:
 * [
 *   { id: string, text: string, source: 'preset' | 'manual', level?: string, threatKey?: string }
 * ]
 */

function parseMeasures(raw) {
  if (!raw) return []
  try {
    const arr = JSON.parse(raw)
    if (Array.isArray(arr)) return arr
  } catch {
    // Legacy: if it's a plain string, convert to single manual item
    if (typeof raw === 'string' && raw.trim()) {
      return [{ id: 'legacy_1', text: raw, source: 'manual' }]
    }
  }
  return []
}

function serializeMeasures(items) {
  return JSON.stringify(items)
}

let _idCounter = Date.now()
function genId() {
  return 'sg_' + (++_idCounter)
}

function Step3Section({ formData, updateField }) {
  const [expandedThreats, setExpandedThreats] = useState({})
  const [manualInput, setManualInput] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const measures = useMemo(() => parseMeasures(formData.step3_measures), [formData.step3_measures])

  function setMeasures(newItems) {
    updateField('step3_measures', serializeMeasures(newItems))
  }

  // Active threats
  const activeThreats = useMemo(() => {
    return THREAT_KEYS.filter(k => formData[k] === 'SI')
  }, [formData])

  // Safeguard examples per active threat
  const safeguardsByThreat = useMemo(() => {
    const result = {}
    for (const key of activeThreats) {
      const examples = getSafeguardExamples(key)
      if (examples.length > 0) {
        result[key] = examples
      }
    }
    return result
  }, [activeThreats])

  // Check if a preset safeguard text is already added
  const addedTexts = useMemo(() => new Set(measures.map(m => m.text)), [measures])

  function toggleThreatExpansion(key) {
    setExpandedThreats(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function addPresetSafeguard(text, level, threatKey) {
    if (addedTexts.has(text)) return // already added
    const newItem = { id: genId(), text, source: 'preset', level: level || null, threatKey: threatKey || null }
    setMeasures([...measures, newItem])
  }

  function removePresetSafeguard(text) {
    setMeasures(measures.filter(m => m.text !== text))
  }

  function togglePresetSafeguard(text, level, threatKey) {
    if (addedTexts.has(text)) {
      removePresetSafeguard(text)
    } else {
      addPresetSafeguard(text, level, threatKey)
    }
  }

  function addManualSafeguard() {
    const trimmed = manualInput.trim()
    if (!trimmed) return
    const newItem = { id: genId(), text: trimmed, source: 'manual' }
    setMeasures([...measures, newItem])
    setManualInput('')
  }

  function removeMeasure(id) {
    setMeasures(measures.filter(m => m.id !== id))
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditText(item.text)
  }

  function saveEdit(id) {
    const trimmed = editText.trim()
    if (!trimmed) {
      removeMeasure(id)
    } else {
      setMeasures(measures.map(m => m.id === id ? { ...m, text: trimmed } : m))
    }
    setEditingId(null)
    setEditText('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditText('')
  }

  function moveMeasure(id, direction) {
    const idx = measures.findIndex(m => m.id === id)
    if (idx < 0) return
    const newIdx = idx + direction
    if (newIdx < 0 || newIdx >= measures.length) return
    const newItems = [...measures]
    const temp = newItems[idx]
    newItems[idx] = newItems[newIdx]
    newItems[newIdx] = temp
    setMeasures(newItems)
  }

  function getLevelBadgeClass(level) {
    if (level === 'firma') return 'badge-firma'
    if (level === 'situacion') return 'badge-situacion'
    if (level === 'entidad') return 'badge-entidad'
    return ''
  }

  return (
    <div className="section">
      <h2 className="section-title">PASO 3 - Medidas de Salvaguarda a Aplicar</h2>

      <div className="step-description">
        Si se han identificado amenazas a la independencia que se consideran significativas, se deben establecer y aplicar las medidas de salvaguarda necesarias para eliminar las amenazas o, en su caso, para reducir a un nivel aceptablemente bajo el riesgo de falta de independencia:
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>Eliminando las circunstancias que estan originando las amenazas;</li>
          <li>Aplicando otras medidas de salvaguarda, cuando esten disponibles y exista la posibilidad de aplicarlas, para eliminar o reducir las amenazas a un nivel aceptablemente bajo, o</li>
          <li>Absteniendose de realizar la auditoria (art. 5.2 LAC y 10 RLAC).</li>
        </ul>
      </div>

      {/* Safeguard suggestions by threat */}
      {activeThreats.length > 0 && Object.keys(safeguardsByThreat).length > 0 && (
        <div className="subsection">
          <h3 className="subsection-title">Ejemplos de salvaguardas por amenaza identificada</h3>
          <p className="safeguard-intro">
            Haga clic en las salvaguardas para agregarlas o quitarlas de la lista de medidas.
          </p>

          <div className="safeguard-threat-list">
            {activeThreats.map(threatKey => {
              const entries = safeguardsByThreat[threatKey]
              if (!entries) return null
              const isExpanded = expandedThreats[threatKey]

              return (
                <div key={threatKey} className="safeguard-threat-group">
                  <div
                    className={`safeguard-threat-header ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleThreatExpansion(threatKey)}
                  >
                    <span className="safeguard-threat-arrow">{isExpanded ? '\u25BC' : '\u25B6'}</span>
                    <span className="safeguard-threat-name">{THREAT_LABELS[threatKey]}</span>
                    <span className="safeguard-threat-count">
                      {entries.reduce((sum, e) => sum + e.salvaguardas.length, 0)} ejemplos
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="safeguard-entries">
                      {entries.map((entry, eIdx) => (
                        <div key={eIdx} className="safeguard-entry">
                          {entry.situacion && (
                            <div className="safeguard-situation">
                              <span className="situation-label">Situacion:</span> {entry.situacion}
                            </div>
                          )}
                          {!entry.situacion && entry.salvaguardas.length > 0 && (
                            <div className="safeguard-situation safeguard-general">
                              Salvaguardas generales
                            </div>
                          )}
                          {entry.salvaguardas.length > 0 && (
                            <div className="safeguard-options">
                              {entry.salvaguardas.map((s, sIdx) => {
                                const isAdded = addedTexts.has(s.text)
                                return (
                                  <div
                                    key={sIdx}
                                    className={`safeguard-option ${isAdded ? 'selected' : ''}`}
                                    onClick={() => togglePresetSafeguard(s.text, s.level, threatKey)}
                                  >
                                    <div className="safeguard-option-check">
                                      {isAdded ? '\u2611' : '\u2610'}
                                    </div>
                                    <div className="safeguard-option-content">
                                      <span className={`safeguard-level-badge ${getLevelBadgeClass(s.level)}`}>
                                        {SAFEGUARD_LEVEL_LABELS[s.level]}
                                      </span>
                                      <span className="safeguard-text">{s.text}</span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Detalle: individual safeguard items */}
      <div className="subsection">
        <div className="form-group">
          <label>Detalle de las medidas de salvaguarda a aplicar</label>
          <span className="hint">
            Para cada amenaza identificada como significativa en el PASO 2 anterior, documentar el detalle de las medidas de salvaguarda a aplicar y el analisis y las conclusiones alcanzadas sobre como se ha eliminado cada una de las amenazas o, en su caso, reducido a un nivel aceptablemente bajo el riesgo de falta de independencia (art. 42.1 RLAC). De acuerdo con el articulo 42 RLAC la mera enumeracion de las medidas de salvaguarda no es documentacion suficiente de como se elimina o reduce la significatividad de una amenaza.
          </span>
        </div>

        {/* Safeguard items list */}
        {measures.length > 0 && (
          <div className="measures-list">
            {measures.map((item, idx) => (
              <div key={item.id} className={`measure-card ${item.source === 'preset' ? 'measure-preset' : 'measure-manual'}`}>
                <div className="measure-card-header">
                  <span className="measure-number">{idx + 1}</span>
                  {item.source === 'preset' && item.level && (
                    <span className={`safeguard-level-badge ${getLevelBadgeClass(item.level)}`}>
                      {SAFEGUARD_LEVEL_LABELS[item.level]}
                    </span>
                  )}
                  {item.source === 'preset' && item.threatKey && (
                    <span className="measure-threat-tag">
                      {THREAT_LABELS[item.threatKey]}
                    </span>
                  )}
                  {item.source === 'manual' && (
                    <span className="measure-source-tag manual-tag">Manual</span>
                  )}
                  <div className="measure-card-actions">
                    <button
                      className="measure-btn measure-btn-move"
                      onClick={() => moveMeasure(item.id, -1)}
                      disabled={idx === 0}
                      title="Mover arriba"
                    >&uarr;</button>
                    <button
                      className="measure-btn measure-btn-move"
                      onClick={() => moveMeasure(item.id, 1)}
                      disabled={idx === measures.length - 1}
                      title="Mover abajo"
                    >&darr;</button>
                    <button
                      className="measure-btn measure-btn-edit"
                      onClick={() => startEdit(item)}
                      title="Editar"
                    >&#9998;</button>
                    <button
                      className="measure-btn measure-btn-delete"
                      onClick={() => removeMeasure(item.id)}
                      title="Eliminar"
                    >&times;</button>
                  </div>
                </div>
                {editingId === item.id ? (
                  <div className="measure-edit-area">
                    <textarea
                      className="measure-edit-textarea"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={4}
                    />
                    <div className="measure-edit-actions">
                      <button className="btn btn-sm btn-primary" onClick={() => saveEdit(item.id)}>Guardar</button>
                      <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="measure-card-text">{item.text}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {measures.length === 0 && (
          <div className="measures-empty">
            No se han agregado medidas de salvaguarda. Seleccione de los ejemplos anteriores o agregue manualmente.
          </div>
        )}

        {/* Manual add */}
        <div className="measure-add-manual">
          <textarea
            className="measure-add-textarea"
            value={manualInput}
            onChange={e => setManualInput(e.target.value)}
            placeholder="Escriba una nueva medida de salvaguarda..."
            rows={3}
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={addManualSafeguard}
            disabled={!manualInput.trim()}
          >
            + Agregar salvaguarda
          </button>
        </div>

        {measures.length > 0 && (
          <div className="measures-summary">
            Total: {measures.length} medida{measures.length !== 1 ? 's' : ''} de salvaguarda
            ({measures.filter(m => m.source === 'preset').length} predefinida{measures.filter(m => m.source === 'preset').length !== 1 ? 's' : ''},
            {' '}{measures.filter(m => m.source === 'manual').length} manual{measures.filter(m => m.source === 'manual').length !== 1 ? 'es' : ''})
          </div>
        )}
      </div>
    </div>
  )
}

export default Step3Section
