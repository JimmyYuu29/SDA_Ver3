import SiNoToggle from './SiNoToggle'

function Step1Section({ formData, updateField }) {
  const { step1_2_answer, step1_3_answer, step1_4_answer, step1_5_answer } = formData

  // Determine which substeps to show based on navigation logic
  const show1_3 = step1_2_answer === 'SI'
  const show1_4 = show1_3 && step1_3_answer === 'NO'
  const show1_5 = show1_4 && step1_4_answer === 'NO'
  const show1_6 = show1_5 && step1_5_answer === 'NO'

  // Also show if 1.2 is NO (not an incompatibility), skip to 1.6 directly
  const show1_6_direct = step1_2_answer === 'NO'

  return (
    <div className="section">
      <h2 className="section-title">PASO 1 - Identificacion de Amenazas a la Independencia</h2>

      {/* 1.1 */}
      <div className="subsection">
        <h3 className="subsection-title">1.1. Identificacion del servicio o situacion</h3>
        <div className="form-group">
          <label>Describir el conflicto de intereses o la relacion comercial, financiera, laboral, familiar o de otra clase, incluidos servicios ajenos a la auditoria proporcionados o a proporcionar a la entidad auditada que pudieran generar una amenaza a la independencia.</label>
          <span className="hint">
            Considerar las relaciones de familiares y personas o entidades relacionadas (incluye red) con el auditor de cuentas o sociedad de auditoria (firma de auditoria). Caso de ser un cliente de auditoria de cuentas potencial, considerar el periodo de vigencia de las incompatibilidades estipulado en el articulo 21 de la LAC (art. 59 RLAC) y, en su caso, en el articulo 5.1 del RUE para la prestacion de servicios ajenos a la auditoria de EIP.
          </span>
          <textarea
            className="large"
            value={formData.step1_1_description}
            onChange={e => updateField('step1_1_description', e.target.value)}
            placeholder="Describa el servicio o situacion..."
          />
        </div>
      </div>

      {/* 1.2 */}
      <div className="subsection">
        <h3 className="subsection-title">1.2. Es una de las incompatibilidades o prohibiciones?</h3>
        <div className="form-group">
          <label>Es una de las incompatibilidades o prohibiciones resultantes de los articulos 14, 15.2, 16 a 20, 23, 24.1, 25 y, para EIP, los arts. 39 a 41 de la LAC y los arts. 4, 5, 17 y 41 del RUE?</label>
          <span className="hint">
            ¿Se trata de alguno de los servicios indicados en el art. 16.1.b) de la LAC que, pudiendo ser una causa de incompatibilidad, la legislación permite aplicar medidas de salvaguarda y determina las mismas, para que no sea considerada como tal? Ver el artículo 16.1.b) 2º, 3º, 4º y 5º de la LAC.
          </span>
          <SiNoToggle
            value={formData.step1_2_answer}
            onChange={v => updateField('step1_2_answer', v)}
          />
          {step1_2_answer === 'SI' && (
            <div className="nav-info">
              Se trata de una incompatibilidad o prohibicion. Continuar con el analisis en los pasos 1.3 a 1.6.
            </div>
          )}
          {step1_2_answer === 'NO' && (
            <div className="nav-info">
              No es una incompatibilidad o prohibicion. Pasar al paso 1.6 para confirmar, y luego al Paso 2.
            </div>
          )}
        </div>
      </div>

      {/* 1.3 - Show if 1.2 is SI */}
      {show1_3 && (
        <div className="subsection">
          <h3 className="subsection-title">1.3. Caso de prestarse a una entidad auditada que no es EIP alguno de los servicios indicados en el artículo 16.1.b) 2º, 3º, 4º y 5º de la LAC, indicar si se dispone de, o se pueden aplicar, las medidas de salvaguarda requeridas por la legislación</h3>
          <div className="form-group">
            <label>¿Se trata de alguno de los servicios indicados en el art. 16.1.b) de la LAC que, pudiendo ser una causa de incompatibilidad, la legislación permite aplicar medidas de salvaguarda y determina las mismas, para que no sea considerada como tal? Ver el artículo 16.1.b) 2º, 3º, 4º y 5º de la LAC.</label>
            <span className="hint">
              Dar detalle, en su caso, de las medidas de salvaguarda requeridas por la legislacion de que se disponga o que se vayan a aplicar para que la situacion analizada deje de considerarse una causa de incompatibilidad, o, si no se considera adecuado o posible aplicarlas, concluir que la independencia del auditor se ve comprometida.
            </span>
            <SiNoToggle
              value={formData.step1_3_answer}
              onChange={v => updateField('step1_3_answer', v)}
            />
            {step1_3_answer === 'SI' && (
              <>
                <div className="nav-info">
                  Analizar segun se indica y pasar al Paso 4 (Conclusion Final).
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label>Detalle de las medidas de salvaguarda:</label>
                  <textarea
                    value={formData.step1_3_detail}
                    onChange={e => updateField('step1_3_detail', e.target.value)}
                    placeholder="Describa las medidas de salvaguarda aplicadas o a aplicar..."
                  />
                </div>
              </>
            )}
            {step1_3_answer === 'NO' && (
              <div className="nav-info">Pasar al paso 1.4.</div>
            )}
          </div>
        </div>
      )}

      {/* 1.4 - Show if 1.3 is NO */}
      {show1_4 && (
        <div className="subsection">
          <h3 className="subsection-title">1.4. Caso de prestarse a una empresa constituida en un tercer país y controlada por la EIP auditada alguno de los servicios indicados en el artículo 5.5 b) del RUE, indicar si se dispone de, o se pueden aplicar, medidas de salvaguarda que mitiguen las correspondientes amenazas</h3>
          <div className="form-group">
            <label>¿La situación analizada consiste en la prestación de servicios ajenos a los de auditoría a los que se refiere el artículo 5.1, párrafo segundo, del RUE (excepto los de las letras b) c) y e)) a una empresa constituida en un tercer país y controlada por la EIP auditada, en la que la norma establece que se generan amenazas significativas que afectan a la independencia del auditor de cuentas y requieren por tanto la adopción de medidas de salvaguarda que mitiguen las correspondientes amenazas. (Ver artículo 5.5 del RUE)?</label>
            <span className="hint">
              Dar detalle de las amenazas que genera el servicio, de las razones para considerar su existencia, de las medidas de salvaguarda de que se disponga o que se vayan a aplicar y del analisis y las conclusiones alcanzadas. De acuerdo con el articulo 42 RLAC la mera enumeracion de las medidas de salvaguarda no es documentacion suficiente.
            </span>
            <SiNoToggle
              value={formData.step1_4_answer}
              onChange={v => updateField('step1_4_answer', v)}
            />
            {step1_4_answer === 'SI' && (
              <>
                <div className="nav-info">
                  Analizar segun se indica y pasar al Paso 4 (Conclusion Final).
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label>Detalle del analisis:</label>
                  <textarea
                    value={formData.step1_4_detail}
                    onChange={e => updateField('step1_4_detail', e.target.value)}
                    placeholder="Describa las amenazas y medidas de salvaguarda..."
                  />
                </div>
              </>
            )}
            {step1_4_answer === 'NO' && (
              <div className="nav-info">Pasar al paso 1.5.</div>
            )}
          </div>
        </div>
      )}

      {/* 1.5 - Show if 1.4 is NO */}
      {show1_5 && (
        <div className="subsection">
          <h3 className="subsection-title">1.5. Participacion en la gestion o toma de decisiones (art. 14.2 LAC y 37 RLAC)</h3>
          <div className="form-group">
            <label>Se trata de una situacion o servicio que implica participacion en la gestion o toma de decisiones?</label>
            <span className="hint">
              Evaluar si el servicio o la situacion implica de alguna forma participar en la gestion o toma de decisiones y, si es el caso, si es posible adoptar medidas que hagan que no se caiga en la prohibicion. Documentar el analisis y las conclusiones alcanzadas.
            </span>
            <SiNoToggle
              value={formData.step1_5_answer}
              onChange={v => updateField('step1_5_answer', v)}
            />
            {step1_5_answer === 'SI' && (
              <>
                <div className="nav-info">
                  Concluir y pasar al Paso 4 (Conclusion Final).
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label>Detalle del analisis:</label>
                  <textarea
                    value={formData.step1_5_detail}
                    onChange={e => updateField('step1_5_detail', e.target.value)}
                    placeholder="Describa el analisis sobre participacion en la gestion..."
                  />
                </div>
              </>
            )}
            {step1_5_answer === 'NO' && (
              <div className="nav-info">Pasar al paso 1.6.</div>
            )}
          </div>
        </div>
      )}

      {/* 1.6 - Show if 1.5 is NO, or if 1.2 is NO directly */}
      {(show1_6 || show1_6_direct) && (
        <div className="subsection">
          <h3 className="subsection-title">1.6. Es una de las incompatibilidades o prohibiciones absolutas?</h3>
          <div className="form-group">
            <label>En base a lo anterior, concluir si estamos ante una de las incompatibilidades o prohibiciones absolutas porque no se contemplan medidas de salvaguarda.</label>
            <span className="hint">
              Concluir si estamos ante una de las incompatibilidades o prohibiciones absolutas porque no se contemplan medidas de salvaguarda y, por lo tanto no se ha analizado ni en el paso 1.3 ni en el paso 1.4.
            </span>
            <SiNoToggle
              value={formData.step1_6_answer}
              onChange={v => updateField('step1_6_answer', v)}
            />
            {formData.step1_6_answer === 'SI' && (
              <div className="nav-info">
                Es una incompatibilidad absoluta. Pasar al Paso 4 (Conclusion Final).
              </div>
            )}
            {formData.step1_6_answer === 'NO' && (
              <>
                <div className="nav-info">
                  No es una incompatibilidad absoluta. Pasar al Paso 2 para identificar amenazas.
                </div>
                <div className="form-group" style={{ marginTop: 12 }}>
                  <label>Detalle/comentarios adicionales:</label>
                  <textarea
                    value={formData.step1_6_detail}
                    onChange={e => updateField('step1_6_detail', e.target.value)}
                    placeholder="Comentarios adicionales (opcional)..."
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Step1Section
