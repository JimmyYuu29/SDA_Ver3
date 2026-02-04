# SDA Cuestionario - Analisis de Amenazas a la Independencia del Auditor

Aplicacion web de cuestionario para documentar el analisis de amenazas y medidas de salvaguarda a la independencia del auditor, basada en el procedimiento de MAZARS. El formulario completado se exporta como documento Word (.docx) con un formato que replica la plantilla Excel original.

---

## Tabla de Contenidos

- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Estructura de Directorios](#estructura-de-directorios)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalacion y Ejecucion Local](#instalacion-y-ejecucion-local)
- [Uso de la Aplicacion](#uso-de-la-aplicacion)
- [Logica de Navegacion Condicional](#logica-de-navegacion-condicional)
- [Sistema de Datos](#sistema-de-datos)
- [Exportacion a Word](#exportacion-a-word)
- [Despliegue en Servidor](#despliegue-en-servidor)
- [Referencia de Componentes](#referencia-de-componentes)
- [Mantenimiento de Contenido](#mantenimiento-de-contenido)

---

## Arquitectura del Proyecto

La aplicacion sigue una arquitectura SPA (Single Page Application) con React y Vite:

```
+--------------------------------------------------+
|                   App.jsx                        |
|  (Estado global del formulario + navegacion)      |
+--------------------------------------------------+
        |              |              |
        v              v              v
+-------------+ +-------------+ +-------------+
| ProgressBar | | Secciones   | | Navegacion  |
| (progreso)  | | (Steps 0-7) | | (ant/sig)   |
+-------------+ +-------------+ +-------------+
                       |
     +-----------------+------------------+
     |    |    |    |    |    |    |    |  |
     v    v    v    v    v    v    v    v  v
   Header Srv  S1  S2   S3   S4  Sign Doc Export
                |    |    |
                v    v    v
         +------+----+------+
         |  data/            |
         |  serviceData.js   |  <-- Codigo de servicio.xlsx
         |  threatDefaults.js|  <-- Amenanzas.xlsx hoja 5
         |  safeguardExamples|  <-- Amenanzas.xlsx hoja 6
         +-------------------+
```

### Patron de Datos

- **Estado centralizado**: Todo el estado del formulario vive en `App.jsx` como un unico objeto `formData`.
- **Actualizacion por campo**: Cada componente recibe `updateField(campo, valor)` para modificar campos individuales.
- **Navegacion condicional**: `getVisibleSteps()` calcula que pasos mostrar segun las respuestas SI/NO del usuario.
- **Datos estaticos en JS**: Catalogo de servicios, amenazas predeterminadas y ejemplos de salvaguardas son archivos JS en `src/data/`.
- **Persistencia local**: Los valores personalizados de amenazas predeterminadas se guardan en `localStorage`.
- **Exportacion cliente-side**: La generacion del Word ocurre enteramente en el navegador, sin servidor.

---

## Estructura de Directorios

```
SDA_Ver3_Questionario/
|-- CUESTIONARIO.xlsx              # Plantilla Excel original del cuestionario
|-- Codigo de servicio.xlsx        # Catalogo de servicios con restricciones
|-- Amenanzas.xlsx                 # Amenazas predeterminadas + ejemplos salvaguardas
|-- README.md                      # Este archivo
|-- MAINTENANCE.md                 # Manual de mantenimiento de contenido
|-- package.json                   # Dependencias raiz (exceljs, xlsx para parsing)
|
|-- questionnaire-app/             # Aplicacion React principal
    |-- index.html                 # Punto de entrada HTML
    |-- package.json               # Dependencias de la app
    |-- vite.config.js             # Configuracion de Vite
    |-- eslint.config.js           # Configuracion de ESLint
    |
    |-- dist/                      # Build de produccion (generado)
    |   |-- index.html
    |   |-- assets/
    |       |-- index-*.js
    |       |-- index-*.css
    |
    |-- src/
        |-- main.jsx               # Punto de entrada React
        |-- App.jsx                # Componente raiz, estado global, navegacion 8 pasos
        |-- App.css                # Todos los estilos
        |-- index.css              # Estilos base globales
        |
        |-- data/                        # Datos estaticos del negocio
        |   |-- serviceData.js           # 116 servicios, 4 categorias, restricciones
        |   |-- threatDefaults.js        # 11 tipos servicio -> 6 amenazas (SI/NO)
        |   |-- safeguardExamples.js     # Ejemplos salvaguardas por amenaza (6 tipos)
        |
        |-- components/
        |   |-- ProgressBar.jsx          # Barra de progreso con pasos clickeables
        |   |-- SiNoToggle.jsx           # Componente reutilizable de toggle SI/NO
        |   |-- HeaderSection.jsx        # Paso 0: Informacion general de la entidad
        |   |-- ServiceSelector.jsx      # Paso 1: Seleccion jerarquica de servicio
        |   |-- Step1Section.jsx         # Paso 1: Identificacion (sub-pasos 1.1-1.6)
        |   |-- Step2Section.jsx         # Paso 2: Amenazas (auto-select + panel ayuda)
        |   |-- Step3Section.jsx         # Paso 3: Salvaguardas (items individuales)
        |   |-- Step4Section.jsx         # Paso 4: Conclusion final (8 opciones)
        |   |-- SignatureSection.jsx     # Firmas y fechas
        |   |-- DocumentationSection.jsx # Documentacion a adjuntar (X-REF)
        |
        |-- utils/
            |-- generateWord.js          # Generador de documento Word (.docx)
```

---

## Tecnologias Utilizadas

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **React** | 19.2.0 | Framework de UI |
| **Vite** | 7.x | Build tool y dev server |
| **docx** | 9.5.1 | Generacion de documentos Word en el navegador |
| **file-saver** | 2.0.5 | Descarga de archivos desde el navegador |
| **ESLint** | 9.x | Linting de codigo |

---

## Instalacion y Ejecucion Local

### Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd SDA_Ver3_Questionario

# 2. Entrar al directorio de la app
cd questionnaire-app

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173/` (o el siguiente puerto disponible).

### Comandos Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con Hot Module Replacement |
| `npm run build` | Genera build de produccion en `dist/` |
| `npm run preview` | Previsualiza el build de produccion localmente |
| `npm run lint` | Ejecuta ESLint sobre el codigo fuente |

---

## Uso de la Aplicacion

### Flujo General (8 pasos)

La aplicacion guia al usuario a traves de 8 secciones en forma de asistente (wizard):

#### Paso 0 - Informacion General
Campos de texto e interruptores SI/NO para capturar:
- Nombre de la entidad auditada y auditor responsable
- Si es EIP (Entidad de Interes Publico)
- Datos del grupo, entidad dominante, entidad vinculada
- Tipo de relacion: cadena de control / control conjunto / influencia significativa
- Entidad MAZARS prestadora del SDA y honorarios

#### Paso 1 - Seleccion de Servicio
Selector jerarquico de 3 niveles:
- **Categoria** (4): Auditores / Asesores y Abogados / Financial Advisory / Servicios Profesionales
- **Tipo de trabajo**: subcategorias dentro de cada categoria
- **Servicio**: servicio individual con codigo unico

Cada servicio muestra **inline** su restriccion segun las condiciones del Paso 0 (EIP/No EIP + tipo de entidad):
- **Prohibido** (codigo NO): no seleccionable
- **Requiere cuestionario** (codigo 1): seleccionable, continua al cuestionario
- **Limitado** (codigo 2): seleccionable, muestra condiciones especificas

Incluye busqueda por palabra clave y tabla de restricciones completa.

#### Paso 1 - Identificacion de Amenazas (1.1 a 1.6)
Sub-pasos condicionales:
- **1.1**: Descripcion del servicio (texto libre)
- **1.2**: Es una incompatibilidad o prohibicion? (SI/NO)
- **1.3 - 1.5**: Preguntas de filtro (SI -> salta a Paso 4)
- **1.6**: Es una incompatibilidad absoluta? (SI -> Paso 4, NO -> Paso 2)

#### Paso 2 - Amenazas y Evaluacion
- **2.1**: 6 tipos de amenazas, cada una SI/NO:
  - Autorrevision
  - Participacion proceso toma de decisiones
  - Abogacia
  - Interes propio
  - Familiaridad
  - Intimidacion
- **Auto-seleccion**: al llegar al paso, las amenazas se pre-marcan segun el tipo de servicio seleccionado
- **Panel de ayuda** (?): tabla editable de amenazas predeterminadas por tipo de servicio, guardada en localStorage
- **2.2**: Evaluacion de importancia (texto libre, solo si hay amenazas)

#### Paso 3 - Medidas de Salvaguarda
- **Ejemplos predefinidos**: agrupados por amenaza activa, con situaciones y 3 niveles (Firma / Situacion / Entidad Auditada)
- **Seleccion individual**: clic para agregar/quitar de la lista de medidas
- **Entrada manual**: campo para escribir salvaguardas propias
- **Gestion**: cada item se puede editar, eliminar, reordenar
- Los items se almacenan como array JSON en `formData.step3_measures`

#### Paso 4 - Conclusion Final
Seleccion unica entre 8 opciones de conclusion predefinidas.

#### Paso 5 - Firmas
Campos de fecha y nombre para socios responsables.

#### Paso 6 - Documentacion
Referencias cruzadas (X-REF) para 7 tipos de documentos a adjuntar.

#### Exportacion
Boton "Generar Documento Word" crea y descarga un `.docx` con formato que replica la plantilla Excel.

---

## Logica de Navegacion Condicional

```
Paso 0 (Informacion General)
  -> Paso 1 (Seleccion Servicio)
    -> Paso 1 (Identificacion 1.1-1.6)
         |
         |-- 1.3/1.4/1.5 SI --> Paso 4
         |-- 1.6 SI ---------> Paso 4
         |-- 1.6 NO ---------> Paso 2
               |
               |-- Sin amenazas --> Paso 4
               |-- Con amenazas --> Paso 3 --> Paso 4
                                               |
                                         Firmas -> Documentacion
```

---

## Sistema de Datos

### Catalogo de Servicios (`serviceData.js`)

- **Fuente**: `Codigo de servicio.xlsx`
- **116 servicios** en 4 categorias principales
- Cada servicio tiene 6 restricciones: 2 escenarios EIP (si/no) x 3 tipos de entidad
- Codigos de restriccion: `NO` (prohibido), `1` (cuestionario), `2` (limitado)
- Funciones exportadas: `getScenario(formData)`, `getServiceRestriction(service, formData)`

### Amenazas Predeterminadas (`threatDefaults.js`)

- **Fuente**: `Amenanzas.xlsx`, hoja "5_Amenazas segun NAS"
- 11 tipos de servicio mapeados a 6 amenazas (SI/NO)
- Matcheo por prefijo del codigo de servicio (ej: `AF_` -> Servicios fiscales)
- Personalizacion via localStorage (editable desde el panel de ayuda del Paso 2)

### Ejemplos de Salvaguardas (`safeguardExamples.js`)

- **Fuente**: `Amenanzas.xlsx`, hoja "6_Ejemplos Amz y Salv"
- 6 tipos de amenaza con situaciones de riesgo y salvaguardas a 3 niveles:
  - A nivel de Firma
  - A nivel de Situacion
  - A nivel de Entidad Auditada

---

## Exportacion a Word

El archivo generado (`SDA_Cuestionario_{entidad}_{fecha}.docx`) replica el formato de la plantilla Excel:

| Elemento | Color en Word | Correspondencia Excel |
|----------|--------------|----------------------|
| Respuestas SI/NO | Azul (`#B4C6E7`) | Celdas azules (theme:3, tint:0.8) |
| Texto introducido por usuario | Amarillo (`#FFF2CC`) | Celdas amarillas |
| Encabezados de seccion | Gris (`#D9D9D9`) | Filas de cabecera |
| Conclusion seleccionada | Verde (`#C6EFCE`) | Celda verde de conclusion |
| Informacion del servicio | Tabla con restriccion coloreada | -- |
| Medidas de salvaguarda | Listado numerado (1. 2. 3...) | -- |

---

## Despliegue en Servidor

### Opcion 1: Archivos Estaticos (Recomendado)

La aplicacion es 100% cliente-side, se puede desplegar como sitio estatico.

```bash
cd questionnaire-app
npm run build
# Desplegar contenido de dist/ en cualquier servidor web
```

### Opcion 2: Docker

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY questionnaire-app/package*.json ./
RUN npm ci
COPY questionnaire-app/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Opcion 3: Plataformas Cloud

Compatible con Vercel, Netlify, GitHub Pages. Framework: Vite, output: `dist/`.

---

## Referencia de Componentes

| Componente | Paso | Responsabilidad |
|---|---|---|
| `App.jsx` | -- | Estado global, navegacion 8 pasos, `getVisibleSteps()` |
| `HeaderSection.jsx` | 0 | Informacion general (EIP, entidad, socios) |
| `ServiceSelector.jsx` | 1 | Seleccion jerarquica con restricciones inline |
| `Step1Section.jsx` | 2 | Identificacion 1.1-1.6 con navegacion condicional |
| `Step2Section.jsx` | 3 | 6 amenazas, auto-select, panel ayuda editable |
| `Step3Section.jsx` | 4 | Salvaguardas individuales (preset + manual) |
| `Step4Section.jsx` | 5 | Conclusion final (8 opciones radio) |
| `SignatureSection.jsx` | 6 | Firmas y fechas |
| `DocumentationSection.jsx` | 7 | Documentacion X-REF |

| Data File | Fuente Excel | Contenido |
|---|---|---|
| `serviceData.js` | Codigo de servicio.xlsx | 116 servicios, restricciones, `getScenario()` |
| `threatDefaults.js` | Amenanzas.xlsx hoja 5 | Amenazas por tipo de servicio |
| `safeguardExamples.js` | Amenanzas.xlsx hoja 6 | Ejemplos salvaguardas por amenaza |

---

## Mantenimiento de Contenido

Para instrucciones detalladas sobre como actualizar contenidos cuando cambian los servicios, las reglas de restriccion, las amenazas predeterminadas, los ejemplos de salvaguardas o las preguntas del cuestionario, ver **[MAINTENANCE.md](./MAINTENANCE.md)**.
