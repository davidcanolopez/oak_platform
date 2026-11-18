# Tablero de Tareas y Ruta Crítica — OAK

**Task origen:** `P0-002` | **Base SHA:** `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7` | **Total tareas:** `114` (`113` de `MASTER_EXECUTION_PLAN.md` §12 + `P0-011` añadida para requisito #14 de `QUALITY_GATES.md` §6 `G0`)  
**Estado de Gates:** `G0 = FAIL` (`P0-001 = ACEPTADA` en `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`) | **`D0 = PENDING USER VALIDATION`**

## 1. Reglas operativas del tablero

- Estados válidos: `PROPUESTA -> READY -> DESARROLLO -> PEER_REVIEW -> QA -> NO_FUNCIONAL -> ACEPTADA -> DESPLEGADA` (auxiliares: `BLOCKED`, `FAIL`, `INVALIDATED`, `CANCELADA`).
- Ninguna tarea de Fase 1+ pasa a `READY` hasta tener `G0 = PASS` en `docs/agentic/GATE_STATUS.md` y validación explícita de `D0` en `docs/agentic/DECISION_LOG.md`.
- Ningún agente aprueba su propio trabajo (`reviewer_agent != owner_agent`); solo `release-guardian` transiciona a `ACEPTADA`.
- Trazabilidad de `P0-011`: añadida explícitamente en `phase0_plan.md` para cubrir el requisito #14 de `QUALITY_GATES.md` §6 `G0` (*referencias de identidad de marca y criterios UX accesibles*) sin renumerar `P0-001..P8-011`.

## 2. Ruta crítica de Fase 0 a Release V1

Cadena de dependencias más larga (54 nodos hacia `P8-011`):

`P0-001 -> P0-003 -> P0-004 -> P0-005 -> P0-010 -> P1-001 -> P1-002 -> P1-003 -> P1-008 -> P1-009 -> P1-010 -> P1-013 -> P2-001 -> P2-002 -> P2-004 -> P2-005 -> P2-006 -> P2-010 -> P2-012 -> P3-001 -> P3-003 -> P4-002 -> P4-003 -> P4-005 -> P4-006 -> P5-007 -> P5-008 -> P5-010 -> P5-012 -> P5-013 -> P5-014 -> P5-015 -> P6-006 -> P6-007 -> P6-008 -> P6-009 -> P6-010 -> P6-011 -> P6-012 -> P6-013 -> P7-001 -> P7-002 -> P7-012 -> P7-013 -> P8-001 -> P8-002 -> P8-004 -> P8-005 -> P8-006 -> P8-007 -> P8-008 -> P8-009 -> P8-010 -> P8-011`

### Secuencia de Olas de Fase 0 (máx. 3 escritores paralelos)
- **Ola 0 (`ACEPTADA`):** `P0-001` (`87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`)
- **Ola 1 (`READY`):** `P0-002` (`orquestador-oak`), `P0-003` -> `P0-006` (`arquitecto-seguridad`), `P0-007` (`qa-e2e`)
- **Ola 2 (`PROPUESTA`, pendiente de Ola 1):** `P0-004` (`devops-release`), `P0-008` (`orquestador-oak`), `P0-011` (`ux-brand`)
- **Ola 3 (`PROPUESTA`, pendiente de `P0-004`):** `P0-005` (`devops-release`), `P0-009` (`backend-datos`)
- **Ola 4 (`PROPUESTA`, cierre `G0`):** `P0-010` (`release-guardian`)

## 3. Inventario completo de tareas

### Fase 0. Bootstrap y control de ejecución

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P0-001` | `ACEPTADA` (`87f92a1`) | `orquestador-oak` (SUP) | `documentacion-handoff` | Ninguna | Registrar inventario de artefactos y confirmar por escrito que no existe aplicación | G0 |
| `P0-002` | `READY` | `orquestador-oak` (SUP) | `analista-funcional` | P0-001 | Crear tablero de tareas con estados, owners, dependencias y ruta crítica | G0 |
| `P0-003` | `READY` | `arquitecto-seguridad` (ARCH) | `devops-release, backend-datos` | P0-001 | Redactar ADR de stack y estrategia de monolito modular | G0 |
| `P0-004` | `PROPUESTA` | `devops-release` (SRE) | `backend-datos, frontend` | P0-003 | Inicializar la aplicación, lockfile y comandos canónicos sin alterar decks | G0 |
| `P0-005` | `PROPUESTA` | `devops-release` (SRE) | `auditor-no-funcional` | P0-004 | Crear CI baseline con artefactos de resultado | G0 |
| `P0-006` | `READY` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P0-001 | Clasificar datos y crear threat model inicial | G0 |
| `P0-007` | `READY` | `qa-e2e` (QA) | `auditor-no-funcional` | P0-001 | Publicar estrategia de pruebas, severidades y matriz de navegadores | G0 |
| `P0-008` | `PROPUESTA` | `orquestador-oak` (SUP) | `qa-e2e` | P0-002, P0-006, P0-007 | Publicar DoR, DoD, plantilla de evidencia y protocolo de excepciones | G0 |
| `P0-009` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad, qa-e2e` | P0-003, P0-004, P0-006 | Definir dataset sintético y cuentas demo sin PII real | G0 |
| `P0-011` | `PROPUESTA` | `ux-brand` (BRUX (añadida en phase0_plan.md)) | `auditor-no-funcional` | P0-001 | Formalizar baseline de referencias de marca y criterios UX accesibles para G0 (Req. #14) | G0 |
| `P0-010` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P0-001, P0-002, P0-003, P0-004, P0-005, P0-006, P0-007, P0-008, P0-009, P0-011 | Auditar y decidir G0 | G0 |

### Fase 1. Contrato de producto, marca y arquitectura

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P1-001` | `PROPUESTA` | `analista-funcional` (PFA) | `orquestador-oak` | P0-010 | Redactar alcance V1 y exclusiones con los supuestos del apartado 4 | D0 |
| `P1-002` | `PROPUESTA` | `analista-funcional` (PFA) | `orquestador-oak` | P1-001 | Definir persona deportista y persona organizador | D0 |
| `P1-003` | `PROPUESTA` | `analista-funcional` (PFA) | `orquestador-oak` | P1-002 | Convertir journeys en criterios funcionales trazables | D0 |
| `P1-004` | `PROPUESTA` | `ux-brand` (BRUX) | `qa-e2e` | P1-001 | Unificar arquitectura de información y nomenclatura | D1 |
| `P1-005` | `PROPUESTA` | `ux-brand` (BRUX) | `qa-e2e` | P0-010 | Crear tokens canónicos y matriz de contraste | D1 |
| `P1-006` | `PROPUESTA` | `ux-brand` (BRUX) | `qa-e2e` | P1-004, P1-005 | Definir inventario de componentes y todos sus estados | D1 |
| `P1-007` | `PROPUESTA` | `ux-brand` (BRUX) | `qa-e2e` | P1-003, P1-006 | Crear prototipo navegable responsive de los journeys P0 | D1 |
| `P1-008` | `PROPUESTA` | `arquitecto-seguridad` (ARCH) | `auditor-no-funcional` | P1-003 | Crear modelo de dominio y catálogo de invariantes | D0 |
| `P1-009` | `PROPUESTA` | `arquitecto-seguridad` (ARCH) | `auditor-no-funcional` | P1-008 | Definir contratos de casos de uso, API y eventos | D0 |
| `P1-010` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P1-003, P1-009 | Crear matriz requisitos → pruebas | D0,D1 |
| `P1-011` | `PROPUESTA` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P1-008, P1-009 | Revisar privacidad, abuso y autorización del diseño | D0 |
| `P1-012` | `PROPUESTA` | `usuario-validador` (USR) | `release-guardian` | P1-001, P1-007, P1-008 | Validar D0 y D1: alcance, navegación, prototipo y desviaciones de marca | D0,D1 |
| `P1-013` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P1-001, P1-002, P1-003, P1-004, P1-005, P1-006, P1-007, P1-008, P1-009, P1-010, P1-011, P1-012 | Congelar Product + Brand + Architecture Contract | D0,D1 |

### Fase 2. Fundaciones técnicas e identidad

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P2-001` | `PROPUESTA` | `devops-release` (SRE) | `auditor-no-funcional` | P1-013 | Configurar entornos development, test y staging | G1 |
| `P2-002` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P1-008, P2-001 | Crear migración inicial del esquema | G3 |
| `P2-003` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-002 | Implementar seed determinista | G3 |
| `P2-004` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-002 | Implementar autenticación y ciclo de sesión | G2,G3 |
| `P2-005` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-004 | Implementar Organization y Membership con autorización deny-by-default | G2,G3 |
| `P2-006` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-005 | Implementar RLS y pruebas de aislamiento | G3 |
| `P2-007` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P1-005, P1-006 | Implementar tokens, tipografías y primitivas UI | G1,G2 |
| `P2-008` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P2-004, P2-007 | Implementar pantallas de auth responsive | G2,G4 |
| `P2-009` | `PROPUESTA` | `devops-release` (SRE) | `auditor-no-funcional` | P2-001 | Instalar logs estructurados, correlation ID y Sentry | G3 |
| `P2-010` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P2-003, P2-004, P2-005, P2-006, P2-007, P2-008, P2-009 | Automatizar suite foundation | G2,G3,G4 |
| `P2-011` | `PROPUESTA` | `analista-funcional` (PFA/BRUX) | `orquestador-oak` | P2-008 | Revisar internamente acceso y base visual | G4 |
| `P2-012` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P2-001, P2-002, P2-003, P2-004, P2-005, P2-006, P2-007, P2-008, P2-009, P2-010, P2-011 | Auditar incremento foundation | G1-G4 |

### Fase 3. Descubrimiento y ficha pública

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P3-001` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-012 | Implementar consulta de eventos publicados | G2,G3 |
| `P3-002` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P3-001 | Implementar filtros por disciplina, ubicación, fecha, distancia y nivel | G2,G3 |
| `P3-003` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P3-001 | Implementar detalle público de evento | G2,G3 |
| `P3-004` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-004, P3-001 | Implementar favoritos idempotentes | G2,G3 |
| `P3-005` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P3-001, P2-007 | Implementar home con búsqueda y selección editorial | G1,G2 |
| `P3-006` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P3-002, P3-005 | Implementar listado, filtros y URL compartible | G2,G4 |
| `P3-007` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P3-003, P3-006 | Implementar ficha de evento y CTA | G2,G4 |
| `P3-008` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P3-004, P3-006 | Implementar favoritos y estado no autenticado | G2,G4 |
| `P3-009` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P3-001, P3-002, P3-003, P3-004, P3-005, P3-006, P3-007, P3-008 | Automatizar discovery P0/P1 | G2-G4 |
| `P3-010` | `PROPUESTA` | `ux-brand` (BRUX) | `qa-e2e` | P3-005, P3-006, P3-007, P3-008 | Realizar regresión visual y revisión de contenido | G4 |
| `P3-011` | `PROPUESTA` | `analista-funcional` (PFA) | `orquestador-oak` | P3-009, P3-010 | Aceptar internamente buscar, filtrar y elegir prueba | G4 |
| `P3-012` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P3-001, P3-002, P3-003, P3-004, P3-005, P3-006, P3-007, P3-008, P3-009, P3-010, P3-011 | Auditar incremento discovery | G1-G4 |

### Fase 4. Perfil, inscripción y pago de prueba

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P4-001` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-004, P2-002 | Implementar AthleteProfile y consentimientos versionados | G2,G3 |
| `P4-002` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P3-003, P4-001 | Implementar borrador de inscripción recuperable | G2,G3 |
| `P4-003` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-002 | Implementar cálculo server-side de precio | G2,G3 |
| `P4-004` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-002 | Implementar reserva atómica de cupo | G2,G3 |
| `P4-005` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-003, P4-004 | Crear sesión Stripe test con idempotency key | G2,G3 |
| `P4-006` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-005 | Procesar webhook firmado e idempotente | G2,G3 |
| `P4-007` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P4-001, P2-007 | Implementar edición de perfil y validación accesible | G2,G4 |
| `P4-008` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P4-002, P4-003, P4-004, P4-005 | Implementar wizard modalidad → datos → revisión/consentimiento → pago | G2,G4 |
| `P4-009` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P4-006 | Implementar confirmación, fallo y reintento | G2,G4 |
| `P4-010` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-006 | Enviar correo de confirmación una sola vez | G3 |
| `P4-011` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P4-001, P4-002, P4-003, P4-004, P4-005, P4-006, P4-007, P4-008, P4-009, P4-010 | Automatizar matriz pago/cupo/idempotencia | G2-G4 |
| `P4-012` | `PROPUESTA` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P4-005, P4-006 | Revisar firma, replay, secretos y datos de pago | G5 parcial |
| `P4-013` | `PROPUESTA` | `analista-funcional` (PFA/QA) | `orquestador-oak` | P4-011 | Aceptar internamente la inscripción completa en Stripe test | G4 |
| `P4-014` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P4-001, P4-002, P4-003, P4-004, P4-005, P4-006, P4-007, P4-008, P4-009, P4-010, P4-011, P4-012, P4-013 | Auditar incremento registration | G1-G4 |

### Fase 5. Workspace del organizador y beta

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P5-001` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-005 | Implementar aceptación de invitación de organizador | G2,G3 |
| `P5-002` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-001, P1-008 | Implementar CRUD de evento draft | G2,G3 |
| `P5-003` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-002 | Implementar modalidades, cupos y price tiers | G2,G3 |
| `P5-004` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-003 | Implementar publish/unpublish/close | G2,G3 |
| `P5-005` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P5-002, P2-007 | Implementar editor de evento por secciones | G2,G4 |
| `P5-006` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P5-004, P5-005 | Implementar checklist y preview de publicación | G2,G4 |
| `P5-007` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-006, P5-001 | Implementar consulta de participantes por evento | G2,G3 |
| `P5-008` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-007 | Implementar export CSV seguro | G2,G3 |
| `P5-009` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-007 | Implementar KPIs de inscritos, ocupación e ingresos test | G2,G3 |
| `P5-010` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P5-007, P5-008, P5-009 | Implementar panel, tabla de participantes y KPIs | G2,G4 |
| `P5-011` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-007, P4-010 | Implementar envío de briefing en sandbox | G2,G3 |
| `P5-012` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P5-001, P5-002, P5-003, P5-004, P5-005, P5-006, P5-007, P5-008, P5-009, P5-010, P5-011 | Automatizar organizer P0/P1 | G2-G4 |
| `P5-013` | `PROPUESTA` | `devops-release` (SRE) | `auditor-no-funcional` | P5-012 | Desplegar beta en staging con seed y cuentas demo | G6 parcial |
| `P5-014` | `PROPUESTA` | `analista-funcional` (PFA/QA) | `orquestador-oak` | P5-013 | Aceptar internamente beta atleta + organizador | G4 |
| `P5-015` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P5-001, P5-002, P5-003, P5-004, P5-005, P5-006, P5-007, P5-008, P5-009, P5-010, P5-011, P5-012, P5-013, P5-014 | Auditar beta funcional | G1-G4 |

### Fase 6. Trayectoria, validación formal y release candidate

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P6-001` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-006 | Implementar consulta de próximas inscripciones | G2,G3 |
| `P6-002` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-006, P5-004 | Implementar historial y marcado de evento completado | G2,G3 |
| `P6-003` | `PROPUESTA` | `backend-datos` (BE) | `arquitecto-seguridad` | P6-002 | Implementar métricas de trayectoria derivadas | G2,G3 |
| `P6-004` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P6-001, P2-007 | Implementar dashboard de próximo reto | G2,G4 |
| `P6-005` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P6-002, P6-003 | Implementar trayectoria e historial | G2,G4 |
| `P6-006` | `PROPUESTA` | `analista-funcional` (PFA) | `orquestador-oak` | P5-015 | Preparar protocolo de validación formal | G1 |
| `P6-007` | `PROPUESTA` | `analista-funcional` (PFA) | `orquestador-oak` | P6-004, P6-005, P6-006 | Ejecutar pruebas con al menos 5 deportistas y 2 organizadores | Evidencia pre-D2 |
| `P6-008` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P6-007 | Convertir hallazgos confirmados en defectos P0-P3 | G4 |
| `P6-009` | `PROPUESTA` | `frontend` (FE/BE) | `qa-e2e` | P6-008 | Corregir defectos P0 y P1 de validación | G1-G4 |
| `P6-010` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P6-001, P6-002, P6-003, P6-004, P6-005, P6-006, P6-007, P6-008, P6-009 | Ejecutar regresión funcional completa | G4 |
| `P6-011` | `PROPUESTA` | `orquestador-oak` (SUP) | `analista-funcional` | P6-010 | Congelar contratos de release candidate | G4 |
| `P6-012` | `PROPUESTA` | `analista-funcional` (PFA) | `orquestador-oak` | P6-010, P6-011 | Firmar aceptación funcional interna del release candidate | Evidencia pre-D2 |
| `P6-013` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P6-001, P6-002, P6-003, P6-004, P6-005, P6-006, P6-007, P6-008, P6-009, P6-010, P6-011, P6-012 | Auditar RC funcional | G4 |

### Fase 7. Hardening, compliance y preparación operativa

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P7-001` | `PROPUESTA` | `qa-e2e` (QA/BRUX) | `auditor-no-funcional` | P6-013 | Ejecutar auditoría WCAG 2.2 AA automática y manual | G5 |
| `P7-002` | `PROPUESTA` | `frontend` (FE) | `qa-e2e` | P7-001 | Corregir incumplimientos de accesibilidad | G5 |
| `P7-003` | `PROPUESTA` | `qa-e2e` (QA/SRE) | `auditor-no-funcional` | P6-013 | Medir CWV y presupuestos de assets en staging | G5 |
| `P7-004` | `PROPUESTA` | `frontend` (FE/BE) | `qa-e2e` | P7-003 | Corregir regresiones de rendimiento | G5 |
| `P7-005` | `PROPUESTA` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P6-013 | Ejecutar SAST, SCA, secret scan y revisión manual | G5 |
| `P7-006` | `PROPUESTA` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P5-013 | Ejecutar DAST autenticado y no autenticado en staging | G5 |
| `P7-007` | `PROPUESTA` | `analista-funcional` (PFA/SEC) | `orquestador-oak` | P6-013 | Finalizar privacidad, consentimientos, retención y borrado | G5 |
| `P7-008` | `PROPUESTA` | `devops-release` (SRE) | `auditor-no-funcional` | P6-013 | Configurar dashboards y alertas | G6 |
| `P7-009` | `PROPUESTA` | `devops-release` (SRE) | `auditor-no-funcional` | P2-002 | Ejecutar backup y restore en entorno aislado | G6 |
| `P7-010` | `PROPUESTA` | `devops-release` (SRE) | `auditor-no-funcional` | P5-013 | Ejecutar rollback de aplicación y migración compatible | G6 |
| `P7-011` | `PROPUESTA` | `documentacion-handoff` (DOC) | `orquestador-oak` | P6-013 | Completar README, runbooks y catálogo de incidencias | G6 |
| `P7-012` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P7-002, P7-004, P7-005, P7-006, P7-007, P7-008, P7-009, P7-010 | Ejecutar smoke posterior a hardening | G5,G6 |
| `P7-013` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P7-001, P7-002, P7-003, P7-004, P7-005, P7-006, P7-007, P7-008, P7-009, P7-010, P7-011, P7-012 | Auditar non-functional y release readiness | G5,G6 |

### Fase 8. UAT, release y handoff final

| ID | Estado | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| `P8-001` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P7-013 | Ejecutar suite de release tres veces desde estado limpio | G4,G7 |
| `P8-002` | `PROPUESTA` | `qa-e2e` (QA/PFA) | `auditor-no-funcional` | P8-001 | Cerrar matriz de trazabilidad | G7 |
| `P8-003` | `PROPUESTA` | `documentacion-handoff` (DOC) | `orquestador-oak` | P7-011 | Preparar guía demo y cuentas de prueba | G7 |
| `P8-004` | `PROPUESTA` | `usuario-validador` (USR) | `release-guardian` | P8-002, P8-003 | Ejecutar D2 UAT final en staging | D2,G6 |
| `P8-005` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P8-004 | Verificar cero P0/P1 y excepciones vigentes | D3 entry |
| `P8-006` | `PROPUESTA` | `usuario-validador` (USR) | `release-guardian` | P8-005 | Autorizar D3 release del artefacto certificado | D3 |
| `P8-007` | `PROPUESTA` | `devops-release` (SRE) | `auditor-no-funcional` | P8-006 | Etiquetar release v1.0.0 y desplegar entorno acordado | G6,G7 |
| `P8-008` | `PROPUESTA` | `qa-e2e` (QA) | `auditor-no-funcional` | P8-007 | Ejecutar post-deploy smoke y monitoreo inicial | G6,G7 |
| `P8-009` | `PROPUESTA` | `documentacion-handoff` (DOC) | `orquestador-oak` | P8-008 | Entregar paquete de handoff | G7 |
| `P8-010` | `PROPUESTA` | `orquestador-oak` (SUP) | `analista-funcional` | P8-009 | Archivar tablero y publicar estado final real | G7 |
| `P8-011` | `PROPUESTA` | `release-guardian` (RG) | `auditor-no-funcional` | P8-010 | Cerrar ejecución | G7 |
