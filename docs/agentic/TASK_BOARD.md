# Tablero de Tareas y Ruta Crítica — OAK

**Task origen:** `P0-002` | **Última sincronización Fase 0:** `013314afe1e35fbf4410dbb3ceb28e31d1c275a5` (merge `P0-009`) | **Total tareas:** `114` (`113` de `MASTER_EXECUTION_PLAN.md` §12 + `P0-011` añadida para requisito #14 de `QUALITY_GATES.md` §6 `G0`)  
**Estado de Gates:** `G0 = FAIL` (`9/11` tareas Fase 0 `ACEPTADA`; `P0-005 = BLOCKED` en `BL-01` por remoto GitHub ausente) | **`D0 = PENDING USER VALIDATION`**

## 1. Reglas operativas y desviaciones declaradas respecto a `MASTER_EXECUTION_PLAN.md` §12

- Estados válidos: `PROPUESTA -> READY -> DESARROLLO -> PEER_REVIEW -> QA -> NO_FUNCIONAL -> ACEPTADA -> DESPLEGADA` (auxiliares: `BLOCKED`, `FAIL`, `INVALIDATED`, `CANCELADA`).
- Ninguna tarea de Fase 1+ pasa a `READY` hasta tener `G0 = PASS` en `docs/agentic/GATE_STATUS.md` y validación explícita de `D0` en `docs/agentic/DECISION_LOG.md`.
- Ningún agente aprueba su propio trabajo (`reviewer_agent != owner_agent`); solo `release-guardian` transiciona a `ACEPTADA`.
- **Desviaciones explícitas trazadas desde `QUALITY_GATES.md` §6 (`G0`) y el plan de Fase 0 aprobado en sesión (sin renumerar `P0-001..P8-011`):**
  1. **`P0-011` añadida (`ux-brand`):** cubre el requisito #14 de `QUALITY_GATES.md` §6 `G0` (*referencias de identidad de marca y criterios UX accesibles*).
  2. **`P0-009` endurecida:** añade dependencias de `P0-004` y `P0-006` (además de `P0-003`) para ejecutar tests reales de fixtures sin solaparse con el scaffold.
  3. **`P0-010` ampliada:** incluye `P0-001`, `P0-002` y `P0-011` (además de `P0-003..P0-009`) para garantizar el cierre de los 14 requisitos de `G0`.

## 2. Ruta crítica de Fase 0 a Release V1

Cadena de dependencias más larga (54 nodos hacia `P8-011`):

`P0-001 -> P0-003 -> P0-004 -> P0-005 -> P0-010 -> P1-001 -> P1-002 -> P1-003 -> P1-008 -> P1-009 -> P1-010 -> P1-013 -> P2-001 -> P2-002 -> P2-004 -> P2-005 -> P2-006 -> P2-010 -> P2-012 -> P3-001 -> P3-003 -> P4-002 -> P4-003 -> P4-005 -> P4-006 -> P5-007 -> P5-008 -> P5-010 -> P5-012 -> P5-013 -> P5-014 -> P5-015 -> P6-006 -> P6-007 -> P6-008 -> P6-009 -> P6-010 -> P6-011 -> P6-012 -> P6-013 -> P7-001 -> P7-002 -> P7-012 -> P7-013 -> P8-001 -> P8-002 -> P8-004 -> P8-005 -> P8-006 -> P8-007 -> P8-008 -> P8-009 -> P8-010 -> P8-011`

### Secuencia de Olas de Fase 0 (máx. 3 escritores paralelos)
- **Ola 0 (`ACEPTADA`):** `P0-001` (`87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`)
- **Ola 1 (`ACEPTADA`):** `P0-002` (`bd3cf59b9f228dffa9c8be66eb4e624723e995b9`), `P0-003` (`1a041b8288c6900fdc285d5e1a4da1cc91d556a9`), `P0-006` (`133fd75e42e24858b9ad60a1f9d5351f01bbcb3c`), `P0-007` (`224a30aac6d366525c2ef2167f67a6c17b01cf9d`)
- **Ola 2 (`ACEPTADA`):** `P0-004` (`0ead1fafcdc9dc0f692c62f47af4a5713f827e5a`), `P0-008` (`84a96301a11b239646d33e148ab3fc66b2aa0a18`), `P0-011` (`470ed338a9836667228e0affac58e430474422`)
- **Ola 3 (`PARCIAL`):** `P0-009` (`ACEPTADA` en `c7e7295a0979ac06ba259613069bb5c89121738b`, merge `013314a`); `P0-005` (`BLOCKED` en `BL-01`, validación local `PASS` sobre `0664fe4422cb3fb5171c32c430bd18cf865f5cad` en `feat/p0-005-ci-baseline`)
- **Ola 4 (`PROPUESTA`, auditoría `G0`):** `P0-010` (`release-guardian`)

## 3. Inventario completo de tareas

### Fase 0. Bootstrap y control de ejecución

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P0-001` | `ACEPTADA` (`87f92a1`) | `Ola 0` | `orquestador-oak` (SUP) | `documentacion-handoff` | Ninguna | Registrar inventario de artefactos y confirmar por escrito que no existe aplicación | G0 |
| `P0-002` | `ACEPTADA` (`bd3cf59`) | `Ola 1` | `orquestador-oak` (SUP) | `analista-funcional` | P0-001 | Crear tablero de tareas con estados, owners, dependencias y ruta crítica | G0 |
| `P0-003` | `ACEPTADA` (`1a041b8`) | `Ola 1` | `arquitecto-seguridad` (ARCH) | `devops-release, backend-datos` | P0-001 | Redactar ADR de stack y estrategia de monolito modular | G0 |
| `P0-004` | `ACEPTADA` (`0ead1fa`) | `Ola 2` | `devops-release` (SRE) | `backend-datos, frontend` | P0-003 | Inicializar la aplicación, lockfile y comandos canónicos sin alterar decks | G0 |
| `P0-005` | `BLOCKED` (`BL-01`, local `0664fe4`) | `Ola 3` | `devops-release` (SRE) | `auditor-no-funcional` | P0-004 | Crear CI baseline con artefactos de resultado | G0 |
| `P0-006` | `ACEPTADA` (`133fd75`) | `Ola 1` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P0-001 | Clasificar datos y crear threat model inicial | G0 |
| `P0-007` | `ACEPTADA` (`224a30a`) | `Ola 1` | `qa-e2e` (QA) | `auditor-no-funcional` | P0-001 | Publicar estrategia de pruebas, severidades y matriz de navegadores | G0 |
| `P0-008` | `ACEPTADA` (`84a9630`) | `Ola 2` | `orquestador-oak` (SUP) | `qa-e2e` | P0-002, P0-006, P0-007 | Publicar DoR, DoD, plantilla de evidencia y protocolo de excepciones | G0 |
| `P0-009` | `ACEPTADA` (`c7e7295`) | `Ola 3` | `backend-datos` (BE) | `arquitecto-seguridad, qa-e2e` | P0-003, P0-004, P0-006 | Definir dataset sintético y cuentas demo sin PII real | G0 |
| `P0-011` | `ACEPTADA` (`470ed33`) | `Ola 2` | `ux-brand` (BRUX (adición Fase 0 req. #14)) | `auditor-no-funcional` | P0-001 | Formalizar baseline de referencias de marca y criterios UX accesibles para G0 (Req. #14) | G0 |
| `P0-010` | `PROPUESTA` | `Ola 4` | `release-guardian` (RG) | `auditor-no-funcional` | P0-001, P0-002, P0-003, P0-004, P0-005, P0-006, P0-007, P0-008, P0-009, P0-011 | Auditar y decidir G0 | G0 |

### Fase 1. Contrato de producto, marca y arquitectura

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P1-001` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 5)` | `analista-funcional` (PFA) | `orquestador-oak` | P0-010 | Redactar alcance V1 y exclusiones con los supuestos del apartado 4 | D0 |
| `P1-002` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 6)` | `analista-funcional` (PFA) | `orquestador-oak` | P1-001 | Definir persona deportista y persona organizador | D0 |
| `P1-003` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 7)` | `analista-funcional` (PFA) | `orquestador-oak` | P1-002 | Convertir journeys en criterios funcionales trazables | D0 |
| `P1-004` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 6)` | `ux-brand` (BRUX) | `qa-e2e` | P1-001 | Unificar arquitectura de información y nomenclatura | D1 |
| `P1-005` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 5)` | `ux-brand` (BRUX) | `qa-e2e` | P0-010 | Crear tokens canónicos y matriz de contraste | D1 |
| `P1-006` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 7)` | `ux-brand` (BRUX) | `qa-e2e` | P1-004, P1-005 | Definir inventario de componentes y todos sus estados | D1 |
| `P1-007` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 8)` | `ux-brand` (BRUX) | `qa-e2e` | P1-003, P1-006 | Crear prototipo navegable responsive de los journeys P0 | D1 |
| `P1-008` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 8)` | `arquitecto-seguridad` (ARCH) | `auditor-no-funcional` | P1-003 | Crear modelo de dominio y catálogo de invariantes | D0 |
| `P1-009` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 9)` | `arquitecto-seguridad` (ARCH) | `auditor-no-funcional` | P1-008 | Definir contratos de casos de uso, API y eventos | D0 |
| `P1-010` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 10)` | `qa-e2e` (QA) | `auditor-no-funcional` | P1-003, P1-009 | Crear matriz requisitos → pruebas | D0,D1 |
| `P1-011` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 10)` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P1-008, P1-009 | Revisar privacidad, abuso y autorización del diseño | D0 |
| `P1-012` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 9)` | `usuario-validador` (USR) | `release-guardian` | P1-001, P1-007, P1-008 | Validar D0 y D1: alcance, navegación, prototipo y desviaciones de marca | D0,D1 |
| `P1-013` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 11)` | `release-guardian` (RG) | `auditor-no-funcional` | P1-001, P1-002, P1-003, P1-004, P1-005, P1-006, P1-007, P1-008, P1-009, P1-010, P1-011, P1-012 | Congelar Product + Brand + Architecture Contract | D0,D1 |

### Fase 2. Fundaciones técnicas e identidad

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P2-001` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 12)` | `devops-release` (SRE) | `auditor-no-funcional` | P1-013 | Configurar entornos development, test y staging | G1 |
| `P2-002` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 13)` | `backend-datos` (BE) | `arquitecto-seguridad` | P1-008, P2-001 | Crear migración inicial del esquema | G3 |
| `P2-003` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 14)` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-002 | Implementar seed determinista | G3 |
| `P2-004` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 14)` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-002 | Implementar autenticación y ciclo de sesión | G2,G3 |
| `P2-005` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 15)` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-004 | Implementar Organization y Membership con autorización deny-by-default | G2,G3 |
| `P2-006` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 16)` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-005 | Implementar RLS y pruebas de aislamiento | G3 |
| `P2-007` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 8)` | `frontend` (FE) | `qa-e2e` | P1-005, P1-006 | Implementar tokens, tipografías y primitivas UI | G1,G2 |
| `P2-008` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 15)` | `frontend` (FE) | `qa-e2e` | P2-004, P2-007 | Implementar pantallas de auth responsive | G2,G4 |
| `P2-009` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 13)` | `devops-release` (SRE) | `auditor-no-funcional` | P2-001 | Instalar logs estructurados, correlation ID y Sentry | G3 |
| `P2-010` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 17)` | `qa-e2e` (QA) | `auditor-no-funcional` | P2-003, P2-004, P2-005, P2-006, P2-007, P2-008, P2-009 | Automatizar suite foundation | G2,G3,G4 |
| `P2-011` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 16)` | `analista-funcional` (PFA/BRUX) | `orquestador-oak` | P2-008 | Revisar internamente acceso y base visual | G4 |
| `P2-012` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 18)` | `release-guardian` (RG) | `auditor-no-funcional` | P2-001, P2-002, P2-003, P2-004, P2-005, P2-006, P2-007, P2-008, P2-009, P2-010, P2-011 | Auditar incremento foundation | G1-G4 |

### Fase 3. Descubrimiento y ficha pública

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P3-001` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 19)` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-012 | Implementar consulta de eventos publicados | G2,G3 |
| `P3-002` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 20)` | `backend-datos` (BE) | `arquitecto-seguridad` | P3-001 | Implementar filtros por disciplina, ubicación, fecha, distancia y nivel | G2,G3 |
| `P3-003` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 20)` | `backend-datos` (BE) | `arquitecto-seguridad` | P3-001 | Implementar detalle público de evento | G2,G3 |
| `P3-004` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 20)` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-004, P3-001 | Implementar favoritos idempotentes | G2,G3 |
| `P3-005` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 20)` | `frontend` (FE) | `qa-e2e` | P3-001, P2-007 | Implementar home con búsqueda y selección editorial | G1,G2 |
| `P3-006` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 21)` | `frontend` (FE) | `qa-e2e` | P3-002, P3-005 | Implementar listado, filtros y URL compartible | G2,G4 |
| `P3-007` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 22)` | `frontend` (FE) | `qa-e2e` | P3-003, P3-006 | Implementar ficha de evento y CTA | G2,G4 |
| `P3-008` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 22)` | `frontend` (FE) | `qa-e2e` | P3-004, P3-006 | Implementar favoritos y estado no autenticado | G2,G4 |
| `P3-009` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 23)` | `qa-e2e` (QA) | `auditor-no-funcional` | P3-001, P3-002, P3-003, P3-004, P3-005, P3-006, P3-007, P3-008 | Automatizar discovery P0/P1 | G2-G4 |
| `P3-010` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 23)` | `ux-brand` (BRUX) | `qa-e2e` | P3-005, P3-006, P3-007, P3-008 | Realizar regresión visual y revisión de contenido | G4 |
| `P3-011` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 24)` | `analista-funcional` (PFA) | `orquestador-oak` | P3-009, P3-010 | Aceptar internamente buscar, filtrar y elegir prueba | G4 |
| `P3-012` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 25)` | `release-guardian` (RG) | `auditor-no-funcional` | P3-001, P3-002, P3-003, P3-004, P3-005, P3-006, P3-007, P3-008, P3-009, P3-010, P3-011 | Auditar incremento discovery | G1-G4 |

### Fase 4. Perfil, inscripción y pago de prueba

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P4-001` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 15)` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-004, P2-002 | Implementar AthleteProfile y consentimientos versionados | G2,G3 |
| `P4-002` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 21)` | `backend-datos` (BE) | `arquitecto-seguridad` | P3-003, P4-001 | Implementar borrador de inscripción recuperable | G2,G3 |
| `P4-003` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 22)` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-002 | Implementar cálculo server-side de precio | G2,G3 |
| `P4-004` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 22)` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-002 | Implementar reserva atómica de cupo | G2,G3 |
| `P4-005` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 23)` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-003, P4-004 | Crear sesión Stripe test con idempotency key | G2,G3 |
| `P4-006` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 24)` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-005 | Procesar webhook firmado e idempotente | G2,G3 |
| `P4-007` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 16)` | `frontend` (FE) | `qa-e2e` | P4-001, P2-007 | Implementar edición de perfil y validación accesible | G2,G4 |
| `P4-008` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 24)` | `frontend` (FE) | `qa-e2e` | P4-002, P4-003, P4-004, P4-005 | Implementar wizard modalidad → datos → revisión/consentimiento → pago | G2,G4 |
| `P4-009` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 25)` | `frontend` (FE) | `qa-e2e` | P4-006 | Implementar confirmación, fallo y reintento | G2,G4 |
| `P4-010` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 25)` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-006 | Enviar correo de confirmación una sola vez | G3 |
| `P4-011` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 26)` | `qa-e2e` (QA) | `auditor-no-funcional` | P4-001, P4-002, P4-003, P4-004, P4-005, P4-006, P4-007, P4-008, P4-009, P4-010 | Automatizar matriz pago/cupo/idempotencia | G2-G4 |
| `P4-012` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 25)` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P4-005, P4-006 | Revisar firma, replay, secretos y datos de pago | G5 parcial |
| `P4-013` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 27)` | `analista-funcional` (PFA/QA) | `orquestador-oak` | P4-011 | Aceptar internamente la inscripción completa en Stripe test | G4 |
| `P4-014` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 28)` | `release-guardian` (RG) | `auditor-no-funcional` | P4-001, P4-002, P4-003, P4-004, P4-005, P4-006, P4-007, P4-008, P4-009, P4-010, P4-011, P4-012, P4-013 | Auditar incremento registration | G1-G4 |

### Fase 5. Workspace del organizador y beta

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P5-001` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 16)` | `backend-datos` (BE) | `arquitecto-seguridad` | P2-005 | Implementar aceptación de invitación de organizador | G2,G3 |
| `P5-002` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 17)` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-001, P1-008 | Implementar CRUD de evento draft | G2,G3 |
| `P5-003` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 18)` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-002 | Implementar modalidades, cupos y price tiers | G2,G3 |
| `P5-004` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 19)` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-003 | Implementar publish/unpublish/close | G2,G3 |
| `P5-005` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 18)` | `frontend` (FE) | `qa-e2e` | P5-002, P2-007 | Implementar editor de evento por secciones | G2,G4 |
| `P5-006` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 20)` | `frontend` (FE) | `qa-e2e` | P5-004, P5-005 | Implementar checklist y preview de publicación | G2,G4 |
| `P5-007` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 25)` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-006, P5-001 | Implementar consulta de participantes por evento | G2,G3 |
| `P5-008` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 26)` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-007 | Implementar export CSV seguro | G2,G3 |
| `P5-009` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 26)` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-007 | Implementar KPIs de inscritos, ocupación e ingresos test | G2,G3 |
| `P5-010` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 27)` | `frontend` (FE) | `qa-e2e` | P5-007, P5-008, P5-009 | Implementar panel, tabla de participantes y KPIs | G2,G4 |
| `P5-011` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 26)` | `backend-datos` (BE) | `arquitecto-seguridad` | P5-007, P4-010 | Implementar envío de briefing en sandbox | G2,G3 |
| `P5-012` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 28)` | `qa-e2e` (QA) | `auditor-no-funcional` | P5-001, P5-002, P5-003, P5-004, P5-005, P5-006, P5-007, P5-008, P5-009, P5-010, P5-011 | Automatizar organizer P0/P1 | G2-G4 |
| `P5-013` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 29)` | `devops-release` (SRE) | `auditor-no-funcional` | P5-012 | Desplegar beta en staging con seed y cuentas demo | G6 parcial |
| `P5-014` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 30)` | `analista-funcional` (PFA/QA) | `orquestador-oak` | P5-013 | Aceptar internamente beta atleta + organizador | G4 |
| `P5-015` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 31)` | `release-guardian` (RG) | `auditor-no-funcional` | P5-001, P5-002, P5-003, P5-004, P5-005, P5-006, P5-007, P5-008, P5-009, P5-010, P5-011, P5-012, P5-013, P5-014 | Auditar beta funcional | G1-G4 |

### Fase 6. Trayectoria, validación formal y release candidate

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P6-001` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 25)` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-006 | Implementar consulta de próximas inscripciones | G2,G3 |
| `P6-002` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 25)` | `backend-datos` (BE) | `arquitecto-seguridad` | P4-006, P5-004 | Implementar historial y marcado de evento completado | G2,G3 |
| `P6-003` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 26)` | `backend-datos` (BE) | `arquitecto-seguridad` | P6-002 | Implementar métricas de trayectoria derivadas | G2,G3 |
| `P6-004` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 26)` | `frontend` (FE) | `qa-e2e` | P6-001, P2-007 | Implementar dashboard de próximo reto | G2,G4 |
| `P6-005` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 27)` | `frontend` (FE) | `qa-e2e` | P6-002, P6-003 | Implementar trayectoria e historial | G2,G4 |
| `P6-006` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 32)` | `analista-funcional` (PFA) | `orquestador-oak` | P5-015 | Preparar protocolo de validación formal | G1 |
| `P6-007` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 33)` | `analista-funcional` (PFA) | `orquestador-oak` | P6-004, P6-005, P6-006 | Ejecutar pruebas con al menos 5 deportistas y 2 organizadores | Evidencia pre-D2 |
| `P6-008` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 34)` | `qa-e2e` (QA) | `auditor-no-funcional` | P6-007 | Convertir hallazgos confirmados en defectos P0-P3 | G4 |
| `P6-009` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 35)` | `frontend` (FE/BE) | `qa-e2e` | P6-008 | Corregir defectos P0 y P1 de validación | G1-G4 |
| `P6-010` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 36)` | `qa-e2e` (QA) | `auditor-no-funcional` | P6-001, P6-002, P6-003, P6-004, P6-005, P6-006, P6-007, P6-008, P6-009 | Ejecutar regresión funcional completa | G4 |
| `P6-011` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 37)` | `orquestador-oak` (SUP) | `analista-funcional` | P6-010 | Congelar contratos de release candidate | G4 |
| `P6-012` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 38)` | `analista-funcional` (PFA) | `orquestador-oak` | P6-010, P6-011 | Firmar aceptación funcional interna del release candidate | Evidencia pre-D2 |
| `P6-013` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 39)` | `release-guardian` (RG) | `auditor-no-funcional` | P6-001, P6-002, P6-003, P6-004, P6-005, P6-006, P6-007, P6-008, P6-009, P6-010, P6-011, P6-012 | Auditar RC funcional | G4 |

### Fase 7. Hardening, compliance y preparación operativa

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P7-001` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 40)` | `qa-e2e` (QA/BRUX) | `auditor-no-funcional` | P6-013 | Ejecutar auditoría WCAG 2.2 AA automática y manual | G5 |
| `P7-002` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 41)` | `frontend` (FE) | `qa-e2e` | P7-001 | Corregir incumplimientos de accesibilidad | G5 |
| `P7-003` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 40)` | `qa-e2e` (QA/SRE) | `auditor-no-funcional` | P6-013 | Medir CWV y presupuestos de assets en staging | G5 |
| `P7-004` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 41)` | `frontend` (FE/BE) | `qa-e2e` | P7-003 | Corregir regresiones de rendimiento | G5 |
| `P7-005` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 40)` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P6-013 | Ejecutar SAST, SCA, secret scan y revisión manual | G5 |
| `P7-006` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 30)` | `arquitecto-seguridad` (SEC) | `auditor-no-funcional` | P5-013 | Ejecutar DAST autenticado y no autenticado en staging | G5 |
| `P7-007` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 40)` | `analista-funcional` (PFA/SEC) | `orquestador-oak` | P6-013 | Finalizar privacidad, consentimientos, retención y borrado | G5 |
| `P7-008` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 40)` | `devops-release` (SRE) | `auditor-no-funcional` | P6-013 | Configurar dashboards y alertas | G6 |
| `P7-009` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 14)` | `devops-release` (SRE) | `auditor-no-funcional` | P2-002 | Ejecutar backup y restore en entorno aislado | G6 |
| `P7-010` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 30)` | `devops-release` (SRE) | `auditor-no-funcional` | P5-013 | Ejecutar rollback de aplicación y migración compatible | G6 |
| `P7-011` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 40)` | `documentacion-handoff` (DOC) | `orquestador-oak` | P6-013 | Completar README, runbooks y catálogo de incidencias | G6 |
| `P7-012` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 42)` | `qa-e2e` (QA) | `auditor-no-funcional` | P7-002, P7-004, P7-005, P7-006, P7-007, P7-008, P7-009, P7-010 | Ejecutar smoke posterior a hardening | G5,G6 |
| `P7-013` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 43)` | `release-guardian` (RG) | `auditor-no-funcional` | P7-001, P7-002, P7-003, P7-004, P7-005, P7-006, P7-007, P7-008, P7-009, P7-010, P7-011, P7-012 | Auditar non-functional y release readiness | G5,G6 |

### Fase 8. UAT, release y handoff final

| ID | Estado | Ola (`wave`) | Owner (Plan ref) | Reviewer independiente | Dependencias | Tarea | Gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `P8-001` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 44)` | `qa-e2e` (QA) | `auditor-no-funcional` | P7-013 | Ejecutar suite de release tres veces desde estado limpio | G4,G7 |
| `P8-002` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 45)` | `qa-e2e` (QA/PFA) | `auditor-no-funcional` | P8-001 | Cerrar matriz de trazabilidad | G7 |
| `P8-003` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 41)` | `documentacion-handoff` (DOC) | `orquestador-oak` | P7-011 | Preparar guía demo y cuentas de prueba | G7 |
| `P8-004` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 46)` | `usuario-validador` (USR) | `release-guardian` | P8-002, P8-003 | Ejecutar D2 UAT final en staging | D2,G6 |
| `P8-005` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 47)` | `release-guardian` (RG) | `auditor-no-funcional` | P8-004 | Verificar cero P0/P1 y excepciones vigentes | D3 entry |
| `P8-006` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 48)` | `usuario-validador` (USR) | `release-guardian` | P8-005 | Autorizar D3 release del artefacto certificado | D3 |
| `P8-007` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 49)` | `devops-release` (SRE) | `auditor-no-funcional` | P8-006 | Etiquetar release v1.0.0 y desplegar entorno acordado | G6,G7 |
| `P8-008` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 50)` | `qa-e2e` (QA) | `auditor-no-funcional` | P8-007 | Ejecutar post-deploy smoke y monitoreo inicial | G6,G7 |
| `P8-009` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 51)` | `documentacion-handoff` (DOC) | `orquestador-oak` | P8-008 | Entregar paquete de handoff | G7 |
| `P8-010` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 52)` | `orquestador-oak` (SUP) | `analista-funcional` | P8-009 | Archivar tablero y publicar estado final real | G7 |
| `P8-011` | `PROPUESTA` | `PENDIENTE_G0 (Nivel 53)` | `release-guardian` (RG) | `auditor-no-funcional` | P8-010 | Cerrar ejecución | G7 |
