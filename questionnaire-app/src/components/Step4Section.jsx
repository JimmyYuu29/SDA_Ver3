import { useMemo } from 'react'

const CONCLUSIONS = [
  {
    id: 'conclusion_1',
    text: 'Estamos ante a) una incompatibilidad o prohibicion absoluta (ver paso 1.6 anterior), o b) ante una incompatibilidad o prohibicion para la que, aun estableciendo la norma posibles salvaguardas, no se puede o no se considera adecuado aplicarlas (ver paso 1.3), o c) se trata de uno de los servicios del articulo 5.1 del RUE que se pretende prestar a una controlada fuera de la UE y no se dispone de salvaguardas adecuadas o no se considera adecuado aplicarlas (ver paso 1.4), o d) la situacion o servicio implica participacion en la gestion o toma de decisiones (ver paso 1.5). Por lo tanto, la independencia del auditor se ve comprometida, por lo que se ha decidido no entrar en la situacion o prestar el servicio para poder continuar con el encargo de auditoria.',
  },
  {
    id: 'conclusion_2',
    text: 'Estamos ante una incompatibilidad o prohibicion ya producidas (ver pasos 1.3, 1.4, 1.5 y 1.6 anteriores) y, por lo tanto, la independencia del auditor se ha visto comprometida, por lo que se procedera a renunciar continuar con el encargo de auditoria de acuerdo con el articulo 5.2 de la LAC y 10 del RLAC.',
  },
  {
    id: 'conclusion_3',
    text: 'Estamos ante una incompatibilidad o prohibicion para la que la norma establece las salvaguardas a aplicar y estas se han aplicado adecuadamente y, por lo tanto, no hay riesgo de falta de independencia (ver paso 1.3).',
  },
  {
    id: 'conclusion_4',
    text: 'Se trata de uno de los servicios del articulo 5.1 del RUE que se pretende prestar a una controlada fuera de la UE y se han podido aplicar medidas de salvaguarda que eliminan o reducen la importancia de las amenazas significativas generadas por el servicio a un nivel aceptablemente bajo y, por lo tanto, no hay riesgo de falta de independencia (ver paso 1.4 anterior).',
  },
  {
    id: 'conclusion_5',
    text: 'La situacion o servicio cumple con los requerimientos de los parrafos segundo y tercero del articulo 37.2 RLAC para no ser considerado participacion en la gestion o toma de decisiones y, por lo tanto, no hay riesgo de falta de independencia (ver paso 1.5 anterior).',
  },
  {
    id: 'conclusion_6',
    text: 'Segun se muestra en los pasos 1.2 y 1.6, esta situacion no constituye una incompatibilidad o prohibicion, pero en el paso 2.2 anterior, se han identificado amenazas significativas y no se han podido aplicar medidas de salvaguarda que las eliminen o que reduzcan el riesgo de falta de independencia a un nivel aceptablemente bajo y, por lo tanto, la independencia del auditor resulta comprometida.',
  },
  {
    id: 'conclusion_7',
    text: 'Segun se muestra en los pasos 1.2 y 1.6, esta situacion no constituye una incompatibilidad o prohibicion y en los pasos 2.2 y 3 anteriores, se han identificado amenazas significativas y se han podido aplicar medidas de salvaguarda que las eliminan o que reducen la importancia de las amenazas identificadas a un nivel aceptablemente bajo y, por lo tanto, no hay riesgo de falta de independencia.',
  },
  {
    id: 'conclusion_8',
    text: 'Segun se muestra en los pasos 2.1 o 2.2 anteriores, no se han identificado amenazas a la independencia o las que se han identificado no son significativas. Por lo tanto, no hay riesgo de falta de independencia y, de acuerdo con el articulo 15.1 de la LAC y 41.1 del RLAC, no es necesario el establecimiento de medidas de salvaguarda.',
  },
]

// Compute a recommended conclusion based on previous step answers
function getRecommendation(formData) {
  const { step1_2_answer, step1_3_answer, step1_4_answer, step1_5_answer, step1_6_answer } = formData

  // Path: 1.2=SI, 1.3=SI → Option 3 (safeguards from legislation applied)
  if (step1_2_answer === 'SI' && step1_3_answer === 'SI') {
    return {
      conclusion: 'conclusion_3',
      option: 3,
      reasons: [
        'Paso 1.2: Es una incompatibilidad o prohibicion (SI)',
        'Paso 1.3: Se dispone de las salvaguardas requeridas por la legislacion y se han aplicado adecuadamente (SI)',
      ],
    }
  }

  // Path: 1.2=SI, 1.3=NO, 1.4=SI → Option 4 (Art 5.1 RUE with safeguards)
  if (step1_2_answer === 'SI' && step1_3_answer === 'NO' && step1_4_answer === 'SI') {
    return {
      conclusion: 'conclusion_4',
      option: 4,
      reasons: [
        'Paso 1.2: Es una incompatibilidad o prohibicion (SI)',
        'Paso 1.3: No se dispone de salvaguardas legales aplicables (NO)',
        'Paso 1.4: Servicio Art. 5.1 RUE a controlada fuera de la UE con salvaguardas adecuadas (SI)',
      ],
    }
  }

  // Path: 1.2=SI, 1.3=NO, 1.4=NO, 1.5=SI → Option 5 (meets Art 37.2 RLAC)
  if (step1_2_answer === 'SI' && step1_3_answer === 'NO' && step1_4_answer === 'NO' && step1_5_answer === 'SI') {
    return {
      conclusion: 'conclusion_5',
      option: 5,
      reasons: [
        'Paso 1.2: Es una incompatibilidad o prohibicion (SI)',
        'Paso 1.5: Cumple requisitos del Art. 37.2 RLAC para no ser considerado participacion en la gestion (SI)',
      ],
    }
  }

  // Path: 1.6=SI → Option 1 (absolute prohibition, don't enter)
  if (step1_6_answer === 'SI') {
    const reasons = []
    if (step1_2_answer === 'SI') {
      reasons.push('Paso 1.2: Es una incompatibilidad o prohibicion (SI)')
    } else if (step1_2_answer === 'NO') {
      reasons.push('Paso 1.2: No es una incompatibilidad formal (NO)')
    }
    reasons.push('Paso 1.6: Es una incompatibilidad o prohibicion absoluta sin salvaguardas posibles (SI)')
    return {
      conclusion: 'conclusion_1',
      option: 1,
      reasons,
    }
  }

  // Path: 1.6=NO → went through Step 2 (and possibly Step 3)
  if (step1_6_answer === 'NO') {
    const threatKeys = [
      'threat_selfInterest', 'threat_selfReview', 'threat_decisionMaking',
      'threat_advocacy', 'threat_familiarity', 'threat_intimidation',
    ]
    const hasThreats = threatKeys.some(k => formData[k] === 'SI')

    let hasMeasures = false
    if (formData.step3_measures) {
      try {
        const parsed = JSON.parse(formData.step3_measures)
        hasMeasures = Array.isArray(parsed) && parsed.length > 0
      } catch {
        hasMeasures = typeof formData.step3_measures === 'string' && formData.step3_measures.trim().length > 0
      }
    }

    // No threats → Option 8
    if (!hasThreats) {
      return {
        conclusion: 'conclusion_8',
        option: 8,
        reasons: [
          'Paso 1.6: No es una incompatibilidad o prohibicion absoluta (NO)',
          'Paso 2: No se han identificado amenazas significativas a la independencia',
        ],
      }
    }

    // Threats with safeguards → Option 7
    if (hasThreats && hasMeasures) {
      return {
        conclusion: 'conclusion_7',
        option: 7,
        reasons: [
          'Paso 1.6: No es una incompatibilidad o prohibicion absoluta (NO)',
          'Paso 2: Se han identificado amenazas significativas',
          'Paso 3: Se han aplicado medidas de salvaguarda',
        ],
      }
    }

    // Threats without safeguards → Option 6
    if (hasThreats && !hasMeasures) {
      return {
        conclusion: 'conclusion_6',
        option: 6,
        reasons: [
          'Paso 1.6: No es una incompatibilidad o prohibicion absoluta (NO)',
          'Paso 2: Se han identificado amenazas significativas',
          'Paso 3: No se han aplicado medidas de salvaguarda adecuadas',
        ],
      }
    }
  }

  return null
}

function Step4Section({ formData, updateField }) {
  const recommendation = useMemo(() => getRecommendation(formData), [
    formData.step1_2_answer,
    formData.step1_3_answer,
    formData.step1_4_answer,
    formData.step1_5_answer,
    formData.step1_6_answer,
    formData.threat_selfInterest,
    formData.threat_selfReview,
    formData.threat_decisionMaking,
    formData.threat_advocacy,
    formData.threat_familiarity,
    formData.threat_intimidation,
    formData.step3_measures,
  ])

  const isCustom = formData.step4_conclusion === 'conclusion_custom'

  return (
    <div className="section">
      <h2 className="section-title">PASO 4 - Conclusion Final</h2>

      <div className="step-description">
        Concluir, en base al analisis anterior, sobre el nivel de riesgo de falta de independencia y, por lo tanto, si la independencia de la firma de auditoria resulta o no comprometida (articulo 15 de la LAC y arts. 39 a 42 del RLAC).
      </div>

      {/* Recommendation hint based on previous answers */}
      {recommendation && (
        <div className="recommendation-box">
          <div className="recommendation-header">
            <span className="recommendation-icon">💡</span>
            <span className="recommendation-title">Sugerencia basada en el analisis previo: <strong>Opcion {recommendation.option}</strong></span>
          </div>
          <div className="recommendation-reasons">
            <span className="recommendation-reasons-label">Basado en las siguientes respuestas:</span>
            <ul className="recommendation-reasons-list">
              {recommendation.reasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>
          <div className="recommendation-note">
            Esta sugerencia es solo orientativa. Seleccione la conclusion que considere mas adecuada segun su analisis profesional.
          </div>
        </div>
      )}

      <div className="warning-box">
        Solo se puede seleccionar una opcion. Seleccione la conclusion que corresponda segun el analisis realizado.
      </div>

      <div className="radio-group">
        {CONCLUSIONS.map((c, idx) => {
          const isRecommended = recommendation && recommendation.conclusion === c.id
          return (
            <label
              key={c.id}
              className={`radio-option${formData.step4_conclusion === c.id ? ' selected' : ''}${isRecommended ? ' recommended' : ''}`}
            >
              <input
                type="radio"
                name="conclusion"
                value={c.id}
                checked={formData.step4_conclusion === c.id}
                onChange={() => updateField('step4_conclusion', c.id)}
              />
              <span className="radio-label">
                <strong>Opcion {idx + 1}:</strong>
                {isRecommended && <span className="recommended-badge">Sugerida</span>}
                {' '}{c.text}
              </span>
            </label>
          )
        })}

        {/* Opción 9 - Custom conclusion */}
        <label
          className={`radio-option${isCustom ? ' selected' : ''}`}
        >
          <input
            type="radio"
            name="conclusion"
            value="conclusion_custom"
            checked={isCustom}
            onChange={() => updateField('step4_conclusion', 'conclusion_custom')}
          />
          <span className="radio-label">
            <strong>Opcion 9:</strong> Otra conclusion (introducir manualmente).
          </span>
        </label>
        {isCustom && (
          <div className="custom-conclusion-input">
            <textarea
              className="large"
              value={formData.step4_conclusion_custom || ''}
              onChange={e => updateField('step4_conclusion_custom', e.target.value)}
              placeholder="Introduzca su conclusion personalizada..."
            />
          </div>
        )}
      </div>
    </div>
  )
}

export { CONCLUSIONS }
export default Step4Section
