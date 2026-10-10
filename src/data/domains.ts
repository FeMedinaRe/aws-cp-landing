export interface Lesson {
  id: string;
  title: string;
  body: string;
  keyPoints: string[];
  example?: string;
}

export interface Domain {
  id: '1' | '2' | '3' | '4';
  titleEs: string;
  titleEn: string;
  weight: number;
  description: string;
  objectives: string[];
  lessons: Lesson[];
}

export const DOMAINS: Domain[] = [
  {
    id: '1',
    titleEs: 'Conceptos de la nube',
    titleEn: 'Cloud Concepts',
    weight: 24,
    description:
      'Fundamentos del modelo de nube: ventajas, elasticidad, tipos de despliegue, migración y economía de la nube. Base para entender por qué las organizaciones adoptan AWS.',
    objectives: [
      '1.1 Definir las ventajas de la nube de AWS: agilidad, elasticidad, economías de escala y alcance global.',
      '1.2 Identificar principios de diseño en la nube: alta disponibilidad, tolerancia a fallos, desacoplamiento y diseño para el fracaso.',
      '1.3 Describir las estrategias y beneficios de la migración a la nube: las 6 R, CAF (Cloud Adoption Framework) y fases de migración.',
      '1.4 Explicar conceptos de economía de la nube: CapEx frente a OpEx, precios bajo demanda y dimensionamiento correcto (right-sizing).',
    ],
    lessons: [
      {
        id: '1-nube',
        title: 'Qué es la nube y sus ventajas',
        body: 'La computación en la nube es la entrega bajo demanda de recursos de TI (cómputo, almacenamiento, bases de datos, redes) a través de internet con pago por uso. AWS opera una infraestructura global que permite aprovisionar un servidor en minutos, escalar de una a miles de instancias y pagar solo por lo consumido. Las seis ventajas clásicas son: cambiar gasto de capital (CapEx) por gasto variable (OpEx), beneficiarse de economías de escala masivas, dejar de adivinar la capacidad, aumentar velocidad y agilidad, dejar de gastar en centros de datos propios y tener alcance global en minutos. Ejemplo: una tienda online pasa de comprar servidores para el pico de Navidad a escalar automáticamente con demanda.',
        keyPoints: [
          'Nube = recursos bajo demanda, pago por uso, acceso por internet y elasticidad.',
          'CapEx (comprar servidores) frente a OpEx (pagar por hora/segundo consumido).',
          'Elasticidad: escalar hacia fuera/adentro según demanda; escalabilidad y agilidad.',
          'Alcance global: desplegar en regiones de todo el mundo en minutos.',
          'Alta disponibilidad y tolerancia a fallos se diseñan, no se heredan.',
        ],
        example:
          'Ejemplo: una startup lanza su app en una región y, al crecer en Latinoamérica y Europa, replica su arquitectura en otras regiones sin comprar hardware.',
      },
      {
        id: '1-modelos',
        title: 'Modelos de despliegue y de servicio',
        body: 'Existen tres modelos de despliegue: nube pública (todo en AWS), híbrida (on-premises + nube conectados, por ejemplo con AWS Outposts o Direct Connect) y on-premises o privada. Los tres modelos de servicio son IaaS (infraestructura como servicio, p. ej. Amazon EC2 donde gestionas el SO), PaaS (plataforma como servicio, p. ej. AWS Elastic Beanstalk donde solo subes el código) y SaaS (software como servicio, p. ej. una aplicación ya gestionada). El examen pide distinguirlos: en IaaS controlas más pero gestionas más; en SaaS gestionas menos pero controlas menos. La nube híbrida es clave en migraciones por etapas.',
        keyPoints: [
          'Despliegue: pública, híbrida y privada (on-premises).',
          'IaaS (EC2), PaaS (Elastic Beanstalk) y SaaS (aplicaciones gestionadas).',
          'A mayor abstracción (SaaS), menor gestión y menor control.',
          'Híbrida combina centro de datos propio con AWS (Direct Connect, VPN, Outposts).',
          'Serverless (Lambda) es un caso extremo de abstracción: sin gestionar servidores.',
        ],
        example:
          'Ejemplo: EC2 = alquilas la máquina virtual y la configuras; Elastic Beanstalk = subes el código y AWS gestiona la plataforma; un CRM SaaS = solo lo usas.',
      },
      {
        id: '1-migracion',
        title: 'Migración, CAF y economía de la nube',
        body: 'Migrar a la nube sigue estrategias conocidas como las 6 R: Rehost (lift-and-shift), Replatform (lift-tinker-and-shift), Repurchase (cambiar a SaaS), Refactor/Rearchitect (rediseñar cloud-native), Retain (mantener) y Retire (retirar). AWS CAF (Cloud Adoption Framework) organiza la adopción en seis perspectivas: negocio, personas, gobernanza, plataforma, seguridad y operaciones. En economía, el examen insiste en: dejar de adivinar capacidad, beneficiarse del precio por uso, dimensionar correctamente (right-sizing) con herramientas como AWS Compute Optimizer y usar Savings Plans o instancias reservadas para cargas estables. El coste total de propiedad (TCO) compara on-premises frente a nube incluyendo hardware, energía y personal.',
        keyPoints: [
          'Las 6 R: Rehost, Replatform, Repurchase, Refactor, Retain y Retire.',
          'AWS CAF: seis perspectivas (negocio, personas, gobernanza, plataforma, seguridad, operaciones).',
          'Right-sizing: ajustar el tamaño de instancias a la carga real para ahorrar.',
          'Savings Plans e instancias reservadas para uso estable; bajo demanda para picos.',
          'TCO y AWS Pricing Calculator ayudan a comparar costes antes de migrar.',
        ],
        example:
          'Ejemplo: una empresa hace Rehost de 50 máquinas virtuales a EC2 en semanas y luego optimiza con right-sizing, reduciendo un 30 % su factura.',
      },
    ],
  },
  {
    id: '2',
    titleEs: 'Seguridad y cumplimiento',
    titleEn: 'Security and Compliance',
    weight: 30,
    description:
      'Modelo de responsabilidad compartida, identidad y acceso (IAM), cifrado, servicios de protección y recursos de cumplimiento. Es el dominio con más peso conceptual del examen.',
    objectives: [
      '2.1 Definir el modelo de responsabilidad compartida de AWS (seguridad DE la nube frente a seguridad EN la nube).',
      '2.2 Identificar conceptos de seguridad, gobernanza y cumplimiento: IAM, MFA, políticas, roles y cifrado.',
      '2.3 Describir capacidades de seguridad de AWS: detección, protección perimetral y respuesta (GuardDuty, Shield, WAF, KMS).',
      '2.4 Identificar recursos de cumplimiento: AWS Artifact, AWS Config, CloudTrail, Audit Manager y programas de conformidad.',
    ],
    lessons: [
      {
        id: '2-responsabilidad',
        title: 'Modelo de responsabilidad compartida',
        body: 'AWS es responsable de la seguridad DE la nube (hardware, red física, virtualización e instalaciones), mientras el cliente es responsable de la seguridad EN la nube (datos, cifrado, configuración de servicios, IAM y sistema operativo en EC2). En servicios gestionados como RDS o Lambda, AWS asume más capas (parcheo del SO), pero el cliente siempre conserva la responsabilidad sobre sus datos, quién accede y cómo se cifran. Un error típico es dejar un bucket S3 público: la infraestructura es segura, pero la configuración es del cliente. El examen pregunta sistemáticamente quién es responsable de cada capa según el servicio (IaaS frente a servicios gestionados).',
        keyPoints: [
          'AWS: seguridad DE la nube (centros de datos, hardware, virtualización).',
          'Cliente: seguridad EN la nube (datos, accesos, cifrado, configuración).',
          'En EC2 el cliente parchea el SO; en RDS/Lambda AWS parchea la plataforma.',
          'El cliente siempre es dueño de sus datos y del control de accesos.',
          'Un bucket S3 público por error es responsabilidad del cliente, no de AWS.',
        ],
        example:
          'Ejemplo: si olvidas restringir un grupo de seguridad de EC2 y alguien accede, el fallo es de configuración del cliente dentro de su responsabilidad.',
      },
      {
        id: '2-iam',
        title: 'IAM: usuarios, roles, políticas y MFA',
        body: 'AWS Identity and Access Management (IAM) gestiona quién puede hacer qué. Conceptos clave: usuarios (personas o apps), grupos (colecciones de usuarios), roles (identidades temporales que se asumen, ideales para EC2 o acceso entre cuentas) y políticas (documentos JSON que permiten o deniegan acciones). Se aplica el principio de mínimo privilegio: otorgar solo los permisos necesarios. La autenticación multifactor (MFA) añade una segunda prueba además de la contraseña y debe activarse en la cuenta raíz. IAM es global, sin coste y con funciones como el analizador de acceso, la rotación de claves y las políticas gestionadas frente a las gestionadas por el cliente. Nunca se usan la cuenta raíz para el día a día ni se incrustan claves en el código.',
        keyPoints: [
          'Usuarios, grupos, roles y políticas JSON (Allow/Deny explícitos).',
          'Principio de mínimo privilegio y denegación por defecto.',
          'MFA obligatorio en la cuenta raíz; roles mejor que claves de larga duración.',
          'Roles para EC2 (instance profile) y acceso entre cuentas sin compartir claves.',
          'Cuenta raíz: protegerla, no usarla a diario y activar MFA.',
        ],
        example:
          'Ejemplo: una app en EC2 necesita leer de S3; en vez de guardar claves, se le asigna un rol IAM con permiso solo de lectura sobre ese bucket.',
      },
      {
        id: '2-proteccion',
        title: 'Protección, detección y cumplimiento',
        body: 'AWS ofrece defensa en profundidad. En el perímetro: AWS Shield (protección DDoS, Standard gratis y Advanced de pago), AWS WAF (firewall de aplicaciones web contra SQL injection y XSS) y Amazon Inspector y GuardDuty (detección de amenazas con machine learning). Para datos: AWS KMS gestiona claves de cifrado para el cifrado en reposo (S3, EBS, RDS), con permisos IAM y rotación; el cifrado en tránsito se protege con TLS (por ejemplo con certificados gestionados por AWS Certificate Manager), que es un mecanismo distinto de KMS. Para gobernanza: AWS Organizations y Service Control Policies (SCP) limitan cuentas, AWS Config registra la configuración y su historial, AWS CloudTrail audita llamadas a la API y AWS Artifact centraliza informes de cumplimiento (ISO, SOC, PCI). El examen asocia cada servicio con su función: Shield = DDoS, WAF = capa 7, GuardDuty = detección, KMS = claves y cifrado en reposo, TLS/ACM = cifrado en tránsito, Artifact = informes.',
        keyPoints: [
          'Shield (DDoS), WAF (ataques web capa 7), GuardDuty (detección inteligente).',
          'KMS gestiona claves para el cifrado en reposo; TLS (p. ej. con ACM) protege el cifrado en tránsito: no son la misma función.',
          'CloudTrail audita quién hizo qué; Config evalúa y registra configuraciones.',
          'Artifact: informes y certificaciones de cumplimiento; Audit Manager: evidencias.',
          'Security Hub centraliza hallazgos; Secrets Manager rota credenciales.',
        ],
        example:
          'Ejemplo: una auditoría pide evidencias ISO 27001: se descargan los informes desde Artifact y se revisa el historial de cambios en Config y CloudTrail.',
      },
    ],
  },
  {
    id: '3',
    titleEs: 'Tecnología y servicios en la nube',
    titleEn: 'Cloud Technology and Services',
    weight: 34,
    description:
      'El dominio de mayor peso: infraestructura global, cómputo, almacenamiento, bases de datos, redes y familias de servicios. Exige reconocer qué servicio usar en cada caso.',
    objectives: [
      '3.1 Describir métodos de despliegue y operación: EC2, contenedores, serverless y Elastic Beanstalk.',
      '3.2 Explicar la infraestructura global: regiones, zonas de disponibilidad, zonas locales y edge (CloudFront, Route 53).',
      '3.3 Identificar los servicios principales: cómputo, almacenamiento, bases de datos y redes (EC2, S3, RDS, VPC).',
      '3.4 Reconocer familias de servicios: analítica, IA/ML, integración, monitoreo y herramientas para desarrolladores.',
    ],
    lessons: [
      {
        id: '3-global',
        title: 'Infraestructura global y redes',
        body: 'AWS divide el mundo en regiones (áreas geográficas con varios centros de datos), cada región contiene varias zonas de disponibilidad o AZ (uno o más centros de datos aislados con energía y red independientes). Desplegar en varias AZ da alta disponibilidad; en varias regiones da recuperación ante desastres y baja latencia por cercanía. En el borde (edge) operan Amazon CloudFront (CDN que cachea contenido en 600+ puntos de presencia), AWS Global Accelerator y Amazon Route 53 (DNS global con enrutamiento por latencia y geolocalización). Una VPC es tu red privada en AWS donde defines subredes públicas/privadas, tablas de rutas, gateway de internet y grupos de seguridad. El examen pide elegir: CloudFront para acelerar contenido estático, Direct Connect para conexión privada dedicada y VPN para conexión cifrada por internet.',
        keyPoints: [
          'Región = área geográfica; AZ = centro(s) de datos aislados dentro de la región.',
          'Multi-AZ = alta disponibilidad; multirregión = recuperación ante desastres.',
          'CloudFront (CDN), Route 53 (DNS), Global Accelerator (red troncal).',
          'VPC: subredes, route tables, internet gateway, NAT, NACL y security groups.',
          'Direct Connect (privada dedicada) frente a VPN (cifrada por internet).',
        ],
        example:
          'Ejemplo: una app crítica se despliega en 2 AZ con balanceador ELB; el contenido estático se sirve por CloudFront y el dominio se gestiona en Route 53.',
      },
      {
        id: '3-computo',
        title: 'Cómputo: EC2, contenedores y serverless',
        body: 'Amazon EC2 ofrece máquinas virtuales con familias optimizadas (uso general, cómputo, memoria, almacenamiento) y opciones de compra: bajo demanda, reservadas, Savings Plans y spot (capacidad sobrante hasta 90 % más barata, interrumpible). Amazon EBS da discos persistentes por instancia y S3 almacenamiento de objetos independiente. Para contenedores: Amazon ECS (orquestador propio) y EKS (Kubernetes gestionado), con AWS Fargate para no gestionar servidores. AWS Lambda ejecuta funciones ante eventos sin aprovisionar nada (serverless, pago por milisegundo). AWS Elastic Beanstalk es PaaS para subir código sin gestionar la infraestructura y Auto Scaling ajusta la capacidad según métricas de CloudWatch con balanceo de Elastic Load Balancing (ALB/NLB/GWLB). Regla del examen: carga impredecible y eventual = Lambda; control total del SO = EC2; microservicios = contenedores.',
        keyPoints: [
          'EC2: tipos de instancia y compras (on-demand, reserved, spot, Savings Plans).',
          'Contenedores: ECS/EKS + Fargate (serverless para contenedores).',
          'Lambda: serverless por eventos, escala a cero, pago por ejecución.',
          'Auto Scaling + ELB: elasticidad y reparto de carga entre AZ.',
          'Beanstalk: PaaS para desplegar código sin gestionar servidores.',
        ],
        example:
          'Ejemplo: procesar imágenes al subirlas a S3 con una función Lambda es más barato que mantener un EC2 encendido 24/7 para un uso esporádico.',
      },
      {
        id: '3-datos',
        title: 'Almacenamiento, bases de datos y servicios gestionados',
        body: 'Almacenamiento: Amazon S3 (objetos, 11 nueves de durabilidad, clases Standard/IA/Glacier para archivado), EBS (bloques para EC2), EFS (archivos compartido NFS) y Storage Gateway (híbrido). Bases de datos: Amazon RDS (relacionales gestionadas: MySQL, PostgreSQL, etc., con Multi-AZ), Aurora (compatible MySQL/PostgreSQL de alto rendimiento), DynamoDB (NoSQL clave-valor serverless de un dígito de milisegundo), ElastiCache (caché Redis/Memcached) y Redshift (data warehouse). Analítica e IA: Athena (SQL sobre S3), EMR, Kinesis (streaming), SageMaker (ML), Rekognition/Polly/Translate (IA preconstruida). Integración: SQS (colas), SNS (pub/sub), EventBridge (eventos) y Step Functions (orquestación). Monitoreo: CloudWatch (métricas/alarmas), CloudTrail (auditoría) y Config (configuración). El examen pide emparejar caso y servicio: objetos web = S3, relacional gestionada = RDS, NoSQL masiva = DynamoDB, caché = ElastiCache.',
        keyPoints: [
          'S3 = objetos; EBS = bloques; EFS = archivos; Glacier = archivado.',
          'RDS/Aurora = relacional; DynamoDB = NoSQL serverless; Redshift = warehouse.',
          'SQS (colas), SNS (notificaciones), EventBridge (eventos).',
          'CloudWatch (métricas), CloudTrail (API), Config (configuración).',
          'Elección por caso: estático en S3, sesión en ElastiCache, SQL ad-hoc con Athena.',
        ],
        example:
          'Ejemplo: un portal con fotos usa S3 + CloudFront; usuarios y pedidos en RDS Multi-AZ; carrito de sesión en ElastiCache; eventos de compra vía SQS.',
      },
    ],
  },
  {
    id: '4',
    titleEs: 'Facturación, precios y soporte',
    titleEn: 'Billing, Pricing, and Support',
    weight: 12,
    description:
      'Modelos de precios, herramientas de facturación y costes, y planes de soporte. Dominio pequeño pero muy preguntado en el examen.',
    objectives: [
      '4.1 Describir modelos de precios y facturación: bajo demanda, Savings Plans, facturación consolidada y etiquetado.',
      '4.2 Usar herramientas de costes: Pricing Calculator, Cost Explorer, Budgets, CUR e informes.',
      '4.3 Identificar recursos técnicos y planes de soporte: Basic, Developer, Business y Enterprise (y TAM).',
      '4.4 Comparar precios y soporte según el caso: qué plan elegir y cómo controlar el gasto.',
    ],
    lessons: [
      {
        id: '4-precios',
        title: 'Modelos de precios de AWS',
        body: 'La mayoría de servicios son pago por uso sin compromiso: EC2 por segundo, S3 por GB-mes y solicitudes, Lambda por solicitudes y GB-segundo y transferencia de datos (la entrada suele ser gratis y la salida a internet paga). Para ahorrar con uso estable existen Savings Plans (compromiso 1-3 años, hasta ~72 % de descuento, flexibles) e instancias reservadas (RI, compromiso por tipo concreto), mientras las instancias spot aprovechan capacidad libre con gran descuento pero pueden interrumpirse. La facturación consolidada de AWS Organizations combina cuentas para obtener descuentos por volumen y las etiquetas (tags) reparten costes por proyecto o entorno. Regla del examen: carga estable 24/7 = Savings Plans/RI; experimental o picos = bajo demanda; batch tolerante a fallos = spot.',
        keyPoints: [
          'Pago por uso: sin pago inicial, la entrada de datos suele ser gratuita.',
          'Savings Plans (flexible) e instancias reservadas (específicas) para uso estable.',
          'Spot: hasta ~90 % de descuento, interrumpible, ideal para batch.',
          'Facturación consolidada y descuentos por volumen con Organizations.',
          'Etiquetas (tags) para asignar y repartir costes por equipo o proyecto.',
        ],
        example:
          'Ejemplo: base de datos productiva 24/7 con Savings Plan de 3 años; entorno de pruebas efímero bajo demanda; proceso nocturno de vídeo con spot.',
      },
      {
        id: '4-costes',
        title: 'Controlar costes: herramientas',
        body: 'AWS Pricing Calculator estima el coste antes de desplegar comparando regiones y servicios. Una vez en uso, AWS Cost Explorer visualiza el gasto por servicio, cuenta o etiqueta y detecta anomalías con AWS Cost Anomaly Detection. AWS Budgets crea presupuestos y envía alertas (o ejecuta acciones) al superar umbrales, y el informe de coste y uso (CUR) ofrece el detalle granular para análisis en Athena o QuickSight. AWS Trusted Advisor revisa la cuenta y sugiere ahorros (instancias infrautilizadas, buckets sin ciclo de vida) además de rendimiento y seguridad. Buenas prácticas: presupuestos por entorno, alertas al 80 %, ciclos de vida en S3 hacia clases baratas y apagado de recursos fuera de horario.',
        keyPoints: [
          'Pricing Calculator: estimar antes; Cost Explorer: analizar después.',
          'Budgets: presupuestos y alertas; Anomaly Detection: picos inesperados.',
          'CUR: detalle granular para auditoría de costes.',
          'Trusted Advisor: recomendaciones de ahorro, rendimiento y seguridad.',
          'Ciclos de vida de S3 y apagado programado reducen la factura.',
        ],
        example:
          'Ejemplo: se crea un presupuesto mensual de 100 USD con alerta al 80 % y se programa el apagado nocturno de EC2 de desarrollo.',
      },
      {
        id: '4-soporte',
        title: 'Soporte y recursos técnicos',
        body: 'Los planes de soporte son cuatro: Basic (gratuito, documentación, 7 Trusted Advisor checks y soporte de facturación), Developer (horario laboral, respuesta <24 h en casos generales, para pruebas), Business (24/7, <1 h en producción caída, IEM y más checks) y Enterprise On-Ramp/Enterprise (TAM dedicado, <15 min en crítico, gestión de eventos y Well-Architected reviews). Además existen AWS Professional Services y el programa APN de partners, la documentación, los whitepapers, re:Post, el centro de conocimiento y AWS Marketplace para software de terceros. El examen suele preguntar: ¿acceso a TAM? Solo Enterprise; ¿respuesta en minutos ante caída crítica? Business/Enterprise; ¿solo facturación? Basic basta. El coste del soporte Business/Enterprise es un porcentaje de la factura con mínimos.',
        keyPoints: [
          'Basic: gratis, facturación y documentación.',
          'Developer: pruebas, horario laboral; Business: producción 24/7 (<1 h).',
          'Enterprise: TAM dedicado, <15 min crítico, gestión de eventos.',
          'Professional Services y partners APN para ayuda experta.',
          're:Post, documentación y Trusted Advisor como recursos gratuitos.',
        ],
        example:
          'Ejemplo: una app de producción que no puede caer necesita Business o Enterprise; un proyecto personal de estudio funciona con Basic.',
      },
    ],
  },
];
