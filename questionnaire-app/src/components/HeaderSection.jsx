import SiNoToggle from './SiNoToggle'

function HeaderSection({ formData, updateField }) {
  return (
    <div className="section">
      <h2 className="section-title">Informacion General</h2>

      <div className="form-group">
        <label>NOMBRE de la Entidad Auditada</label>
        <input
          type="text"
          value={formData.entityName}
          onChange={e => updateField('entityName', e.target.value)}
          placeholder="Introduzca el nombre de la entidad auditada"
        />
      </div>

      <div className="form-group">
        <label>NOMBRE DEL AUDITOR DE CUENTAS RESPONSABLE (FIRMANTE)</label>
        <input
          type="text"
          value={formData.auditorName}
          onChange={e => updateField('auditorName', e.target.value)}
          placeholder="Introduzca el nombre del auditor"
        />
      </div>

      <div className="form-group">
        <label>EIP (segun legislacion espanola)</label>
        <SiNoToggle
          value={formData.eip}
          onChange={v => updateField('eip', v)}
        />
      </div>

      <div className="form-group">
        <label>NOMBRE DEL GRUPO al que pertenece la Entidad Auditada</label>
        <input
          type="text"
          value={formData.groupName}
          onChange={e => updateField('groupName', e.target.value)}
          placeholder="Introduzca el nombre del grupo"
        />
      </div>

      <div className="form-group">
        <label>La Entidad Dominante de la Entidad Auditada es una EIP segun su legislacion especifica?</label>
        <SiNoToggle
          value={formData.parentEIP}
          onChange={v => updateField('parentEIP', v)}
        />
      </div>

      <div className="form-group">
        <label>La Entidad Dominante esta radicada en la UE?</label>
        <SiNoToggle
          value={formData.parentInEU}
          onChange={v => updateField('parentInEU', v)}
        />
      </div>

      <div className="form-group">
        <label>La Entidad Dominante o el grupo es auditado por alguna firma de la red MAZARS?</label>
        <SiNoToggle
          value={formData.parentAuditedByMazars}
          onChange={v => updateField('parentAuditedByMazars', v)}
        />
      </div>

      <div className="form-group">
        <label>NOMBRE DEL SOCIO auditoria de la entidad Dominante y/o GRUPO</label>
        <input
          type="text"
          value={formData.partnerName}
          onChange={e => updateField('partnerName', e.target.value)}
          placeholder="Introduzca el nombre del socio"
        />
      </div>

      <div className="form-group">
        <label>LOS SERVICIOS ESTAN SUJETOS A AUTORIZACION PREVIA POR PARTE DE LA COMISION DE AUDITORIA/DIRECCION DEL CLIENTE AUDITADO O POR LA COMISION DE AUDITORIA O DIRECCION DE SU ENTIDAD DOMINANTE?</label>
        <span className="hint">En caso afirmativo, se debera adjuntar copia de dicha autorizacion</span>
        <SiNoToggle
          value={formData.servicesAuthorized}
          onChange={v => updateField('servicesAuthorized', v)}
        />
      </div>

      <h3 className="section-subtitle">Entidad Vinculada</h3>

      <div className="form-group">
        <label>Si el SDA se presta a una entidad vinculada a la Entidad Auditada, indicar NOMBRE de la ENTIDAD VINCULADA</label>
        <input
          type="text"
          value={formData.linkedEntityName}
          onChange={e => updateField('linkedEntityName', e.target.value)}
          placeholder="Introduzca el nombre de la entidad vinculada"
        />
      </div>

      <div className="form-group">
        <label>Esta la Entidad Vinculada en la cadena de control de la Entidad Auditada?</label>
        <SiNoToggle
          value={formData.linkedInControlChain}
          onChange={v => updateField('linkedInControlChain', v)}
        />
      </div>

      <div className="form-group">
        <label>Es la Entidad Vinculada una entidad que ejerce control conjunto o influencia significativa en la Entidad Auditada?</label>
        <SiNoToggle
          value={formData.linkedJointControl}
          onChange={v => updateField('linkedJointControl', v)}
        />
      </div>

      <div className="form-group">
        <label>Es la Entidad Vinculada una entidad sobre la que la Entidad Auditada ejerce influencia significativa?</label>
        <SiNoToggle
          value={formData.linkedSignificantInfluence}
          onChange={v => updateField('linkedSignificantInfluence', v)}
        />
      </div>

      <h3 className="section-subtitle">Datos del SDA</h3>

      <div className="form-group">
        <label>ENTIDAD DE LA RED MAZARS prestadora del SDA</label>
        <input
          type="text"
          value={formData.mazarsEntity}
          onChange={e => updateField('mazarsEntity', e.target.value)}
          placeholder="Introduzca la entidad de la red MAZARS"
        />
      </div>

      <div className="form-group">
        <label>Nombre del SOCIO RESPONSABLE del SDA</label>
        <input
          type="text"
          value={formData.sdaPartnerName}
          onChange={e => updateField('sdaPartnerName', e.target.value)}
          placeholder="Introduzca el nombre del socio responsable"
        />
      </div>

      <div className="form-group">
        <label>HONORARIOS SDA</label>
        <input
          type="text"
          value={formData.sdaFees}
          onChange={e => updateField('sdaFees', e.target.value)}
          placeholder="Introduzca los honorarios"
        />
      </div>
    </div>
  )
}

export default HeaderSection
