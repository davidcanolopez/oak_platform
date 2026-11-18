# Plan maestro de ejecución multiagente para OAK

## 1. Propósito y regla de uso

Este documento es el contrato operativo para que Codex, Antigravity u otro orquestador multiagente construyan una primera versión funcional de OAK en ocho semanas. Define alcance, arquitectura, responsabilidades, secuencia, criterios de aceptación, evidencias y puertas de calidad.

La regla principal es: ninguna tarea ni fase avanza por confianza, por tiempo transcurrido o porque un agente declare que ha terminado. Avanza únicamente cuando un agente independiente reproduce la evidencia exigida y el Release Guardian aprueba la puerta correspondiente.

El usuario actúa como validador de producto en hitos concretos. No debe coordinar tareas, perseguir agentes ni revisar cada commit.

## 2. Situación de partida verificada

Fecha de referencia: 11 de noviembre de 2026.

### 2.1 Lo que existe

- Un deck estático de identidad de marca de 18 pantallas en sites/oak-brand-deck/dist.
- Un deck estático de experiencia web de 19 pantallas en sites/oak-web-design-deck/dist.
- Assets de marca e imagen: logotipo PNG, símbolo SVG, topografía SVG y tres fotografías.
- Una memoria de TFM parcial en Memoria_TFM_David_Cano_v.1.docx.
- Una hoja de seguimiento de ocho semanas en outputs/01a1cca1-459e-7272-9d2c-fe149168c997/Seguimiento_TFM_8_semanas.xlsx.
- Figuras académicas sobre posicionamiento, metodología e incertidumbres en figuras.

### 2.2 Lo que no existe

- No existe una aplicación OAK.
- No existe frontend de producto, backend, API, base de datos, autenticación, pagos ni panel operativo real.
- No existen requisitos versionados, historias con criterios de aceptación, modelo de dominio, contratos API ni arquitectura técnica aprobada.
- No existen tests, pipeline CI/CD, entornos de staging/producción, observabilidad, migraciones ni seed reproducible.
- No existen README técnico, ADR, runbooks ni historial Git útil. El repositorio raíz y el Git anidado del deck de marca no tienen commits.
- El deck web es un macroprototipo visual. Sus formularios no persisten datos y su JavaScript evita los envíos.

### 2.3 Estado de la documentación

- La memoria define la oportunidad y el posicionamiento, pero conserva marcadores en el resumen, introducción, alcance y gran parte del capítulo de desarrollo.
- La selección del mercado inicial no está cerrada. Running, trail running y ciclismo se presentan como candidatos.
- La hoja de seguimiento guardada contiene 38 tareas y 153 horas previstas, todas en estado No iniciada y 0 % de avance.
- Los decks proporcionan una base visual sólida, pero no un design system listo para producción.

### 2.4 Decisiones de marca ya utilizables

- Significado: Overcome. Achieve. Keep going.
- Propósito: reducir la fricción entre la intención y la participación deportiva.
- Personalidad: resiliente, aventurera, humana y conectada con el mundo real.
- Voz: clara, activa y alentadora; centrada en progreso, constancia, reto, camino e historia; nunca elitista, agresiva o culpabilizadora.
- Tipografías: Sora para títulos, mensajes y cifras; Inter para interfaz y contenido operativo.
- Paleta de referencia:
  - Oak Forest: #12372A.
  - Growth Lime: #B7F34A.
  - Trail Orange: #FF6B35.
  - Open Sky: #28B7E9.
  - Warm Sand: #E3D4BB.
  - Ground: #17211B.
- Lenguaje visual: topografía, anillos de crecimiento, rutas y destinos.

### 2.5 Riesgos de marca que deben resolverse antes de construir UI definitiva

- Los dos decks usan nombres de tokens distintos para colores equivalentes.
- Hay colores hardcodeados fuera de la paleta declarada.
- Orange sobre Sand, Sky sobre Sand y el muted actual sobre Sand no alcanzan contraste AA para texto normal.
- Las variantes reverse y monocroma se simulan con filtros CSS sobre un PNG; falta el wordmark vectorial oficial.
- La navegación usa nombres inconsistentes: Mi trayectoria, Trayectoria, Mis retos y Perfil.
- El flujo desktop habla de tres pasos, mientras el móvil añade el pago como paso posterior.
- Se muestran mapa, bottom sheet y dorsal móvil sin diseño completo.
- Se mezclan español e inglés sin una política editorial cerrada.

## 3. Objetivo de la versión 1

Entregar una web responsive en español que permita completar de extremo a extremo dos experiencias:

1. Un deportista descubre una prueba de trail o running en la Comunidad de Madrid, consulta información suficiente, crea su cuenta, completa su perfil, se inscribe con un pago de prueba y ve la inscripción y su trayectoria.
2. Un organizador autorizado crea y publica una prueba, configura modalidades, cupos y precios, consulta participantes, exporta datos y supervisa métricas básicas.

La versión se considerará funcional cuando estos journeys funcionen con datos persistentes en staging, con controles de acceso, pruebas automatizadas, accesibilidad, observabilidad, backup/restore y rollback verificados.

## 4. Supuestos recomendados

Estos supuestos se adoptan como baseline y se validan juntos en la decisión D0. Cualquier cambio posterior requiere una decisión registrada y replanificación de las tareas afectadas.

| Decisión | Baseline recomendado |
| --- | --- |
| Mercado inicial | Trail running y running popular en la Comunidad de Madrid |
| Usuario primario | Deportista aficionado que busca su siguiente reto y participa en varias pruebas al año |
| Cliente económico inicial | Organizador pequeño o mediano de pruebas populares |
| Canal | Web responsive; desktop, tablet y móvil |
| Idioma | Español; arquitectura preparada para i18n, sin segundo idioma en V1 |
| Acceso de organizadores | Alta por invitación; no marketplace abierto de autoalta |
| Pagos | Stripe en modo test; no dinero real ni liquidaciones a organizadores en V1 |
| Geografía | Comunidad de Madrid; direcciones y zonas horarias españolas |
| Catálogo | Datos propios cargados por organizadores y seed de demostración |
| Recomendaciones | Reglas simples por disciplina, distancia y ubicación; sin IA |
| Resultados de una prueba | Marcado administrativo como completada; sin cronometraje ni integración externa |
| Infraestructura | Servicios gestionados con entornos separados de desarrollo, staging y producción |
| Privacidad | Minimización de PII, consentimiento explícito, exportación y borrado básico |
| Compatibilidad | Dos últimas versiones estables de Chrome, Edge, Firefox y Safari; Safari iOS y Chrome Android |

## 5. Exclusiones de la versión 1

Quedan fuera salvo decisión explícita del usuario con impacto aceptado en plazo y calidad:

- Aplicaciones nativas iOS o Android.
- Integración con Strava, Garmin, Polar u otros wearables.
- Red social, feeds, comentarios, mensajería entre deportistas o clubes.
- Recomendaciones mediante IA o modelos predictivos.
- Marketplace de marcas, patrocinadores o servicios profesionales.
- Cronometraje, resultados oficiales, seguimiento GPS en vivo o clasificación.
- Mapas interactivos avanzados, edición de rutas y análisis GPX.
- Dorsal digital, wallet, check-in y operativa del día de carrera.
- Cupones complejos, referidos, afiliación y precios dinámicos.
- Multiidioma, multimoneda, fiscalidad internacional y operación fuera de España.
- Cobro real, payouts, conciliación bancaria y facturación fiscal automatizada.
- Gamificación avanzada. V1 solo muestra métricas y trayectoria derivadas de inscripciones.
- Aplicación completa de soporte interno. Solo habrá herramientas administrativas mínimas y auditables.

## 6. Stack técnico propuesto

Las versiones exactas se fijarán en el ADR de stack usando versiones estables y soportadas en la fecha de arranque. No se permiten versiones flotantes; el lockfile es obligatorio.

### 6.1 Aplicación

- TypeScript en modo strict.
- Next.js con React y App Router como monolito modular full-stack.
- Node.js LTS y pnpm.
- CSS variables como fuente canónica de tokens, Tailwind CSS para composición y utilidades limitadas.
- Primitivas accesibles headless cuando aporten comportamiento complejo; no se importará un tema visual ajeno a OAK.
- Storybook para estados de componentes y revisión aislada.
- Zod para validar formularios, comandos, respuestas y variables de entorno.

### 6.2 Datos e identidad

- Supabase gestionado para PostgreSQL, Auth y Storage.
- Migraciones SQL versionadas y seed determinista.
- Row Level Security como defensa adicional, sin sustituir controles de autorización de servidor.
- Acceso a datos detrás de repositorios/adaptadores; las UI no consultan tablas directamente.

### 6.3 Integraciones

- Stripe Checkout en modo test y webhooks firmados.
- Resend o proveedor equivalente en sandbox para correos transaccionales.
- Sentry para errores y rendimiento, más logs estructurados con correlation ID.
- Feature flags simples para integraciones y funciones de riesgo.

### 6.4 Calidad y entrega

- ESLint, Prettier, typecheck y build reproducible.
- Vitest y Testing Library para unitarios y componentes.
- MSW para dobles de APIs externas.
- Playwright para E2E, regresión visual y recorridos responsive.
- axe-core y pruebas manuales para accesibilidad.
- Pruebas de integración contra PostgreSQL/Supabase local o aislado.
- GitHub Actions para CI; Vercel para previews, staging y despliegue web.
- Gitleaks, SAST, SCA, DAST y análisis de dependencias en el pipeline.

### 6.5 Criterio de arquitectura

Se adopta un monolito modular. No se crearán microservicios, colas distribuidas ni infraestructura Kubernetes para esta versión. La prioridad es una única aplicación desplegable con límites de dominio claros, tests rápidos y adaptadores sustituibles.

## 7. Arquitectura de referencia

### 7.1 Capas

1. Presentación: páginas, componentes, formularios y accesibilidad.
2. Aplicación: casos de uso, comandos, consultas, autorización y transacciones.
3. Dominio: entidades, estados, invariantes y políticas.
4. Infraestructura: PostgreSQL/Supabase, Stripe, correo, storage, logs y métricas.

La dirección de dependencia va de presentación e infraestructura hacia contratos de aplicación y dominio. Ninguna regla crítica vive únicamente en la UI.

### 7.2 Módulos de dominio

| Módulo | Responsabilidad |
| --- | --- |
| Identity | Cuenta, sesión, verificación, recuperación y preferencias |
| Athlete | Perfil del deportista, datos reutilizables y consentimientos |
| Organization | Organización, miembros, roles y aislamiento multi-tenant |
| Catalog | Eventos publicados, modalidades, búsqueda, filtros y favoritos |
| Registration | Borrador, participante, cupo, precio, confirmación y cancelación |
| Payments | Sesión Stripe, webhook, idempotencia, fallo y reembolso de prueba |
| Journey | Próximos retos, historial, métricas y eventos completados |
| Organizer Ops | Alta/edición/publicación de eventos, participantes y exportaciones |
| Communications | Confirmaciones, briefing y registro de envíos |
| Audit and Observability | Audit log, eventos operativos, errores, métricas y trazas |

### 7.3 Entidades mínimas

- User, AthleteProfile y ConsentRecord.
- Organization y OrganizationMembership.
- Event, EventModality, PriceTier y EventMedia.
- Favourite.
- Registration y RegistrationParticipant.
- Payment y PaymentWebhookEvent.
- CommunicationLog.
- AuditLog.

### 7.4 Estados obligatorios

- Event: DRAFT, PUBLISHED, CLOSED, CANCELLED, COMPLETED.
- Registration: DRAFT, PENDING_PAYMENT, CONFIRMED, CANCELLED, REFUNDED.
- Payment: CREATED, REQUIRES_ACTION, SUCCEEDED, FAILED, REFUNDED.
- Membership: INVITED, ACTIVE, REVOKED.

Las transiciones se implementan en servicios de dominio, se prueban y se auditan. No se actualizan estados críticos mediante escrituras genéricas.

### 7.5 Invariantes críticas

- Un usuario no accede a datos privados de otra organización.
- Un evento no se publica sin fecha, ubicación, modalidad, cupo, precio, reglamento y contacto.
- Una inscripción confirmada nunca supera el cupo disponible.
- El precio confirmado coincide con el precio calculado por servidor.
- Un webhook repetido produce el mismo resultado efectivo y no duplica inscripciones ni correos.
- Una inscripción no se confirma sin pago SUCCEEDED, salvo un flujo gratuito explícito.
- El borrado de cuenta no elimina registros que deban conservarse por auditoría; los anonimiza según política.
- Las métricas de trayectoria se derivan de datos confirmados/completados, no de valores escritos por el cliente.

### 7.6 Seguridad y privacidad desde diseño

- Denegar por defecto y autorizar por caso de uso.
- MFA obligatorio para administradores y recomendado para organizadores antes de producción.
- Secrets solo en gestores de secretos; nunca en Git, evidencias o logs.
- PII cifrada en tránsito y en reposo mediante capacidades del proveedor.
- Logs sin documentos, tokens, direcciones completas ni payloads de pago.
- Rate limiting en login, recuperación, búsqueda abusiva, checkout y webhooks.
- Consentimientos versionados y auditables.
- Exportación y borrado de cuenta con verificación de identidad.

## 8. Gobierno multiagente

### 8.1 Roles permanentes

| Código | Agente | Responsabilidad | Restricción |
| --- | --- | --- | --- |
| SUP | Supervisor de entrega | Mantiene plan, dependencias, estados, riesgos y coordinación continua | No desarrolla features ni aprueba su propio trabajo |
| RG | Release Guardian | Reproduce evidencias, aplica gates y ejerce veto | Independiente de los autores; no corrige el cambio que evalúa |
| PFA | Producto y funcional | Alcance, journeys, criterios, UAT y trazabilidad | No convierte supuestos en hechos sin validación |
| ARCH | Arquitectura | ADR, límites, modelo, contratos y decisiones transversales | No acepta excepciones silenciosas |
| BRUX | Marca, UX y accesibilidad | Tokens, IA, prototipo, componentes y revisión visual | Debe resolver contraste antes del handoff |
| FE | Frontend | UI responsive, estados, formularios y cliente | No contiene reglas críticas solo en cliente |
| BE | Backend y datos | Casos de uso, autorización, persistencia e integraciones | Migraciones serializadas y reversibles |
| QA | QA automatizado y funcional | Estrategia, tests, regresión, defectos y evidencia | No da por válida una prueba que no puede reproducir |
| SEC | Seguridad y privacidad | Threat model, SAST/SCA/DAST, revisión y cumplimiento | Tiene veto sobre Critical/High |
| SRE | DevOps y fiabilidad | CI/CD, entornos, observabilidad, backup y rollback | Producción solo tras G6 y aprobación del usuario |
| DOC | Documentación y handoff | README, runbooks, decisiones, demo y paquete final | Documenta el estado real, no el previsto |
| USR | Usuario validador | Acepta/rechaza hitos de producto y excepciones | No coordina ejecución diaria |

### 8.2 Supervisión continua

SUP permanece activo durante toda la ejecución y realiza este ciclo después de cada handoff:

1. Lee el estado real y la evidencia nueva.
2. Comprueba que las dependencias estén Aceptadas.
3. Detecta cambios de contrato, migración o riesgo que invaliden evidencia anterior.
4. Asigna únicamente tareas Ready y sin conflictos de escritura.
5. Solicita revisión independiente.
6. Entrega el paquete al RG para decisión de gate.
7. Actualiza tablero, riesgos, decisiones y ruta crítica.

SUP no puede marcar una tarea como Aceptada. Solo RG puede hacerlo tras reproducir la evidencia.

### 8.3 Estado obligatorio de cada tarea

Propuesta → Ready → Desarrollo → Review → QA → No funcional → Aceptada → Desplegada.

- Una tarea vuelve a Desarrollo si falla Review, QA o No funcional.
- Una tarea Aceptada vuelve al último estado verificable cuando un cambio posterior afecta su contrato, datos, UI, seguridad o evidencia.
- Bloqueada es una marca auxiliar con causa, owner y siguiente acción; no sustituye el estado.

### 8.4 Reglas de paralelismo

- Solo se paralelizan tareas cuyas dependencias estén Aceptadas.
- Una migración o contrato compartido tiene un único owner y se integra antes de abrir consumidores paralelos.
- Ningún agente modifica archivos fuera de su alcance declarado.
- Frontend y backend pueden trabajar en paralelo solo con contratos versionados y fixtures compartidos.
- QA diseña los casos antes o en paralelo al desarrollo, nunca después de terminar la feature.
- Los cambios de tokens, navegación, esquemas o contratos requieren un RFC corto y análisis de impacto.

## 9. Definition of Ready y Definition of Done

### 9.1 Definition of Ready global

Una tarea pasa a Ready solo si dispone de:

- ID, owner único y resultado observable.
- Dependencias Aceptadas.
- Criterios de aceptación inequívocos.
- Datos y cuentas de prueba definidos.
- Riesgos de seguridad, privacidad y accesibilidad identificados.
- Contratos o mock disponibles cuando dependa de otro módulo.
- Evidencia esperada y gate de salida.
- Alcance fuera de la tarea explícito.

### 9.2 Definition of Done global

Además del DoD específico de cada tarea:

- Código formateado, lint limpio, typecheck limpio y build reproducible.
- Revisión por un agente que no sea el autor.
- Tests unitarios, integración y E2E aplicables ejecutados en CI.
- Estados loading, empty, error, success, disabled y permiso denegado cubiertos cuando apliquen.
- Accesibilidad de teclado, foco, nombres accesibles y contraste revisada.
- Logs, errores y métricas sin PII.
- Documentación y contratos actualizados.
- Evidencia guardada en docs/evidence/<semana>/<task-id>/.
- Cero defectos P0/P1 abiertos asociados.
- RG reproduce comandos clave desde un checkout limpio.

## 10. Gates no negociables

| Gate | Requisitos de aprobación |
| --- | --- |
| G0 Baseline | Inventario, repositorio, build mínimo, DoR/DoD, dataset, clasificación de datos, threat model y owners definidos |
| G1 Calidad de cambio | Format, lint, typecheck, build, revisión independiente, secret scan y alcance preservado |
| G2 Unitarios | ≥85 % líneas, ≥80 % ramas, diff coverage ≥90 %; dominios críticos de cupo, precio, autorización, estados e idempotencia con 100 % de ramas |
| G3 Integración | Contratos, migraciones, seed, RLS, rollback de migración, idempotencia y concurrencia probados |
| G4 E2E | 100 % de journeys P0/P1; tres ejecuciones consecutivas sin flakes; capturas y trazas conservadas |
| G5 No funcional | SAST/SCA/DAST con 0 Critical/High; WCAG 2.2 AA; presupuestos de rendimiento y revisión de privacidad superados |
| G6 Release | Staging, smoke, observabilidad, alertas, backup/restore y rollback verificados mediante simulacro |
| G7 Release final | G0-G6 vigentes, D2 y D3 aprobadas, cero P0/P1, trazabilidad y documentación completas, artefacto certificado desplegado, smoke y observación post-despliegue superados |

Un cambio posterior invalida toda evidencia afectada. Las excepciones solo pueden ser aprobadas por el usuario e incluyen motivo, owner, mitigación y fecha de caducidad.

## 11. Presupuestos no funcionales

- WCAG 2.2 AA, sin violaciones Critical/Serious en axe y con revisión manual de los journeys P0.
- Foco visible mínimo equivalente a 3 px y objetivos táctiles mínimos de 48 × 48 px.
- Core Web Vitals en rango bueno p75 sobre móvil representativo: LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1.
- Respuesta p95 ≤500 ms para catálogo, detalle y consultas normales sobre el dataset objetivo; operaciones externas se miden aparte.
- Cero sobreventa bajo prueba concurrente.
- Webhook de pago efectivamente exactly-once mediante idempotencia.
- Cero vulnerabilidades Critical/High abiertas.
- RPO de 24 horas y RTO de 4 horas para el MVP, demostrados mediante restore.
- Tasa de flake E2E 0 % en tres ejecuciones consecutivas de la suite de release.

## 12. Plan de fases y tareas atómicas

### Fase 0. Bootstrap y control de ejecución

Ventana: días 1 y 2 de la semana 1. Objetivo: crear una base reproducible y el sistema de gobierno antes de implementar producto.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P0-001 | SUP | Ninguna | Registrar inventario de artefactos y confirmar por escrito que no existe aplicación | Baseline con paths, estado Git y límites; docs/evidence/W01/P0-001/summary.md | G0 |
| P0-002 | SUP | P0-001 | Crear tablero de tareas con estados, owners, dependencias y ruta crítica | Todas las tareas de este plan cargadas y trazables; captura/export del tablero | G0 |
| P0-003 | ARCH | P0-001 | Redactar ADR de stack y estrategia de monolito modular | Versiones candidatas, compatibilidad, alternativas y decisión; ADR revisado | G0 |
| P0-004 | SRE | P0-003 | Inicializar la aplicación, lockfile y comandos canónicos sin alterar decks | Checkout limpio instala, ejecuta format/lint/typecheck/test/build; logs | G0 |
| P0-005 | SRE | P0-004 | Crear CI baseline con artefactos de resultado | Pipeline obligatorio en PR y fallo intencional demostrado | G0 |
| P0-006 | SEC | P0-001 | Clasificar datos y crear threat model inicial | Activos, actores, fronteras, amenazas, mitigaciones y riesgos ownerizados | G0 |
| P0-007 | QA | P0-001 | Publicar estrategia de pruebas, severidades y matriz de navegadores | Matriz P0/P1, pirámide, fixtures y política anti-flake revisadas | G0 |
| P0-008 | SUP | P0-002,P0-006,P0-007 | Publicar DoR, DoD, plantilla de evidencia y protocolo de excepciones | Plantillas completas y prueba de un handoff ficticio | G0 |
| P0-009 | BE | P0-003 | Definir dataset sintético y cuentas demo sin PII real | Dataset versionado: 2 organizaciones, 12 eventos, modalidades y estados límite | G0 |
| P0-010 | RG | P0-003..P0-009 | Auditar y decidir G0 | Informe reproducible PASS/FAIL; ninguna desviación sin owner | G0 |

### Fase 1. Contrato de producto, marca y arquitectura

Ventana: resto de la semana 1. Objetivo: congelar qué se construye antes de abrir desarrollo visual o de dominio.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P1-001 | PFA | P0-010 | Redactar alcance V1 y exclusiones con los supuestos del apartado 4 | Scope con métricas de éxito y preguntas cerradas; review SUP | D0 |
| P1-002 | PFA | P1-001 | Definir persona deportista y persona organizador | JTBD, dolores, contexto y criterios de adopción basados en hipótesis explícitas | D0 |
| P1-003 | PFA | P1-002 | Convertir journeys en criterios funcionales trazables | IDs AC-Jxx enlazados a pantallas, datos, permisos y tests | D0 |
| P1-004 | BRUX | P1-001 | Unificar arquitectura de información y nomenclatura | Sitemap, rutas, navegación desktop/mobile y términos únicos aprobables | D1 |
| P1-005 | BRUX | P0-010 | Crear tokens canónicos y matriz de contraste | Tokens semánticos, prohibiciones cromáticas y reporte AA; no hardcodes nuevos | D1 |
| P1-006 | BRUX | P1-004,P1-005 | Definir inventario de componentes y todos sus estados | Story map con default/hover/focus/disabled/loading/empty/error/success | D1 |
| P1-007 | BRUX | P1-003,P1-006 | Crear prototipo navegable responsive de los journeys P0 | Desktop 1440, tablet 768 y móvil 390; teclado y flujo de pago coherentes | D1 |
| P1-008 | ARCH | P1-003 | Crear modelo de dominio y catálogo de invariantes | Entidades, relaciones, estados, transiciones y decisiones abiertas resueltas | D0 |
| P1-009 | ARCH | P1-008 | Definir contratos de casos de uso, API y eventos | Schemas versionados con errores, permisos, idempotency keys y ejemplos | D0 |
| P1-010 | QA | P1-003,P1-009 | Crear matriz requisitos → pruebas | Cada AC P0/P1 enlaza unit/integration/E2E/UAT y fixture | D0,D1 |
| P1-011 | SEC | P1-008,P1-009 | Revisar privacidad, abuso y autorización del diseño | Threat model actualizado y controles incluidos en AC | D0 |
| P1-012 | USR | P1-001,P1-007,P1-008 | Validar D0 y D1: alcance, navegación, prototipo y desviaciones de marca | Dos decisiones Aceptado/Rechazado registradas por separado | D0,D1 |
| P1-013 | RG | P1-001..P1-012 | Congelar Product + Brand + Architecture Contract | Tag/commit identificable y matriz sin huecos P0/P1 | D0,D1 |

### Fase 2. Fundaciones técnicas e identidad

Ventana: semana 2. Objetivo: tener una plataforma desplegable con datos, auth, permisos, design system y observabilidad base.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P2-001 | SRE | P1-013 | Configurar entornos development, test y staging | Variables validadas, secrets fuera de Git y matriz de configuración | G1 |
| P2-002 | BE | P1-008,P2-001 | Crear migración inicial del esquema | Up/down o procedimiento de rollback probado desde DB limpia | G3 |
| P2-003 | BE | P2-002 | Implementar seed determinista | Dos ejecuciones producen estado equivalente y sin duplicados | G3 |
| P2-004 | BE | P2-002 | Implementar autenticación y ciclo de sesión | Alta, verificación, login, logout y recuperación probados | G2,G3 |
| P2-005 | BE | P2-004 | Implementar Organization y Membership con autorización deny-by-default | Tests cross-tenant negativos y audit log | G2,G3 |
| P2-006 | BE | P2-005 | Implementar RLS y pruebas de aislamiento | Ninguna cuenta accede a filas ajenas usando clientes permitidos | G3 |
| P2-007 | FE | P1-005,P1-006 | Implementar tokens, tipografías y primitivas UI | Storybook sin hardcodes no autorizados; capturas de estados | G1,G2 |
| P2-008 | FE | P2-004,P2-007 | Implementar pantallas de auth responsive | Teclado, errores, loading y recuperación en 390/768/1440 | G2,G4 |
| P2-009 | SRE | P2-001 | Instalar logs estructurados, correlation ID y Sentry | Error sintético aparece en staging sin PII | G3 |
| P2-010 | QA | P2-003..P2-009 | Automatizar suite foundation | Coberturas G2, integración y E2E auth tres veces sin flakes | G2,G3,G4 |
| P2-011 | PFA/BRUX | P2-008 | Revisar internamente acceso y base visual | Walkthrough funcional y revisión de marca sin blockers; informe al RG | G4 |
| P2-012 | RG | P2-001..P2-011 | Auditar incremento foundation | Informe PASS de G1-G4 aplicables | G1-G4 |

### Fase 3. Descubrimiento y ficha pública

Ventana: semana 3. Objetivo: primer vertical slice útil del deportista, desde inicio hasta decisión de inscripción.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P3-001 | BE | P2-012 | Implementar consulta de eventos publicados | Draft/cancelled nunca aparecen; paginación y orden deterministas | G2,G3 |
| P3-002 | BE | P3-001 | Implementar filtros por disciplina, ubicación, fecha, distancia y nivel | Combinaciones y límites probados contra seed | G2,G3 |
| P3-003 | BE | P3-001 | Implementar detalle público de evento | Devuelve modalidad, cupo visible, precio, reglamento y contacto sin PII | G2,G3 |
| P3-004 | BE | P2-004,P3-001 | Implementar favoritos idempotentes | Añadir/quitar repetido no duplica; autorización probada | G2,G3 |
| P3-005 | FE | P3-001,P2-007 | Implementar home con búsqueda y selección editorial | Responsive, skeleton, error y empty state; sin recomendaciones IA | G1,G2 |
| P3-006 | FE | P3-002,P3-005 | Implementar listado, filtros y URL compartible | Back/forward conserva estado; teclado y lector de pantalla | G2,G4 |
| P3-007 | FE | P3-003,P3-006 | Implementar ficha de evento y CTA | Precio, fecha, ubicación, distancia, nivel y cupo visibles antes del CTA | G2,G4 |
| P3-008 | FE | P3-004,P3-006 | Implementar favoritos y estado no autenticado | Login return-to conserva intención y no pierde filtros | G2,G4 |
| P3-009 | QA | P3-001..P3-008 | Automatizar discovery P0/P1 | Unit/integration/E2E responsive; tres runs sin flakes | G2-G4 |
| P3-010 | BRUX | P3-005..P3-008 | Realizar regresión visual y revisión de contenido | Capturas 390/768/1440 y checklist de voz OAK | G4 |
| P3-011 | PFA | P3-009,P3-010 | Aceptar internamente buscar, filtrar y elegir prueba | Script funcional completo y defectos clasificados para RG | G4 |
| P3-012 | RG | P3-001..P3-011 | Auditar incremento discovery | PASS acumulativo G1-G4 | G1-G4 |

### Fase 4. Perfil, inscripción y pago de prueba

Ventana: semana 4. Objetivo: completar el journey transaccional sin sobreventa ni duplicados.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P4-001 | BE | P2-004,P2-002 | Implementar AthleteProfile y consentimientos versionados | CRUD autorizado, validación y audit trail | G2,G3 |
| P4-002 | BE | P3-003,P4-001 | Implementar borrador de inscripción recuperable | Reentrada restaura datos; expiración definida y probada | G2,G3 |
| P4-003 | BE | P4-002 | Implementar cálculo server-side de precio | Cliente no puede alterar total; tiers y gestión probados al 100 % ramas | G2,G3 |
| P4-004 | BE | P4-002 | Implementar reserva atómica de cupo | Prueba concurrente demuestra cero sobreventa | G2,G3 |
| P4-005 | BE | P4-003,P4-004 | Crear sesión Stripe test con idempotency key | Reintento devuelve resultado seguro y metadata mínima | G2,G3 |
| P4-006 | BE | P4-005 | Procesar webhook firmado e idempotente | Duplicados/out-of-order no duplican registro, pago ni correo | G2,G3 |
| P4-007 | FE | P4-001,P2-007 | Implementar edición de perfil y validación accesible | Labels, errores asociados, guardado y reuso en inscripción | G2,G4 |
| P4-008 | FE | P4-002..P4-005 | Implementar wizard modalidad → datos → revisión/consentimiento → pago | Total siempre visible, salida recuperable y mobile keyboard correcto | G2,G4 |
| P4-009 | FE | P4-006 | Implementar confirmación, fallo y reintento | Refresco/reentrada no altera el estado; copy no engañoso | G2,G4 |
| P4-010 | BE | P4-006 | Enviar correo de confirmación una sola vez | Sandbox contiene evento, modalidad, total y enlace; sin PII excesiva | G3 |
| P4-011 | QA | P4-001..P4-010 | Automatizar matriz pago/cupo/idempotencia | Happy path, fallo, cancelación, duplicado, concurrencia y expiración | G2-G4 |
| P4-012 | SEC | P4-005,P4-006 | Revisar firma, replay, secretos y datos de pago | 0 High/Critical y reporte de casos negativos | G5 parcial |
| P4-013 | PFA/QA | P4-011 | Aceptar internamente la inscripción completa en Stripe test | Walkthrough desde ficha hasta dashboard/correo con evidencias | G4 |
| P4-014 | RG | P4-001..P4-013 | Auditar incremento registration | PASS acumulativo G1-G4 y seguridad transaccional | G1-G4 |

### Fase 5. Workspace del organizador y beta

Ventana: semana 5. Objetivo: que un organizador gestione oferta y participantes sin intervención técnica.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P5-001 | BE | P2-005 | Implementar aceptación de invitación de organizador | Token de un uso, expiración y rol correcto | G2,G3 |
| P5-002 | BE | P5-001,P1-008 | Implementar CRUD de evento draft | Autorización cross-tenant negativa y auditoría | G2,G3 |
| P5-003 | BE | P5-002 | Implementar modalidades, cupos y price tiers | Invariantes y edición con registros existentes probadas | G2,G3 |
| P5-004 | BE | P5-003 | Implementar publish/unpublish/close | Validación completa; transiciones inválidas rechazadas | G2,G3 |
| P5-005 | FE | P5-002,P2-007 | Implementar editor de evento por secciones | Autosave controlado, errores, preview y responsive desktop/tablet | G2,G4 |
| P5-006 | FE | P5-004,P5-005 | Implementar checklist y preview de publicación | No permite publicar incompleto; enlaces públicos correctos | G2,G4 |
| P5-007 | BE | P4-006,P5-001 | Implementar consulta de participantes por evento | Filtros, paginación, estados y aislamiento probados | G2,G3 |
| P5-008 | BE | P5-007 | Implementar export CSV seguro | Cabeceras, encoding, protección formula injection y audit log | G2,G3 |
| P5-009 | BE | P5-007 | Implementar KPIs de inscritos, ocupación e ingresos test | Reconciliación exacta contra registros/pagos | G2,G3 |
| P5-010 | FE | P5-007..P5-009 | Implementar panel, tabla de participantes y KPIs | Empty/loading/error, filtros y export accesible | G2,G4 |
| P5-011 | BE | P5-007,P4-010 | Implementar envío de briefing en sandbox | Selección autorizada, preview, confirmación y un registro por envío | G2,G3 |
| P5-012 | QA | P5-001..P5-011 | Automatizar organizer P0/P1 | E2E crea, publica, recibe registro, exporta y consulta KPI | G2-G4 |
| P5-013 | SRE | P5-012 | Desplegar beta en staging con seed y cuentas demo | URL, smoke, observabilidad y reset reproducible | G6 parcial |
| P5-014 | PFA/QA | P5-013 | Aceptar internamente beta atleta + organizador | Dos scripts funcionales completados y defectos clasificados | G4 |
| P5-015 | RG | P5-001..P5-014 | Auditar beta funcional | PASS acumulativo G1-G4 | G1-G4 |

### Fase 6. Trayectoria, validación formal y release candidate

Ventana: semana 6. Objetivo: cerrar la propuesta de continuidad y corregir defectos de uso antes del hardening.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P6-001 | BE | P4-006 | Implementar consulta de próximas inscripciones | Orden, estados y permisos probados | G2,G3 |
| P6-002 | BE | P4-006,P5-004 | Implementar historial y marcado de evento completado | Solo organizador autorizado cambia estado; historial consistente | G2,G3 |
| P6-003 | BE | P6-002 | Implementar métricas de trayectoria derivadas | Retos, km y localidades reconciliados; sin edición cliente | G2,G3 |
| P6-004 | FE | P6-001,P2-007 | Implementar dashboard de próximo reto | CTA, cuenta atrás, loading/empty/error y responsive | G2,G4 |
| P6-005 | FE | P6-002,P6-003 | Implementar trayectoria e historial | Métricas explicables, sin presión competitiva y accesibles | G2,G4 |
| P6-006 | PFA | P5-015 | Preparar protocolo de validación formal | Guion, consentimiento, métricas, tareas y criterios de éxito | G1 |
| P6-007 | PFA | P6-004,P6-005,P6-006 | Ejecutar pruebas con al menos 5 deportistas y 2 organizadores | Notas anonimizadas, tasas de éxito y hallazgos priorizados | Evidencia pre-D2 |
| P6-008 | QA | P6-007 | Convertir hallazgos confirmados en defectos P0-P3 | Reproducción, expected/actual, owner y test de regresión requerido | G4 |
| P6-009 | FE/BE | P6-008 | Corregir defectos P0 y P1 de validación | Cada fix incluye test que falla antes y pasa después | G1-G4 |
| P6-010 | QA | P6-001..P6-009 | Ejecutar regresión funcional completa | 100 % P0/P1 y tres runs sin flakes | G4 |
| P6-011 | SUP | P6-010 | Congelar contratos de release candidate | RC identificado; cambios posteriores solo mediante triage | G4 |
| P6-012 | PFA | P6-010,P6-011 | Firmar aceptación funcional interna del release candidate | Lista cerrada de blockers y recomendación para hardening | Evidencia pre-D2 |
| P6-013 | RG | P6-001..P6-012 | Auditar RC funcional | Cero P0/P1 funcional abierto | G4 |

### Fase 7. Hardening, compliance y preparación operativa

Ventana: semana 7. Objetivo: demostrar que el RC es accesible, seguro, observable y recuperable.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P7-001 | QA/BRUX | P6-013 | Ejecutar auditoría WCAG 2.2 AA automática y manual | Teclado, foco, landmarks, formularios, zoom, SR y contraste documentados | G5 |
| P7-002 | FE | P7-001 | Corregir incumplimientos de accesibilidad | Tests de regresión y cero Critical/Serious | G5 |
| P7-003 | QA/SRE | P6-013 | Medir CWV y presupuestos de assets en staging | LCP/INP/CLS p75 y bundle report archivados | G5 |
| P7-004 | FE/BE | P7-003 | Corregir regresiones de rendimiento | Budgets del apartado 11 cumplidos sin degradar accesibilidad | G5 |
| P7-005 | SEC | P6-013 | Ejecutar SAST, SCA, secret scan y revisión manual | 0 Critical/High; findings Medium con owner y caducidad | G5 |
| P7-006 | SEC | P5-013 | Ejecutar DAST autenticado y no autenticado en staging | Reporte, reproducción y 0 Critical/High | G5 |
| P7-007 | PFA/SEC | P6-013 | Finalizar privacidad, consentimientos, retención y borrado | Texto versionado, flujos probados y límites legales declarados | G5 |
| P7-008 | SRE | P6-013 | Configurar dashboards y alertas | Error rate, latencia, webhooks, auth y jobs visibles; alerta sintética recibida | G6 |
| P7-009 | SRE | P2-002 | Ejecutar backup y restore en entorno aislado | RPO/RTO medidos y datos reconciliados | G6 |
| P7-010 | SRE | P5-013 | Ejecutar rollback de aplicación y migración compatible | Simulacro documentado sin pérdida de registros confirmados | G6 |
| P7-011 | DOC | P6-013 | Completar README, runbooks y catálogo de incidencias | Un agente nuevo levanta local y opera staging solo con docs | G6 |
| P7-012 | QA | P7-002,P7-004..P7-010 | Ejecutar smoke posterior a hardening | Journeys P0 continúan verdes y evidencias actualizadas | G5,G6 |
| P7-013 | RG | P7-001..P7-012 | Auditar non-functional y release readiness | PASS G5/G6 o veto con blockers concretos | G5,G6 |

### Fase 8. UAT, release y handoff final

Ventana: semana 8. Objetivo: aceptar, etiquetar, desplegar y transferir una versión reproducible.

| ID | Owner | Dependencias | Tarea atómica | DoD y evidencia | Gate |
| --- | --- | --- | --- | --- | --- |
| P8-001 | QA | P7-013 | Ejecutar suite de release tres veces desde estado limpio | Tres runs consecutivos, 100 % P0/P1, 0 flakes | G4,G7 |
| P8-002 | QA/PFA | P8-001 | Cerrar matriz de trazabilidad | Cada requisito enlaza código, test, evidencia y resultado UAT | G7 |
| P8-003 | DOC | P7-011 | Preparar guía demo y cuentas de prueba | Guion atleta/organizador, reset y limitaciones reales | G7 |
| P8-004 | USR | P8-002,P8-003 | Ejecutar D2 UAT final en staging | Checklist firmado: aceptar, rechazar o excepción explícita | D2,G6 |
| P8-005 | RG | P8-004 | Verificar cero P0/P1 y excepciones vigentes | Informe con hashes y recomendación pre-release GO/NO-GO; no cierra G7 | D3 entry |
| P8-006 | USR | P8-005 | Autorizar D3 release del artefacto certificado | Decisión go/no-go registrada; pagos reales siguen deshabilitados salvo permiso separado | D3 |
| P8-007 | SRE | P8-006 | Etiquetar release v1.0.0 y desplegar entorno acordado | Tag inmutable, changelog, deployment ID y smoke | G6,G7 |
| P8-008 | QA | P8-007 | Ejecutar post-deploy smoke y monitoreo inicial | P0 verdes, errores/latencia normales y rollback listo | G6,G7 |
| P8-009 | DOC | P8-008 | Entregar paquete de handoff | Arquitectura, credenciales por canal seguro, runbooks, backups, riesgos y backlog | G7 |
| P8-010 | SUP | P8-009 | Archivar tablero y publicar estado final real | Hecho/pendiente/excluido separado; deuda con owner | G7 |
| P8-011 | RG | P8-010 | Cerrar ejecución | Acta final PASS y lista de evidencias reproducibles | G7 |

## 13. Criterios funcionales por journey

Los siguientes criterios son el mínimo. PFA debe convertirlos en escenarios Given/When/Then y QA en pruebas trazables durante P1-003 y P1-010.

### J01. Descubrimiento público

- AC-J01-01: una persona puede buscar por disciplina y ubicación sin iniciar sesión.
- AC-J01-02: puede combinar fecha, distancia y nivel; el resultado refleja todos los filtros activos.
- AC-J01-03: la URL representa los filtros y permite volver atrás/adelante sin perder contexto.
- AC-J01-04: solo aparecen eventos PUBLISHED y futuros/abiertos según la regla definida.
- AC-J01-05: loading, cero resultados y error ofrecen acciones comprensibles.
- AC-J01-06: la experiencia es operable por teclado y a 320 px sin scroll horizontal.

### J02. Decisión en la ficha de evento

- AC-J02-01: antes del CTA se muestran fecha, lugar, disciplina, distancia, desnivel cuando aplique, nivel, precio total desde, cupo/estado y reglamento.
- AC-J02-02: las modalidades comparan nombre, distancia, cupo, precio y requisitos.
- AC-J02-03: un evento cerrado o sin cupo no ofrece un CTA engañoso.
- AC-J02-04: favoritos requiere sesión, conserva return-to y es idempotente.
- AC-J02-05: contenido y fotografía siguen la voz y dirección OAK aprobadas.

### J03. Cuenta y perfil

- AC-J03-01: alta, verificación, login, logout y recuperación funcionan sin enumerar cuentas.
- AC-J03-02: el perfil valida nombre, fecha de nacimiento, documento si es imprescindible, contacto y preferencias.
- AC-J03-03: los datos del perfil se reutilizan en la inscripción y pueden corregirse antes de confirmar.
- AC-J03-04: consentimientos guardan versión, fecha, actor y propósito.
- AC-J03-05: exportación y solicitud de borrado requieren sesión reciente.

### J04. Inscripción y pago

- AC-J04-01: el flujo es modalidad → datos → revisión/consentimiento → pago.
- AC-J04-02: el desglose y total se muestran desde la selección y antes del pago.
- AC-J04-03: un borrador se recupera tras cerrar o cambiar de dispositivo autenticado.
- AC-J04-04: el servidor recalcula precio y cupo dentro de una operación segura.
- AC-J04-05: solicitudes o webhooks repetidos no duplican pagos, inscripciones ni correos.
- AC-J04-06: concurrencia en la última plaza confirma una sola inscripción.
- AC-J04-07: éxito, fallo, cancelación y reintento muestran el estado real.
- AC-J04-08: una confirmación aparece en dashboard y correo una sola vez.

### J05. Trayectoria del deportista

- AC-J05-01: el dashboard separa próximo reto, inscripciones activas e historial.
- AC-J05-02: una inscripción CONFIRMED aparece sin necesidad de recargar datos manualmente.
- AC-J05-03: las métricas usan únicamente eventos confirmados/completados y explican su significado.
- AC-J05-04: una cuenta sin eventos ve un empty state útil con acceso al catálogo.
- AC-J05-05: no se presentan niveles o métricas como presión competitiva ni como datos clínicos.

### J06. Crear y publicar evento

- AC-J06-01: solo un miembro ACTIVE con permiso crea o edita eventos de su organización.
- AC-J06-02: un draft admite contenido, imágenes, modalidades, cupos, precios, reglamento y contacto.
- AC-J06-03: publicar ejecuta un checklist server-side y devuelve campos faltantes concretos.
- AC-J06-04: la preview coincide con la ficha pública en contenido esencial.
- AC-J06-05: cambios que afectarían registros existentes están bloqueados o requieren un flujo explícito y auditado.
- AC-J06-06: cada transición registra actor, fecha y cambio.

### J07. Gestionar participantes

- AC-J07-01: el organizador filtra por evento, modalidad y estado sin ver otras organizaciones.
- AC-J07-02: los totales concilian con inscripciones y pagos confirmados.
- AC-J07-03: export CSV neutraliza formula injection y registra quién exportó.
- AC-J07-04: el briefing requiere preview, confirmación y selección explícita.
- AC-J07-05: reintentos no envían comunicaciones duplicadas.

### J08. Administración y soporte mínimo

- AC-J08-01: un administrador puede localizar una inscripción por identificador sin búsquedas amplias de PII.
- AC-J08-02: operaciones sensibles generan audit log y requieren motivo.
- AC-J08-03: no existe impersonación silenciosa.
- AC-J08-04: soporte no puede alterar pagos o cupos mediante edición directa de base de datos.

## 14. Hitos de validación del usuario

El usuario participa solo en estos puntos. SUP prepara una demo de 20-30 minutos y un checklist con decisiones binarias. Si rechaza un hito, PFA convierte cada observación en tarea o defecto y SUP recalcula dependencias.

| Decisión | Momento | Qué valida el usuario | Evidencia mínima |
| --- | --- | --- | --- |
| D0 | Semana 1 | Beachhead, alcance, pagos test, idioma, datos tratados y exclusiones | Product brief y decision log |
| D1 | Semana 1 | IA, nombres, prototipo, tokens, componentes y desviaciones accesibles de marca | Prototipo navegable + matriz de contraste |
| D2 | Semana 8, tras G6 | Beta completa en staging mediante journeys atleta y organizador | Acta UAT, defectos y manifiesto del artefacto |
| D3 | Semana 8, tras recomendación del RG | Go/no-go del artefacto exacto, entorno de destino y riesgos residuales | Release report, rollback y decisión registrada |

Las revisiones de las semanas 2 a 7 las ejecutan PFA, BRUX, QA, SEC y RG. Sus resultados se incorporan al siguiente paquete sin pedir al usuario que coordine o apruebe cada incremento.

No hay aprobación tácita. Si el usuario no está disponible, los agentes pueden avanzar en tareas reversibles que no dependan de esa decisión, pero el gate permanece bloqueado.

## 15. Evidencia y trazabilidad

Cada tarea crea un directorio docs/evidence/<semana>/<task-id>/ con lo aplicable:

- summary.md: alcance, resultado, commit y conclusión.
- commands.txt: comandos exactos reproducibles.
- test-results: JUnit/HTML/JSON de unit, integration y E2E.
- coverage: líneas, ramas y diff coverage.
- screenshots: 390, 768 y 1440; estados normal/error/empty.
- a11y: axe y checklist manual.
- security: scans y triage, sin secretos.
- performance: CWV, bundle y pruebas de carga.
- migration: up, rollback, seed y reconciliación.
- deployment: URL, ID, smoke y rollback target.
- approvals.md: reviewer, RG y usuario cuando aplique.

La evidencia debe contener hashes de commit y entorno. Una captura aislada o un PASS escrito por el autor no es evidencia suficiente.

## 16. Protocolo de handoff entre agentes

Todo handoff usa esta estructura:

1. Task ID y estado solicitado.
2. Resultado observable y criterios cubiertos.
3. Alcance exacto y archivos modificados.
4. Commits y migraciones.
5. Contratos/API/eventos modificados.
6. Comandos ejecutados y resultado.
7. Evidencias y rutas.
8. Riesgos, deuda y preguntas abiertas.
9. Procedimiento de rollback.
10. Receptor y siguiente acción.

El receptor debe:

- Revisar desde checkout limpio.
- Reejecutar al menos build y pruebas relevantes.
- Comparar el cambio con los criterios, no con la descripción del autor.
- Rechazar el handoff si falta evidencia, hay cambios fuera de alcance o los contratos no están versionados.
- Confirmar recepción en el tablero. El silencio no es aceptación.

### 16.1 Handoff FE ↔ BE

- BE entrega schema, ejemplos, errores, permisos y fixtures antes de la integración.
- FE desarrolla inicialmente contra mock generado del mismo contrato.
- QA ejecuta contract tests que comparan mock y servidor.
- Un cambio incompatible vuelve a Propuesta las tareas consumidoras y elimina sus aprobaciones afectadas.

### 16.2 Handoff desarrollo → QA

- El autor incluye tests de nivel correcto; QA no recibe solo una URL.
- QA verifica happy path, límites, permisos, error, reintento, accesibilidad y datos.
- Un defecto incluye pasos, fixture, expected/actual, severidad y evidencia.

### 16.3 Handoff QA → RG

- QA entrega resultados completos, no una selección de éxitos.
- RG comprueba independencia, cobertura, flakes y validez del entorno.
- RG aprueba o veta con gate, requisito fallido y evidencia reproducible.

## 17. Severidad, excepciones y bloqueo

| Severidad | Definición | Efecto |
| --- | --- | --- |
| P0 | Pérdida/corrupción de datos, brecha, cobro incorrecto, sobreventa o sistema inutilizable | Veto inmediato; detiene release y dependientes |
| P1 | Journey principal imposible, autorización incorrecta o resultado materialmente falso | Bloquea gate y release |
| P2 | Función secundaria degradada con workaround seguro | Puede entrar solo con decisión de triage y owner |
| P3 | Defecto cosmético sin impacto funcional/accesible | Backlog con prioridad explícita |

Las excepciones de calidad:

- Solo las aprueba USR, nunca SUP, RG ni el autor.
- Incluyen requisito incumplido, motivo, impacto, mitigación, owner y caducidad.
- No se permiten para vulnerabilidades Critical/High, pérdida de datos, sobreventa o cobros incorrectos.

## 18. Criterio final de éxito

OAK V1 está terminada únicamente cuando:

- Los journeys J01-J07 cumplen todos los AC P0/P1.
- G0-G7 están aprobados con evidencia reproducible.
- El usuario ha aprobado D0, D1, D2 y D3.
- No hay P0/P1 abiertos.
- Staging y el entorno final acordado funcionan con observabilidad, backup/restore y rollback probados.
- El repositorio permite a un agente nuevo instalar, probar, desplegar y operar la plataforma siguiendo la documentación.
- El handoff separa con precisión lo entregado, lo excluido y el backlog posterior.

La existencia de pantallas bonitas, un build verde aislado o una demo feliz no sustituye estos criterios.
