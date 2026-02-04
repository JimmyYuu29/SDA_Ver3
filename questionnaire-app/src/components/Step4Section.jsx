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

function Step4Section({ formData, updateField }) {
  return (
    <div className="section">
      <h2 className="section-title">PASO 4 - Conclusion Final</h2>

      <div className="step-description">
        Concluir, en base al analisis anterior, sobre el nivel de riesgo de falta de independencia y, por lo tanto, si la independencia de la firma de auditoria resulta o no comprometida (articulo 15 de la LAC y arts. 39 a 42 del RLAC).
      </div>

      <div className="warning-box">
        Solo se puede seleccionar una opcion. Seleccione la conclusion que corresponda segun el analisis realizado.
      </div>

      <div className="radio-group">
        {CONCLUSIONS.map((c, idx) => (
          <label
            key={c.id}
            className={`radio-option${formData.step4_conclusion === c.id ? ' selected' : ''}`}
          >
            <input
              type="radio"
              name="conclusion"
              value={c.id}
              checked={formData.step4_conclusion === c.id}
              onChange={() => updateField('step4_conclusion', c.id)}
            />
            <span className="radio-label">
              <strong>Opcion {idx + 1}:</strong> {c.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export { CONCLUSIONS }
export default Step4Section
