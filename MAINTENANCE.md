# Manual de Mantenimiento de Contenido

Este documento explica como actualizar el contenido del cuestionario SDA cuando cambian los servicios, las reglas, las amenazas o las salvaguardas. No se requiere conocimiento profundo de React; solo es necesario editar archivos JavaScript de datos.

**Archivos de datos a mantener:**

| Archivo | Contenido | Cuando actualizar |
|---|---|---|
| `src/data/serviceData.js` | Catalogo de servicios + restricciones | Cuando cambian servicios o reglas de restriccion |
| `src/data/threatDefaults.js` | Amenazas predeterminadas por tipo de servicio | Cuando cambia la tabla de amenazas por tipo |
| `src/data/safeguardExamples.js` | Ejemplos de salvaguardas por amenaza | Cuando cambian las medidas de salvaguarda ejemplo |

**Tras cualquier cambio**, reconstruir la app:

```bash
cd questionnaire-app
npm run build
```

---

## 1. Modificar el Catalogo de Servicios

**Archivo**: `questionnaire-app/src/data/serviceData.js`
**Fuente Excel**: `Codigo de servicio.xlsx`

### 1.1 Agregar un nuevo servicio

Localizar la categoria y tipo correspondiente dentro de `SERVICE_CATALOG`, y agregar una llamada a `s()`:

```javascript
// Dentro de SERVICE_CATALOG.auditores (o la categoria correspondiente)
{
  tipo: '02. ECO',
  descripcion: 'Ecoembes',
  services: [
    s('ECO_ECOEM', 'Ecoembes', null, '1','1','1','1','1','1'),
    // AGREGAR AQUI:
    s('ECO_NUEVO', 'Nuevo servicio Ecoembes', null, '1','1','1','NO','NO','NO'),
  ],
},
```

**Parametros de `s()`** (9 parametros, en orden):

| # | Parametro | Descripcion | Ejemplo |
|---|---|---|---|
| 1 | `code` | Codigo unico del servicio | `'AF_IRPF'` |
| 2 | `description` | Descripcion del servicio | `'IRPF Declaracion'` |
| 3 | `limitaciones` | Texto de limitaciones (para codigo 2), o `null` | `'Solo para no EIP'` |
| 4 | `ne_ea` | Restriccion: No EIP + Entidad Auditada | `'1'`, `'2'`, o `'NO'` |
| 5 | `ne_cc` | Restriccion: No EIP + Cadena de Control | `'1'`, `'2'`, o `'NO'` |
| 6 | `ne_vs` | Restriccion: No EIP + Vinculada Significativa | `'1'`, `'2'`, o `'NO'` |
| 7 | `e_ea` | Restriccion: EIP + Entidad Auditada | `'1'`, `'2'`, o `'NO'` |
| 8 | `e_cc` | Restriccion: EIP + Cadena de Control | `'1'`, `'2'`, o `'NO'` |
| 9 | `e_vs` | Restriccion: EIP + Vinculada Significativa | `'1'`, `'2'`, o `'NO'` |

**Codigos de restriccion:**
- `'NO'` = Servicio prohibido (no seleccionable)
- `'1'` = Requiere cuestionario con analisis de amenazas y salvaguardas
- `'2'` = Servicio limitado (mostrar texto de `limitaciones`); requiere cuestionario

### 1.2 Modificar restricciones de un servicio existente

Buscar el codigo del servicio (ej: `GRC_ASDEAI`) y cambiar los valores:

```javascript
// ANTES:
s('GRC_ASDEAI', 'Auditoría Interna', null, '1','1','1','NO','NO','NO'),
// DESPUES (cambiar EIP + Entidad Auditada de NO a 1):
s('GRC_ASDEAI', 'Auditoría Interna', null, '1','1','1','1','NO','NO'),
```

### 1.3 Agregar una nueva categoria principal

Agregar a `CATEGORIES` y crear la entrada correspondiente en `SERVICE_CATALOG`:

```javascript
// En CATEGORIES:
export const CATEGORIES = [
  { id: 'auditores', name: 'SERVICIOS MAZARS AUDITORES' },
  { id: 'asesores', name: 'SERVICIOS MAZARS ASESORES Y ABOGADOS' },
  { id: 'financial', name: 'SERVICIOS MAZARS FINANCIAL ADVISORY' },
  { id: 'profesionales', name: 'SERVICIOS MAZARS SERVICIOS PROFESIONALES' },
  // NUEVA:
  { id: 'nuevaCategoria', name: 'SERVICIOS NUEVA CATEGORIA' },
]

// En SERVICE_CATALOG:
export const SERVICE_CATALOG = {
  auditores: [...],
  asesores: [...],
  financial: [...],
  profesionales: [...],
  // NUEVA:
  nuevaCategoria: [
    {
      tipo: '01. TIPO',
      descripcion: 'Descripcion del tipo',
      services: [
        s('NC_001', 'Primer servicio', null, '1','1','1','1','1','1'),
      ],
    },
  ],
}
```

### 1.4 Agregar un nuevo tipo de trabajo (subcategoria)

Dentro de la categoria correspondiente en `SERVICE_CATALOG`, agregar un nuevo objeto:

```javascript
SERVICE_CATALOG.auditores = [
  // ... tipos existentes ...
  {
    tipo: '99. NUEVO',
    descripcion: 'Nuevo tipo de trabajo',
    services: [
      s('NUE_001', 'Servicio nuevo 1', null, '1','1','1','1','1','1'),
    ],
  },
]
```

### 1.5 Eliminar un servicio

Simplemente eliminar la linea `s(...)` correspondiente del array `services`.

### 1.6 Cambiar la logica de escenario

La funcion `getScenario()` al final de `serviceData.js` determina el escenario actual basandose en los campos del formulario. Si cambia la logica de prioridad entre tipos de entidad:

```javascript
export function getScenario(formData) {
  const isEip = formData.eip === 'SI'
  const isInControlChain = formData.linkedInControlChain === 'SI'
  const isVinculadaSignificativa =
    formData.linkedJointControl === 'SI' || formData.linkedSignificantInfluence === 'SI'

  // PRIORIDAD: vinculadaSignificativa > cadenaControl > entidadAuditada
  let entityType = 'entidadAuditada'
  if (isVinculadaSignificativa) {
    entityType = 'vinculadaSignificativa'
  } else if (isInControlChain) {
    entityType = 'cadenaControl'
  }
  // ... rest of function
}
```

---

## 2. Modificar Amenazas Predeterminadas

**Archivo**: `questionnaire-app/src/data/threatDefaults.js`
**Fuente Excel**: `Amenanzas.xlsx`, hoja "5_Amenazas segun NAS"

### 2.1 Estructura del mapeo

El array `DEFAULT_THREAT_MAP` contiene un objeto por cada tipo de servicio:

```javascript
{
  serviceType: 'Servicios fiscales',          // Nombre mostrado en la tabla
  prefixes: ['AF_', 'OTF_', 'PF_', 'PT_', 'RF_'],  // Prefijos de codigo
  defaults: {
    threat_selfReview: 'SI',       // Autorrevision
    threat_decisionMaking: 'SI',   // Participacion toma de decisiones
    threat_advocacy: 'SI',         // Abogacia
    threat_selfInterest: 'SI',     // Interes propio
    threat_familiarity: 'NO',      // Familiaridad
    threat_intimidation: 'NO',     // Intimidacion
  },
},
```

### 2.2 Cambiar un valor predeterminado

Localizar el tipo de servicio y cambiar `'SI'` a `'NO'` o viceversa:

```javascript
// Cambiar: Servicios fiscales ya no tiene amenaza de Abogacia
{
  serviceType: 'Servicios fiscales',
  prefixes: ['AF_', 'OTF_', 'PF_', 'PT_', 'RF_'],
  defaults: {
    ...
    threat_advocacy: 'NO',  // Antes era 'SI'
    ...
  },
},
```

### 2.3 Agregar un nuevo tipo de servicio

Agregar un nuevo objeto al array `DEFAULT_THREAT_MAP`:

```javascript
{
  serviceType: 'Servicios ESG',
  prefixes: ['ESG_', 'SUS_'],  // Prefijos de codigo que coinciden
  defaults: {
    threat_selfReview: 'SI',
    threat_decisionMaking: 'NO',
    threat_advocacy: 'NO',
    threat_selfInterest: 'SI',
    threat_familiarity: 'NO',
    threat_intimidation: 'NO',
  },
},
```

### 2.4 Cambiar los prefijos de matcheo

Los prefijos determinan que servicios corresponden a cada tipo. Un servicio con codigo `AF_IRPF` matchea con el prefijo `AF_`:

```javascript
prefixes: ['AF_', 'OTF_', 'PF_'],  // AF_IRPF matchea con 'AF_'
```

Si un servicio no matchea ningun prefijo, se usa el fallback "Otros servicios" (todo en NO).

### 2.5 Agregar un nuevo tipo de amenaza

Esto es un cambio mas significativo que requiere modificar varios archivos:

1. **`threatDefaults.js`**: Agregar a `THREAT_KEYS`, `THREAT_LABELS`, y a cada entrada de `DEFAULT_THREAT_MAP`
2. **`App.jsx`**: Agregar el nuevo campo a `INITIAL_STATE` y al array `hasThreats` en `getVisibleSteps()`
3. **`generateWord.js`**: Agregar al array `hasAnyThreatAnswer` y agregar `toggleRow()` para el nuevo tipo
4. **`safeguardExamples.js`**: Agregar una seccion de ejemplos para el nuevo tipo (si hay)

Ejemplo - agregar `threat_newType`:

```javascript
// threatDefaults.js
export const THREAT_KEYS = [
  'threat_selfReview',
  'threat_decisionMaking',
  'threat_advocacy',
  'threat_selfInterest',
  'threat_familiarity',
  'threat_intimidation',
  'threat_newType',          // NUEVO
]

export const THREAT_LABELS = {
  ...
  threat_newType: 'Nuevo Tipo de Amenaza',  // NUEVO
}

// App.jsx - INITIAL_STATE
threat_newType: '',  // NUEVO

// App.jsx - getVisibleSteps()
const hasThreats = [..., 'threat_newType'].some(...)

// generateWord.js
rows.push(toggleRow('- Nuevo tipo', formData.threat_newType, { boldLabel: true }))
```

### 2.6 Nota sobre localStorage

Los usuarios pueden personalizar los valores predeterminados desde el panel de ayuda (?). Estas personalizaciones se guardan en `localStorage` bajo la clave `sda_threat_defaults_custom`. Si cambias los valores predeterminados en el codigo, los usuarios que ya personalizaron no veran los cambios hasta que pulsen "Restaurar originales" en el panel.

---

## 3. Modificar Ejemplos de Salvaguardas

**Archivo**: `questionnaire-app/src/data/safeguardExamples.js`
**Fuente Excel**: `Amenanzas.xlsx`, hoja "6_Ejemplos Amz y Salv"

### 3.1 Estructura de los ejemplos

Los ejemplos estan organizados por tipo de amenaza. Cada tipo tiene un array de entradas:

```javascript
const SAFEGUARD_EXAMPLES = {
  threat_advocacy: [           // Clave de amenaza
    {
      situacion: 'Texto describiendo la situacion de riesgo...',  // o null para generales
      salvaguardas: [
        { level: 'firma',      text: 'Salvaguarda a nivel de firma...' },
        { level: 'situacion',  text: 'Salvaguarda a nivel de situacion...' },
        { level: 'entidad',    text: 'Salvaguarda a nivel de entidad auditada...' },
      ],
    },
    // mas entradas...
  ],
  threat_selfReview: [...],
  // etc.
}
```

**Niveles de salvaguarda:**
- `'firma'` = A nivel de Firma (azul)
- `'situacion'` = A nivel de Situacion (naranja)
- `'entidad'` = A nivel de Entidad Auditada (morado)

### 3.2 Agregar una nueva salvaguarda a una situacion existente

Localizar la amenaza y la situacion, y agregar al array `salvaguardas`:

```javascript
threat_advocacy: [
  {
    situacion: 'Litigio entre la propia sociedad...',
    salvaguardas: [
      { level: 'firma', text: 'Texto existente...' },
      { level: 'situacion', text: 'Texto existente...' },
      // NUEVA:
      { level: 'entidad', text: 'Nueva salvaguarda a nivel de entidad...' },
    ],
  },
]
```

### 3.3 Agregar una nueva situacion de riesgo

Agregar un nuevo objeto al array de la amenaza:

```javascript
threat_selfInterest: [
  // ... situaciones existentes ...
  // NUEVA SITUACION:
  {
    situacion: 'Descripcion de la nueva situacion de riesgo...',
    salvaguardas: [
      { level: 'firma', text: 'Salvaguarda a nivel de firma...' },
      { level: 'situacion', text: 'Salvaguarda a nivel de situacion...' },
    ],
  },
]
```

### 3.4 Agregar salvaguardas generales (sin situacion)

Usar `situacion: null` para salvaguardas que aplican generalmente:

```javascript
{
  situacion: null,  // Se muestra como "Salvaguardas generales"
  salvaguardas: [
    { level: 'firma', text: 'Salvaguarda general...' },
  ],
},
```

### 3.5 Eliminar una salvaguarda o situacion

Simplemente eliminar el objeto correspondiente del array.

### 3.6 Agregar ejemplos para un nuevo tipo de amenaza

Agregar una nueva clave al objeto `SAFEGUARD_EXAMPLES`:

```javascript
const SAFEGUARD_EXAMPLES = {
  // ... tipos existentes ...
  threat_newType: [
    {
      situacion: 'Primera situacion...',
      salvaguardas: [
        { level: 'firma', text: '...' },
      ],
    },
  ],
}
```

**Importante**: la clave debe coincidir exactamente con la definida en `THREAT_KEYS` de `threatDefaults.js`.

---

## 4. Modificar Preguntas del Cuestionario

### 4.1 Cambiar texto de preguntas o hints

**Paso 1 (1.1-1.6)**: Editar `src/components/Step1Section.jsx`
**Paso 2 (amenazas)**: Editar `src/components/Step2Section.jsx`
**Paso 3 (salvaguardas)**: Editar `src/components/Step3Section.jsx`
**Paso 4 (conclusion)**: Editar `src/components/Step4Section.jsx`

Los textos estan directamente en el JSX. Buscar las etiquetas `<label>`, `<span className="hint">`, y `<div className="step-description">`.

### 4.2 Cambiar opciones de conclusion (Paso 4)

Editar el array `CONCLUSIONS` en `src/components/Step4Section.jsx`:

```javascript
export const CONCLUSIONS = [
  { id: 'c1', text: 'Texto de la conclusion 1...' },
  { id: 'c2', text: 'Texto de la conclusion 2...' },
  // ... agregar, modificar o eliminar opciones
]
```

**Nota**: Este array tambien es usado por `generateWord.js` para el export.

### 4.3 Cambiar campos del encabezado (Paso 0)

Editar `src/components/HeaderSection.jsx`. Cada campo usa el patron:

```jsx
<input value={formData.nombreCampo} onChange={e => updateField('nombreCampo', e.target.value)} />
```

Si agregas un campo nuevo:
1. Agregar a `INITIAL_STATE` en `App.jsx`
2. Agregar el JSX en `HeaderSection.jsx`
3. Si debe aparecer en el Word, agregar en `generateWord.js`

### 4.4 Cambiar etiquetas de amenazas

Editar `THREAT_LABELS` en `src/data/threatDefaults.js`:

```javascript
export const THREAT_LABELS = {
  threat_selfReview: 'Autorrevision',                          // Cambiar texto aqui
  threat_decisionMaking: 'Participacion proceso toma de decisiones',
  threat_advocacy: 'Abogacia',
  threat_selfInterest: 'Interes Propio',
  threat_familiarity: 'Familiaridad',
  threat_intimidation: 'Intimidacion',
}
```

Estas etiquetas se usan en: Step2Section (toggles), Step3Section (grupos de salvaguardas), y los tags en las tarjetas de medidas.

---

## 5. Modificar la Exportacion Word

**Archivo**: `questionnaire-app/src/utils/generateWord.js`

### 5.1 Estructura del archivo Word

El documento se compone de tablas secuenciales. Cada seccion (PASO 1, PASO 2, etc.) es una tabla independiente con filas de tipo:

- `sectionHeaderRow(text)` - Encabezado gris
- `stepTitleRow(text)` - Titulo de sub-paso
- `textRow(text)` - Texto del usuario (fondo amarillo)
- `toggleRow(label, value)` - Fila SI/NO (fondo azul)

### 5.2 Agregar un campo nuevo al Word

Localizar la seccion correspondiente y agregar la fila:

```javascript
// Ejemplo: agregar un nuevo campo al PASO 2
rows.push(toggleRow('- Nuevo tipo de amenaza', formData.threat_newType, { boldLabel: true }))
```

### 5.3 Formato de salvaguardas en Word

Las salvaguardas se exportan como lista numerada. Si se cambia el formato de `step3_measures` (actualmente JSON array), tambien hay que actualizar el bloque de PASO 3 en `generateWord.js`:

```javascript
// Bloque actual: parsea JSON array y genera filas numeradas
measuresItems.forEach((item, idx) => {
  const prefix = `${idx + 1}. `
  rows.push(textRow(prefix + (item.text || '')))
})
```

---

## 6. Modificar Estilos Visuales

**Archivo**: `questionnaire-app/src/App.css`

Secciones principales del CSS (marcadas con comentarios):

| Seccion CSS | Componente |
|---|---|
| `/* Service Selector */` | ServiceSelector.jsx |
| `/* Step 2 - Threat Defaults Help Panel */` | Step2Section (panel de ayuda) |
| `/* Step 3 - Safeguard Suggestions */` | Step3Section (ejemplos de salvaguardas) |
| `/* Step 3 - Measures List */` | Step3Section (lista de medidas individuales) |

### Colores de badges de nivel de salvaguarda

```css
.badge-firma     { background: #e3f2fd; color: #1565c0; }  /* Azul */
.badge-situacion { background: #fff3e0; color: #e65100; }  /* Naranja */
.badge-entidad   { background: #f3e5f5; color: #7b1fa2; }  /* Morado */
```

---

## 7. Checklist de Cambios

### Al agregar/modificar un servicio:
- [ ] Editar `serviceData.js` (agregar/modificar `s()`)
- [ ] Verificar que los prefijos en `threatDefaults.js` cubren el nuevo codigo
- [ ] `npm run build` sin errores
- [ ] Probar seleccion del servicio en la app
- [ ] Probar restriccion con diferentes combinaciones EIP/entidad

### Al cambiar amenazas predeterminadas:
- [ ] Editar `threatDefaults.js` (cambiar defaults o prefixes)
- [ ] `npm run build` sin errores
- [ ] Probar auto-seleccion al llegar al Paso 2
- [ ] Verificar en el panel de ayuda (?) que la tabla es correcta
- [ ] Nota: usuarios con personalizaciones en localStorage no veran cambios hasta restaurar

### Al cambiar ejemplos de salvaguardas:
- [ ] Editar `safeguardExamples.js`
- [ ] `npm run build` sin errores
- [ ] Probar en Paso 3 que los ejemplos aparecen correctamente
- [ ] Verificar que seleccion/deseleccion funciona

### Al agregar un nuevo tipo de amenaza:
- [ ] `threatDefaults.js`: agregar a THREAT_KEYS, THREAT_LABELS, cada entrada de DEFAULT_THREAT_MAP
- [ ] `App.jsx`: agregar campo a INITIAL_STATE, agregar al array en getVisibleSteps()
- [ ] `generateWord.js`: agregar al array hasAnyThreatAnswer, agregar toggleRow()
- [ ] `safeguardExamples.js`: agregar seccion de ejemplos (opcional)
- [ ] `npm run build` sin errores
- [ ] Probar flujo completo

### Al cambiar preguntas del cuestionario:
- [ ] Editar componente correspondiente (Step1Section, Step2Section, etc.)
- [ ] Si es un campo nuevo: agregar a INITIAL_STATE en App.jsx
- [ ] Si debe exportarse: agregar a generateWord.js
- [ ] `npm run build` sin errores
