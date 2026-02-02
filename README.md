# SDA Evaluation App

**Sistema de Evaluación de Servicios Distintos de Auditoría**

Aplicación web para evaluar la compatibilidad de servicios no relacionados con auditoría según la normativa española de independencia del auditor.

---

## 📋 Descripción

Esta aplicación automatiza el proceso de evaluación SDA (Servicios Distintos de Auditoría) de Forvis Mazars España, verificando el cumplimiento con:

- **LAC 16**: Incompatibilidades para entidades NO EIP
- **LAC 39**: Prohibiciones para Entidades de Interés Público (EIP)
- **RUE 5**: Regulación de la Unión Europea para EIP

## 🎯 Funcionalidades

| Función | Descripción |
|---------|-------------|
| Catálogo de Servicios | 128 servicios Mazars organizados en 4 categorías |
| Gate Legal | Verificación automática de prohibiciones/incompatibilidades |
| Identificación de Amenazas | Mapeo a 6 tipos de amenazas IESBA |
| Selección de Salvaguardas | 64 medidas de mitigación disponibles |
| Generación de Documentos | Exportación a Word con resumen completo |

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│                 React + TypeScript                      │
│                   Tailwind CSS                          │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API
┌─────────────────────▼───────────────────────────────────┐
│                      BACKEND                            │
│                   Python FastAPI                        │
│                   python-docx                           │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                     DATABASE                            │
│                    PostgreSQL                           │
└─────────────────────────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
sda-evaluation-app/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── routers/        # Endpoints API
│   │   ├── services/       # Lógica de negocio
│   │   └── templates/      # Plantillas Word
│   ├── scripts/            # Extracción de datos
│   └── requirements.txt
│
├── frontend/               # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes UI
│   │   ├── pages/          # Páginas del wizard
│   │   ├── hooks/          # Custom hooks
│   │   └── services/       # API client
│   └── package.json
│
├── data/                   # Archivos fuente Excel
│   ├── Codigo_de_servicio.xlsx
│   ├── Gate_legal.xlsx
│   ├── Amenanzas.xlsx
│   └── CUESTIONARIO.xlsx
│
├── docs/                   # Documentación técnica
│   ├── SDA_App_Architecture_EN.docx
│   ├── SDA_App_Architecture_CN.docx
│   ├── SDA_Excel_Linkages_EN.docx
│   ├── SDA_Excel_Linkages_CN.docx
│   ├── SDA_Extraction_Guide_EN.docx
│   └── SDA_Extraction_Guide_CN.docx
│
├── CLAUDE.md               # Instrucciones para Claude Code
└── README.md
```

## 🔄 Flujo de Evaluación

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   PASO 1     │───▶│   PASO 2     │───▶│   PASO 3     │───▶│   PASO 4     │
│  Gate Legal  │    │  Amenazas    │    │ Salvaguardas │    │  Conclusión  │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  Verificar           Identificar         Seleccionar         Generar
  prohibiciones       6 tipos de          medidas de          código
  LAC/RUE             amenazas            mitigación          C1-C7
```

## 📊 Tipos de Conclusión

| Código | Resultado | Acción |
|--------|-----------|--------|
| C1 | Aprobado - Sin amenazas | Documentar y proceder |
| C2 | Aprobado con salvaguardas | Implementar medidas, luego proceder |
| C3 | Requiere aprobación adicional | Escalar a Socio de Ética |
| C4 | Aprobación condicional | Cumplir condiciones antes de proceder |
| C5 | Prohibido - Incompatibilidad legal | Rechazar encargo |
| C6 | Prohibido - Amenazas no mitigables | Rechazar encargo |
| C7 | Diferido - Requiere más análisis | Revisión adicional necesaria |

## 🚀 Instalación

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python scripts/seed_database.py
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuración

Variables de entorno (`.env`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/sda_db
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

## 📖 Documentación

La carpeta `/docs` contiene documentación técnica detallada en inglés y chino:

- **Architecture**: Visión general del sistema y stack tecnológico
- **Excel Linkages**: Relaciones entre archivos de datos fuente
- **Extraction Guide**: Instrucciones de extracción y prompt para desarrollo

## 👥 Equipo

**Forvis Mazars España** - Departamento de Auditoría

---

*Aplicación interna para uso exclusivo de Forvis Mazars España*
