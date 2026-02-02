# SDA Evaluation App - Project Instructions

## Project Overview
Build a web application for evaluating Non-Audit Services (SDA - Servicios Distintos de Auditoría) 
for compliance with Spanish audit independence regulations (LAC 16, LAC 39, RUE 5).

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: PostgreSQL (or SQLite for development)
- **Document Generation**: python-docx

## Source Data
All source data is in `/data/` folder:
- `Codigo_de_servicio.xlsx` - 128 Mazars services with permission codes
- `Gate_legal.xlsx` - Legal rules (3 sheets: LAC 16, EIP prohibitions, safeguards)
- `Amenanzas.xlsx` - 6 threat types with safeguard mappings
- `CUESTIONARIO.xlsx` - 4-step questionnaire workflow

## Core Features
1. **Service Catalog**: Searchable dropdown with 128 services grouped by category
2. **Entity Type Toggle**: EIP (Public Interest Entity) vs NO EIP selection
3. **4-Step Wizard Workflow**:
   - STEP 1: Legal Gate (check prohibitions based on entity type)
   - STEP 2: Threat Identification (map service to 6 threat types)
   - STEP 3: Safeguard Selection (choose mitigation measures)
   - STEP 4: Conclusion (generate C1-C7 determination)
4. **Document Export**: Generate Word document with evaluation summary

## Business Logic
- Permission values: `1` = requires questionnaire, `2` = limited, `NO` = prohibited
- If service permission = "NO" for entity type → return conclusion C5 (prohibited)
- 7 conclusion types: C1 (approved), C2 (with safeguards), C3 (needs Ethics Partner), 
  C4 (conditional), C5 (legally prohibited), C6 (unmitigable), C7 (needs more analysis)

## Development Phases
1. **Phase 1**: Data extraction scripts + database schema + seed data
2. **Phase 2**: Backend API (FastAPI endpoints for services, threats, evaluations)
3. **Phase 3**: Frontend wizard UI (React components for 4-step flow)
4. **Phase 4**: Document generation (python-docx template)
5. **Phase 5**: Integration + testing

## Documentation
Detailed specifications available in `/docs/` folder (English and Chinese versions).
```

---

## 💬 Mensajes para Claude Code (por fases)

### **Mensaje 1 - Iniciar proyecto**
```
Lee el archivo CLAUDE.md y los Excel en /data/. 
Crea la estructura inicial del proyecto con:
- Backend FastAPI en /backend
- Frontend React en /frontend
- Scripts de extracción de datos de los Excel
```

### **Mensaje 2 - Base de datos**
```
Crea el esquema de base de datos PostgreSQL basado en los 4 Excel.
Incluye tablas: services, categories, legal_rules, threats, safeguards, 
service_threats, evaluations.
Genera scripts de migración y seed data desde los Excel.
```

### **Mensaje 3 - Backend API**
```
Implementa los endpoints FastAPI:
- GET /services (lista con filtro por categoría)
- GET /services/{id}/threats (amenazas por servicio)
- GET /legal-rules?entity_type=EIP|NO_EIP
- POST /evaluations (crear evaluación)
- GET /evaluations/{id}/export (generar Word)
```

### **Mensaje 4 - Frontend Wizard**
```
Crea el wizard de 4 pasos en React:
- Step1LegalGate: muestra resultado del gate legal
- Step2Threats: checkboxes de amenazas con rating
- Step3Safeguards: multiselect de salvaguardas
- Step4Conclusion: resultado final con color coding
Incluye barra de progreso y navegación entre pasos.
```

### **Mensaje 5 - Generación de documentos**
```
Implementa la generación del Word con python-docx:
- Header con logo Mazars
- Secciones: Servicio, Entidad, Gate Legal, Amenazas, Salvaguardas, Conclusión
- Campos de firma y fecha
- Exportar como .docx descargable