function SignatureSection({ formData, updateField }) {
  return (
    <div className="section">
      <h2 className="section-title">Firmas</h2>

      <div className="signature-group">
        <label>Fecha del analisis</label>
        <div className="form-group">
          <input
            type="date"
            value={formData.analysisDate}
            onChange={e => updateField('analysisDate', e.target.value)}
          />
        </div>
      </div>

      <div className="signature-group">
        <label>Firma del socio responsable de la auditoria</label>
        <div className="form-group">
          <input
            type="text"
            value={formData.auditPartnerSignature}
            onChange={e => updateField('auditPartnerSignature', e.target.value)}
            placeholder="Nombre del firmante"
          />
        </div>
      </div>

      <div style={{ margin: '24px 0', padding: '16px', background: '#f0f2f5', borderRadius: 8 }}>
        <h3 className="section-subtitle" style={{ margin: '0 0 16px 0' }}>
          Firma del socio responsable del servicio distinto al de auditoria
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: 16 }}>
          Aceptando la descripcion del servicio y, en su caso, las conclusiones y medidas de salvaguarda a aplicar.
        </p>

        <div className="signature-group">
          <label>Fecha</label>
          <div className="form-group">
            <input
              type="date"
              value={formData.sdaPartnerDate}
              onChange={e => updateField('sdaPartnerDate', e.target.value)}
            />
          </div>
        </div>

        <div className="signature-group">
          <label>Firma del socio responsable del SDA</label>
          <div className="form-group">
            <input
              type="text"
              value={formData.sdaPartnerSignature}
              onChange={e => updateField('sdaPartnerSignature', e.target.value)}
              placeholder="Nombre del firmante"
            />
          </div>
        </div>

        <div className="signature-group">
          <label>Firma del socio responsable de los servicios distintos a los de auditoria</label>
          <div className="form-group">
            <input
              type="text"
              value={formData.sdaResponsibleSignature}
              onChange={e => updateField('sdaResponsibleSignature', e.target.value)}
              placeholder="Nombre del firmante"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignatureSection
