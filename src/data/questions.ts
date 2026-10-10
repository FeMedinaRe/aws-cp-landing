export interface Question {
  id: string;
  domainId: '1' | '2' | '3' | '4';
  questionEs: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Banco original de preguntas de práctica (contenido NO oficial, no son preguntas reales del examen).
export const QUESTIONS: Question[] = [
  // ---- Dominio 1 (24 %) ----
  {
    id: 'd1-01',
    domainId: '1',
    questionEs: '¿Cuál es una ventaja principal de migrar de CapEx a OpEx en la nube?',
    options: [
      'Hay que comprar servidores por adelantado para 5 años',
      'Se paga solo por lo que se consume, sin gran inversión inicial',
      'Se pierde la capacidad de escalar',
      'Aumenta el gasto en centros de datos propios',
    ],
    correctIndex: 1,
    explanation:
      'OpEx permite cambiar la compra anticipada de hardware (CapEx) por pago variable por uso, reduciendo la inversión inicial y el riesgo de sobredimensionar.',
  },
  {
    id: 'd1-02',
    domainId: '1',
    questionEs: 'Una tienda online recibe 10 veces más tráfico en rebajas. ¿Qué característica de la nube resuelve esto mejor?',
    options: [
      'Elasticidad para escalar y reducir capacidad según la demanda',
      'Comprar servidores fijos para el pico anual',
      'Desactivar el monitoreo',
      'Usar solo almacenamiento local',
    ],
    correctIndex: 0,
    explanation:
      'La elasticidad (p. ej. con Auto Scaling) permite ampliar la capacidad en picos y reducirla después, pagando solo lo necesario.',
  },
  {
    id: 'd1-03',
    domainId: '1',
    questionEs: '¿Qué describe mejor el modelo IaaS frente a SaaS?',
    options: [
      'En IaaS el cliente gestiona el SO; en SaaS solo usa la aplicación',
      'En SaaS el cliente gestiona el hardware físico',
      'IaaS y SaaS son idénticos',
      'En IaaS no existe virtualización',
    ],
    correctIndex: 0,
    explanation:
      'En IaaS (p. ej. EC2) el cliente controla el sistema operativo y las apps; en SaaS consume una aplicación gestionada sin administrar la infraestructura.',
  },
  {
    id: 'd1-04',
    domainId: '1',
    questionEs: 'Una empresa quiere mover sus máquinas virtuales tal cual a EC2 sin cambios. ¿Qué estrategia de las 6 R es?',
    options: ['Refactor', 'Rehost (lift-and-shift)', 'Repurchase', 'Retire'],
    correctIndex: 1,
    explanation:
      'Rehost o lift-and-shift mueve las cargas sin modificarlas; es la vía más rápida aunque no la más optimizada para la nube.',
  },
  {
    id: 'd1-05',
    domainId: '1',
    questionEs: '¿Qué es el dimensionamiento correcto (right-sizing)?',
    options: [
      'Usar siempre la instancia más grande disponible',
      'Ajustar el tamaño de los recursos a la carga real para evitar desperdicio',
      'Desactivar todas las alarmas',
      'Comprar hardware on-premises',
    ],
    correctIndex: 1,
    explanation:
      'Right-sizing consiste en elegir el tipo y tamaño adecuados según métricas reales; herramientas como Compute Optimizer ayudan a detectar sobredimensionamiento.',
  },
  {
    id: 'd1-06',
    domainId: '1',
    questionEs: '¿Qué marco de AWS organiza la adopción de la nube en perspectivas de negocio, personas, gobernanza, plataforma, seguridad y operaciones?',
    options: [
      'AWS CAF (Cloud Adoption Framework)',
      'Amazon VPC',
      'AWS Shield',
      'Amazon Route 53',
    ],
    correctIndex: 0,
    explanation:
      'AWS CAF estructura la transformación en seis perspectivas para coordinar a todos los equipos durante la migración.',
  },
  {
    id: 'd1-07',
    domainId: '1',
    questionEs: '¿Qué modelo de despliegue combina un centro de datos propio con AWS?',
    options: [
      'Nube híbrida',
      'Solo on-premises',
      'SaaS puro sin red',
      'Sin conexión',
    ],
    correctIndex: 0,
    explanation:
      'La nube híbrida conecta lo local con AWS (VPN, Direct Connect u Outposts) y permite migraciones por etapas.',
  },
  {
    id: 'd1-08',
    domainId: '1',
    questionEs: '¿Cuál es un beneficio de las economías de escala de AWS?',
    options: [
      'Costes unitarios menores al agregar la demanda de miles de clientes',
      'Cada cliente paga su propio centro de datos',
      'Menor agilidad',
      'Mayor tiempo de aprovisionamiento',
    ],
    correctIndex: 0,
    explanation:
      'Al agregar una demanda enorme, AWS logra precios unitarios más bajos que los que obtendría un cliente por separado.',
  },
  // ---- Dominio 2 (30 %) ----
  {
    id: 'd2-01',
    domainId: '2',
    questionEs: 'Según el modelo de responsabilidad compartida, ¿de qué es responsable SIEMPRE el cliente?',
    options: [
      'Del hardware físico de los centros de datos',
      'De sus datos, accesos y configuración',
      'De la virtualización del hipervisor',
      'Del cableado de las instalaciones',
    ],
    correctIndex: 1,
    explanation:
      'AWS protege la infraestructura (DE la nube); el cliente protege lo que pone EN la nube: datos, identidades, cifrado y configuración.',
  },
  {
    id: 'd2-02',
    domainId: '2',
    questionEs: '¿Quién parchea el sistema operativo en Amazon EC2 y quién en AWS Lambda?',
    options: [
      'En ambos lo hace AWS',
      'En EC2 el cliente; en Lambda AWS gestiona la plataforma',
      'En ambos lo hace el cliente',
      'Nadie los parchea nunca',
    ],
    correctIndex: 1,
    explanation:
      'En EC2 (IaaS) el cliente administra el SO; en Lambda (serverless) AWS gestiona servidores y runtime, y el cliente solo aporta el código y los permisos.',
  },
  {
    id: 'd2-03',
    domainId: '2',
    questionEs: '¿Qué práctica de IAM sigue el principio de mínimo privilegio?',
    options: [
      'Dar AdministratorAccess a todos',
      'Otorgar solo los permisos necesarios para la tarea',
      'Compartir la cuenta raíz',
      'Incrustar claves en el código',
    ],
    correctIndex: 1,
    explanation:
      'El mínimo privilegio otorga solo lo imprescindible y reduce el impacto de credenciales comprometidas.',
  },
  {
    id: 'd2-04',
    domainId: '2',
    questionEs: 'Una aplicación en EC2 necesita leer un bucket S3. ¿Qué es más seguro?',
    options: [
      'Guardar claves en el código',
      'Asignar un rol IAM a la instancia con permiso de solo lectura',
      'Hacer público el bucket',
      'Compartir la contraseña raíz',
    ],
    correctIndex: 1,
    explanation:
      'Los roles proporcionan credenciales temporales automáticas sin claves permanentes y se limitan al permiso mínimo.',
  },
  {
    id: 'd2-05',
    domainId: '2',
    questionEs: '¿Qué servicio protege contra ataques DDoS y cuál filtra ataques web como SQL injection?',
    options: [
      'Shield contra DDoS y WAF contra ataques web',
      'WAF contra DDoS y Shield contra SQL injection',
      'KMS contra ambos',
      'Artifact contra ambos',
    ],
    correctIndex: 0,
    explanation:
      'AWS Shield mitiga DDoS en capas 3/4 (y 7 con Advanced); AWS WAF inspecciona peticiones HTTP contra inyecciones y XSS.',
  },
  {
    id: 'd2-06',
    domainId: '2',
    questionEs: '¿Qué servicio registra las llamadas a la API de AWS para auditoría (quién hizo qué y cuándo)?',
    options: ['AWS CloudTrail', 'Amazon Polly', 'Amazon Athena', 'AWS Budgets'],
    correctIndex: 0,
    explanation:
      'CloudTrail registra las acciones de la API y consola; es la base de la auditoría. Config registra la configuración de recursos.',
  },
  {
    id: 'd2-07',
    domainId: '2',
    questionEs: '¿Dónde descarga un auditor los informes de cumplimiento ISO/SOC/PCI de AWS?',
    options: [
      'AWS Artifact',
      'Amazon S3 sin más',
      'AWS Lambda',
      'Amazon EC2',
    ],
    correctIndex: 0,
    explanation:
      'AWS Artifact centraliza informes y certificaciones de conformidad de terceros sobre la infraestructura de AWS.',
  },
  {
    id: 'd2-08',
    domainId: '2',
    questionEs: '¿Qué gestiona AWS KMS?',
    options: [
      'Claves de cifrado para proteger datos en reposo y controlar su uso',
      'Nombres de dominio DNS',
      'Vídeos en streaming',
      'Presupuestos mensuales',
    ],
    correctIndex: 0,
    explanation:
      'KMS crea y controla claves para cifrar S3, EBS, RDS y otros servicios, con permisos IAM y rotación.',
  },
  // ---- Dominio 3 (34 %) ----
  {
    id: 'd3-01',
    domainId: '3',
    questionEs: '¿Qué diferencia hay entre una región y una zona de disponibilidad (AZ)?',
    options: [
      'Son lo mismo',
      'La región es un área geográfica con varias AZ aisladas entre sí',
      'La AZ contiene varias regiones',
      'Las regiones no tienen centros de datos',
    ],
    correctIndex: 1,
    explanation:
      'Cada región agrupa varias AZ (centros de datos con aislamiento de energía/red). Desplegar en varias AZ aporta alta disponibilidad.',
  },
  {
    id: 'd3-02',
    domainId: '3',
    questionEs: 'Un sitio con imágenes estáticas para usuarios globales va lento. ¿Qué servicio lo acelera?',
    options: [
      'Amazon CloudFront (CDN)',
      'AWS Budgets',
      'AWS Artifact',
      'Amazon Redshift',
    ],
    correctIndex: 0,
    explanation:
      'CloudFront cachea el contenido en puntos de presencia cercanos al usuario y reduce la latencia.',
  },
  {
    id: 'd3-03',
    domainId: '3',
    questionEs: '¿Qué servicio usarías para máquinas virtuales con control total del SO?',
    options: [
      'Amazon EC2',
      'Amazon Polly',
      'Amazon SNS',
      'AWS Artifact',
    ],
    correctIndex: 0,
    explanation:
      'EC2 proporciona instancias (VM) donde eliges AMI, tipo, red y administras el sistema operativo.',
  },
  {
    id: 'd3-04',
    domainId: '3',
    questionEs: 'Necesitas ejecutar código solo cuando se sube un archivo, sin servidores. ¿Qué servicio encaja?',
    options: [
      'AWS Lambda (serverless por eventos)',
      'Instancia EC2 encendida 24/7',
      'Cable físico',
      'Un servidor on-premises',
    ],
    correctIndex: 0,
    explanation:
      'Lambda se dispara por eventos (p. ej. S3), escala a cero y cobra por ejecución: ideal para cargas esporádicas.',
  },
  {
    id: 'd3-05',
    domainId: '3',
    questionEs: '¿Qué almacenamiento elegirías para fotos de una web y para discos de EC2, respectivamente?',
    options: [
      'S3 para objetos y EBS para bloques de EC2',
      'EBS para web pública y S3 para arranque',
      'Cintas físicas en ambos casos',
      'RAM volátil en ambos casos',
    ],
    correctIndex: 0,
    explanation:
      'S3 almacena objetos por web/API con alta durabilidad; EBS ofrece volúmenes de bloque persistentes para una instancia.',
  },
  {
    id: 'd3-06',
    domainId: '3',
    questionEs: 'App con base relacional que necesita alta disponibilidad con conmutación automática. ¿Qué opción es adecuada?',
    options: [
      'Amazon RDS con despliegue Multi-AZ',
      'Una hoja de cálculo local',
      'Sin copias de seguridad',
      'Un solo disco sin réplica',
    ],
    correctIndex: 0,
    explanation:
      'RDS Multi-AZ mantiene una réplica en espera en otra AZ y conmuta automáticamente ante un fallo.',
  },
  {
    id: 'd3-07',
    domainId: '3',
    questionEs: 'Necesitas caché en memoria para sesiones y Cola de mensajes entre microservicios. ¿Qué par encaja?',
    options: [
      'ElastiCache y SQS',
      'Route 53 y Shield',
      'Budgets y Artifact',
      'KMS y Macie',
    ],
    correctIndex: 0,
    explanation:
      'ElastiCache (Redis/Memcached) acelera lecturas y sesiones; SQS desacopla microservicios con colas.',
  },
  {
    id: 'd3-08',
    domainId: '3',
    questionEs: '¿Qué hace Elastic Load Balancing junto con Auto Scaling?',
    options: [
      'Reparte el tráfico entre instancias y ajusta cuántas hay según la demanda',
      'Aumenta la factura siempre',
      'Elimina la necesidad de VPC',
      'Guarda contraseñas',
    ],
    correctIndex: 0,
    explanation:
      'ELB distribuye peticiones entre AZ e instancias sanas; Auto Scaling añade o quita instancias según métricas de CloudWatch.',
  },
  // ---- Dominio 4 (12 %) ----
  {
    id: 'd4-01',
    domainId: '4',
    questionEs: 'Una carga estable 24/7 durante 3 años quiere el menor precio. ¿Qué conviene?',
    options: [
      'Savings Plans o instancias reservadas',
      'Solo bajo demanda sin compromiso',
      'Apagar la cuenta',
      'Instancias spot para la base productiva crítica',
    ],
    correctIndex: 0,
    explanation:
      'El compromiso 1-3 años de Savings Plans/RI ofrece grandes descuentos frente a bajo demanda en uso constante.',
  },
  {
    id: 'd4-02',
    domainId: '4',
    questionEs: '¿Qué herramienta estima el coste ANTES de desplegar y cuál analiza el gasto DESPUÉS?',
    options: [
      'Pricing Calculator antes y Cost Explorer después',
      'Cost Explorer antes y Pricing Calculator después',
      'Shield en ambos casos',
      'Route 53 en ambos casos',
    ],
    correctIndex: 0,
    explanation:
      'Pricing Calculator modela arquitecturas y precios; Cost Explorer visualiza el gasto histórico por servicio o etiqueta.',
  },
  {
    id: 'd4-03',
    domainId: '4',
    questionEs: 'Quieres un aviso cuando el gasto supere el 80 % del presupuesto. ¿Qué usas?',
    options: [
      'AWS Budgets con alertas',
      'AWS Shield',
      'Amazon EC2 sin más',
      'AWS WAF',
    ],
    correctIndex: 0,
    explanation:
      'Budgets define umbrales de coste/uso y envía alertas (e incluso acciones) al superarlos.',
  },
  {
    id: 'd4-04',
    domainId: '4',
    questionEs: '¿Qué plan de soporte incluye un TAM (Technical Account Manager) dedicado?',
    options: [
      'Enterprise',
      'Basic',
      'Solo Basic',
      'Ninguno',
    ],
    correctIndex: 0,
    explanation:
      'Solo los planes Enterprise (y On-Ramp) asignan un TAM para orientación proactiva y gestión de eventos.',
  },
  {
    id: 'd4-05',
    domainId: '4',
    questionEs: 'Un proyecto personal de estudio solo necesita ayuda con la factura. ¿Qué plan basta?',
    options: [
      'Basic (gratuito)',
      'Enterprise con TAM',
      'Contratar un centro de datos',
      'Ningún recurso',
    ],
    correctIndex: 0,
    explanation:
      'Basic incluye soporte de facturación, documentación y un subconjunto de Trusted Advisor sin coste.',
  },
  {
    id: 'd4-06',
    domainId: '4',
    questionEs: '¿Para qué sirven las etiquetas (tags) en facturación?',
    options: [
      'Para repartir y filtrar costes por proyecto, entorno o equipo',
      'Para acelerar la red',
      'Para cifrar discos',
      'Para crear regiones',
    ],
    correctIndex: 0,
    explanation:
      'Etiquetar recursos (p. ej. Proyecto=A, Entorno=prod) permite ver el gasto en Cost Explorer por cada dimensión.',
  },
  {
    id: 'd4-07',
    domainId: '4',
    questionEs: '¿Qué trabajo batch tolerante a interrupciones sale más barato?',
    options: [
      'Instancias spot',
      'Instancias bajo demanda siempre encendidas al máximo tamaño',
      'Comprar servidores físicos nuevos',
      'Sin cómputo',
    ],
    correctIndex: 0,
    explanation:
      'Spot aprovecha capacidad libre con descuentos de hasta ~90 %, asumiendo interrupciones: ideal para batch reintentable.',
  },
  {
    id: 'd4-08',
    domainId: '4',
    questionEs: '¿Qué informe ofrece el detalle más granular del gasto para analizarlo con Athena?',
    options: [
      'El informe de coste y uso (CUR)',
      'Un registro DNS',
      'Una clave KMS',
      'Un grupo de seguridad',
    ],
    correctIndex: 0,
    explanation:
      'El CUR contiene líneas por hora/recurso que pueden consultarse para auditorías finas de costes.',
  },
];
