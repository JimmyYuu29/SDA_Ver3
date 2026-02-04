/**
 * Safeguard examples per threat type, from "6_Ejemplos Amz y Salv" sheet.
 *
 * Structure: each threat type has a list of entries. Each entry groups:
 *   - situacion: the risk situation (may be null for general safeguards)
 *   - salvaguardas: array of safeguard texts, each with a level (firma/situacion/entidad)
 *
 * The threat keys map to the THREAT_KEYS in threatDefaults.js via THREAT_KEY_MAP below.
 */

/**
 * Map from Excel threat names to our internal threat keys.
 */
export const THREAT_KEY_MAP = {
  'Abogacía': 'threat_advocacy',
  'Autorrevisión': 'threat_selfReview',
  'Familiaridad': 'threat_familiarity',
  'Interés Propio': 'threat_selfInterest',
  'Intimidación': 'threat_intimidation',
  'Participación toma de decisiones': 'threat_decisionMaking',
}

/**
 * Safeguard level labels for display.
 */
export const SAFEGUARD_LEVEL_LABELS = {
  firma: 'A nivel de Firma',
  situacion: 'A nivel de Situación',
  entidad: 'A nivel de Entidad Auditada',
}

/**
 * Raw safeguard examples organized by threat key.
 * Each threat has entries with optional situacion and safeguards at 3 levels.
 */
const SAFEGUARD_EXAMPLES = {
  threat_advocacy: [
    {
      situacion: 'Mantenimiento de una posición a favor o en contra de la entidad auditada (Defensa ante tribunales y otros servicios en los que públicamente se mantenga una posición no independiente de defensa de los intereses del cliente de auditoría).',
      salvaguardas: [
        { level: 'firma', text: 'El servicio de abogacia solo puede ser prestado por Mazars Tax & Legal SLP, en ningun caso por Mazars Auditores.\nOtros procedimientos como los que se detallan a continuacion' },
        { level: 'situacion', text: 'Asignación de diferentes equipos en la prestación de servicios distintos del de auditoría y en la auditoría de cuentas.' },
        { level: 'entidad', text: 'La entidad auditada tiene el conocimiento, experiencia y los recursos necesarios para la toma de decisiones requeridas por el trabajo.' },
      ],
    },
    {
      situacion: 'Servicios en los que pueda haber una percepción de posicionamiento a favor de la entidad auditada (ej. informes de procedimientos acordados relacionados con conflictos, litigios o investigaciones, informes periciales, etc).',
      salvaguardas: [
        { level: 'firma', text: 'Que el auditor de cuentas o sociedad de auditoría no negociarán, no tendrán la capacidad de cerrar acuerdos o establecer cualquier relación contractual en nombre de la entidad auditada.' },
        { level: 'situacion', text: 'Evaluación en términos de importancia relativa del impacto posible en los estados financieros u otros documentos contables como resultado del servicio.' },
        { level: 'entidad', text: 'La entidad auditada no podrá basar su toma de decisiones exclusivamente en las recomendaciones/asesoramiento del auditor de cuentas o sociedad de auditoría sino que cualquier decisión adoptada tendrá que basarse en un análisis/valoración interna y en caso de considerarse oportuno o necesario, podrá recurrir a otros expertos.' },
      ],
    },
    {
      situacion: 'Litigio entre la propia sociedad de auditoría y entre la entidad auditada',
      salvaguardas: [
        { level: 'firma', text: 'Un litigio entre la propia sociedad de auditoría y la entidad auditada supondría una amenaza significativa dificil de salvaguardar, independientemente de las cantidades involucradas en el litigio.\n\nEn caso de que el litigio fuera entre la entidad auditada y un miembro de la Red Mazars, un ejemplo de medida de salvaguarda, cuando la amenaza se considere significativa, es la revisión por un revisor competente del trabajo de auditoría realizado.' },
        { level: 'situacion', text: 'Rechazo de la relación o eliminación de la situación' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
      ],
    },
    {
      situacion: null,
      salvaguardas: [
        { level: 'firma', text: 'Que el auditor de cuentas o sociedad de auditoría no participa en la toma de decisiones, siendo esta responsabilidad de la entidad auditada.' },
        { level: 'firma', text: 'Que el auditor de cuentas no realiza funciones propias de la dirección.' },
        { level: 'firma', text: 'Que el auditor de cuentas o sociedad de auditoría no ostentarán apoderamientos con mandato general por la entidad auditada.' },
        { level: 'firma', text: 'Que los servicios de representación, de una entidad que no es una EIP, ante tribunales se prestan por personas jurídicas distintas y con consejos de administración diferentes, y sin que puedan referirse a la resolución de litigios sobre cuestiones que puedan tener una incidencia significativa, medida en términos de importancia relativa, en los estados financieros correspondientes al período o ejercicio auditado.' },
        { level: 'situacion', text: 'La prestación de servicios de abogacía simultáneamente para la entidad auditada, que no es una EIP, salvo que dichos servicios se presten por personas jurídicas distintas y con consejos de administración diferentes, y sin que puedan referirse a la resolución de litigios sobre cuestiones que puedan tener una incidencia significativa, medida en términos de importancia relativa, en los estados financieros correspondientes al período o ejercicio auditado.' },
        { level: 'situacion', text: 'Rechazo de la relación o eliminación de la situación' },
        { level: 'situacion', text: 'Los procedimientos para ejecutar el servicio no entrañan un alto grado de subjetividad.' },
        { level: 'entidad', text: 'La entidad auditada es la responsable de determinar su estrategia procesal o de negociación.' },
        { level: 'entidad', text: 'Con independencia de que el resultado del trabajo esté bien desarrollado y detallado, es responsabilidad de la entidad auditada la evaluación del resultado de nuestro trabajo y en su caso, adaptarlo e implantarlo.' },
        { level: 'entidad', text: 'La Dirección de la Sociedad designará una persona con conocimiento y experiencia adecuada en cuestiones objeto del SDA, para que sea el interlocutor con el equipo de trabajo asignado a la prestación del SDA, y evalúe los trabajos o recomendaciones objeto del servicio, y ponga dicha evaluación a disposición de las personas con competencia en la gestión o toma de decisiones de la Sociedad' },
        { level: 'entidad', text: 'La entidad de la Red Mazars que preste el servicio no asumirá responsabilidades de la Dirección, que únicamente corresponden a la Sociedad, siendo esta última la única competente para realizar y responsabilizarse de declaraciones a realizar y de la toma de decisiones y juicios significativos.' },
      ],
    },
  ],

  threat_selfReview: [
    {
      situacion: 'Prestación de servicios distintos del de auditoría que conlleve la emisión de resultados, juicios o criterios en relación con datos o información que la entidad auditada considerará al tomar decisiones con efecto en la información financiera contenida en las cuentas, documentos o estados auditados y que, en la realización del trabajo de auditoría, se llevarán a cabo procedimientos que supongan revisiones o evaluaciones de estos resultados, juicios o criterios.',
      salvaguardas: [
        { level: 'firma', text: 'Ver guias y Formacion en relacion con esta amenaza.\nOtros procedimientos como los que se detallan a continuacion' },
        { level: 'situacion', text: 'El auditor de cuentas o sociedad de auditoría no participa en la gestión o la toma de decisiones en los términos previstos en el artículo 14 de la LAC siendo esta responsabilidad de la entidad auditada.' },
        { level: 'entidad', text: 'La entidad auditada es responsable de la preparación de los registros contables y de los estados financieros.' },
      ],
    },
    {
      situacion: 'Ostentación de un cargo directivo, de supervisión interna o de empleo en la entidad auditada durante el periodo objeto de auditoría.',
      salvaguardas: [
        { level: 'situacion', text: 'El servicio se presta en una entidad auditada por otro auditor, participada por nuestro cliente de auditoría, por lo que los resultados de nuestros servicios serán revisados por este otro auditor.' },
        { level: 'entidad', text: 'La entidad auditada confirma tener el conocimiento, experiencia y los recursos necesarios para la toma de decisiones requeridas por el proyecto y supervisar nuestros servicios.' },
      ],
    },
    {
      situacion: 'Prestación de servicios de valoración, auditoría interna o diseño y puesta en práctica de procedimientos de control interno o de gestión de riesgos a una no EIP en los términos del artículo 16.1.b) de la LAC o a una EIP en los términos del artículo 39 de la LAC (artículo 5 del Reglamento (UE)).',
      salvaguardas: [
        { level: 'situacion', text: 'Rechazo de la relación o eliminación de la situación' },
        { level: 'entidad', text: 'La entidad auditada no podrá basar su toma de decisiones exclusivamente en las recomendaciones/asesoramiento del auditor de cuentas o sociedad de auditoría sino que cualquier decisión adoptada tendrá que basarse en un análisis/valoración interna y en caso de considerarse oportuno o necesario, podrá recurrir a otros expertos.' },
      ],
    },
    {
      situacion: 'La prestación de servicios de valoración o fiscales, que lleven aparejados resultados u opiniones que el auditor deba evaluar y cuestionarse al realizar la auditoría.',
      salvaguardas: [
        { level: 'situacion', text: 'Asignación de diferentes equipos en la prestación de servicios distintos del de auditoría y en la auditoría de cuentas.' },
        { level: 'entidad', text: 'Con independencia de que el resultado del trabajo esté bien desarrollado y detallado, es responsabilidad de la entidad auditada la evaluación del resultado de nuestro trabajo y en su caso, adaptarlo e implantarlo.' },
      ],
    },
    {
      situacion: 'Cesión de personal a la entidad auditada',
      salvaguardas: [
        { level: 'situacion', text: 'Asignación de diferentes equipos en la prestación de servicios distintos del de auditoría y en la auditoría de cuentas.' },
        { level: 'entidad', text: 'Con independencia de que el resultado del trabajo esté bien desarrollado y detallado, es responsabilidad de la entidad auditada la evaluación del resultado de nuestro trabajo y en su caso, adaptarlo e implantarlo.' },
      ],
    },
    {
      situacion: null,
      salvaguardas: [
        { level: 'situacion', text: 'No se incluye dentro del alcance de nuestro trabajo la preparación de los registros contables y de los estados financieros o la preparación de proyecciones, estimaciones o valoraciones de cantidades significativas/ Nuestros trabajo no está destinado a ser incluido, ni cualitativa ni cuantitativamente, en los estados financieros de la entidad auditada.' },
        { level: 'situacion', text: 'La entidad auditada, que no es una EIP, asume la responsabilidad del establecimiento y del mantenimiento del sistema de control interno, de la determinación del alcance, riesgo y frecuencia de los procedimientos de auditoría interna, de la consideración, decisión y ejecución de los resultados y recomendaciones proporcionados por la auditoría interna, así como de que el auditor de cuentas no participa en la toma de decisiones sobre la gestión y control de la prestación de los servicios de auditoría interna.' },
        { level: 'situacion', text: 'La entidad auditada, que no es una EIP, asume la responsabilidad del sistema global de control interno, o de que el servicio se presta siguiendo las especificaciones establecidas por dicha entidad, constando igualmente que ésta asume la responsabilidad del proceso de diseño, ejecución y evaluación, incluida cualquier decisión al respecto, y del funcionamiento del sistema de tecnología de la información financiera, mediante el cual se generan evaluaciones o datos integrantes de las cuentas anuales u otros estados financieros.' },
        { level: 'situacion', text: 'Deberá dejarse constancia documental de las instrucciones y especificaciones establecidas por la entidad auditada en el caso de prestarse los servicios a que se refiere este apartado.' },
        { level: 'situacion', text: 'Apartar del equipo del encargo de auditoría a personas de cuya participación se puedan derivar incompatibilidades de acuerdo con la LAC o que supongan amenazas que no puedan ser eliminadas o reducidas a un nivel aceptablemente bajo.' },
        { level: 'entidad', text: 'La entidad auditada analizará la adecuación de nuestros servicios asumiendo la responsabilidad sobre sus resultados así como de su puesta en práctica.' },
        { level: 'entidad', text: 'La Dirección de la entidad auditada tiene una involucración sustancial y significativa en relación con el servicio.' },
        { level: 'entidad', text: 'La Dirección de la Sociedad designará una persona con conocimiento y experiencia adecuada en cuestiones objeto del SDA, para que sea el interlocutor con el equipo de trabajo asignado a la prestación del SDA, y evalúe los trabajos o recomendaciones objeto del servicio, y ponga dicha evaluación a disposición de las personas con competencia en la gestión o toma de decisiones de la Sociedad' },
        { level: 'entidad', text: 'La entidad de la Red Mazars que vaya a prestar el SDA se abstendrá de prestar los servicios detallados anteriormente si de los mismos pudiera derivarse su participación en el proceso de toma de decisiones sobre los estados financieros de la Sociedad o de sus vinculadas por una relación de control o que por su incidencia significativa, medida en términos de importancia relativa sobre los estados financieros o documentos contables sobre los que MAZARS AUDITORES S.L.P. ha de expresar una opinión, puedan suponer una amenaza de auto revisión, valoración o abogacía imposible de eliminar o reducir a niveles aceptables y, por tanto, comprometan su independencia' },
        { level: 'entidad', text: 'La entidad de la Red Mazars que preste el servicio no asumirá responsabilidades de la Dirección, que únicamente corresponden a la Sociedad, siendo esta última la única competente para realizar y responsabilizarse de declaraciones a realizar y de la toma de decisiones y juicios significativos.' },
        { level: 'entidad', text: 'Los órganos de control de la entidad auditada, normalmente la Comisión de Auditoría, analizará previamente las posibles amenazas que se puedan derivar de prestación de servicio distinto del de auditoría, y en su caso, procederá a su autorización antes del inicio de la prestación del mismo.' },
      ],
    },
  ],

  threat_familiarity: [
    {
      situacion: 'Relación profesional prolongada con la entidad auditada derivando en una percepción de posible falta de escepticismo profesional.',
      salvaguardas: [
        { level: 'firma', text: 'Ver procedimientos sobre familiaridad QAM.\nExistencia de procedimientos en la sociedad de auditoría para asegurar:' },
        { level: 'situacion', text: 'Apartar del equipo del encargo de auditoría a personas de cuya participación se puedan derivar incompatibilidades de acuerdo con la LAC o que supongan amenazas que no puedan ser eliminadas o reducidas a un nivel aceptablemente bajo.' },
        { level: 'entidad', text: 'La entidad auditada tiene el conocimiento, experiencia y los recursos necesarios para la toma de decisiones requeridas por el trabajo.' },
      ],
    },
    {
      situacion: 'Riesgo de participar en la gestión y toma de decisiones de la entidad auditada.',
      salvaguardas: [
        { level: 'firma', text: 'Que el auditor de cuentas o sociedad de auditoría no participa en la toma de decisiones, siendo esta responsabilidad de la entidad auditada.' },
        { level: 'situacion', text: 'Asignación de diferentes equipos en la prestación de servicios distintos del de auditoría y en la auditoría de cuentas.' },
        { level: 'entidad', text: 'La entidad auditada no podrá basar su toma de decisiones exclusivamente en las recomendaciones/asesoramiento del auditor de cuentas o sociedad de auditoría sino que cualquier decisión adoptada tendrá que basarse en un análisis/valoración interna y en caso de considerarse oportuno o necesario, podrá recurrir a otros expertos.' },
      ],
    },
    {
      situacion: 'Relaciones de empleo con la entidad auditada, en especial las relacionadas con la información financiera.',
      salvaguardas: [
        { level: 'firma', text: 'Que se reemplace o sustituya al profesional que genere el potencial conflicto en el equipo del encargo.' },
        { level: 'situacion', text: 'En el caso de que no se requiera la rotación obligatoria del auditor de cuentas o sociedad de auditoría una vez transcurridos 10 años o de los auditores principales responsables una vez transcurridos 5 años, realización de procedimientos de control de calidad del trabajo de auditoría por profesionales ajenos al equipo del encargo.' },
        { level: 'entidad', text: 'La Dirección de la Sociedad designará una persona con conocimiento y experiencia adecuada en cuestiones objeto del SDA, para que sea el interlocutor con el equipo de trabajo asignado a la prestación del SDA, y evalúe los trabajos o recomendaciones objeto del servicio, y ponga dicha evaluación a disposición de las personas con competencia en la gestión o toma de decisiones de la Sociedad' },
      ],
    },
    {
      situacion: 'Recepción de regalos, obsequios, favores, atenciones, por parte de la entidad auditada que excedan un valor simbólico',
      salvaguardas: [
        { level: 'firma', text: 'Que se cumplimenten las confirmaciones de independencia del personal involucrado, tanto en la prestación de servicios de auditoría como de servicios distintos del de auditoría, en los términos establecidos por la norma, según su grado de vinculación, responsabilidades y funciones.' },
        { level: 'situacion', text: 'Rechazar regalos, atenciones, otros acuerdos financieros (por ejemplo préstamos) a precios distintos de los de mercado por parte de la entidad auditada y que excedan un valor insignificante o intranscendente' },
      ],
    },
    {
      situacion: 'Relaciones empresariales que el auditor de cuentas o sociedad de auditoría pueda mantener con cargos directivos o consejeros de la entidad auditada.',
      salvaguardas: [
        { level: 'firma', text: 'En la auditoría de una EIP, la rotación del auditor de cuentas o sociedad de auditoría, de los auditores principales responsables y de aquellos miembros del equipo del encargo que se dispongan, en los términos establecidos por el artículo 40 de la LAC.' },
        { level: 'situacion', text: 'En caso de entidades no EIP, se realizará evaluación en Herramienta de Familiaridad, pudiendo ser las salvaguardas a implantar por decision de Responsable Etica/Risk Manager una de las siguientes: rotación del auditor principal responsable y del equipo del encargo (de forma gradual) o cambiar su función en el equipo; nombramiento de un EQCR; o Revisión de control de calidad del trabajo (realización de un CTP) realizado por la persona afectada' },
      ],
    },
    {
      situacion: 'Cesión de personal a la entidad auditada',
      salvaguardas: [
        { level: 'situacion', text: 'Asignación de diferentes equipos en la prestación de servicios distintos del de auditoría y en la auditoría de cuentas.' },
        { level: 'entidad', text: 'Con independencia de que el resultado del trabajo esté bien desarrollado y detallado, es responsabilidad de la entidad auditada la evaluación del resultado de nuestro trabajo y en su caso, adaptarlo e implantarlo.' },
      ],
    },
    {
      situacion: null,
      salvaguardas: [
        { level: 'situacion', text: 'No ser miembros de los comités creados por la entidad auditada en relación con un proyecto donde se tomen las decisiones y no participar en los procesos deliberativos de los mismos.' },
      ],
    },
  ],

  threat_selfInterest: [
    {
      situacion: 'Prestar un servicio relacionado con una cuestión a dos o más entidades, incluida la entidad auditada, cuyos intereses con respecto a dicha cuestión no son coincidentes o son opuestos (conflicto de intereses)',
      salvaguardas: [],
    },
    {
      situacion: 'Tenencia de interés significativo directo (incluye instrumentos financieros, préstamos, etc.) por parte del auditor o la sociedad de auditoría en la entidad auditada.',
      salvaguardas: [],
    },
    {
      situacion: 'Realización de operaciones con instrumentos financieros por parte del auditor o la sociedad de auditoría en la entidad auditada',
      salvaguardas: [],
    },
    {
      situacion: 'Posesión de intereses financieros por parte del auditor o la sociedad de auditoría en la entidad auditada',
      salvaguardas: [
        { level: 'firma', text: '- Programas de formación y conocimientos del personal afectado\n- Existencia de medios para comunicar esas circunstancias y para confirmar la revision del cumplimiento de la normativa\n- Acceso a personal responsable de Etica e Independencia' },
        { level: 'situacion', text: 'Rechazar entrar en una relación empresarial en caso que la misma sea significativa para la entidad auditada o el auditor de cuentas.' },
        { level: 'situacion', text: 'Apartar del equipo del encargo de auditoría a personas de cuya participación se puedan derivar incompatibilidades de acuerdo con la LAC o que supongan amenazas que no puedan ser eliminadas o reducidas a un nivel aceptablemente bajo.' },
      ],
    },
    {
      situacion: 'Honorarios de una misma entidad auditada con un porcentaje significativo sobre el total de los ingresos anuales del auditor de cuentas o sociedad de auditoría',
      salvaguardas: [
        { level: 'firma', text: 'Ver CCOI Mazars Auditores ES y QAM, respecto al analisis y la documentacion de la amenaza, cuando debe ser evaluada como significativa y cuando debe ser aprobada la salvagurada por el RM; controles en las EIP. Ver Guía Amenaza Interés Propio por honorarios por SDA' },
      ],
    },
    {
      situacion: 'Recepción de regalos, obsequios, favores, atenciones, por parte de la entidad auditada que excedan un valor simbólico',
      salvaguardas: [
        { level: 'firma', text: 'Confirmaciones de independencia del personal involucrado, tanto en la prestación de servicios de auditoría como de servicios distintos a la auditoría, en los términos establecidos por la norma según su grado de vinculación, responsabilidades y funciones.' },
        { level: 'situacion', text: 'Rechazar regalos, atenciones, otros acuerdos financieros (por ejemplo préstamos) a precios distintos de los de mercado por parte de la entidad auditada y que excedan un valor insignificante o intranscendente' },
      ],
    },
    {
      situacion: 'Ofertas de empleo de la entidad auditada a miembros del equipo de trabajo de auditoría.',
      salvaguardas: [
        { level: 'firma', text: 'Equipos de trabajo distintos al del encargo de auditoría cuando proceda.' },
        { level: 'situacion', text: 'Apartar del equipo del encargo de auditoría a personas de cuya participación se puedan derivar incompatibilidades de acuerdo con la LAC o que supongan amenazas que no puedan ser eliminadas o reducidas a un nivel aceptablemente bajo.' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
        { level: 'situacion', text: 'Asignación de personal cualificado a las correspondientes áreas o aspectos afectados.' },
      ],
    },
    {
      situacion: 'Relaciones familiares o de amistad con la entidad auditada, o con sus propietarios o administradores',
      salvaguardas: [
        { level: 'firma', text: 'El cumplimiento del artículo 21 de la LAC que establece que las incompatibilidades establecidas en el artículo 16.1.a) 2º deberán solucionarse antes de la aceptación del nombramiento como auditor de cuentas.' },
        { level: 'situacion', text: 'Apartar del equipo del encargo de auditoría a personas de cuya participación se puedan derivar incompatibilidades de acuerdo con la LAC o que supongan amenazas que no puedan ser eliminadas o reducidas a un nivel aceptablemente bajo.' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
        { level: 'situacion', text: 'Asignación de personal cualificado a las correspondientes áreas o aspectos afectados.' },
      ],
    },
    {
      situacion: 'Relaciones de empleo recientes con la entidad auditada.',
      salvaguardas: [
        { level: 'firma', text: 'Evaluación de las extensiones establecidas por el artículo 18 de la LAC en referencia a las relaciones familiares' },
        { level: 'situacion', text: 'Apartar del equipo del encargo de auditoría a personas de cuya participación se puedan derivar incompatibilidades de acuerdo con la LAC o que supongan amenazas que no puedan ser eliminadas o reducidas a un nivel aceptablemente bajo.' },
        { level: 'situacion', text: 'Confirmación de independencia de la persona afectada' },
      ],
    },
    {
      situacion: 'La posición de inquilino del auditor frente a la de propietario de la entidad auditada',
      salvaguardas: [
        { level: 'situacion', text: 'Rechazo de la relación o eliminación de la situación' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
      ],
    },
    {
      situacion: 'Litigio entre la propia sociedad de auditoría y entre la entidad auditada',
      salvaguardas: [
        { level: 'firma', text: 'Un litigio entre la propia sociedad de auditoría y la entidad auditada supondría una amenaza significativa dificil de salvaguardar, independientemente de las cantidades involucradas en el litigio.\n\nEn caso de que el litigio fuera entre la entidad auditada y un miembro de la Red Mazars, un ejemplo de medida de salvaguarda, cuando la amenaza se considere significativa, es la revisión por un revisor competente del trabajo de auditoría realizado.' },
        { level: 'situacion', text: 'Rechazo de la relación o eliminación de la situación' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
      ],
    },
    {
      situacion: 'Relaciones empresariales con la entidad auditada, o con sus propietarios o administradores',
      salvaguardas: [
        { level: 'firma', text: 'Analisis previo a la transaccion o inicio de la relacion\nDocumentacion del analisis y autorizacion por Risk Manager' },
        { level: 'situacion', text: 'Rechazo de la relación o eliminación de la situación' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
      ],
    },
    {
      situacion: 'Honorarios: Desproporcionalidad entre los honorarios percibidos por los servicios de auditoría y los servicios distintos de auditoría',
      salvaguardas: [
        { level: 'firma', text: 'Ver CCOI Mazars Auditores ES y QAM, respecto al analisis y la documentacion de la amenaza, cuando debe ser evaluada como significativa y cuando debe ser aprobada la salvagurada por el RM; controles en las EIP. Ver Guía Amenaza Interés Propio por honorarios por SDA' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
        { level: 'situacion', text: 'Rechazo de la relación o eliminación de la situación' },
      ],
    },
    {
      situacion: 'Honorarios impagados por parte de la entidad auditada',
      salvaguardas: [
        { level: 'firma', text: 'Ver CCOI Mazars Auditores ES\n\nCuando el impago supere 1 año, se determinará si los honorarios pueden equipararse a un préstamo al cliente y si, debido a la importancia de los honorarios impagados, existe una amenaza significativa, en cuyo caso se pondrá en conocimiento del Risk Manager, que evaluará la continuidad o, en caso de no poder renunciar, las implicaciones de las acciones que se deriven' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
      ],
    },
    {
      situacion: 'Honorarios demasiado bajos',
      salvaguardas: [
        { level: 'firma', text: 'Ver CCOI Mazars Auditores ES\nPueden suponer una posible amenaza de interés propio en relación con la competencia y diligencia profesionales. Si los honorarios son demasiado bajos puede resultar difícil llevar a cabo el encargo de conformidad con las normas técnicas y profesionales aplicables.' },
        { level: 'situacion', text: 'Poner en conocimiento del cliente las condiciones del encargo, y en particular, la base sobre la que se calculan los honorarios; Asegurar que se han asignado recursos adecuados; Ajustar el nivel de honorarios o el alcance del encargo' },
        { level: 'situacion', text: 'Solicitar al Risk Manager que valide la decisión de continuar con el encargo' },
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
      ],
    },
    {
      situacion: 'Honorarios por referencias o comisiones',
      salvaguardas: [
        { level: 'firma', text: 'Ver CCOI Mazars Auditores ES\nEn general no pueden prestarse servicios SDA con honorarios contingentes, en todo caso, deben ser autorizados por el Risk Manager\n\nPueden suponer una amenaza de interés propio en relación con los principios de objetividad y competencia y diligencia profesionales al:i) Recibir honorarios por referir un servicio para un cliente a un tercero, o ii) Recibir una comisión de un tercero por bienes vendidos a un cliente, o iii) Pagar unos honorarios para obtener un cliente' },
        { level: 'situacion', text: 'Solicitar autorización al Risk Manager\n\nCuando se adquiere otra firma de contabilidad, los pagos a sus anteriores propietarios no se consideran honorarios por referencia o comisiones' },
      ],
    },
    {
      situacion: 'Honorarios contingentes en la prestación de servicios distintos del de auditoría.',
      salvaguardas: [
        { level: 'firma', text: 'No pueden prestarse servicios SDA con honorarios contingentes.\nVer CCOI Mazars Auditores ES' },
      ],
    },
  ],

  threat_intimidation: [
    {
      situacion: 'Posición de presión (cese de nombramiento, impacto sobre familiares del auditor de cuentas, demandas, por relaciones de negocio con directivos o consejeros de la entidad auditada..) por parte de la entidad auditada.',
      salvaguardas: [
        { level: 'firma', text: 'Existencia de procedimientos en la sociedad de auditoría para asegurar: La comunicación con los órganos de gobierno de la entidad auditada.' },
        { level: 'situacion', text: 'Apartar del equipo del encargo de auditoría a personas de cuya participación se puedan derivar incompatibilidades de acuerdo con la LAC o que supongan amenazas que no puedan ser eliminadas o reducidas a un nivel aceptablemente bajo.' },
      ],
    },
    {
      situacion: 'Exigencias no razonables por parte de la entidad auditada.',
      salvaguardas: [
        { level: 'situacion', text: 'La revisión del trabajo realizado por un revisor competente que no intervino en la auditoría o en el servicio, o su asesoramiento según sea necesario, con el fin de valorar si los juicios clave y las conclusiones son adecuados.' },
      ],
    },
    {
      situacion: 'Percepción de presión o influencia por la entidad auditada por mantener los servicios que se prestan a la entidad auditada o las relaciones que se mantienen con esta',
      salvaguardas: [
        { level: 'situacion', text: 'Asignación de personal cualificado a las correspondientes áreas o aspectos afectados.' },
      ],
    },
    {
      situacion: 'Amenaza de revocación por mantener una determinada posición o criterio',
      salvaguardas: [
        { level: 'situacion', text: 'El establecimiento de los procesos de control de calidad de los trabajos de auditoría existentes y establecidos específicamente para un trabajo donde se haya recibido esta presión.' },
      ],
    },
    {
      situacion: 'Honorarios: Desproporcionalidad entre los honorarios percibidos por los servicios de auditoría y los servicios distintos de auditoría',
      salvaguardas: [
        { level: 'situacion', text: 'Separación absoluta entre el auditor principal responsable y quien ejerce o recibe la presión o influencia.' },
      ],
    },
    {
      situacion: 'Honorarios por prestar servicios distintos de auditoría no prohibidos: por temor a su pérdida',
      salvaguardas: [
        { level: 'situacion', text: 'La renuncia al nombramiento como auditor de cuentas, en caso necesario.' },
      ],
    },
  ],

  threat_decisionMaking: [
    {
      situacion: 'Riesgo de participar en la gestión y toma de decisiones de la entidad auditada.',
      salvaguardas: [
        { level: 'firma', text: 'Que el auditor de cuentas o sociedad de auditoría no participa en la toma de decisiones, siendo esta responsabilidad de la entidad auditada.' },
        { level: 'situacion', text: 'Asignación de diferentes equipos en la prestación de servicios distintos del de auditoría y en la auditoría de cuentas.' },
        { level: 'entidad', text: 'La entidad auditada no podrá basar su toma de decisiones exclusivamente en las recomendaciones/asesoramiento del auditor de cuentas o sociedad de auditoría sino que cualquier decisión adoptada tendrá que basarse en un análisis/valoración interna y en caso de considerarse oportuno o necesario, podrá recurrir a otros expertos.' },
      ],
    },
    {
      situacion: 'Prestación de servicios distintos de auditoría que pueda entenderse que implican participacion en la toma de decisiones de la entidad auditada',
      salvaguardas: [
        { level: 'firma', text: 'De conformidad con el art 14.2 LAC y 37.2 RLAC, está prohibida la participación por el auditor de cualquier manera en la gestión o toma de decisiones de la entidad auditada' },
        { level: 'situacion', text: 'Con carácter general, según art 37.2 RLAC, no se entenderá que el auditor ha participado en la toma de decisiones de la entidad auditada cuando realice algún trabajo, o emita algún informe o recomendación relacionada con cualquier servicio ajeno a la auditoría en el que concurran las siguientes circunstancias:\n- Permita a la entidad auditada decidir entre alternativas razonables que lleven a la toma de decisiones diferentes;\n- Estén basados en datos observables o en estándares o prácticas habituales;\n- La entidad auditada, mediante personas cualificadas y con experiencia, evalúe los trabajos o recomendaciones objeto del servicio y ponga dicha evaluación a disposición de las personas con competencia en la gestión o toma de decisiones en la entidad auditada.;\nCuando no existieran alternativas posibles de acuerdo con la normativa aplicable o cuando de hecho no sea posible más que una solución deberá quedar adecuadamente documentada la justificación de esta situación en el archivo de auditor.' },
        { level: 'entidad', text: 'En la medida que nuestros servicios incluyan opiniones o recomendaciones, se atenderá a lo que dispone el art 37.2 RLAC y será responsabilidad de la dirección decidir sobre su implantación, sin que auditor o sociedad de auditoría participe en el proceso de toma de decisiones, así como de su puesta en práctica.' },
      ],
    },
  ],
}

/**
 * Get safeguard examples for a specific threat key.
 * Returns array of { situacion, salvaguardas: [{ level, text }] }
 */
export function getSafeguardExamples(threatKey) {
  return SAFEGUARD_EXAMPLES[threatKey] || []
}

/**
 * Get all safeguard examples for multiple threat keys (only those marked SI).
 * Returns { threatKey: { label, entries } }
 */
export function getSafeguardExamplesForThreats(formData, threatLabels) {
  const result = {}
  for (const [key, entries] of Object.entries(SAFEGUARD_EXAMPLES)) {
    if (formData[key] === 'SI') {
      result[key] = {
        label: (threatLabels && threatLabels[key]) || key,
        entries,
      }
    }
  }
  return result
}

/**
 * Get a flat list of all unique safeguard texts for given threat keys.
 * Useful for building a selectable list.
 */
export function getAllSafeguardTexts(threatKeys) {
  const seen = new Set()
  const result = []
  for (const key of threatKeys) {
    const entries = SAFEGUARD_EXAMPLES[key] || []
    for (const entry of entries) {
      for (const s of entry.salvaguardas) {
        const id = `${s.level}::${s.text}`
        if (!seen.has(id)) {
          seen.add(id)
          result.push({ ...s, threatKey: key })
        }
      }
    }
  }
  return result
}

export default SAFEGUARD_EXAMPLES
