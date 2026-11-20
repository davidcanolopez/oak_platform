# Alcance Definitivo V1, Exclusiones Explícitas, Métricas de Éxito y Supuestos Cerrados (`D0`) — OAK

- **Paquete origen:** `P1-001` (Fase 1 — Contrato de producto, marca y arquitectura)
- **Owner funcional:** `analista-funcional` (`PFA`)
- **Decisión de alcance `D0`:** `APPROVED` (`2026-11-20`, aprobado por el usuario en `docs/agentic/DECISION_LOG.md`)
- **Estado de Gate `D1`:** `PENDING USER VALIDATION` (se valida en `P1-012`)
- **Línea base técnica previa:** `G0 = PASS` (`docs/agentic/GATE_STATUS.md`, `P0-010 = ACEPTADA`)
- **Fuentes normativas vinculantes:** `AGENTS.md`, `docs/agentic/DECISION_LOG.md`, `docs/agentic/MASTER_EXECUTION_PLAN.md` (§3–§5, §7, §10–§13), `docs/agentic/REQUIREMENTS_BASELINE.md`, `docs/agentic/QUALITY_GATES.md`, `docs/brand/BRAND_UX_CONTRACT.md` (§1.4, §3.4, §9–§15), `docs/security/DATA_CLASSIFICATION_RETENTION.md`, `docs/data/SYNTHETIC_DATASET.md`, `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/adr/ADR-003-auth-tenancy-and-integrations.md`, `docs/adr/ADR-004-migrations-recovery-and-budgets.md`

---

## 1. Propósito, jerarquía normativa y resumen ejecutivo (`D0`)

Este documento congela el **contrato funcional de alcance de la beta V1 de OAK** sobre la decisión `D0 = APPROVED` (`2026-11-20`) y constituye la fuente única para `P1-002` (personas JTBD), `P1-003` (criterios funcionales Given/When/Then), `P1-004` (arquitectura de información), `P1-007` (prototipo), `P1-008` (modelo de dominio) y `P1-009` (contratos API/eventos).

En caso de discrepancia entre documentos, prevalece estrictamente la jerarquía fijada en `AGENTS.md`:

1. `docs/agentic/DECISION_LOG.md` (decisiones explícitas del usuario `D0`–`D3`).
2. `docs/agentic/MASTER_EXECUTION_PLAN.md` (alcance, dependencias e hitos).
3. `docs/agentic/QUALITY_GATES.md` (requisitos de prueba, calidad y release).
4. `docs/brand/BRAND_UX_CONTRACT.md` (reglas de UI, contenido, diseño responsive y accesibilidad).
5. Los dos decks estáticos bajo `sites/` únicamente como evidencia visual de referencia (nunca como código, constantes, copy o alcance funcional).
6. La memoria del TFM y la hoja de seguimiento como contexto de negocio.

### Resumen ejecutivo cerrado en `D0`

La beta V1 de OAK es una **plataforma web responsive en español (`es-ES`)** que conecta de extremo a extremo a **deportistas aficionados** y **organizadores por invitación cerrada** en pruebas de **`trail` y `running` dentro de la Comunidad de Madrid**, respaldada por herramientas mínimas y auditables de **administración/soporte (`AC-J08`)**:

- **Lado deportista (`J01`–`J05`):** descubre pruebas publicadas sin iniciar sesión mediante filtros deterministas (sin IA), consulta información completa antes del CTA, guarda o retira eventos en **Favoritos (`AC-J02-04`, explícitamente INCLUIDO en V1 por `D0`)**, gestiona cuenta/perfil/consentimientos, completa una inscripción recuperable en cuatro etapas (`modalidad -> datos -> revisión/consentimiento -> pago` mediante **Stripe Hosted Checkout en modo `test`**, o confirmación gratuita `0 EUR`) sin sobreventa ni duplicados, y consulta sus próximas inscripciones y trayectoria derivada.
- **Lado organizador (`J06`–`J07`):** accede mediante invitación cerrada de un solo uso (sin marketplace de autoalta), crea borradores de evento con modalidades, cupos y tramos de precio (`EUR` en céntimos enteros), supera un checklist server-side para publicar, gestiona participantes aislados por organización, concilia totales confirmados, exporta CSV protegido contra _formula injection_ y envía briefings en sandbox sin duplicados.
- **Lado administración/soporte (`J08`):** opera bajo MFA obligatorio (`ADMIN`), localiza una inscripción concreta por identificador sin búsquedas abiertas de PII, registra motivo obligatorio en `AuditLog` inmutable, no dispone de impersonación silenciosa y no puede editar pagos ni cupos directamente en base de datos.

---

## 2. Beachhead geográfico, disciplinar, de canal e idioma (`D0 = APPROVED`)

| Dimensión                            | Definición congelada V1 (`D0`)                     | Regla de verificación y frontera                                                                                                                                                                                                                                                           |
| ------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Disciplinas incluidas**            | `trail` y `running` popular                        | Catálogo, filtros, modelo de dominio y `oak-seed.v1.json` aceptan únicamente `"trail"` y `"running"`. Ciclismo y cualquier otra disciplina quedan fuera de V1.                                                                                                                             |
| **Ámbito geográfico**                | **Comunidad de Madrid** (España)                   | Región fija `"Comunidad de Madrid"`, lista validada de municipios madrileños (`data/fixtures/schema.ts`), direcciones y zona horaria española (`Europe/Madrid`).                                                                                                                           |
| **Canal y viewports**                | **Web responsive** (`320 px` a `1440+ px`)         | Breakpoints canónicos `Mobile` (`320–767 px`), `Tablet` (`768–1199 px`) y `Desktop` (`>= 1200 px`), verificados en `320x568`, `390x844`, `768x1024`, `1200x800` y `1440x900`. Sin apps nativas.                                                                                            |
| **Idioma y localización**            | **Español de España (`es-ES`)**                    | `lang="es"` en documento, navegación, formularios, errores, correos sandbox y panel organizador. Arquitectura preparada para i18n, pero sin segundo idioma en V1. Excepciones inglesas únicamente donde `BRAND_UX_CONTRACT.md` §3.4 las autorice (sujeto a confirmación final en `D1-06`). |
| **Moneda y cobros**                  | **`EUR`** con **Stripe Checkout solo modo `test`** | Importes almacenados como enteros en céntimos (`INTEGER >= 0`). Cero dinero real, cero claves `sk_live_`/`pk_live_`, cero payouts en V1. Admite modalidad gratuita `0 EUR` explícita.                                                                                                      |
| **Personalización y descubrimiento** | **Reglas deterministas sin IA**                    | Búsqueda, filtros combinables y selección editorial ordenados por disciplina, distancia, ubicación/municipio y fecha; sin motores de ML, IA ni `Para ti` predictivo opaco.                                                                                                                 |
| **Favoritos (`AC-J02-04`)**          | **INCLUIDO en V1 (`D0 = APPROVED`)**               | Disponible para deportistas autenticados con redirección `return-to` segura para anónimos, conservación de filtros e idempotencia (`UNIQUE (user_id, event_id)`).                                                                                                                          |

---

## 3. Catálogo de actores, roles y matriz de capacidades V1

De acuerdo con `D0`, `ADR-003` §2.2 y `MASTER_EXECUTION_PLAN.md` §7.2–§7.4, V1 reconoce únicamente los actores y roles siguientes, regidos por autorización server-side **`deny-by-default`** y segunda barrera **`FORCE ROW LEVEL SECURITY`**:

| Actor / Rol                                   | Mecanismo de acceso                                                                               | Capacidades autorizadas en V1                                                                                                                                                                                                                                                                                                                                                                          | Restricciones explícitas y prohibiciones                                                                                                                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`ANONYMOUS`** (Visitante)                   | Sin sesión                                                                                        | Buscar y filtrar eventos `PUBLISHED` futuros/abiertos (`/`, `/explorar`), consultar ficha pública (`/retos/:eventSlug`), acceder a `/entrar`, `/registro` y `/recuperar-acceso`.                                                                                                                                                                                                                       | Cero acceso a eventos `DRAFT`, listados de inscritos, `/mis-retos`, `/trayectoria`, `/perfil`, `/inscripciones/**` o `/pro/**`. Al pulsar Favoritos o inscribirse redirige a `/entrar` conservando `return-to` interno seguro. |
| **`ATHLETE`** (Deportista)                    | Autoalta con verificación de correo y sesión SSR `HttpOnly`                                       | Gestionar perfil reutilizable y consentimientos versionados (`AC-J03`), guardar/quitar **Favoritos** (`AC-J02-04`), iniciar/recuperar borradores e inscribirse en 4 pasos con Stripe test o `0 EUR` (`AC-J04`), ver próximo reto, inscripciones e historial/métricas derivadas (`AC-J05`), exportar sus datos JSON y solicitar borrado/anonimización RGPD con sesión reciente (`auth_time <= 15 min`). | No accede a datos de otros deportistas (`NT-02`). No crea ni edita eventos ni entra en `/pro/**` salvo membresía `ACTIVE`. No puede alterar precios, cupos ni métricas de trayectoria desde cliente.                           |
| **`ORG_OWNER`** (Organizador propietario)     | **Invitación cerrada** de un uso (`SHA-256`, `72 h`) sobre `Organization` + `Membership = ACTIVE` | Gestión completa de su organización y miembros (`INVITED`/`ACTIVE`/`REVOKED`), CRUD de eventos `DRAFT`, modalidades, cupos y `PriceTier`, checklist y publicación/cierre/cancelación/marcado `COMPLETED`, consulta de participantes, KPIs reconciliados, export CSV seguro y envío de briefings en sandbox (`AC-J06`, `AC-J07`).                                                                       | Cero acceso cross-tenant a otras organizaciones (`NT-01`). No puede operar sobre eventos en `DRAFT` ajenos ni dejar una organización activa sin `ORG_OWNER`.                                                                   |
| **`ORG_MANAGER`** (Organizador gestor)        | **Invitación cerrada** + `Membership = ACTIVE`                                                    | Creación/edición/publicación/cierre/completado de eventos de su organización, consulta de participantes, KPIs reconciliados, export CSV seguro y envío de briefings en sandbox.                                                                                                                                                                                                                        | Sin administración de propietarios/membresías de la organización; cero acceso a otras organizaciones.                                                                                                                          |
| **`ORG_VIEWER`** (Organizador lector)         | **Invitación cerrada** + `Membership = ACTIVE`                                                    | Lectura de eventos, participantes y KPIs reconciliados de su organización.                                                                                                                                                                                                                                                                                                                             | Sin permiso para crear, editar, publicar, cerrar, cancelar, completar eventos ni enviar briefings (`NT-03`).                                                                                                                   |
| **`INVITED` / `REVOKED`**                     | Estado de `OrganizationMembership` no activo                                                      | Ninguna capacidad operativa en `/pro/**` (conserva únicamente sus permisos propios como `ATHLETE` si tiene cuenta).                                                                                                                                                                                                                                                                                    | Bloqueo `403` inmediato en cualquier recurso de la organización (`NT-03`).                                                                                                                                                     |
| **`ADMIN`** (Administración / Soporte mínimo) | Cuenta `ADMIN` con **MFA obligatorio**                                                            | Localización puntual de una inscripción por `registration_id` o `registration_code` (`AC-J08-01`), acciones mínimas auditadas de soporte con campo `reason` obligatorio en `AuditLog` (`AC-J08-02`).                                                                                                                                                                                                   | Prohibidas búsquedas amplias/abiertas de PII (`wildcard`), prohibida la **impersonación silenciosa** (`AC-J08-03`) y prohibida la alteración directa de pagos o cupos en BD (`AC-J08-04`).                                     |

---

## 4. Alcance In-Scope V1 y trazabilidad completa (`44/44` AC + `9/9` NFR)

### 4.1 Módulos de dominio, entidades y flujo transaccional cubiertos en V1

V1 implementa los **10 módulos de dominio** y las **16 entidades mínimas** fijadas en `MASTER_EXECUTION_PLAN.md` §7.2–§7.4 y `SYSTEM_ARCHITECTURE.md`:

- **Módulos:** `identity`, `athlete`, `organization`, `catalog`, `registration`, `payments`, `journey`, `organizer-ops`, `communications`, `audit-observability`.
- **Entidades:** `User`, `AthleteProfile`, `ConsentRecord`, `Organization`, `OrganizationMembership`, `Event`, `EventModality`, `PriceTier`, `EventMedia`, `Favourite`, `Registration`, `RegistrationParticipant`, `Payment`, `PaymentWebhookEvent`, `CommunicationLog`, `AuditLog`.
- **Estados obligatorios:** `Event` (`DRAFT`, `PUBLISHED`, `CLOSED`, `CANCELLED`, `COMPLETED`), `Registration` (`DRAFT`, `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `REFUNDED`), `Payment` (`CREATED`, `REQUIRES_ACTION`, `SUCCEEDED`, `FAILED`, `REFUNDED`), `OrganizationMembership` (`INVITED`, `ACTIVE`, `REVOKED`).
- **Modelo canónico de inscripción en 4 etapas (`AC-J04-01`):** `Modalidad` -> `Datos` -> `Revisión y consentimiento` -> `Pago` (Stripe Hosted Checkout en modo `test`, o confirmación atómica `0 EUR`) -> `Resultado` durable (`CONFIRMED`, `PENDING_PAYMENT`, `FAILED`, `CANCELLED`).

### 4.2 Matriz completa de alcance funcional V1 (`44/44` IDs `AC-J01-01`..`AC-J08-04`)

| ID exacto   | Journey                | Prioridad | Especificación de alcance en V1 (`REQUIREMENTS_BASELINE.md` + `D0`)                                                                                              | Módulo(s)                              | Fase / Gates              |
| ----------- | ---------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------- |
| `AC-J01-01` | `J01` Descubrimiento   | `P0`      | Búsqueda pública por disciplina (`trail`/`running`) y ubicación en Comunidad de Madrid sin iniciar sesión.                                                       | `catalog`                              | Fase 3 / `G3`, `G4`       |
| `AC-J01-02` | `J01` Descubrimiento   | `P0`      | Filtros combinables por fecha, distancia y nivel; resultado refleja todos los filtros activos sin IA.                                                            | `catalog`                              | Fase 3 / `G3`, `G4`       |
| `AC-J01-03` | `J01` Descubrimiento   | `P1`      | Parámetros de filtro sincronizados en URL compartible con soporte de navegación atrás/adelante sin perder contexto.                                              | `catalog`                              | Fase 3 / `G4`             |
| `AC-J01-04` | `J01` Descubrimiento   | `P0`      | Visibilidad pública estricta de eventos `PUBLISHED` y futuros/abiertos según regla de cierre (`DRAFT`/`CANCELLED` ocultos).                                      | `catalog`                              | Fase 3 / `G2`, `G3`       |
| `AC-J01-05` | `J01` Descubrimiento   | `P1`      | Estados `loading`, cero resultados (`empty`) y `error` en español `es-ES` con acciones claras de recuperación/limpieza.                                          | `catalog`                              | Fase 3 / `G4`, `G5`       |
| `AC-J01-06` | `J01` Descubrimiento   | `P0`      | Operabilidad completa por teclado y reflow en `320 px` sin scroll horizontal en los 5 viewports.                                                                 | `catalog`                              | Fase 3 / `G4`, `G5`       |
| `AC-J02-01` | `J02` Ficha evento     | `P0`      | Antes del CTA se muestran fecha, lugar, disciplina, distancia, desnivel cuando aplique, nivel, precio total desde (`EUR`), cupo/estado y reglamento.             | `catalog`                              | Fase 3 / `G4`             |
| `AC-J02-02` | `J02` Ficha evento     | `P0`      | Comparativa clara de modalidades por nombre, distancia, cupo disponible, precio total y requisitos (legible en móvil sin scroll 2D).                             | `catalog`                              | Fase 3 / `G3`, `G4`       |
| `AC-J02-03` | `J02` Ficha evento     | `P0`      | Evento `CLOSED`, `CANCELLED` o con `remainingSpots = 0` bloquea CTA engañoso y rechaza inicio de inscripción en servidor.                                        | `catalog`, `registration`              | Fase 3 / `G2`, `G4`       |
| `AC-J02-04` | `J02` Ficha evento     | `P1`      | **Favoritos INCLUIDO en V1 (`D0`):** requiere sesión autenticada, conserva `return-to` interno seguro/filtros y opera de forma idempotente (`UNIQUE`).           | `catalog`, `identity`                  | Fase 3 / `G2`, `G3`, `G4` |
| `AC-J02-05` | `J02` Ficha evento     | `P1`      | Contenido y fotografía siguen la voz, política `es-ES` y reglas visuales/medios aprobadas de OAK (`BRAND_UX_CONTRACT.md`).                                       | `catalog`                              | Fase 3 / `G4`             |
| `AC-J03-01` | `J03` Cuenta y perfil  | `P0`      | Alta, verificación de correo, login, logout con revocación y recuperación de acceso con respuestas no enumeradoras.                                              | `identity`                             | Fase 2 / `G2`, `G3`, `G5` |
| `AC-J03-02` | `J03` Cuenta y perfil  | `P0`      | Validación de nombre, fecha de nacimiento, contacto y preferencias no clínicas; documento sensible bloqueado/no exigible hasta `D1-09`.                          | `athlete`                              | Fase 4 / `G2`, `G3`       |
| `AC-J03-03` | `J03` Cuenta y perfil  | `P0`      | Reutilización segura de datos de `AthleteProfile` en la inscripción con revisión y corrección previa a confirmar.                                                | `athlete`, `registration`              | Fase 4 / `G4`             |
| `AC-J03-04` | `J03` Cuenta y perfil  | `P0`      | Registro append-only de `ConsentRecord` guardando versión del texto legal, fecha UTC, actor y propósito.                                                         | `athlete`, `registration`              | Fase 4 / `G3`, `G5`       |
| `AC-J03-05` | `J03` Cuenta y perfil  | `P1`      | Exportación JSON y solicitud de borrado/anonimización RGPD desde `/perfil` exigiendo sesión reciente (`auth_time <= 15 min`).                                    | `athlete`, `identity`                  | Fase 7 / `G5`             |
| `AC-J04-01` | `J04` Inscripción/pago | `P0`      | Flujo secuencial obligatorio `modalidad -> datos -> revisión/consentimiento -> pago` con guardia server-side contra saltos.                                      | `registration`, `payments`             | Fase 4 / `G4`             |
| `AC-J04-02` | `J04` Inscripción/pago | `P0`      | Desglose de tarifa, gastos de gestión y total (`EUR`) visibles desde la selección de modalidad y antes de pagar.                                                 | `registration`, `payments`             | Fase 4 / `G4`             |
| `AC-J04-03` | `J04` Inscripción/pago | `P1`      | Recuperación de borrador `DRAFT` al cerrar sesión o cambiar de dispositivo autenticado dentro de la ventana de vigencia (`7 días`).                              | `registration`                         | Fase 4 / `G3`, `G4`       |
| `AC-J04-04` | `J04` Inscripción/pago | `P0`      | El servidor recalcula importe desde `PriceTier` en céntimos enteros y reserva cupo en transacción atómica (`SELECT ... FOR UPDATE`).                             | `registration`, `payments`             | Fase 4 / `G2`, `G3`       |
| `AC-J04-05` | `J04` Inscripción/pago | `P0`      | Solicitudes repetidas (`Idempotency-Key`) y webhooks Stripe test duplicados o _out-of-order_ no duplican pagos, registros ni correos.                            | `payments`, `communications`           | Fase 4 / `G2`, `G3`       |
| `AC-J04-06` | `J04` Inscripción/pago | `P0`      | Bajo concurrencia sobre la última plaza disponible (`remainingSpots = 1`) confirma exactamente una inscripción (`0` sobreventa).                                 | `registration`                         | Fase 4 / `G2`, `G3`       |
| `AC-J04-07` | `J04` Inscripción/pago | `P0`      | Éxito, pendiente, fallo de tarjeta test, cancelación en Checkout y reintento seguro reflejan siempre el estado real persistido en servidor.                      | `payments`, `registration`             | Fase 4 / `G4`             |
| `AC-J04-08` | `J04` Inscripción/pago | `P0`      | Una confirmación aparece exactamente una vez en `Mis retos` y dispara exactamente un correo en sandbox (`CommunicationLog` outbox).                              | `registration`, `communications`       | Fase 4 / `G3`, `G4`       |
| `AC-J05-01` | `J05` Trayectoria      | `P0`      | Dashboard deportista separa claramente próximo reto con cuenta atrás, inscripciones activas e historial pasado.                                                  | `journey`                              | Fase 6 / `G4`             |
| `AC-J05-02` | `J05` Trayectoria      | `P0`      | Una inscripción `CONFIRMED` aparece automáticamente en `Mis retos` sin requerir recarga manual forzada ni cachés obsoletas.                                      | `journey`, `registration`              | Fase 6 / `G3`, `G4`       |
| `AC-J05-03` | `J05` Trayectoria      | `P0`      | Métricas de trayectoria (retos, km, localidades) derivan solo de inscripciones `CONFIRMED` y eventos `COMPLETED` y explican su cálculo.                          | `journey`                              | Fase 6 / `G2`, `G3`       |
| `AC-J05-04` | `J05` Trayectoria      | `P1`      | Cuenta sin eventos muestra un _empty state_ claro y útil con acceso directo al catálogo `/explorar`.                                                             | `journey`                              | Fase 6 / `G4`             |
| `AC-J05-05` | `J05` Trayectoria      | `P1`      | Cero presión competitiva, cero rankings/culpabilización y cero datos clínicos, biométricos o de salud en métricas o niveles.                                     | `journey`                              | Fase 6 / `G4`, `D1`       |
| `AC-J06-01` | `J06` Crear/publicar   | `P0`      | Solo un miembro `ACTIVE` con permiso (`ORG_OWNER`/`ORG_MANAGER`) crea o edita eventos de su organización (aislamiento cross-tenant).                             | `organization`, `organizer-ops`        | Fase 5 / `G2`, `G3`, `G5` |
| `AC-J06-02` | `J06` Crear/publicar   | `P0`      | Borrador `DRAFT` admite contenido, imágenes seguras (`<= 5 MB`, sin SVG ni EXIF), modalidades, cupos, `PriceTier`, reglamento y contacto institucional.          | `organizer-ops`                        | Fase 5 / `G3`, `G4`       |
| `AC-J06-03` | `J06` Crear/publicar   | `P0`      | La publicación ejecuta un checklist server-side obligatorio y devuelve la lista exacta de campos faltantes si el evento está incompleto.                         | `organizer-ops`                        | Fase 5 / `G2`, `G3`       |
| `AC-J06-04` | `J06` Crear/publicar   | `P1`      | La vista previa en `/pro/eventos/:eventId` coincide en contenido esencial (título, fechas, modalidades, precios, cupo, reglamento) con la ficha pública.         | `organizer-ops`, `catalog`             | Fase 5 / `G4`             |
| `AC-J06-05` | `J06` Crear/publicar   | `P0`      | Ediciones incompatibles con inscritos existentes (reducir cupo bajo confirmados o eliminar modalidad/tarifa usada) quedan bloqueadas o requieren flujo auditado. | `organizer-ops`                        | Fase 5 / `G2`, `G3`       |
| `AC-J06-06` | `J06` Crear/publicar   | `P0`      | Cada transición de estado de evento (`DRAFT`->`PUBLISHED`->`CLOSED`->`COMPLETED`/`CANCELLED`) queda validada por dominio y registrada en `AuditLog`.             | `organizer-ops`, `audit-observability` | Fase 5 / `G3`, `G5`       |
| `AC-J07-01` | `J07` Participantes    | `P0`      | Consulta de participantes filtrable por evento, modalidad y estado aislada estrictamente a la organización del miembro `ACTIVE`.                                 | `organizer-ops`                        | Fase 5 / `G2`, `G3`, `G5` |
| `AC-J07-02` | `J07` Participantes    | `P0`      | KPIs de inscritos, ocupación e ingresos en modo `test` concilian exactamente al céntimo con inscripciones `CONFIRMED` y pagos `SUCCEEDED`.                       | `organizer-ops`, `payments`            | Fase 5 / `G2`, `G3`       |
| `AC-J07-03` | `J07` Participantes    | `P0`      | Exportación CSV UTF-8 neutraliza _CSV formula injection_ (`=`, `+`, `-`, `@`, `\t`, `\r` prefijados con `'`) y registra quién exportó en `AuditLog`.             | `organizer-ops`, `audit-observability` | Fase 5 / `G2`, `G3`, `G5` |
| `AC-J07-04` | `J07` Participantes    | `P1`      | Envío de briefing en sandbox exige selección explícita de destinatarios de la propia organización, vista previa y confirmación explícita.                        | `organizer-ops`, `communications`      | Fase 5 / `G3`, `G4`       |
| `AC-J07-05` | `J07` Participantes    | `P0`      | Reintentos de envío de briefing mantienen idempotencia por lote/destinatario (`idempotency_key UNIQUE`) sin duplicar correos.                                    | `communications`                       | Fase 5 / `G2`, `G3`       |
| `AC-J08-01` | `J08` Admin/soporte    | `P1`      | `ADMIN` (con MFA) localiza una inscripción únicamente por identificador exacto (`registrationId`/`registrationCode`) sin listados amplios de PII.                | `identity`, `registration`             | Fase 5/7 / `G3`, `G5`     |
| `AC-J08-02` | `J08` Admin/soporte    | `P0`      | Toda operación sensible administrativa exige motivo explícito (`reason`) y genera entrada inmutable en `AuditLog`.                                               | `audit-observability`                  | Fase 5/7 / `G3`, `G5`     |
| `AC-J08-03` | `J08` Admin/soporte    | `P0`      | Prohibida la impersonación silenciosa de cuentas de deportistas u organizadores en autenticación, sesiones o rutas de soporte.                                   | `identity`, `audit-observability`      | Fase 2/7 / `G5`           |
| `AC-J08-04` | `J08` Admin/soporte    | `P0`      | Soporte/admin no puede editar directamente importes de pago ni cupos en base de datos fuera de transiciones de dominio auditadas.                                | `payments`, `registration`             | Fase 2/4 / `G3`, `G5`     |

### 4.3 Trazabilidad de Requisitos No Funcionales V1 (`NFR-01`..`NFR-09`)

| ID exacto | Prioridad | Categoría                          | Requisito cuantitativo en V1 (`REQUIREMENTS_BASELINE.md` §2)                                                                                                                                                       | Gates            |
| --------- | --------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| `NFR-01`  | `P0`      | Integridad transaccional (cupo)    | `0` sobreventa bajo prueba concurrente sobre última plaza (`25` paralelas -> `1` `CONFIRMED`, `24` `409 CONFLICT`).                                                                                                | `G2`, `G3`, `G4` |
| `NFR-02`  | `P0`      | Idempotencia financiera            | Webhook Stripe test efectivamente _exactly-once_ e importe recalculado en servidor en `EUR` céntimos enteros.                                                                                                      | `G2`, `G3`, `G5` |
| `NFR-03`  | `P0`      | Seguridad y aislamiento            | `deny-by-default` + `FORCE RLS` multi-tenant, `0` Critical/High (`SAST`/`SCA`/`DAST`), `0` secretos, `0` PII en logs/Sentry/`AuditLog`/fixtures.                                                                   | `G1`, `G3`, `G5` |
| `NFR-04`  | `P0`      | Accesibilidad (`WCAG 2.2 AA`)      | `0` violaciones Critical/Serious en `axe`, teclado, foco `>= 3 px`, objetivos `>= 48x48 px`, zoom `200 %`, reflow `320 px`, `reduced-motion`, `NVDA` + lector móvil, contraste AA.                                 | `G4`, `G5`       |
| `NFR-05`  | `P0`      | Fiabilidad de suite E2E            | Tasa de flake `0 %` en `3` ejecuciones consecutivas (`retries: 0`) y `0` skips/`only` silenciosos.                                                                                                                 | `G4`, `G7`       |
| `NFR-06`  | `P1`      | Rendimiento web (CWV y Lighthouse) | `LCP <= 2,5 s`, `INP <= 200 ms`, `CLS <= 0,1` (p75 móvil), Lighthouse móvil `>= 90` perf / `>= 95` a11y y presupuestos de transferencia `ADR-004`.                                                                 | `G0`, `G5`       |
| `NFR-07`  | `P1`      | Latencia y carga API               | Respuesta `p95 <= 500 ms` para catálogo, detalle y consultas normales bajo perfil de carga `ADR-004` (`20 RPS` sostenidos / `60 RPS` burst).                                                                       | `G0`, `G5`       |
| `NFR-08`  | `P1`      | Continuidad operativa              | `RPO <= 24 h` y `RTO <= 4 h` demostrados mediante simulacro de backup/restore y rollback en staging.                                                                                                               | `G6`, `G7`       |
| `NFR-09`  | `P2`      | Compatibilidad multi-navegador     | Matriz extendida (`2` últimas versiones Chrome, Edge, Firefox, Safari; Safari iOS y Chrome Android en los `5` viewports); cobertura base (`Chromium`/`Firefox`/`WebKit` desktop y `320 px`) exigible en `P0`/`P1`. | `G4`, `G5`       |

---

## 5. Catálogo `Out-of-Scope V1`, honestidad visual y prohibiciones de decks (`AC-02`)

### 5.1 Exclusiones explícitas de producto e interfaz (`Out-of-Scope V1`)

Ninguna de las capacidades siguientes forma parte de V1 salvo nueva decisión explícita aprobada por el usuario en `DECISION_LOG.md`:

|   # | Capacidad excluida en V1                                                                                   | Fuente normativa                                       | Tratamiento obligatorio en código, diseño e interfaz V1                                                                                       |
| --: | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | **Aplicaciones nativas iOS o Android**                                                                     | `D0`, Plan §5                                          | Solo web responsive en navegador (`320 px..1440+ px`); sin paquetes nativos ni tiendas móviles.                                               |
|   2 | **Integración con wearables y plataformas externas** (`Strava`, `Garmin`, `Polar`, relojes/GPS)            | `D0`, Plan §5, `BRAND` §15.2                           | Sin OAuth externo de actividad ni importación automática de entrenamientos o actividades.                                                     |
|   3 | **Red social, feeds, comentarios, seguidores o mensajería** entre deportistas o clubes                     | `D0`, Plan §5                                          | Sin muros sociales, comentarios, chat ni compartición social pública de actividad.                                                            |
|   4 | **Recomendaciones mediante IA, ML o modelos predictivos**                                                  | `D0`, Plan §4–§5, `BRAND` §15.2                        | Prohibido etiquetar secciones como personalización algorítmica IA; recomendaciones solo por reglas deterministas.                             |
|   5 | **Marketplace abierto de autoalta** de organizadores, patrocinadores, marcas o servicios profesionales     | `D0`, Plan §5, `BRAND` §2.4                            | Organizadores únicamente por invitación cerrada; sin portal comercial de sponsors ni autoalta abierta.                                        |
|   6 | **Cronometraje oficial, resultados cronometrados, clasificaciones, rankings o seguimiento GPX en directo** | `D0`, Plan §5                                          | Sin tiempos oficiales ni emisión en vivo; los eventos finalizados se marcan `COMPLETED` administrativamente por su organizador (`AC-J05-03`). |
|   7 | **Mapa interactivo avanzado, edición de rutas y análisis GPX**                                             | `D0`, Plan §5, `BRAND` §15.2                           | **Excluido de V1.** Prohibido renderizar mapa interactivo incompleto o conmutador lista/mapa falso.                                           |
|   8 | **Dorsal digital, wallet, check-in y operativa de día de carrera**                                         | `D0`, Plan §5, `BRAND` §15.2                           | **Excluido de V1.** No existe pantalla, pase Apple/Google Wallet ni QR de dorsal operativo en V1.                                             |
|   9 | **Cupones complejos, códigos promocionales, referidos, afiliación y precios dinámicos**                    | Plan §5                                                | Solo tarifas fijas `PriceTier` definidas por fecha o cupo máximo en céntimos `EUR`.                                                           |
|  10 | **Multiidioma, multimoneda, fiscalidad internacional y operación fuera de España/Madrid**                  | `D0`, Plan §5                                          | Solo `es-ES`, `EUR`, Comunidad de Madrid y `trail`/`running`.                                                                                 |
|  11 | **Cobros reales, Stripe Connect, payouts, conciliación bancaria y facturación fiscal automatizada**        | `D0`, Plan §5, `ADR-003`                               | Solo Stripe Checkout modo `test`; `sk_live_`/`pk_live_` bloqueados en arranque sin `D3` separado.                                             |
|  12 | **Gamificación avanzada** (niveles, insignias, sellos de pasaporte, títulos competitivos)                  | Plan §5, `BRAND` §10.5, §15.2                          | V1 muestra únicamente métricas explicables derivadas de inscripciones/completados sin niveles competitivos.                                   |
|  13 | **Lista de espera (_waitlist_), cesión/transferencia de dorsal y planes de preparación**                   | `BRAND` §10.4, §15.2                                   | Sin colas automáticas ni reventa/transferencia entre deportistas en V1.                                                                       |
|  14 | **Aplicación completa de soporte interno**                                                                 | Plan §5                                                | Solo soporte mínimo auditable por ID de inscripción (`AC-J08-01..04`).                                                                        |
|  15 | **Recogida de documentos de identidad sensibles (`DNI`/`NIE`/pasaporte), menores y datos clínicos/salud**  | `DATA_CLASSIFICATION_RETENTION.md` §3.4, `BRAND` §10.4 | Bloqueado por defecto en V1 hasta decisión específica `D1-09` (`documentNumber: null`, cero datos de salud/biométricos).                      |

### 5.2 Regla de honestidad visual e interfaz (`BRAND_UX_CONTRACT.md` §15.2 y §16)

1. **Cero controles decorativos o promesas rotas:** Todo botón, pestaña, enlace, tarjeta o flujo correspondiente a una capacidad `Out-of-Scope V1` (especialmente el **mapa interactivo**, el **dorsal digital**, los **niveles/insignias** y la **conexión con wearables**) debe **eliminarse por completo** de la arquitectura de información (`P1-004`), del prototipo (`P1-007`) y de las pantallas de producción.
2. **Prohibición de encabezados mixtos e iconos Unicode de presentación:** No pueden llegar a producto anotaciones bilingües de los decks (`Decision page`, `Conversion flow`, `Athlete home`) ni glifos Unicode utilizados como sistema de iconos (`BRAND_UX_CONTRACT.md` §3.4 y §11.1).
3. **Prohibición de pares cromáticos inaccesibles y copy heredado sin contraste:** Prohibido el uso de `Orange/Sand`, `Sky/Sand`, `Cream/Orange` y `Lime/Sand-Cream` en texto o iconos significativos, así como la copia directa de CSS o JS de `sites/**` (`G0_BRAND_UX_BASELINE.md` §1.2 y §2.4).

### 5.3 Prohibición de datos ilustrativos y términos mock de los decks (`BRAND_UX_CONTRACT.md` §1.4)

En aplicación de `BRAND_UX_CONTRACT.md` §1.4 y `assertNoBannedMockData()` (`data/fixtures/schema.ts`), los siguientes **8 términos ilustrativos de presentación** quedan **PROHIBIDOS (`0` ocurrencias)** como alcance activo, constante de producto, precio contractual, evento real/demo, cuenta de prueba, dominio o nivel de deportista en `src/**`, `data/**`, `tests/**`, documentación de producto y evidencias:

- Personas y perfiles ilustrativos prohibidos: `David Cano`
- Eventos ilustrativos prohibidos: `Trail del Robledal`, `Pedales de Guadarrama`, `10K Madrid Rio`, `Sierra Norte Trail`
- Dominios ilustrativos prohibidos: `oak.run`
- Niveles/gamificación ilustrativos prohibidos: `Explorer`, `Pathfinder`

Cualquier dato sintético en seeds, capturas o ejemplos de documentación debe emplear exclusivamente entidades del dataset sintético (`oak-seed.v1`) y direcciones bajo dominio reservado RFC 2606 (`@oak-demo.invalid`).

---

## 6. Métricas de éxito cuantitativas y presupuestos objetivos V1 (`AC-03`)

### 6.1 Métricas de producto y validación con usuarios (`P6-007` y `P8-004`)

| Métrica de producto / validación                 | Objetivo cuantitativo V1                                                                                       | Modo de medición y fase            |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Cobertura funcional verificada**               | **`100 %`** de criterios `P0` (`33/33`) y `P1` (`11/11`) en `PASS` (`44/44` AC)                                | Matriz `P1-010` / `P8-002` + `G4`  |
| **Cohorte mínima de validación formal**          | **`>= 5` deportistas** y **`>= 2` organizadores** en entorno `staging`                                         | `P6-007` (pre-`D2`)                |
| **Tasa de finalización de inscripción E2E**      | **`>= 85 %`** de participantes de prueba completan `modalidad -> pago test -> Mis retos` sin asistencia        | Guion `P6-007` y `D2` (`P8-004`)   |
| **Tasa de publicación correcta por organizador** | **`100 %`** completan creación -> checklist -> publicación -> export CSV sin errores bloqueantes no explicados | Guion `P6-007` y `D2` (`P8-004`)   |
| **Conciliación exacta y cero sobreventa**        | **`0`** discrepancias de aforo o céntimos en inscripciones, KPIs y pagos de prueba                             | Reconciliación SQL `G3` / `P5-015` |
| **Defectos bloqueantes en release**              | **`0`** defectos `P0` y **`0`** defectos `P1` abiertos                                                         | `G4`–`G7` / `P8-005`               |

### 6.2 Métricas de ingeniería, fiabilidad y continuidad (`QUALITY_GATES.md` §6 y `ADR-004`)

| Dimensión                          | Umbral cuantitativo obligatorio                                                                                                                          | Gate                     |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **Cobertura de pruebas unitarias** | Líneas **`>= 85 %`**, ramas **`>= 80 %`**, diff **`>= 90 %`**, **`100 %` ramas críticas** (precio, cupo, authz, estados, idempotencia), `0` skips/`only` | `G2`                     |
| **Estabilidad suite E2E**          | **`0 %` flake** en **`3` ejecuciones consecutivas** (`retries: 0`) en Chromium, Firefox y WebKit                                                         | `G4`, `P8-001`           |
| **Concurrencia última plaza**      | `25` peticiones paralelas sobre `remainingSpots = 1` -> **`1` confirmada + `24` `409 CONFLICT` + `0` sobreventa + `0` `5xx`**                            | `G3`, `G5`               |
| **Idempotencia de webhooks**       | `20` entregas duplicadas/desordenadas -> **`1` `CONFIRMED` + `1` `Payment SUCCEEDED` + `1` `CommunicationLog` + `0` `5xx`**                              | `G3`, `G5`               |
| **Continuidad operativa**          | **`RPO <= 24 h`** y **`RTO <= 4 h`** verificados mediante simulacro real de backup/restore y rollback en `staging`                                       | `G6`, `P7-009`, `P7-010` |

### 6.3 Presupuestos de rendimiento web (`ADR-004` §2.4) y SLO de API

| Métrica de rendimiento / carga                       | Umbral cuantitativo obligatorio                                                                                                 | Condición de medida                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Core Web Vitals (`LCP` / `INP` / `CLS` / `TTFB`)** | **`LCP <= 2,5 s`**, **`INP <= 200 ms`**, **`CLS <= 0,1`**, **`TTFB <= 800 ms`**                                                 | Percentil `p75` en móvil representativo (`G5`)                                 |
| **Lighthouse CI móvil**                              | **`>= 90`** en Performance y **`>= 95`** en Accessibility                                                                       | Rutas clave desktop/móvil (`G5`)                                               |
| **JS First-Load máximo (gzip)**                      | Públicas **`<= 160 KB`**, atleta auth **`<= 190 KB`**, `/pro/**` **`<= 220 KB`**                                                | `next build` (`ADR-004` §2.4.A)                                                |
| **Transferencia inicial total máxima**               | Públicas **`<= 900 KB`** (`<= 750 KB` `/explorar`, `<= 850 KB` detalle), atleta auth **`<= 600 KB`**, `/pro/**` **`<= 800 KB`** | CSS `<= 45 KB` gzip, WOFF2 `<= 120 KB`, hero `<= 350 KB`, thumbnail `<= 40 KB` |
| **Latencia y tasa de error API**                     | **`p95 <= 500 ms`**, `p99 <= 1200 ms`, `5xx <= 0,5 %` (`20 RPS` sostenidos) / `<= 1,0 %` (`60 RPS` burst)                       | Staging hasta `500` eventos / `10.000` inscripciones (`G5`)                    |

### 6.4 Métricas de accesibilidad (`WCAG 2.2 AA`) y seguridad / PII

- **Accesibilidad (`NFR-04`):** `0` violaciones `critical`/`serious` en `axe-core`; contraste funcional `>= 4,5:1`; foco visible `>= 3 px` (contraste `>= 3:1`); objetivos táctiles `>= 48x48 px`; zoom `200 %`; reflow `320 px` sin scroll horizontal; `prefers-reduced-motion` en CSS y JS; revisión manual completa con `NVDA` + lector móvil (`TalkBack` o `VoiceOver`).
- **Seguridad y PII (`NFR-03`):** `0` vulnerabilidades `Critical`/`High` en `SAST`/`SCA`/`DAST`; `0` secretos en Git/CI (`gitleaks` + `secretlint`); `0` PII real y `0` correos fuera de `@oak-demo.invalid`/RFC 2606 en código, seeds, logs, Sentry, `AuditLog` o evidencias; `17/17` pruebas negativas `NT-01..NT-17` en `PASS`.

---

## 7. Límites operativos y cierre de preguntas abiertas para `P1-002..P1-008`

### 7.1 Límites operativos y reglas cerradas V1

1. **Moneda y cálculo financiero (`EUR`):** Todo precio (`PriceTier`, `Registration`, `Payment`) se almacena como entero no negativo en **céntimos de euro** (`currency = 'EUR'`). El servidor ignora cualquier importe enviado por el cliente y recalcula `amountCents + managementFeeCents = totalCents` dentro de la transacción de reserva.
2. **Tiempo y zona horaria:** Toda marca temporal persistida usa `TIMESTAMPTZ` en **UTC**; `Event.timezone` toma `'Europe/Madrid'` por defecto, convirtiendo a hora local únicamente en UI y exportaciones. Siempre se exige `registrationClosesAtUtc <= startsAtUtc`.
3. **Cupo, reserva temporal y borradores:** Cada modalidad define `capacityLimit >= 1` y protege `reservedCount <= capacityLimit` con `SELECT ... FOR UPDATE` y `CHECK`. El estado `PENDING_PAYMENT` retiene plaza durante un **TTL de `15 minutos`** antes de liberación automática; los borradores `DRAFT` son recuperables durante **`7 días`** de inactividad (limpieza a `30 días`).
4. **Regla de publicación y visibilidad (`AC-J01-04`, `AC-J06-03`):** El catálogo público muestra únicamente eventos `PUBLISHED` con `registrationClosesAtUtc > NOW()` (eventos `DRAFT`, `CLOSED`, `CANCELLED` o `COMPLETED` no aparecen como inscribibles; los `COMPLETED` permanecen accesibles en el historial del deportista inscrito).
5. **Acceso cerrado a organizadores:** Toda alta de miembro organizador requiere invitación emitida internamente (`token SHA-256`, un solo uso, caducidad **`72 horas`**); `invited_email` se limpia tras activación o vencimiento (`30 días`).
6. **Medios y exportación CSV:** `EventMedia` admite únicamente `image/webp`, `image/avif`, `image/jpeg` e `image/png` de hasta **`5 MB`**, elimina metadatos EXIF y **prohíbe SVG subido por usuario**. Las tablas de `/pro` pagan a `<= 50` filas/página y el export CSV neutraliza fórmulas anteponiendo `'` y registrando `AuditLog`.
7. **Privacidad, `D1-09` y derechos RGPD:** Queda **deshabilitada la captura obligatoria de documento de identidad (`DNI`/`NIE`/pasaporte), reglas especiales de menores y cualquier dato clínico/biométrico en V1** hasta una decisión específica en `D1-09` (`documentNumber: null` en `oak-seed.v1.json`). Exportación JSON y borrado/anonimización RGPD exigen re-autenticación reciente (`auth_time <= 15 min`), preservando `Registration`/`Payment`/`AuditLog` sin PII directa.

### 7.2 Cierre de las preguntas del apartado 4 de `MASTER_EXECUTION_PLAN.md`

| Pregunta abierta (Plan §4)          | Respuesta cerrada para `P1-002..P1-008`                                                                                                                                                   | Tareas desbloqueadas directamente      |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **1. Mercado inicial**              | `trail` y `running` popular en la **Comunidad de Madrid** (ciclismo excluido en V1).                                                                                                      | `P1-002`, `P1-003`, `P1-004`, `P1-008` |
| **2. Usuario primario**             | Deportista aficionado de Madrid (`trail`/`running`) que descubre retos, guarda favoritos (`AC-J02-04`) y consolida su historial sin presión competitiva.                                  | `P1-002`, `P1-003`, `P1-004`           |
| **3. Cliente económico inicial**    | Organizador pequeño o mediano de pruebas populares madrileñas operando bajo una `Organization` multi-tenant aislada.                                                                      | `P1-002`, `P1-003`, `P1-008`           |
| **4. Canal**                        | Web responsive `320 px..1440+ px` (breakpoints `320/768/1200`, `5` viewports de referencia); cero apps nativas.                                                                           | `P1-004`, `P1-006`, `P1-007`           |
| **5. Idioma**                       | Español de España (`es-ES`) en toda la UI y comunicaciones; preparado estructuralmente para i18n sin segundo idioma en V1.                                                                | `P1-003`, `P1-004`, `P1-007`           |
| **6. Acceso de organizadores**      | Alta exclusivamente por **invitación cerrada** (`token SHA-256`, `72 h`) y roles `ORG_OWNER` / `ORG_MANAGER` / `ORG_VIEWER`; sin autoalta abierta.                                        | `P1-002`, `P1-003`, `P1-008`, `P1-009` |
| **7. Pagos**                        | **Stripe Hosted Checkout en modo `test`** (`EUR` céntimos enteros, webhook firmado idempotente) + modalidad gratuita `0 EUR`; sin dinero real ni payouts.                                 | `P1-003`, `P1-008`, `P1-009`           |
| **8. Geografía**                    | Comunidad de Madrid (`55` municipios validados), zona horaria IANA `Europe/Madrid`, almacenamiento UTC.                                                                                   | `P1-003`, `P1-008`, `P1-009`           |
| **9. Catálogo**                     | Eventos propios cargados por organizadores autorizados y dataset sintético determinista `oak-seed.v1` (`0` PII en no-producción).                                                         | `P1-003`, `P1-008`, `P1-009`           |
| **10. Recomendaciones y Favoritos** | Reglas deterministas por disciplina, distancia, ubicación y fecha (cero IA); **Favoritos (`AC-J02-04`) incluido en V1** para usuarios autenticados.                                       | `P1-003`, `P1-004`, `P1-008`, `P1-009` |
| **11. Resultados de prueba**        | Marcado administrativo del evento como `COMPLETED` por el organizador autorizado (`AC-J06-06`); cero cronometraje o GPS en directo.                                                       | `P1-003`, `P1-008`, `P1-009`           |
| **12. Infraestructura**             | Monolito modular Next.js + Supabase/PostgreSQL gestionado + Stripe test + Resend sandbox + Sentry en entornos `local`/`preview`/`staging`/`prod`.                                         | `P1-008`, `P1-009`, `P1-011`           |
| **13. Privacidad y `D1-09`**        | Minimización estricta de PII, `ConsentRecord` versionado append-only, exportación/borrado RGPD con `auth_time <= 15 min`, cero documentos de identidad sensibles ni datos clínicos en V1. | `P1-002`, `P1-003`, `P1-008`, `P1-011` |
| **14. Compatibilidad**              | `2` últimas versiones estables de Chrome, Edge, Firefox y Safari; Safari iOS y Chrome Android en los `5` viewports (`Chromium`/`Firefox`/`WebKit` obligatorios en CI `G4`).               | `P1-007`, `P1-010`                     |

---

## 8. Frontera exacta `D0` (cerrado) vs `D1` (`D1-01..D1-14` pendientes de `P1-012`)

### 8.1 Lo que ya queda CERRADO en `D0` (`2026-11-20`)

Quedan congelados sin necesidad de nueva validación de negocio en `D1`:

- Beachhead (`trail` y `running` en la Comunidad de Madrid).
- Actores (`Deportista` + `Organizador por invitación` + `Admin/Soporte AC-J08`).
- Canal web responsive `320 px..1440+ px` en `es-ES` (sin segundo idioma ni apps nativas).
- Stripe Checkout exclusivamente en modo `test` (sin dinero real ni payouts).
- Inclusión de **Favoritos (`AC-J02-04`)** en V1.
- Exclusión de mapa interactivo avanzado, dorsal digital, wearables, red social, IA/ML, marketplace, cronometraje/GPX en vivo, cupones complejos, gamificación avanzada y facturación automatizada.

### 8.2 Bloqueadores abiertos exclusivos de Gate `D1` (`BRAND_UX_CONTRACT.md` §15.1)

Permanece en **`PENDING USER VALIDATION`** hasta el hito **`P1-012` (`D1`)** el cierre de marca, experiencia de usuario y políticas operativas finas de los **14 ítems `D1-01..D1-14`**, sin alterar las decisiones de alcance ya cerradas en `D0`:

| ID `D1` | Decisión o entregable pendiente de `D1` (`P1-012`)                                                                       | Relación con `P1-001` (`D0`)                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `D1-01` | Aprobar `BRAND_UX_CONTRACT.md` y nombrar propietarios de marca/UX                                                        | Adopta las exclusiones de `D0` y el retiro de mapa/dorsal digital.                            |
| `D1-02` | Congelar paquete máquina de tokens canónicos (`color`, `type`, `spacing`, `radius`, `elevation`, `breakpoint`, `motion`) | Ejecutado en `P1-005`.                                                                        |
| `D1-03` | Aprobar masters vectoriales de logotipo, área de respeto, tamaño mínimo y favicon                                        | Bloquea uso productivo de `oak-logo.png` hasta aprobación.                                    |
| `D1-04` | Confirmar licencias `WOFF2` locales (`Sora` / `Inter`) y estrategia de carga                                             | Cumple presupuesto `<= 120 KB` de `ADR-004`.                                                  |
| `D1-05` | Aprobar paleta semántica (`success`, `warning`, `danger`, `disabled`, gráficos) verificada por contraste                 | Respeta pares prohibidos (`§4.5`).                                                            |
| `D1-06` | Congelar política lingüística `es-ES` y decidir si promesa/firma permanecen en inglés o pasan a español                  | Respeta idioma único `es-ES` de `D0`.                                                         |
| `D1-07` | Aprobar navegación primaria (`Inicio`, `Explorar`, `Mis retos`, `Trayectoria`, `/perfil` y `/pro`), rutas y acceso       | Ejecutado en `P1-004`; integra enlace/flujo de Favoritos (`AC-J02-04`).                       |
| `D1-08` | Validar flujo visual en 4 etapas y políticas finas de cancelación/reembolso/fallo                                        | Mantiene Stripe solo modo `test` y flujo de 4 pasos.                                          |
| `D1-09` | Validar reglas detalladas de perfil, edad, consentimientos y confirmación de no recogida de documento sensible/salud     | Mantiene bloqueados documentos sensibles y datos clínicos en V1.                              |
| `D1-10` | Validar campos detallados de ficha de evento y alcance operativo concreto de organizador en el prototipo                 | La macro-definición (Madrid, `trail`/`running`, invitación cerrada) ya está cerrada por `D0`. |
| `D1-11` | Aprobar inventario de componentes, librería de iconos SVG (sin Unicode) y estados universales                            | Ejecutado en `P1-006`.                                                                        |
| `D1-12` | Aprobar procedencia/derechos de fotografía y pipeline AVIF/WebP responsive                                               | Prohibidos los PNG `1672x941` actuales en producción.                                         |
| `D1-13` | Aprobar plan de pruebas de accesibilidad (`WCAG 2.2 AA`, `NVDA` + lector móvil) y owner                                  | Alinea con `NFR-04` y `TEST_STRATEGY.md`.                                                     |
| `D1-14` | Establecer líneas base de regresión visual deterministas sobre los `5` viewports                                         | Post-prototipo `P1-007` antes de UI productiva.                                               |

---

## 9. Riesgos residuales y disparadores de invalidación

| ID      | Riesgo residual                                                                                                                    | Impacto        | Mitigación operativa                                                                                                        | Owner                                         | Fase / Gate                  |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------- |
| `RS-01` | Reintroducción inadvertida en `P1-004..P1-007` de controles de mapa interactivo, dorsal digital o términos prohibidos de los decks | Alto (`P1`)    | Revisión cruzada obligatoria de `P1-004`, `P1-006`, `P1-007` contra §5 de este documento + `assertNoBannedMockData()`       | `ux-brand` / `orquestador-oak`                | `P1-004..P1-012` / `D1`      |
| `RS-02` | Ambigüedad en campos concretos de evento o política de cancelación/edad hasta cerrar `D1-08`–`D1-10`                               | Medio (`P1`)   | Mantener modelo extensible sin documentos sensibles ni cobros reales hasta acta `D1` en `P1-012`                            | `analista-funcional` / `arquitecto-seguridad` | `P1-003`, `P1-008`, `P1-012` |
| `RS-03` | Exposición accidental de Stripe en modo `live` o seed sintético en entorno no autorizado                                           | Crítico (`P0`) | Guardias fail-closed en `src/shared/env.ts` (`OAK_ENABLE_LIVE_PAYMENTS`, `OAK_ALLOW_DEMO_SEED`) y pruebas negativas `NT-10` | `arquitecto-seguridad` / `devops-release`     | `P2-001`, `P2-003`, `P4-005` |
| `RS-04` | Crecimiento de alcance de Favoritos (`AC-J02-04`) hacia listas públicas o alertas complejas fuera de `D0`                          | Bajo (`P2`)    | Acotar `Favourite` estrictamente a marca privada por usuario (`UNIQUE (user_id, event_id)`) con estado idempotente          | `analista-funcional` / `backend-datos`        | `P1-003`, `P3-004`, `P3-008` |

### Disparadores de invalidación de este contrato

Este documento queda **`INVALIDATED`** y debe revisarse antes de continuar si:

1. Se modifica `D0` en `docs/agentic/DECISION_LOG.md` (disciplinas, geografía, pagos, idioma o inclusión/exclusión de funcionalidades).
2. Cambia la lista o prioridad de los `44` criterios `AC-J01-01..AC-J08-04` o `9` `NFR` en `docs/agentic/REQUIREMENTS_BASELINE.md`.
3. La validación `D1` (`D1-08`/`D1-09`/`D1-10`) autoriza documentos de identidad sensibles, reglas de menores o datos no contemplados en `DATA_CLASSIFICATION_RETENTION.md`.
