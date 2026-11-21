# Criterios Funcionales Verificables V1 (`Given / When / Then`) — OAK

- **Paquete origen:** `P1-003` (Fase 1 — Contrato de producto, marca y arquitectura)
- **Owner funcional:** `analista-funcional` (`PFA`)
- **Dependencia previa:** `P1-002 = ACEPTADA` (`master @ cdebd34cc0674f26e8d868437003862b88fb07dd`) y `P1-001 = ACEPTADA` (`db0bfd9499cb32817e1b7a19fb2a76859a520f38`)
- **Decisión de alcance `D0`:** `APPROVED` (`2026-11-20`, `docs/agentic/DECISION_LOG.md`)
- **Estado de Gate `D1`:** `PENDING USER VALIDATION` (se resuelve en `P1-012`; prohibida su auto-aprobación aquí)
- **Fuentes normativas vinculantes:** `docs/product/V1_SCOPE_AND_EXCLUSIONS.md`, `docs/product/PERSONAS_AND_DATA_CATALOG.md`, `docs/agentic/REQUIREMENTS_BASELINE.md`, `docs/agentic/DECISION_LOG.md`, `docs/agentic/MASTER_EXECUTION_PLAN.md` (§4, §7, §12–§13), `docs/agentic/QUALITY_GATES.md`, `docs/brand/BRAND_UX_CONTRACT.md` (§1.4, §3–§15), `docs/brand/tokens.oak.v1.json`, `docs/security/DATA_CLASSIFICATION_RETENTION.md`, `docs/security/THREAT_MODEL.md`, `docs/architecture/SYSTEM_ARCHITECTURE.md`, `docs/adr/ADR-003-auth-tenancy-and-integrations.md`, `docs/adr/ADR-004-migrations-recovery-and-budgets.md`, `docs/data/SYNTHETIC_DATASET.md`, `data/fixtures/schema.ts`

---

## 1. Propósito, fuentes, convenciones `Given/When/Then` y coordinación `P1-004` / `D1`

### 1.1 Propósito y alcance de esta especificación

Este documento traduce los **8 journeys (`J01`..`J08`)**, las personas operativas y casos límite **`CL-01..CL-28` (`P1-002`)**, el catálogo lógico de **`16` entidades mínimas** y las amenazas **`NT-01..NT-17`** en **criterios funcionales verificables para la totalidad exacta de los `44` requisitos `AC-J01-01`..`AC-J08-04` (`REQUIREMENTS_BASELINE.md`)** en español de España (`es-ES`).

Su finalidad directa es eliminar toda ambigüedad funcional antes de diseñar y construir:

- el prototipo navegable responsive (`P1-007`);
- el modelo de dominio, máquinas de estado e invariantes (`P1-008`);
- los contratos de casos de uso, API y eventos (`P1-009`);
- la matriz de trazabilidad requisitos-pruebas (`P1-010`).

### 1.2 Nota de coordinación normativa con `P1-004` (`D1-07`) y frontera `D0` / `D1`

1. **Coordinación de rutas provisionales con `P1-004` (`D1-07`):** Todas las referencias en este documento a subvistas o puntos de entrada concretos que concretan o amplían `BRAND_UX_CONTRACT.md` §9 —en especial **`/mis-retos/favoritos`** (gestión privada de Favoritos, `AC-J02-04`, `AC-J05-01`, `AC-J05-04`) y **`/soporte`** (entrada mínima de soporte/admin `AC-J08-01..04`), así como las subrutas del flujo de inscripción (`/inscripciones/:eventId/*`) y del espacio `/pro/**`— son **referencias funcionales provisionales alineadas con la propuesta de arquitectura de información `P1-004` (`INFORMATION_ARCHITECTURE_AND_ROUTES.md`) y sujetas a ratificación formal en `D1-07` (`P1-012`)**.
2. **Separación estricta `D0` cerrado vs `D1` abierto:** Ningún criterio de esta especificación auto-aprueba los ítems `D1-01..D1-14` (`DECISION_LOG.md`, `BRAND_UX_CONTRACT.md` §15.1). Toda afirmación se rige por estas etiquetas explícitas:
   - **`[REGLA_CONTRACTUAL_CERRADA]`**: Comportamiento congelado por `D0 = APPROVED`, `P1-001`, `P1-002`, `ADR-003`, `ADR-004`, `DATA_CLASSIFICATION_RETENTION.md` o `THREAT_MODEL.md`.
   - **`[CANDIDATO_D1]`**: Propuesta funcional o de UX recomendada por defecto para desbloquear `P1-007`/`P1-008`/`P1-010`, pero sujeta a **`PENDING USER VALIDATION`** en **`P1-012` (`Gate D1`)**. Aplica expresamente a:
     - **`D1-05` / `D1-11`:** Paleta semántica final (`status.success`, `status.warning`, `status.danger`, `status.disabled`), librería de iconos SVG (sin glifos Unicode) y detalles visuales de componentes.
     - **`D1-06`:** Confirmación de política lingüística `es-ES` y permanencia o traducción de la promesa maestra/firma en inglés.
     - **`D1-07`:** Ratificación del mapa de rutas (`/mis-retos/favoritos`, `/soporte`, acceso de cuenta a `/perfil` y etapas `/inscripciones/:eventId/*`).
     - **`D1-08`:** Validación visual del flujo de inscripción en 4 etapas y políticas finas de cancelación, reembolso, facturación y fallo.
     - **`D1-09`:** Reglas detalladas de perfil, edad/menores, redacción legal de consentimientos y **confirmación expresa de mantener el estado `blocked_by_D1_09`** sobre documentos de identidad sensibles (`DNI`/`NIE`/pasaporte -> `document_number: null`) y cero datos clínicos/de salud.
     - **`D1-10`:** Campos detallados opcionales de ficha de evento y alcance operativo fino del panel `/pro`.
     - **`D1-12`:** Procedencia, derechos y pipeline responsive AVIF/WebP de fotografía (`EventMedia`).

### 1.3 Convenciones de estructura `Given / When / Then` y matriz estándar UI `es-ES`

Cada uno de los `44` criterios (`AC-J01-01`..`AC-J08-04`) especifica de forma homogénea:

1. **Prioridad, Fase y Gates objetivo** (`REQUIREMENTS_BASELINE.md`).
2. **Ruta(s) / Pantalla(s) afectadas y Matriz de Roles (`Permitidos` vs `Denegados` con códigos `401`/`403`/`404`)**.
3. **Entidades y campos tocados** (cubriendo `16/16` entidades lógicas + `EventPrivateOps`, clasificación `N1..N6` y `blocked_by_D1_09` donde aplique).
4. **Escenario Principal (`Dado / Cuando / Entonces`)** determinista y verificable.
5. **Escenario(s) Negativo / Borde / Autorización (`Dado / Cuando / Entonces`)** enlazando con `CL-01..CL-28` y `NT-01..NT-17`.
6. **Requisitos UI `es-ES` y Accesibilidad verificables** (`WCAG 2.2 AA`, `NFR-04`, `BRAND_UX_CONTRACT.md` §3, §11–§13).

#### Matriz estándar de estados UI `es-ES` aplicable a todas las pantallas (`[REGLA_CONTRACTUAL_CERRADA]` + `[CANDIDATO_D1]` en `D1-05`/`D1-11`)

| Estado / Dimensión                        | Requisito obligatorio en V1 (`BRAND_UX_CONTRACT.md` §4, §11–§13 y `tokens.oak.v1.json`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Idioma y voz (`es-ES`)**                | `lang="es"`, copia en español de España (_sentence case_ en párrafos/errores), voz OAK clara y alentadora sin tono elitista, culpa ni escasez falsa; botones con verbo/objeto específico (ej. `Guardar reto`, `Continuar al pago`, `Publicar evento`, `Exportar participantes CSV`); prohibidos `Aceptar`, `Enviar`, controles solo-flecha y encabezados mixtos de los decks.                                                                                                                                                                                                                          |
| **Estados interactivos (§11.2)**          | Todo control define `Default`, `Hover` (sin desplazar layout), `Focus visible` (anillo `>= 3 px`, separación `>= 2 px`, contraste `>= 3:1` con `focus.on-light`/`focus.on-dark`), `Active`, `Selected/current` (`aria-current` / `aria-pressed` / `aria-selected`), `Disabled` (programático `disabled`/`aria-disabled="true"` + texto explicativo, nunca solo opacidad), `Loading` (conserva dimensiones, bloquea doble envío, `aria-busy="true"`), `Error` (icono SVG + texto de recuperación + `aria-describedby`, nunca solo color) y `Success` (icono SVG + confirmación + `aria-live="polite"`). |
| **Estados de contenido (§11.4)**          | Toda vista respaldada por datos define `loading` inicial/retardado (skeleton estable con `CLS <= 0,1`, detenido bajo `prefers-reduced-motion`), `empty` / `filtered empty`, `partial`, `stale` cuando importe la frescura, error recuperable (`Reintentar` / `Limpiar filtros`) y error de permisos (`403`/`404`) comprensibles en `es-ES`.                                                                                                                                                                                                                                                            |
| **Responsive y accesibilidad (`NFR-04`)** | Reflow completo a **`320 px`** (`320x568`) sin scroll horizontal; cobertura obligatoria de los **`5` viewports** (`320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900`); usable a **`zoom 200 %`**; objetivos puntero **`>= 48x48 px`**; contraste funcional **`>= 4,5:1`** (prohibidos `Orange/Sand`, `Sky/Sand`, `Cream/Orange`, `Lime/Sand-Cream` y `#FFFFFF`/`#000000` como marca OAK); `<h1>` único, landmarks nativos, skip link, teclado completo sin trampas, `NVDA` + lector móvil (`TalkBack`/`VoiceOver`) y respeto estricto de `prefers-reduced-motion` en CSS y JS.                   |

### 1.4 Reglas transversales no negociables (`[REGLA_CONTRACTUAL_CERRADA]`)

1. **Moneda e integridad financiera (`EUR`):** Todos los importes (`PriceTier`, `Registration`, `Payment`) se almacenan como **`INTEGER >= 0` en céntimos de euro** (`currency = 'EUR'`). El servidor ignora cualquier importe, moneda o descuento enviado desde cliente y recalcula `unit_amount_cents + fee_cents = total_cents` dentro de la transacción SQL. En V1 opera únicamente **Stripe Hosted Checkout modo `test`** (con `sk_live_`/`pk_live_` bloqueados en arranque) y confirmación gratuita explícita `0 EUR`.
2. **Tiempo y zona horaria:** Todas las marcas temporales persistidas emplean **`TIMESTAMPTZ` en UTC**; cada `Event` fija **`timezone = 'Europe/Madrid'`** y la conversión a hora local ocurre únicamente en UI y exportaciones. Siempre se valida `registration_closes_at_utc <= starts_at_utc`.
3. **Bloqueos de privacidad, `D1-09` y prohibiciones de seguridad:** Queda **`blocked_by_D1_09`** cualquier captura de `DNI`/`NIE`/pasaporte (`document_type = null`, `document_number = null`), reglas especiales no aprobadas de menores y **todo dato clínico, médico o biométrico**. Prohibida PII en logs `stdout`, Sentry, `AuditLog`, URLs compartibles y fixtures; todos los correos sintéticos de prueba usan sufijo `.invalid` (`@oak-demo.invalid` o `@anon.oak.invalid` tras borrado). Prohibido usar ninguno de los `8` términos ilustrativos catalogados en `V1_SCOPE_AND_EXCLUSIONS.md` §5.3 y `BANNED_DECK_TERMS` (`data/fixtures/schema.ts`).
4. **Respeto absoluto de las `15` exclusiones `Out-of-Scope V1` (`D0`):** Cero criterios positivos, rutas o controles para apps nativas, wearables (`Strava`/`Garmin`), red social/mensajería, IA/ML, autoalta abierta de organizadores, cronometraje/GPX en directo, mapa interactivo o conmutador lista/mapa, dorsal digital/wallet/QR, cupones complejos/precios dinámicos, multiidioma/multimoneda, Stripe `live`/payouts/facturación, gamificación (niveles/insignias/pasaporte), lista de espera/cesión de dorsal, soporte completo ni documentos sensibles/salud.

---

## 2. Especificación verificable por Journey (`44/44` criterios `AC-J01-01`..`AC-J08-04`)

### 2.1 Journey J01 — Descubrimiento público (`AC-J01-01`..`AC-J01-06`)

#### `AC-J01-01` — Búsqueda pública por disciplina y ubicación en la Comunidad de Madrid sin iniciar sesión

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 3 · `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/` (Inicio con buscador rápido y selección editorial determinista) y `/explorar` (Catálogo y búsqueda).
- **Roles permitidos vs denegados:** Permitido a `ANONYMOUS`, `ATHLETE`, miembros `ORG_*` y `ADMIN` en lectura pública. Sin redirección a login (`0` respuestas `401`/`403` en lectura pública); si un parámetro inválido se envía al endpoint de consulta, responde `400`/`422`.
- **Entidades y campos tocados:** `Event` (`id`, `slug`, `title`, `discipline`, `status`, `region = 'Comunidad de Madrid'`, `municipality`, `location_name`, `starts_at_utc`, `registration_closes_at_utc`, `timezone` — `N1 Pública`), `EventModality` (`distance_meters`, `level`, `capacity_limit`, `reserved_count` — `N1 Pública`), `PriceTier` (`total_cents`, `currency = 'EUR'` — `N1/N5`), `EventMedia` (`storage_path`, `alt_text` — `N1`), `Organization` (`display_name` — `N1`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un visitante `ANONYMOUS` sin cookies de sesión que accede a `/` o `/explorar`, donde existen eventos `PUBLISHED` de `trail` y `running` distribuidos entre los `55` municipios válidos de la Comunidad de Madrid (`oak-seed.v1`),
  - **Cuando** selecciona disciplina (`trail` o `running`) y una ubicación/municipio madrileño (por ejemplo `Miraflores de la Sierra` o `Getafe`) y pulsa `Buscar retos`,
  - **Entonces** el sistema ejecuta una consulta determinista en servidor (sin IA ni ML, `NFR-07` `p95 <= 500 ms`), muestra únicamente las tarjetas de eventos `PUBLISHED` coincidentes con disciplina, `region = 'Comunidad de Madrid'` y ubicación, exponiendo en cada tarjeta disciplina, título, fecha/hora convertida a `Europe/Madrid`, municipio, distancia o rango de modalidades y precio total mínimo en `EUR` (`"Desde XX,XX EUR"` o `"Gratuita (0,00 EUR)"`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Disciplina o territorio fuera de `D0` — `CL-06`, `NT-09`):_ **Dado** un visitante o petición API que solicita `?disciplina=ciclismo` o `?municipio=Segovia` (fuera de la allowlist de `55` municipios madrileños de `data/fixtures/schema.ts`), **cuando** el servidor procesa la búsqueda, **entonces** rechaza la entrada inválida con aviso claro en `es-ES` (`400`/`422` en API o restablecimiento seguro de filtro en UI) y jamás devuelve eventos fuera de `trail`/`running` ni fuera de la Comunidad de Madrid.
  2. _(Ausencia total de controles excluidos `D0` — `Out-of-Scope V1` #4, #7):_ **Dado** el renderizado completo de `/` y `/explorar`, **cuando** se inspecciona la interfaz, **entonces** no existe ningún botón de mapa interactivo ni conmutador lista/mapa, ni etiquetas de recomendación IA (`Para ti` opaco).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Etiquetas visibles persistentes (`Disciplina`, `Ubicación en Madrid`), botón de envío con etiqueta específica (`Buscar retos`), tarjetas sin texto `< 12 px`, contraste `>= 4,5:1` (`ground.900`/`forest.700` sobre `cream.100`/`sand.300`), imágenes con `alt` descriptivo o `alt=""` (`NFR-04`, `NFR-06`).

#### `AC-J01-02` — Combinación determinista de filtros (fecha, distancia, nivel y desnivel cuando aplique)

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 3 · `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/explorar`.
- **Roles permitidos vs denegados:** Permitido a `ANONYMOUS` y usuarios autenticados en lectura pública (`400`/`422` ante rangos inválidos como `fechaDesde > fechaHasta` o `distanciaMin > distanciaMax`).
- **Entidades y campos tocados:** `Event` (`discipline`, `municipality`, `starts_at_utc`, `status`), `EventModality` (`distance_meters`, `elevation_gain_meters`, `level`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un visitante en `/explorar` con catálogo `PUBLISHED` activo en Madrid,
  - **Cuando** combina filtros de rango de fechas, rango de distancia (`km`), nivel (`INICIACION`, `MEDIO`, `AVANZADO`) y —cuando aplique a `trail`— desnivel positivo, más ordenación determinista (por fecha próxima o precio ascendente, sin motor predictivo),
  - **Entonces** el listado devuelto satisface simultáneamente la intersección lógica (`AND`) de todos los filtros activos sobre eventos que tengan al menos una `EventModality` coincidente, muestra cada filtro activo como chip visible e individualmente eliminable (`Quitar filtro <nombre>`), y actualiza el contador accesible de resultados encontrados.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Eliminación parcial de un filtro activo — `CL-06`):_ **Dado** un resultado filtrado por `disciplina=trail`, `nivel=MEDIO` y `distancia=15-30km` con `1` evento mostrado, **cuando** el usuario pulsa `Quitar filtro Nivel: Medio`, **entonces** se recalcula la consulta aplicando únicamente los filtros restantes (`trail` + `15-30km`) sin resetear los demás criterios ni perder el foco lógico.
  2. _(Rango numérico o de fechas invertido):_ **Dado** un formulario o query con `fechaDesde = 2027-06-01` y `fechaHasta = 2027-05-01`, **cuando** el usuario aplica filtros, **entonces** la UI muestra error inline vinculado con `aria-describedby` en `es-ES` (`"La fecha de inicio no puede ser posterior a la fecha de fin"`) y el servidor valida y rechaza rangos incoherentes (`422`).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Controles de filtro visibles en panel lateral en desktop (`>= 1200 px`) y mediante diálogo / _bottom sheet_ accesible con botón `Aplicar filtros` y cierre por `Escape` en móvil (`320–767 px`); región `aria-live="polite"` anuncia el nuevo total de pruebas sin interrumpir la navegación (`NFR-04`, `NFR-07`).

#### `AC-J01-03` — Sincronización de filtros en URL compartible e historial atrás/adelante

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 3 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/explorar?...` y transición hacia/desde `/retos/:eventSlug`.
- **Roles permitidos vs denegados:** Permitido a todos los roles en lectura; prohibido incluir datos personales, identificadores de usuario o tokens de sesión en la URL (`NFR-03`).
- **Entidades y campos tocados:** Parámetros de consulta públicos de `Event` y `EventModality` (`disciplina`, `municipio`, `desde`, `hasta`, `distanciaMin`, `distanciaMax`, `nivel`, `orden`, `pagina` — `N1 Pública`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un usuario que selecciona en `/explorar` los filtros `disciplina=trail`, `municipio=miraflores-de-la-sierra` y `nivel=MEDIO`,
  - **Cuando** aplica los filtros, copia la URL resultante, la abre en otra pestaña o entra a `/retos/subida-la-najarra-miraflores` y pulsa el botón `Atrás` / `Adelante` del navegador,
  - **Entonces** la URL refleja fielmente los filtros activos mediante query params deterministas, la carga directa de la URL compartida reproduce exactamente el mismo conjunto de resultados e indicadores de filtros activos, y la navegación atrás/adelante restaura el contexto previo (filtros, orden y página) sin reiniciar la búsqueda.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Retorno desde `/entrar` conservando filtros URL — `CL-04`, `NT-12`):_ **Dado** un usuario `ANONYMOUS` en `/explorar?disciplina=running&nivel=INICIACION` que activa `Guardar reto` (Favoritos) y es redirigido a `/entrar?returnTo=...`, **cuando** inicia sesión con éxito, **entonces** regresa exactamente a `/explorar?disciplina=running&nivel=INICIACION` conservando sus filtros intactos.
  2. _(Query params desconocidos o manipulados — `CL-06`, `NT-11`):_ **Dado** una URL compartida con parámetros desconocidos o payload XSS (`?disciplina=<script>`), **cuando** se renderiza `/explorar`, **entonces** los parámetros inválidos se ignoran/sanean en servidor sin ejecutar scripts ni provocar error `500`, mostrando aviso recuperable si ningún filtro válido coincide.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** `<title>` de página refleja el contexto de búsqueda, el foco no se pierde de forma abrupta en actualizaciones de filtros y todos los chips reflejan fielmente los parámetros de la URL (`NFR-04`).

#### `AC-J01-04` — Visibilidad pública estricta de eventos `PUBLISHED` futuros y abiertos

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 3 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/`, `/explorar`, `/retos/:eventSlug` y API/queries del módulo `catalog`.
- **Roles permitidos vs denegados:** `ANONYMOUS` y `ATHLETE` solo consultan `PUBLISHED` abiertos en catálogo público (`DRAFT` devuelve **`404 NOT_FOUND`** para no filtrarse ni enumerarse, `NT-09`). Miembros `ACTIVE` de la organización propietaria consultan sus `DRAFT` solo dentro de `/pro/**`.
- **Entidades y campos tocados:** `Event` (`status`, `registration_closes_at_utc`, `starts_at_utc`, `organization_id`), `EventModality` (`capacity_limit`, `reserved_count`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** la base de datos con los `12` eventos de `oak-seed.v1` (`6` `PUBLISHED` —uno con fecha de cierre futura, uno con última plaza y uno con `remaining_spots = 0`—, `2` `DRAFT`, `1` `CLOSED`, `1` `CANCELLED` y `2` `COMPLETED`),
  - **Cuando** un visitante consulta `/` o `/explorar` o invoca el caso de uso público de catálogo en tiempo `T`,
  - **Entonces** únicamente resultan elegibles para descubrimiento público los eventos con `Event.status = 'PUBLISHED'` y `registration_closes_at_utc > NOW()` (excluyendo `DRAFT`, `CLOSED`, `CANCELLED`, `COMPLETED` y eventos `PUBLISHED` cuya ventana de inscripción ya venció); adicionalmente la tabla privada `EventPrivateOps` nunca se expone en consultas públicas (`ADR-003` §2.2).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Acceso directo por slug a borrador privado `DRAFT` — `CL-02`, `NT-09`):_ **Dado** el evento `kilometro-vertical-barranca-navacerrada` en estado `DRAFT` de `Org 1`, **cuando** un `ANONYMOUS`, un `ATHLETE` o un miembro de `Org 2` solicita `/retos/kilometro-vertical-barranca-navacerrada`, **entonces** el servidor y RLS responden **`404 NOT_FOUND`** indistinguible de un slug inexistente sin revelar título, organización ni existencia del borrador.
  2. _(Evento `PUBLISHED` con `registration_closes_at_utc <= NOW()` — `CL-03`):_ **Dado** un evento `PUBLISHED` cuya fecha de cierre de inscripciones acaba de expirar aunque conserve plazas libres, **cuando** se ejecuta una búsqueda en `/explorar`, **entonces** queda excluido de resultados abiertos de inscripción.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** La página `404` de reto no encontrado explica en `es-ES` que la prueba no está disponible o no existe y ofrece enlace/botón claro `Volver a explorar retos` hacia `/explorar` (`NFR-03`, `NFR-04`).

#### `AC-J01-05` — Estados `loading`, cero resultados (`empty`) y `error` comprensibles en `es-ES`

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 3 · `G4`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/` y `/explorar`.
- **Roles permitidos vs denegados:** Todos los roles con acceso público.
- **Entidades y campos tocados:** Proyección pública de `Event`, `EventModality`, `PriceTier`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un usuario navegando en `/explorar` (p. ej. con red lenta simulada o combinación de filtros sin coincidencias),
  - **Cuando** la petición está en curso (`loading`), cuando la combinación devuelve `0` resultados (`filtered empty`) o cuando ocurre un fallo recuperable de servidor/red (`error`),
  - **Entonces**:
    1. En `loading`, se renderiza un _skeleton_ estructural acorde a la jerarquía final con `CLS <= 0,1`, sin animaciones agresivas bajo `prefers-reduced-motion` y con estado anunciado sin exceso (`aria-busy="true"`).
    2. En `empty` / `filtered empty`, se informa claramente en `es-ES` (_"No hay pruebas abiertas que coincidan con tus filtros actuales"_) y se ofrece un botón primario/secundario visible `Limpiar filtros` (objetivo `>= 48x48 px`).
    3. En `error`, se sustituye el estado de carga por un aviso claro sin detalles técnicos internos (_"No hemos podido cargar el catálogo en este momento"_) y un botón `Reintentar` operativo.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Abuso de peticiones en `/explorar` — `CL-28`, `NT-13`):_ **Dado** un cliente automatizado que supera el límite de ráfaga permitido en búsqueda pública, **cuando** recibe respuesta **`429 TOO_MANY_REQUESTS`**, **entonces** la UI presenta mensaje controlado en `es-ES` (_"Has realizado muchas búsquedas seguidas. Espera unos segundos antes de volver a intentarlo"_) sin filtrar stack traces ni caer en bucle infinito de reintentos automáticos.
  2. _(Fallo parcial de imagen de tarjeta):_ **Dado** una tarjeta cuyo `EventMedia` no carga en el navegador, **cuando** falla el recurso gráfico, **entonces** el contenedor reserva dimensiones explícitas (`CLS <= 0,1`) y muestra superficie gráfica de respaldo OAK válida sin romper el layout ni mostrar texto alternativo roto.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Los skeletons nunca permanecen indefinidamente ante error; mensajes de vacío y error utilizan texto `ground.900`/`forest.700` con icono SVG y enlace `aria-live="polite"`; prohibido depender únicamente del color (`NFR-04`, `NFR-06`).

#### `AC-J01-06` — Operabilidad total por teclado y reflow en `320 px` sin scroll horizontal

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 3 · `G4`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/` y `/explorar` (y patrón transversal en toda la app) en los `5` viewports de referencia (`320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900`).
- **Roles permitidos vs denegados:** Todos los roles.
- **Entidades y campos tocados:** Navegación primaria (`Inicio`, `Explorar`, `Mis retos`, `Trayectoria`), formulario de búsqueda/filtros y tarjetas de `Event`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un usuario que opera exclusivamente con teclado (`Tab`, `Shift+Tab`, `Enter`, `Space`, teclas de dirección, `Escape`) o navega en viewport **`320x568`** (`320 CSS px`) y con **`zoom 200 %`**,
  - **Cuando** recorre desde el enlace `Saltar al contenido` hasta la navegación principal, abre el panel/diálogo de filtros, selecciona disciplina/municipio/nivel, aplica filtros, abre una tarjeta de reto y pulsa el botón de favorito o consulta,
  - **Entonces** todo el flujo se completa sin puntero ni trampas de teclado, el foco visible (`>= 3 px` usando `focus.on-light`/`focus.on-dark`, contraste `>= 3:1`) jamás queda oculto tras cabeceras fijas, los diálogos devuelven el foco al disparador al cerrarse con `Escape`, todos los objetivos interactivos miden **`>= 48x48 CSS px`** con separación `>= 8 px` y **`document.documentElement.scrollWidth <= window.innerWidth`** (`0 px` de scroll horizontal) en `320 px` y en `zoom 200 %`.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Navegación por teclado en *bottom sheet* móvil — `CL-27`):_ **Dado** un usuario en `320x568` que abre el _bottom sheet_ de filtros mediante `Enter` sobre `Filtrar retos`, **cuando** tabula dentro del diálogo y pulsa `Escape` sin aplicar cambios, **entonces** el foco permanece contenido mientras el modal está abierto y regresa exactamente al botón `Filtrar retos` al cerrarse.
  2. _(Usuario con `prefers-reduced-motion: reduce` — `CL-27`):_ **Dado** la preferencia del sistema `prefers-reduced-motion: reduce` activa, **cuando** interactúa con transiciones de filtros o tarjetas, **entonces** se desactivan animaciones no esenciales en CSS y JS (`duration = 0 ms`) manteniendo cambios de estado inmediatos.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Cumplimiento `0` violaciones `critical`/`serious` en `axe-core`, un único `<h1>`, landmarks semánticos (`header`, `nav`, `main`, `footer`), `NVDA` en escritorio y `TalkBack`/`VoiceOver` en móvil (`NFR-04`, `NFR-09`).

---

### 2.2 Journey J02 — Decisión en la ficha de evento y Favoritos (`AC-J02-01`..`AC-J02-05`)

#### `AC-J02-01` — Información mínima de decisión completa antes del CTA primario

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 3 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` en detalle fino de política de cancelación `D1-08` y campos opcionales `D1-10`)
- **Rutas / Pantallas:** `/retos/:eventSlug`.
- **Roles permitidos vs denegados:** Lectura pública permitida a `ANONYMOUS` y autenticados cuando `Event.status IN ('PUBLISHED', 'CLOSED', 'CANCELLED', 'COMPLETED')` (nota: `COMPLETED`/`CANCELLED`/`CLOSED` visibles en ficha informativa de solo lectura sin CTA activo de inscripción; `DRAFT` devuelve **`404`** a no autorizados, `NT-09`).
- **Entidades y campos tocados:** `Event` (`title`, `discipline`, `region`, `municipality`, `location_name`, `starts_at_utc`, `registration_closes_at_utc`, `timezone = 'Europe/Madrid'`, `regulation_summary`, `cancellation_policy_summary`, `public_contact_email`, `status`), `Organization` (`display_name`, `slug`), `EventModality` (`name`, `distance_meters`, `elevation_gain_meters`, `level`, `time_limit_minutes`, `capacity_limit`, `reserved_count`, `remaining_spots`), `PriceTier` (`amount_cents`, `management_fee_cents`, `total_cents`, `currency = 'EUR'`), `EventMedia` (`storage_path`, `alt_text`). Jamás consulta ni expone `EventPrivateOps`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento `PUBLISHED` abierto en Madrid (ej. `trail-puentes-viejas-lozoya` en `oak-seed.v1`) con modalidades, precios y reglamento completos,
  - **Cuando** un deportista o visitante abre `/retos/:eventSlug`,
  - **Entonces** antes del botón de acción principal (`Inscribirme` / `Seleccionar modalidad`) se muestran claramente y sin ambigüedades: nombre del reto, disciplina (`trail` o `running`), fecha y hora local en `Europe/Madrid` (y fecha límite de cierre), lugar de salida y municipio madrileño, distancia (y desnivel positivo en metros cuando aplique), nivel, tiempo límite cuando aplique, precio total desde (`"Desde 30,00 EUR — gastos de gestión incluidos"` o `"Gratuita (0,00 EUR)"`), qué incluye la inscripción, identidad y `public_contact_email` institucional del organizador, cupo disponible/estado real (`remaining_spots` agregado sin PII de inscritos), resumen de política de cancelación/reembolso (`[CANDIDATO_D1]` `D1-08`), enlace/resumen del reglamento e información de seguridad/accesibilidad del recorrido cuando aplique (`[CANDIDATO_D1]` `D1-10`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Aislamiento de notas privadas del organizador — `ADR-003` §2.2, `NT-01`):_ **Dado** que el organizador ha registrado notas operativas internas en `EventPrivateOps`, **cuando** `ANONYMOUS` o `ATHLETE` solicita `/retos/:eventSlug` o su endpoint de respaldo, **entonces** el DTO público nunca incluye campos de `EventPrivateOps` ni correos personales de miembros.
  2. _(Ausencia de información de día de carrera excluida en `D0` — `Out-of-Scope V1` #7, #8):_ **Dado** la ficha `/retos/:eventSlug`, **cuando** se revisan sus secciones, **entonces** no muestra mapa interactivo en vivo, análisis GPX interactivo ni vista previa de dorsal digital/QR.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Lectura accesible para lectores de pantalla (`NVDA`/móvil) de fechas, importes (`"30 euros"`, o `"30,00 EUR"`), distancias (`"21 kilómetros"`) y desnivel (`"1.100 metros positivos"`); si en móvil (`320–767 px`) se usa barra CTA adherente (_sticky_), no oculta el foco de teclado ni tapa textos o avisos de error (`NFR-04`, `BRAND_UX_CONTRACT.md` §12.2, §13.4).

#### `AC-J02-02` — Comparativa clara de modalidades por nombre, distancia, cupo, precio y requisitos

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 3 · `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/retos/:eventSlug` (sección de modalidades) y enlace directo hacia etapa 1 (`/inscripciones/:eventId/modalidad`).
- **Roles permitidos vs denegados:** `ANONYMOUS` y usuarios autenticados en eventos visibles; `DRAFT` denegado (`404`).
- **Entidades y campos tocados:** `EventModality` (`id`, `name`, `distance_meters`, `elevation_gain_meters`, `level`, `time_limit_minutes`, `capacity_limit`, `reserved_count`, `remaining_spots`), `PriceTier` (`id`, `label`, `amount_cents`, `management_fee_cents`, `total_cents`, `currency`, `valid_from_utc`, `valid_until_utc`, `max_quantity`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento con dos o más modalidades y tramos de precio (ej. `Trail Puentes Viejas` con modalidad `24K` y `12K`, y tramos `Anticipada` vs `General`),
  - **Cuando** el usuario consulta la comparativa de modalidades en desktop (`1200 px`/`1440 px`), tablet (`768 px`) o móvil (`320 px`/`390 px`),
  - **Entonces** cada modalidad expone simultáneamente nombre, distancia, desnivel cuando aplique, tiempo límite/requisitos y nivel, plazas disponibles reales (`capacity_limit - reserved_count`, o aviso `"Última plaza"` cuando `remaining_spots === 1` y `"Agotada"` cuando `=== 0`), y el desglose del tramo `PriceTier` vigente en tiempo `NOW()` (`tarifa + gestión = total EUR`); en escritorio se presenta en tabla o rejilla comparativa estructurada y en móvil (`320 px`) se adapta en tarjetas apiladas con etiquetas explícitas sin requerir desplazamiento horizontal 2D.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Modalidad con último cupo vs agotada en un mismo evento — `CL-02`, `CL-27`):_ **Dado** un evento donde la modalidad A tiene `remaining_spots = 0` y la modalidad B tiene `remaining_spots = 1`, **cuando** se compara la lista, **entonces** la modalidad A muestra estado `Agotada` con botón de selección deshabilitado programáticamente (`disabled`), mientras la modalidad B permanece seleccionable con etiqueta objetiva `1 plaza disponible` (sin relojes de cuenta atrás falsos ni escasez inventada).
  2. _(Tramo de precio futuro o expirado):_ **Dado** una modalidad con tramo `Anticipada` expirado y tramo `General` vigente en `NOW()`, **cuando** se muestra la comparativa, **entonces** el precio vigente destacado corresponde exclusivamente al `PriceTier` activo en servidor, indicando opcionalmente la existencia de tramos posteriores sin permitir seleccionar un tramo expirado.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** En escritorio, tabla con `<th scope="col">` y `<caption>`; en móvil `320 px` (`CL-27`), transformación responsive a tarjetas sin scroll horizontal; cada tarjeta/botón de selección cumple `>= 48x48 px` y contraste `>= 4,5:1` (`NFR-04`, `NFR-09`).

#### `AC-J02-03` — Bloqueo honesto de evento cerrado, cancelado, finalizado o sin cupo

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 3 · `G2`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/retos/:eventSlug` y POST/acción de inicio de inscripción en `/inscripciones/:eventId/*`.
- **Roles permitidos vs denegados:** Cualquier visitante o `ATHLETE` autenticado que intente inscribirse en un evento no elegible recibe rechazo server-side **`409 CONFLICT`** o **`422 UNPROCESSABLE_ENTITY`**.
- **Entidades y campos tocados:** `Event` (`status`, `registration_closes_at_utc`), `EventModality` (`capacity_limit`, `reserved_count`, `remaining_spots`), `Registration` (`0` filas creadas).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento en estado `CLOSED` (`10k-parque-central-tres-cantos`), `CANCELLED` (`senda-carcavas-patones`), `COMPLETED` (`trail-pedriza-sur-manzanares`), `PUBLISHED` con `registration_closes_at_utc <= NOW()` o `PUBLISHED` con todas sus modalidades en `remaining_spots = 0` (`circular-monte-abantos-escorial`),
  - **Cuando** un usuario visita `/retos/:eventSlug`,
  - **Entonces** el CTA primario de inscripción **no se muestra como disponible ni redirige a checkout**: aparece reemplazado o deshabilitado de forma explícita y no engañosa (`Inscripciones cerradas`, `Prueba cancelada`, `Prueba finalizada` o `Plazas agotadas`), explicando en `es-ES` por qué no es posible inscribirse y ofreciendo un enlace alternativo `Explorar otras pruebas abiertas` hacia `/explorar`.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Ataque directo al endpoint de inicio de inscripción — `CL-02`, `CL-03`, `NT-16`):_ **Dado** un usuario `ATHLETE` autenticado que envía directamente una petición HTTP `POST` para crear `Registration(DRAFT)` o reservar plaza sobre `circular-monte-abantos-escorial` (`remaining_spots = 0`) o sobre `10k-parque-central-tres-cantos` (`CLOSED`) o sobre un evento con `registration_closes_at_utc <= NOW()`, **cuando** el caso de uso valida el estado en PostgreSQL, **entonces** rechaza la operación con **`409 CONFLICT`** (o `422`), no crea ninguna fila en `Registration` ni modifica `reserved_count`, y devuelve mensaje claro en `es-ES`.
  2. _(Ausencia de lista de espera simulada — `Out-of-Scope V1` #13):_ **Dado** una prueba agotada, **cuando** se muestra el estado `Plazas agotadas`, **entonces** no se muestra ningún formulario ficticio de lista de espera (`waitlist`).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Estado deshabilitado comunicado mediante icono SVG, texto explícito y atributos `disabled`/`aria-disabled="true"` (nunca solo por opacidad o color); sin texto de escasez agresiva (`BRAND_UX_CONTRACT.md` §3.3, §11.2; `NFR-04`).

#### `AC-J02-04` — Favoritos en V1: sesión obligatoria, `returnTo` interno seguro e idempotencia

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 3 (`INCLUIDO en V1 por D0 = APPROVED`) · `G2`, `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]` · **Nota DoR `P1-004` (`D1-07`):** la ruta dedicada de listado **`/mis-retos/favoritos`** es una **referencia funcional provisional alineada con la propuesta de arquitectura de información `P1-004` (`INFORMATION_ARCHITECTURE_AND_ROUTES.md`) y sujeta a ratificación formal en `D1-07` (`P1-012`)**.
- **Rutas / Pantallas:** Tarjetas en `/` y `/explorar`, ficha `/retos/:eventSlug`, login `/entrar?returnTo=...` y subvista `/mis-retos/favoritos` (provisional `D1-07`).
- **Roles permitidos vs denegados:**
  - `ATHLETE` (y cuenta autenticada personal): puede crear (`POST`/`PUT`), listar propios y eliminar (`DELETE`) sus propios `Favourite` (`user_id === actor.userId`, RLS `auth.uid() = user_id`).
  - `ANONYMOUS`: lectura no permitida en endpoints privados (`401`); en UI redirige a `/entrar?returnTo=<ruta_interna_validada>`.
  - Cross-athlete (`Atleta A` manipulando favorito de `Atleta B`): denegado **`403`** / **`404`** por caso de uso y RLS (`NT-02`).
- **Entidades y campos tocados:** `Favourite` (`user_id`, `event_id`, `created_at_utc` con `UNIQUE (user_id, event_id)` — `N2 Interna`), `Event` (`id`, `status = 'PUBLISHED'`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un visitante `ANONYMOUS` en `/explorar?disciplina=trail&nivel=MEDIO` o en `/retos/subida-la-najarra-miraflores` que pulsa el botón `Guardar reto` (Favorito) de un evento `PUBLISHED`,
  - **Cuando** el sistema detecta ausencia de sesión, redirige a `/entrar?returnTo=<ruta_interna_codificada>`, y el usuario se autentica correctamente,
  - **Entonces** el servidor valida que `returnTo` pertenezca a la lista blanca interna permitida, redirige de vuelta al origen conservando intactos los filtros de `/explorar` o la ficha `/retos/:eventSlug`, ejecuta de forma idempotente `INSERT INTO Favourite (user_id, event_id) ON CONFLICT (user_id, event_id) DO NOTHING`, actualiza visual y programáticamente el control a `Guardado en favoritos` (`aria-pressed="true"`) y el evento aparece listado en `/mis-retos/favoritos` (provisional `D1-07`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Doble clic o reintento de red — `CL-05`):_ **Dado** un `ATHLETE` autenticado que pulsa `Guardar reto` dos veces seguidas en `< 300 ms` (o repite la petición HTTP), **cuando** el control entra en estado `loading` preservando tamaño `>= 48x48 px` y el servidor procesa la operación idempotente `ON CONFLICT (user_id, event_id) DO NOTHING` (o `DELETE` idempotente al retirar), **entonces** persiste exactamente `1` fila por `(user_id, event_id)` (o `0` al retirar), devuelve `200`/`201` sin errores `500` y refleja el estado real final.
  2. _(Prevención de open redirect en `returnTo` — `CL-04`, `NT-12`):_ **Dado** un parámetro manipulado `/entrar?returnTo=https://malicioso.invalid`, `/entrar?returnTo=//malicioso.invalid` o `/entrar?returnTo=javascript:alert(1)`, **cuando** el usuario completa el inicio de sesión, **entonces** la validación fail-closed descarta el `returnTo` externo/inseguro y redirige por defecto a `/explorar` o `/mis-retos` (`0` redirecciones externas).
  3. _(Intento de marcar `DRAFT` o borrar favorito ajeno — `NT-02`, `NT-09`):_ **Dado** un `ATHLETE` que envía `POST` de favorito sobre un `event_id` en estado `DRAFT` o `DELETE` indicando otro `user_id`, **cuando** el servidor valida visibilidad y `actor.userId`, **entonces** rechaza con `404`/`403` y RLS bloquea toda lectura o mutación cruzada.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Control con etiqueta accesible explícita (`Guardar <título> en favoritos` / `Quitar <título> de favoritos`), `aria-pressed="true|false"`, icono SVG aprobado en `D1-11` (**prohibido usar glifo Unicode `♡`**), objetivo mínimo `>= 48x48 px`, anuncio en `aria-live="polite"` (`"Reto guardado en favoritos"` / `"Reto retirado de favoritos"`) y separación suficiente respecto al enlace de tarjeta para evitar pulsación accidental en `320 px` (`NFR-04`).

#### `AC-J02-05` — Contenido textual, tono OAK `es-ES` y fotografía/medios conforme a contrato

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 3 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` en `D1-06` y `D1-12`)
- **Rutas / Pantallas:** `/`, `/explorar`, `/retos/:eventSlug`.
- **Roles permitidos vs denegados:** Lectura pública; solo `ORG_OWNER`/`ORG_MANAGER` `ACTIVE` suben medios (`EventMedia`) en `/pro/**` (`403` resto).
- **Entidades y campos tocados:** `Event` (`title`, `regulation_summary`, `cancellation_policy_summary`), `EventMedia` (`storage_path`, `mime_type`, `size_bytes`, `width_px`, `height_px`, `alt_text`, `rights_owner`, `provenance_note` — `N1 Pública` / `N3 Confidencial` en `DRAFT`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** cualquier evento `PUBLISHED` mostrado en catálogo o ficha pública,
  - **Cuando** se evalúan sus textos, imágenes y estilos aplicados en los `5` viewports,
  - **Entonces** todo el copy de interfaz y textos transaccionales están redactados en `es-ES` con voz clara, activa y alentadora (`BRAND_UX_CONTRACT.md` §3.1–§3.4, sujeto a decisión `D1-06` sobre promesa/firma), las imágenes de `EventMedia` se sirven en variantes responsive `AVIF`/`WebP` (hero `<= 350 KB`, thumbnail `<= 40 KB`, sin EXIF ni SVG subido por usuario, con `width`/`height` explícitos), utilizan overlays que aseguran contraste `>= 4,5:1` cuando soportan texto, y emplean `0` términos ilustrativos de `BANNED_DECK_TERMS` (`V1_SCOPE_AND_EXCLUSIONS.md` §5.3).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Texto con inyección HTML/XSS o URL insegura — `NT-11`):_ **Dado** un campo de título, descripción o reglamento que contiene `<script>alert(1)</script>` o `javascript:alert(1)`, **cuando** se persiste y renderiza en `/retos/:eventSlug`, **entonces** la entrada se sanea/escapa automáticamente en React y la política CSP bloquea ejecución (`0` scripts ejecutados).
  2. _(Uso prohibido de activos PNG pesados de decks o pares cromáticos prohibidos — `D1-12`):_ **Dado** las reglas de `BRAND_UX_CONTRACT.md` §4.5 y §7, **cuando** se auditan rutas de producción, **entonces** `0` páginas sirven las fotos PNG `1672x941` heredadas de `sites/**` ni emplean combinaciones `Orange/Sand`, `Sky/Sand`, `Cream/Orange` o `Lime/Sand-Cream` en texto/iconos significativos.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Imágenes informativas poseen `alt_text` descriptivo en `es-ES` y motivos topográficos decorativos usan `alt=""` (`aria-hidden="true"`); prohibidas imágenes de texto salvo logotipos aprobados (`D1-03`); presupuesto de transferencia pública `<= 900 KB` (`<= 850 KB` en detalle, `NFR-04`, `NFR-06`).

---

### 2.3 Journey J03 — Cuenta, perfil reutilizable y derechos RGPD (`AC-J03-01`..`AC-J03-05`)

#### `AC-J03-01` — Alta, verificación de correo, login, logout y recuperación sin enumerar cuentas

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 2 · `G2`, `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/registro`, `/entrar`, `/recuperar-acceso`, cierre de sesión desde control de cuenta y middleware SSR de sesión.
- **Roles permitidos vs denegados:**
  - `/registro`, `/entrar`, `/recuperar-acceso`: accesibles a `ANONYMOUS` (usuarios ya autenticados redirigen a `/mis-retos` o `/pro` según destino seguro).
  - `/mis-retos`, `/trayectoria`, `/perfil`, `/inscripciones/**`, `/pro/**`: acceso sin sesión válida denegado (`302` a `/entrar?returnTo=...` en rutas UI, `401 UNAUTHORIZED` en endpoints/Server Actions).
- **Entidades y campos tocados:** `User` (`id`, `email`, `password_hash` en Supabase Auth, `platform_role`, `mfa_enabled`, `email_verified_at_utc`, `last_auth_at_utc` — `N2/N4/N6`), `ConsentRecord` (`ACCOUNT_PRIVACY_POLICY` al registrarse).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** una persona `ANONYMOUS` que abre `/registro` con un correo válido no registrado (en pruebas/demo únicamente `@oak-demo.invalid`),
  - **Cuando** completa el alta aceptando explícitamente la política de privacidad vigente (`ConsentRecord`), verifica su correo mediante enlace de Supabase Auth, inicia sesión en `/entrar`, posteriormente solicita recuperación en `/recuperar-acceso` y finalmente pulsa `Cerrar sesión`,
  - **Entonces** la sesión se gestiona íntegramente en servidor (`@supabase/ssr`) mediante cookies **`HttpOnly`**, **`Secure`** (en HTTPS) y **`SameSite=Lax`** (`0` tokens JWT en `localStorage` o `sessionStorage`, `NT-12`), `last_auth_at_utc` se actualiza al autenticar, y `Cerrar sesión` revoca la sesión en servidor invalidando cookies de forma inmediata.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Sondeo de enumeración de cuentas en `/entrar`, `/registro` y `/recuperar-acceso` — `CL-28`, `NT-09`):_ **Dado** un atacante que prueba en `/recuperar-acceso` o `/entrar` un correo existente (`atleta.historial@oak-demo.invalid`) frente a un correo inexistente (`noexiste@oak-demo.invalid`), **cuando** recibe respuesta del servidor, **entonces** los mensajes en `es-ES` (_"Si el correo está registrado, recibirás instrucciones en unos minutos"_ en recuperación; _"Correo o contraseña no válidos"_ en login) y los códigos HTTP son idénticos para ambos casos sin filtrar si la cuenta existe.
  2. _(Fuerza bruta y límite de tasa `429` — `CL-28`, `NT-13`):_ **Dado** múltiples intentos fallidos seguidos contra `/entrar` o `/recuperar-acceso`, **cuando** se supera el umbral de rate limiting por IP/identificador, **entonces** el borde devuelve **`429 TOO_MANY_REQUESTS`** con aviso claro en `es-ES` sin revelar existencia de la cuenta.
  3. _(Mutación cross-origin sin origen válido — `NT-12`):_ **Dado** una petición `POST` de login/logout/mutación enviada con cabecera `Origin` externa no permitida, **cuando** el servidor valida origen y cookie `SameSite=Lax`, **entonces** rechaza la mutación con **`403 FORBIDDEN`**.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Campos con `<label>` visible persistente (nunca `placeholder` como etiqueta), requisitos de contraseña explicados antes de escribir, opción accesible `Mostrar contraseña` con nombre programático y `aria-pressed`, errores inline con `aria-describedby` y resumen de errores al inicio tras envío fallido, foco movido al resumen o primer error (`NFR-03`, `NFR-04`).

#### `AC-J03-02` — Validación del perfil del deportista y bloqueo `D1-09` de documento sensible y salud

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` en reglas de edad `D1-09`)
- **Rutas / Pantallas:** `/perfil`.
- **Roles permitidos vs denegados:** Solo el propio `ATHLETE` autenticado (`user_id === actor.userId`, RLS `auth.uid() = user_id`). `ANONYMOUS` recibe `401`/redirección; otro atleta intentando leer o escribir perfil ajeno recibe **`403`** / **`404`** (`NT-02`).
- **Entidades y campos tocados:** `AthleteProfile` (`user_id`, `full_name` `1..120`, `birth_date` `[CANDIDATO_D1]` `D1-09`, `phone`, `municipality` allowlist `55` Madrid, `emergency_contact_name`, `emergency_contact_phone`, `preferred_disciplines`, `preferred_level` — `N2/N4`), **`document_type` / `document_number` (`blocked_by_D1_09`, `null` forzado)**, **`health_or_clinical_data` (`blocked_by_D1_09`, inexistente/prohibido)**.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un `ATHLETE` autenticado en `/perfil`,
  - **Cuando** edita y guarda `full_name`, `birth_date` (si se informa, fecha válida en el pasado; recomendación por defecto `[CANDIDATO_D1]` `>= 18` años hasta validar política de menores en `D1-09`), `phone`, `municipality` dentro de los `55` municipios de Madrid, contacto de emergencia y preferencias deportivas no clínicas (`trail`/`running` y `INICIACION`/`MEDIO`/`AVANZADO`),
  - **Entonces** el servidor valida mediante Zod todos los campos, sanea entradas textuales contra HTML/XSS (`NT-11`), persiste `AthleteProfile` vinculado al `user_id` autenticado sin exigir `DNI`/`NIE`/pasaporte (`document_number = null` en BD, **`blocked_by_D1_09`**) ni mostrar campos clínicos, y confirma en `es-ES` `"Tus datos de perfil se han guardado"`.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Intento de inyectar documento sensible o datos clínicos — `CL-17`, `D1-09`):_ **Dado** una petición alterada a la API de `/perfil` que incluye `documentNumber: "00000000A"`, `allergies` o `bloodGroup`, **cuando** el servidor procesa el esquema estricto Zod, **entonces** rechaza o descarta esos campos (`400`/`422`) manteniendo `document_type = null`, `document_number = null` (`blocked_by_D1_09`) y `0` columnas/valores clínicos persistidos.
  2. _(IDOR cross-athlete o inyección XSS — `NT-02`, `NT-11`):_ **Dado** `Atleta A` intentando `GET`/`PATCH` del `AthleteProfile` de `Atleta B`, o enviando `<script>alert(1)</script>` en `full_name`, **cuando** actúa la capa de aplicación + RLS, **entonces** el acceso cruzado responde **`403`** / **`404`** con `0` PII filtrada, y los intentos XSS quedan rechazados o escapados sin ejecución.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Distinción clara de campos obligatorios y opcionales en etiqueta o instrucción previa, formatos de fecha/teléfono explicados antes del input, ausencia total de campos médicos o de documento oficial en UI mientras `D1-09` siga abierto (`NFR-03`, `NFR-04`).

#### `AC-J03-03` — Reutilización segura del perfil en inscripción con revisión y corrección previa

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/inscripciones/:eventId/datos` (etapa 2) y `/inscripciones/:eventId/revision` (etapa 3).
- **Roles permitidos vs denegados:** Solo el `ATHLETE` propietario del borrador `Registration` (`user_id === actor.userId`). Otro usuario recibe `403`/`404` (`NT-02`).
- **Entidades y campos tocados:** `AthleteProfile` (`full_name`, `birth_date`, `phone`, `emergency_contact_*`), `User` (`email`), `RegistrationParticipant` (`id`, `registration_id`, `full_name`, `email`, `birth_date`, `phone`, `emergency_contact`, `club_or_team`, `document_type/document_number = null` `blocked_by_D1_09`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un `ATHLETE` con `AthleteProfile` guardado (`atleta.historial@oak-demo.invalid`) que completa etapa 1 (`Modalidad`) y accede a `/inscripciones/:eventId/datos`,
  - **Cuando** visualiza el formulario precargado con sus datos del perfil, corrige un dato puntual para esa carrera (ej. `phone` o `club_or_team`) y avanza a `/inscripciones/:eventId/revision`,
  - **Entonces** la UI muestra explícitamente el resumen completo para su revisión y corrección antes de cualquier compromiso financiero, guarda los datos como **snapshot independiente** en `RegistrationParticipant` asociado a ese `registration_id` (`CL-16`), conserva intactas las inscripciones históricas ya confirmadas y (por defecto recomendado, sin sobrescribir silenciosamente) solo actualiza `AthleteProfile` si el deportista marca explícitamente la casilla opcional `"Guardar estos cambios también en mi perfil"` (`BRAND_UX_CONTRACT.md` §10.4).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Deportista con perfil vacío/incompleto — `CL-08`, `CL-16`):_ **Dado** `athlete-nuevo-sin-retos` que inicia su primera inscripción sin teléfono o con perfil parcial, **cuando** intenta avanzar de etapa 2 sin completar los campos obligatorios del evento, **entonces** el servidor y el formulario bloquean el avance (`422`), señalan los campos faltantes con `aria-describedby` y resumen superior y mantienen lo ya escrito.
  2. _(Retorno desde revisión para corregir datos — `CL-16`):_ **Dado** un deportista en etapa 3 (`Revisión`) que detecta una errata en su nombre o club y pulsa `Editar datos del participante`, **cuando** vuelve a etapa 2, **entonces** conserva la modalidad y tarifa elegidas y persiste la corrección antes de confirmar.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Aviso claro previo a la precarga (_"Hemos cargado los datos de tu perfil para agilizar tu inscripción. Revísalos antes de continuar"_); orden de foco lógico al volver de revisión a datos; botón específico `Guardar datos y revisar` (`NFR-04`).

#### `AC-J03-04` — Consentimientos versionados append-only con fecha UTC, actor y propósito

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` para texto legal final en `D1-09`)
- **Rutas / Pantallas:** `/registro`, `/inscripciones/:eventId/revision` (etapa 3) y `/perfil` (gestión de consentimientos opcionales).
- **Roles permitidos vs denegados:** Solo el usuario autenticado sobre sus propios consentimientos (`actor_id = user_id = auth.uid()`). Prohibido a `ANONYMOUS` y a cualquier usuario modificar consentimientos ajenos (`403`, `NT-02`) o sobrescribir filas históricas (`UPDATE`/`DELETE` revocados).
- **Entidades y campos tocados:** `ConsentRecord` (`id`, `user_id`, `registration_id` nullable, `purpose` enum `'ACCOUNT_PRIVACY_POLICY' | 'EVENT_REGULATION_ACCEPTANCE' | 'EVENT_COMMUNICATIONS'`, `consent_version`, `granted`, `acted_at_utc` `TIMESTAMPTZ UTC`, `actor_id`, `evidence_context` — `N2 Interna`, cero PII directa ni IP/UA en claro).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un deportista en `/inscripciones/:eventId/revision` antes de confirmar o pagar,
  - **Cuando** abre/consulta los enlaces al reglamento de la prueba y política de privacidad (`BRAND_UX_CONTRACT.md` §10.4), marca explícitamente la casilla obligatoria de aceptación de reglamento/privacidad (`granted = true`) y opcionalmente decide sobre comunicaciones del evento (`EVENT_COMMUNICATIONS`), y confirma la etapa,
  - **Entonces** el servidor inserta nuevas filas **append-only** en `ConsentRecord` con `purpose`, `consent_version` vigente en servidor, `acted_at_utc = NOW() AT TIME ZONE 'UTC'`, `actor_id = actor.userId`, `registration_id` y `evidence_context = 'revision_inscripcion'` (sin IP en claro); si posteriormente revoca `EVENT_COMMUNICATIONS` en `/perfil`, se inserta una nueva fila con `granted = false` sin alterar la fila anterior.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Intento de avanzar sin consentimiento obligatorio — `CL-07`, `CL-18`):_ **Dado** una petición de etapa 3 a etapa 4 (`Pago` o confirmación `0 EUR`) sin `ConsentRecord` obligatorio vigente para ese `registration_id`, **cuando** el servidor verifica precondiciones, **entonces** rechaza con **`422`** y mantiene la casilla sin premarcar en UI (prohibido premarcar consentimientos opcionales).
  2. _(Intento de actualizar/borrar fila histórica o guardar IP en `evidence_context` — `NT-14`):_ **Dado** el modelo de persistencia de `ConsentRecord`, **cuando** se audita su esquema y código, **entonces** no existen operaciones `UPDATE`/`DELETE` aplicativas sobre consentimientos ni almacenamiento de IP en claro o `User-Agent` identificativo.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Casillas de consentimiento con objetivo `>= 48x48 px` (incluyendo área clickable de etiqueta), texto claro que distingue obligatorio vs opcional antes del control, enlace accesible al reglamento (`<a target="_blank" rel="noopener noreferrer">` con aviso de apertura o panel modal accesible) (`NFR-03`, `NFR-04`).

#### `AC-J03-05` — Exportación JSON y solicitud de borrado/anonimización RGPD con sesión reciente (`auth_time <= 15 min`)

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 7 · `G5` · `[REGLA_CONTRACTUAL_CERRADA]` (regla operacional RGPD alineada con `DATA_CLASSIFICATION_RETENTION.md` §6 y `D1-09`)
- **Rutas / Pantallas:** `/perfil` (sección `Privacidad y tus datos`).
- **Roles permitidos vs denegados:** Solo el propietario autenticado de la cuenta (`user_id === actor.userId`) con **`last_auth_at_utc` dentro de los últimos `15 minutos`** (`auth_time <= 15 min`). Sesiones caducadas de re-autenticación (`> 15 min`) o usuarios ajenos reciben **`401`/`403`**.
- **Entidades y campos tocados:** Lectura/exportación de `User`, `AthleteProfile`, `ConsentRecord`, `Favourite`, `Registration`, `RegistrationParticipant`, `Payment` (resumen sin PAN/CVV); mutación de borrado sobre `User` (`email = 'deleted-<uuid>@anon.oak.invalid'` / `deleted_at_utc = NOW()`, revocación Supabase Auth), `AthleteProfile` (borrado/nulificación), `Favourite` (borrado físico), `Registration(DRAFT)` (borrado físico), `RegistrationParticipant` confirmadas/pasadas (`full_name = 'Participante Anonimizado'`, resto PII `NULL`, `anonymized_at_utc = NOW()`), `OrganizationMembership` (`REVOKED` si procede sin dejar org activa sin `ORG_OWNER`), `CommunicationLog` (vínculo anonimizado), preservando `Registration` confirmadas/canceladas/reembolsadas, `Payment`, `ConsentRecord` y `AuditLog` (`GDPR_DATA_EXPORTED`, `GDPR_ACCOUNT_ANONYMIZED` sin PII — `INV-07`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un `ATHLETE` autenticado en `/perfil` cuya última autenticación ocurrió hace `<= 15 minutos`,
  - **Cuando** pulsa `Descargar mis datos (JSON)` o solicita `Eliminar mi cuenta`, revisa la advertencia explícita (incluyendo aviso si tiene inscripciones futuras `CONFIRMED` o si es el único `ORG_OWNER` de una organización activa) y confirma la acción destructiva mediante confirmación explícita,
  - **Entonces**:
    1. Para exportación: el servidor genera un archivo JSON estructurado con sus datos personales y de inscripciones, y registra `GDPR_DATA_EXPORTED` en `AuditLog` sin PII.
    2. Para borrado/anonimización: dentro de una transacción atómica revoca sesiones en Supabase Auth, elimina `AthleteProfile`, `Favourite` y `DRAFT`, anonimiza `User` (`deleted-<uuid>@anon.oak.invalid`) y `RegistrationParticipant`, conserva intactos `Payment`, `Registration` no-borrador, `ConsentRecord` y conteos de cupo (`reserved_count`), y registra `GDPR_ACCOUNT_ANONYMIZED` en `AuditLog` sin PII (`CL-18`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Sesión antigua olvidada con `auth_time > 15 min` — `CL-18`, `NT-17`):_ **Dado** un navegador con sesión iniciada hace `20 minutos`, **cuando** el usuario pulsa `Descargar mis datos (JSON)` o `Eliminar mi cuenta`, **entonces** el servidor rechaza con **`401`/`403`** exigiendo re-autenticación reciente, la UI solicita confirmar credenciales antes de reintentar y no exporta ni anonimiza ningún dato.
  2. _(Único `ORG_OWNER` de organización con eventos — `CL-20`, `DATA_CLASSIFICATION_RETENTION.md` §6.2):_ **Dado** un usuario que es el único `ORG_OWNER ACTIVE` de una `Organization` activa intentando borrar su cuenta, **cuando** solicita la eliminación, **entonces** el servidor bloquea dejar la organización huérfana (`409 CONFLICT`) indicando en `es-ES` que debe designar otro `ORG_OWNER` antes de suprimir la cuenta.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Modal/confirmación de borrado con gestión de foco, cierre seguro con `Escape`, explicación clara de qué datos se eliminan/anonimizan y qué registros contables permanecen sin PII (`BRAND_UX_CONTRACT.md` §3.5, §13.5), sin diseño manipulativo ni mensajes de culpabilización (`NFR-03`, `NFR-04`).

---

### 2.4 Journey J04 — Inscripción recuperable en 4 etapas y pago en modo test (`AC-J04-01`..`AC-J04-08`)

#### `AC-J04-01` — Flujo secuencial obligatorio en 4 etapas con guardia server-side contra saltos

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` en ratificación visual de 4 etapas en `D1-08` y rutas en `D1-07`)
- **Rutas / Pantallas:** `/inscripciones/:eventId/modalidad` (Etapa 1) -> `/inscripciones/:eventId/datos` (Etapa 2) -> `/inscripciones/:eventId/revision` (Etapa 3) -> `/inscripciones/:eventId/pago` (Etapa 4) -> `/inscripciones/:eventId/resultado` (Resultado durable). _(Rutas sujetas a ratificación en `D1-07`/`D1-08`.)_
- **Roles permitidos vs denegados:** Requiere sesión `ATHLETE` (o usuario autenticado personal) antes de comprometer plaza/datos (`ANONYMOUS` en `/retos/:eventSlug` al pulsar `Inscribirme` redirige a `/entrar?returnTo=/inscripciones/:eventId/modalidad` validado, `CL-04`, `NT-12`). Otro atleta accediendo a un `registrationId` ajeno recibe `403`/`404` (`NT-02`).
- **Entidades y campos tocados:** `Registration` (`id`, `user_id`, `event_id`, `event_modality_id`, `price_tier_id`, `status`), `RegistrationParticipant`, `ConsentRecord`, `Event` (`status = 'PUBLISHED'`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un `ATHLETE` autenticado que parte desde `/retos/:eventSlug` de un evento `PUBLISHED` con plazas libres,
  - **Cuando** avanza paso a paso: selecciona modalidad en `/modalidad`, revisa/completa datos en `/datos`, valida resumen y acepta consentimientos obligatorios en `/revision`, y ejecuta la confirmación/pago en `/pago`,
  - **Entonces** el indicador de progreso (_stepper_) refleja siempre la etapa actual (`1 de 4`, `2 de 4`, `3 de 4`, `4 de 4`), cada avance valida y persiste el estado en PostgreSQL antes de habilitar la etapa siguiente, y al finalizar conduce a `/resultado` con estado real persistido.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Salto directo de etapa por URL — `CL-07`):_ **Dado** un deportista que introduce manualmente la URL `/inscripciones/:eventId/revision` o `/inscripciones/:eventId/pago` sin haber seleccionado modalidad ni completado `RegistrationParticipant` o `ConsentRecord`, **cuando** el servidor evalúa la carga de la ruta o la mutación, **entonces** bloquea el acceso/mutación (`302` a la primera etapa incompleta o **`409`/`422`** en API) con aviso claro en `es-ES`.
  2. _(Inscripción duplicada activa en la misma modalidad — `data/fixtures/schema.ts` línea 704):_ **Dado** un `ATHLETE` que ya posee una inscripción `CONFIRMED` o `PENDING_PAYMENT` activa para esa misma `(user_id, event_modality_id)`, **cuando** intenta abrir o confirmar otra inscripción sobre la misma modalidad, **entonces** el servidor detecta la duplicidad (`409 CONFLICT`) e informa en `es-ES` con acceso directo a su inscripción existente en `/mis-retos`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** _Stepper_ accesible con lista ordenada (`<ol>`), estado actual marcado con `aria-current="step"`, botones de navegación claros (`Volver a modalidad`, `Continuar a datos`, `Continuar a revisión`, `Continuar al pago` / `Confirmar inscripción gratuita`), nunca botones solo-flecha ni genéricos; `320 px` sin scroll horizontal (`NFR-04`).

#### `AC-J04-02` — Desglose de tarifa, gastos de gestión y total (`EUR`) visibles desde selección y antes de pagar

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/inscripciones/:eventId/modalidad`, `/datos`, `/revision`, `/pago` y `/resultado`.
- **Roles permitidos vs denegados:** `ATHLETE` propietario del flujo.
- **Entidades y campos tocados:** `PriceTier` (`amount_cents`, `management_fee_cents`, `total_cents`, `currency = 'EUR'`), `Registration` (`unit_amount_cents`, `fee_cents`, `total_cents`, `currency = 'EUR'`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento con tramo de pago (ej. `2800 + 200 = 3000` céntimos -> `28,00 EUR + 2,00 EUR = 30,00 EUR`) o con modalidad gratuita explícita (`0 + 0 = 0` céntimos -> `0,00 EUR`, ej. `Encuentro Atlético del Henares` en `oak-seed.v1`),
  - **Cuando** el deportista selecciona la modalidad en etapa 1 y avanza por etapa 2 hasta etapa 3 (`Revisión`) antes del botón de pago/confirmación,
  - **Entonces** la UI muestra de forma permanente y legible en `es-ES` el desglose exacto (`Inscripción base: XX,XX EUR`, `Gastos de gestión: XX,XX EUR`, `Total a pagar: XX,XX EUR`, moneda `EUR`, sin recargos ocultos al final); para `0,00 EUR` indica explícitamente `"Inscripción gratuita (0,00 EUR) — No se solicitará tarjeta"` (`CL-12`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Cambio de tramo de `PriceTier` durante un borrador — `CL-08`, `CL-13`):_ **Dado** un borrador creado cuando estaba vigente `Anticipada` (`28,00 EUR + 2,00 EUR`) cuyo periodo expiró antes de confirmar pasando a `General` (`34,00 EUR + 2,00 EUR`), **cuando** el deportista retoma etapa 3 (`Revisión`), **entonces** el servidor recalcula al tramo vigente actual, bloquea continuar con el importe obsoleto (`409` en confirmación directa si no fue revisado), actualiza el desglose visible con aviso explícito del cambio de tramo antes de ir a pago.
  2. _(Prohibición de cupones o precios dinámicos en V1 — `Out-of-Scope V1` #9):_ **Dado** el resumen de precio en etapas 1–4, **cuando** se inspeccionan los controles, **entonces** no existe campo de códigos promocionales ni recargos variables no respaldados por `PriceTier`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Resumen de importe ubicado antes de la acción de confirmación (`BRAND_UX_CONTRACT.md` §3.5), lectura accesible para lectores de pantalla de decimales y moneda (`"30,00 euros"`), nunca comunicando diferencias de precio únicamente por color (`NFR-02`, `NFR-04`).

#### `AC-J04-03` — Recuperación de borrador `DRAFT` entre sesiones y dispositivos (`7 días`)

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 4 · `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/inscripciones/:eventId/*`, `/mis-retos` y `/retos/:eventSlug` (aviso de borrador recuperable).
- **Roles permitidos vs denegados:** Exclusivo del `ATHLETE` creador del `DRAFT` (`user_id === actor.userId`). Otro atleta recibe `403`/`404` (`NT-02`).
- **Entidades y campos tocados:** `Registration` (`status = 'DRAFT'`, `event_modality_id`, `price_tier_id`, `draft_expires_at_utc = updated_at_utc + 7 días`, `updated_at_utc`), `RegistrationParticipant` (`full_name`, `email`, `birth_date`, `phone`, `emergency_contact`, `club_or_team`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** que `S-DEP-01` (`ATHLETE`) inicia en móvil (`390x844`) una inscripción para `Trail Puentes Viejas`, elige modalidad, rellena datos en etapa 2 y cierra sesión o cierra el navegador sin pagar (`Registration.status = 'DRAFT'`),
  - **Cuando** dentro de los **`7 días`** siguientes inicia sesión desde otro dispositivo (`1200x800` escritorio) y entra a `/mis-retos` o vuelve a `/retos/trail-puentes-viejas-lozoya` -> `Continuar inscripción`,
  - **Entonces** el sistema restaura desde PostgreSQL (`0` dependencia exclusiva de `localStorage`, `CL-08`) la modalidad seleccionada, los datos guardados de `RegistrationParticipant` y la última etapa completada, validando en servidor que el evento siga `PUBLISHED` abierto, haya cupo y el `PriceTier` siga vigente.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Borrador caducado `> 7 días` — `CL-08`, `DATA_CLASSIFICATION_RETENTION.md` §6.2):_ **Dado** un `DRAFT` cuyo `draft_expires_at_utc <= NOW()` (superada la ventana de `7 días`; limpieza física programada a `30 días`), **cuando** el atleta intenta reanudarlo, **entonces** el servidor no restaura un borrador vencido (`410`/`404` o transición a nuevo borrador limpio), informa en `es-ES` (_"Tu borrador guardado ha caducado tras 7 días. Puedes iniciar una nueva inscripción"_) y permite comenzar desde etapa 1.
  2. _(Evento agotado o cerrado mientras existía el borrador — `CL-02`, `CL-08`):_ **Dado** un `DRAFT` cuyo evento pasó a `CLOSED`, `CANCELLED` o `remaining_spots = 0` antes de reanudar, **cuando** el usuario intenta continuar, **entonces** el servidor impide avanzar al pago (`409`) y explica el estado actual del evento en `es-ES`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Aviso claro en etapas 1–3 indicando que el borrador se conserva durante `7 días` sin reservar plaza definitiva hasta pasar a pago (`BRAND_UX_CONTRACT.md` §10.4); botón `Continuar inscripción` con `>= 48x48 px` (`NFR-04`).

#### `AC-J04-04` — Recálculo server-side de precio (`EUR` céntimos) y reserva atómica de cupo (`SELECT ... FOR UPDATE`)

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** Acción de confirmación en `/inscripciones/:eventId/revision` -> `/pago` (o confirmación directa `0 EUR` -> `/resultado`).
- **Roles permitidos vs denegados:** Solo `ATHLETE` autenticado propietario del `DRAFT`. `ANONYMOUS` -> `401`; cross-athlete -> `403`/`404`.
- **Entidades y campos tocados:** `Event` (`status`), `EventModality` (`capacity_limit`, `reserved_count`), `PriceTier` (`amount_cents`, `management_fee_cents`, `total_cents`, `currency`), `Registration` (`PENDING_PAYMENT` con `reserved_until_utc = NOW() + 15 min`, o `CONFIRMED` si `total_cents === 0`), `Payment` (`CREATED`, `provider = 'stripe_test'`, `mode = 'test'`, `amount_cents`, `currency = 'EUR'`, `idempotency_key`), `CommunicationLog` (`PENDING` en flujo `0 EUR`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un `DRAFT` en etapa 3 con consentimientos obligatorios válidos y un `PriceTier` vigente en `EUR`,
  - **Cuando** el deportista confirma para ir a pago (`total_cents > 0`),
  - **Entonces** el servidor:
    1. Ignora por completo importes/moneda enviados desde el navegador y recalcula `unit_amount_cents + fee_cents = total_cents` desde `PriceTier` en PostgreSQL (`INTEGER >= 0`, `currency = 'EUR'`, `INV-04`);
    2. Abre transacción `TX1`, bloquea la fila con **`SELECT ... FOR UPDATE`** sobre `EventModality`, verifica `Event.status = 'PUBLISHED'`, `registration_closes_at_utc > NOW()` y `reserved_count < capacity_limit`;
    3. Incrementa `reserved_count = reserved_count + 1`, transiciona `Registration` a `PENDING_PAYMENT` fijando TTL **`reserved_until_utc = NOW() + 15 minutos`** (`CL-09`) y crea `Payment(CREATED)` con `provider = 'stripe_test'`, `mode = 'test'` y `amount_cents === Registration.total_cents`;
    4. Invoca `checkout.sessions.create` (Stripe `test`, timeout `<= 5 s`) con ese importe recalculado en servidor y redirige a Stripe Hosted Checkout.
       _(Si `total_cents === 0`, en una sola transacción hace `SELECT ... FOR UPDATE`, incrementa `reserved_count`, transiciona `DRAFT -> CONFIRMED` sin crear pago de pasarela e inserta outbox `CommunicationLog(PENDING)`, `CL-12`.)_
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Manipulación de precio o moneda en cliente — `CL-13`, `NT-07`):_ **Dado** una petición alterada que envía `total_cents = 0`, `amount_cents = -100`, `currency = "USD"` o un `price_tier_id` de otra modalidad/expirado, **cuando** el servidor la procesa, **entonces** Zod y el servicio de dominio rechazan o ignoran los importes cliente (`400`/`422`) y nunca crean una sesión Stripe por un importe distinto al `PriceTier` autoritativo en BD.
  2. _(Expiración TTL `15 min` de `PENDING_PAYMENT` — `CL-09`, `NT-13`):_ **Dado** una reserva `PENDING_PAYMENT` cuyo `reserved_until_utc < NOW()` sin pago `SUCCEEDED`, **cuando** actúa el _sweeper_ idempotente o la liberación bajo demanda, **entonces** dentro de transacción con `SELECT ... FOR UPDATE` decrementa `reserved_count`, revierte `Registration` de `PENDING_PAYMENT -> DRAFT` (o `CANCELLED` por caducidad definitiva) y marca el `Payment` expirado como `FAILED` para evitar acaparamiento de cupo.
  3. _(Guardia de modo `live` accidental — `NT-10`):_ **Dado** un entorno sin autorización `D3` donde aparezca clave `sk_live_*` con `OAK_ENABLE_LIVE_PAYMENTS !== "true"`, **cuando** arranca la aplicación, **entonces** `src/shared/env.ts` aborta fail-closed antes de servir peticiones (`0` cobros reales).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Antes de redirigir a Stripe, la pantalla informa el importe exacto en `EUR`, el tiempo máximo de retención de plaza (`15 minutos`) y el estado `Cargando pasarela de pago segura...` con bloqueo anti-doble clic (`NFR-01`, `NFR-02`, `NFR-03`).

#### `AC-J04-05` — Idempotencia de solicitudes (`Idempotency-Key`) y webhooks Stripe test duplicados / desordenados

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** Inicio de Checkout (`/inscripciones/:eventId/pago`) y endpoint `POST /api/webhooks/stripe`.
- **Roles permitidos vs denegados:**
  - `POST /api/webhooks/stripe`: autenticado exclusivamente por firma criptográfica `stripe-signature` con `rawBody` y `<STRIPE_WEBHOOK_SECRET>`; sin cookie de usuario. Petición sin firma o con firma inválida es rechazada fail-closed (`400`/`401` + emisión de alerta `AL-01`, `NT-05`).
- **Entidades y campos tocados:** `Payment` (`idempotency_key UNIQUE` `reg:<registration_id>:attempt:<n>`, `status`, `provider_checkout_session_id`, `provider_payment_intent_id`), `PaymentWebhookEvent` (`provider = 'stripe'`, `provider_event_id UNIQUE`, `event_type`, `processing_status`, `sanitized_summary` sin PII ni `stripe-signature`), `Registration` (`CONFIRMED` / `REFUNDED` / `DRAFT`), `CommunicationLog` (`idempotency_key UNIQUE`), `AuditLog`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un pago iniciado con `Idempotency-Key = reg:<id>:attempt:1` cuya entrega webhook `checkout.session.completed` (`evt_*`) llega `20` veces consecutivas o en paralelo desde Stripe test, o tras recibir primero un evento desordenado (_out-of-order_),
  - **Cuando** `POST /api/webhooks/stripe` verifica la firma usando `rawBody`, abre `TX_WEBHOOK` y ejecuta `INSERT INTO PaymentWebhookEvent (provider_event_id, ...) ON CONFLICT (provider_event_id) DO NOTHING`,
  - **Entonces** únicamente la primera entrega válida ejecuta `Payment = SUCCEEDED`, `registration.markConfirmedFromPayment(tx)` (`PENDING_PAYMENT -> CONFIRMED`) e inserta `CommunicationLog(PENDING, idempotency_key = confirm:<registration_id>)` en la misma transacción; las `19` entregas repetidas devuelven **`200 OK`** idempotente sin duplicar pagos, registros ni correos (`INV-05`, `CL-14`, `NFR-02`, `NT-06`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Firma `stripe-signature` falsificada o secreto ausente — `CL-14`, `NT-05`):_ **Dado** un atacante que envía `POST /api/webhooks/stripe` simulando `checkout.session.completed` sin firma válida (o entorno con `<STRIPE_WEBHOOK_SECRET>` ausente), **cuando** entra al handler, **entonces** falla cerrado (`400`/`401` o `500` controlado en config), no modifica `Payment` ni `Registration`, y dispara evento operativo `AL-01` sin loguear cabeceras ni payloads PII (`NT-14`).
  2. _(Evento `expired` o `charge.refunded` fuera de secuencia — `CL-14`, `NT-06`):_ **Dado** una inscripción ya `CONFIRMED` para la que llega tarde un `checkout.session.expired` retrasado, **cuando** el procesador aplica reglas monótonas de máquina de estados, **entonces** registra `PaymentWebhookEvent` como `IGNORED_OUT_OF_ORDER`, jamás degrada `CONFIRMED -> DRAFT`, y responde `200 OK` seguro.
  3. _(Timeout o fallo de Stripe > `5 s` al crear sesión Checkout — `CL-10`):_ **Dado** que `TX1` reservó plaza (`PENDING_PAYMENT`) pero `checkout.sessions.create` falla o supera `5 s` antes de devolver `sessionUrl`, **cuando** se ejecuta `TX_COMP`, **entonces** marca `Payment = FAILED`, libera la plaza (`reserved_count - 1`), revierte `Registration` a `DRAFT` y el siguiente reintento del atleta usa `reg:<id>:attempt:2`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Al pulsar `Continuar al pago`, el botón entra en estado `Loading` deshabilitando reenvíos múltiples mientras mantiene dimensiones estables (`>= 48x48 px`), y ante fallo transitorio ofrece mensaje claro y botón `Reintentar pago` (`NFR-02`, `NFR-04`).

#### `AC-J04-06` — Cero sobreventa bajo concurrencia en la última plaza (`remaining_spots = 1`)

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** Acción de reserva/inicio de pago (`POST` desde `/inscripciones/:eventId/revision`) y confirmación `0 EUR`.
- **Roles permitidos vs denegados:** `25` deportistas `ATHLETE` distintos autenticados operando en paralelo (`ANONYMOUS` bloqueado `401`).
- **Entidades y campos tocados:** `EventModality` (`capacity_limit`, `reserved_count` con restricción `CHECK (reserved_count <= capacity_limit)`), `Registration`, `Payment`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** una modalidad `PUBLISHED` con exactamente **`1` plaza libre** (`remaining_spots = 1`, ej. `Subida a La Najarra` en `oak-seed.v1`) y `25` deportistas `ATHLETE` con borradores listos en etapa 3,
  - **Cuando** los `25` deportistas lanzan simultáneamente en paralelo la petición de reserva/confirmación sobre esa última plaza,
  - **Entonces** el bloqueo pesimista transaccional **`SELECT ... FOR UPDATE`** sobre la fila de `EventModality` serializa las transacciones en PostgreSQL de forma que **exactamente `1`** petición avanza (`PENDING_PAYMENT` o `CONFIRMED` si `0 EUR`, quedando `reserved_count === capacity_limit` y `remaining_spots === 0`), **`24`** peticiones reciben rechazo controlado **`409 CONFLICT`** (`0` errores `5xx`, `0` sobreventa, `INV-03`, `CL-01`, `NFR-01`, `NT-04`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Usuario ganador abandona antes de pagar y caduca TTL `15 min` — `CL-09`):_ **Dado** que el `1` ganador pasó a `PENDING_PAYMENT` y no completó Checkout en `15 minutos`, **cuando** expira `reserved_until_utc`, **entonces** la liberación atómica devuelve `remaining_spots` de `0` a `1` para permitir una nueva reserva limpia.
  2. _(Barrera física de BD — `INV-03`):_ **Dado** cualquier intento hipotético en BD de fijar `reserved_count = capacity_limit + 1`, **cuando** se ejecuta el `UPDATE`, **entonces** la restricción `CHECK (reserved_count <= capacity_limit)` aborta la transacción.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Los `24` usuarios rechazados con `409` reciben una alerta clara enfocada/anunciada por `aria-live="assertive"` en `es-ES` (_"La última plaza disponible se acaba de reservar. No se ha realizado ningún cobro"_), conservando su borrador de datos y ofreciendo volver a `/explorar` (`NFR-01`, `NFR-04`).

#### `AC-J04-07` — Estados de resultado reales (éxito, pendiente, fallo tarjeta test, cancelación y reintento)

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` para detalle de reembolso/cancelación en `D1-08`)
- **Rutas / Pantallas:** `/inscripciones/:eventId/resultado`.
- **Roles permitidos vs denegados:** Exclusivamente el `ATHLETE` propietario del `registration_id` (`user_id === actor.userId`, RLS). Acceso ajeno -> `403`/`404` (`NT-02`).
- **Entidades y campos tocados:** `Registration` (`id`, `registration_code`, `status`, `total_cents`, `reserved_until_utc`), `Payment` (`status`, `mode = 'test'`, `idempotency_key`), `Event`, `EventModality`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** que el deportista regresa desde Stripe Hosted Checkout (`mode = 'test'`) a `/inscripciones/:eventId/resultado` tras completar el pago, tras fallar una tarjeta de prueba, tras cancelar en Stripe o mientras el webhook aún está en tránsito,
  - **Cuando** el servidor renderiza `/inscripciones/:eventId/resultado`,
  - **Entonces** la pantalla **consulta siempre el estado real persistido en PostgreSQL** (`INV-06`):
    - Si `Registration.status = 'CONFIRMED'` (y `Payment.status = 'SUCCEEDED'` o `total_cents === 0`): muestra confirmación duradera con `registration_code`, importe total pagado (`EUR`), modalidad, fecha/lugar `Europe/Madrid` y botón `Ir a Mis retos` (`/mis-retos`).
    - Si `Registration.status = 'PENDING_PAYMENT'`: muestra estado de espera controlada (_"Confirmando el estado de tu pago..."_) con actualización segura y aviso de reserva vigente (`15 min`) sin falsificar éxito.
    - Si `Payment.status = 'FAILED'` o cancelado/expirado: muestra el motivo seguro en `es-ES`, confirma que no hay inscripción confirmada, conserva el borrador y ofrece botón específico `Reintentar pago` (generando nuevo intento `attempt:<n+1>`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Manipulación de query params de retorno — `CL-11`, `NT-16`):_ **Dado** un deportista cuyo `Payment` sigue `CREATED` o `FAILED` que navega manualmente a `/inscripciones/:eventId/resultado?status=success&paid=true`, **cuando** carga la página, **entonces** el servidor ignora totalmente los parámetros de éxito en URL, consulta PostgreSQL y muestra el estado real (`PENDING_PAYMENT` o `FAILED`), jamás confirmando la inscripción.
  2. _(Cancelación voluntaria de tarjeta / botón Volver de Stripe — `CL-11`):_ **Dado** que el deportista pulsa `Volver` en Stripe Checkout sin pagar, **cuando** regresa a OAK, **entonces** puede reanudar el pago si la reserva sigue dentro de `15 min` o liberar plaza y volver a editar sus datos en etapa 2/3 sin quedarse bloqueado.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Cada estado usa icono SVG + titular `<h1>` explícito + descripción en `es-ES` + acción siguiente clara (`Ir a Mis retos` o `Reintentar pago`); actualización controlada en `PENDING_PAYMENT` anunciada sin ruido excesivo (`aria-live="polite"`); cero mensajes culpabilizadores (`NFR-04`).

#### `AC-J04-08` — Confirmación única en `Mis retos` y envío único de correo en sandbox (`CommunicationLog`)

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 4 · `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/inscripciones/:eventId/resultado`, `/mis-retos` y salida de correo en `Resend sandbox`.
- **Roles permitidos vs denegados:** Transición iniciada por webhook firmado (`SYSTEM_WEBHOOK`) o confirmación atómica `0 EUR` de `ATHLETE` propietario (`INV-06`). Prohibido disparar envío directo desde cliente (`403`).
- **Entidades y campos tocados:** `Registration` (`CONFIRMED`, `confirmed_at_utc`), `CommunicationLog` (`id`, `idempotency_key = confirm:<registration_id> UNIQUE`, `registration_id`, `event_id`, `recipient_user_id`, `communication_type = 'REGISTRATION_CONFIRMATION'`, `provider = 'resend_sandbox'`, `provider_message_id`, `status = 'PENDING'|'SENT'|'FAILED'`, `template_version`, `sent_at_utc`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** una inscripción que pasa a `CONFIRMED` (mediante `Payment SUCCEEDED` vía webhook Stripe test o confirmación `0 EUR`),
  - **Cuando** concluye la transacción de confirmación,
  - **Entonces** se inserta dentro de la **misma transacción SQL** una única fila outbox `CommunicationLog(status = 'PENDING', idempotency_key = confirm:<registration_id>)` (`ON CONFLICT DO NOTHING`), el correo en `es-ES` se despacha post-`COMMIT` vía `Resend sandbox` (`timeout <= 5 s`) pasando a `SENT` con evento, modalidad, `registration_code`, importe total `EUR` y enlace a `/mis-retos` (sin datos sensibles ni cuerpo raw persistido con PII excesiva en BD), y la inscripción figura **exactamente una vez** en `/mis-retos` (`CL-12`, `CL-14`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Caída o error `500` / timeout de Resend tras confirmar pago — `CL-15`, `NT-17`):_ **Dado** que `TX_WEBHOOK` hace `COMMIT` dejando `Registration = CONFIRMED` y `Payment = SUCCEEDED`, pero la llamada posterior a Resend devuelve HTTP `500` o supera `5 s`, **cuando** ocurre el fallo de correo, **entonces** **jamás se revierte `Registration = CONFIRMED`**, la plaza aparece inmediatamente en `/mis-retos` (`AC-J05-02`) y `CommunicationLog` queda en `PENDING`/`FAILED` para reintento idempotente posterior del _worker_ sin generar un segundo correo si ya hubiera pasado a `SENT`.
  2. _(Doble disparo de outbox):_ **Dado** cualquier reintento de webhook o _worker_ sobre el mismo `registration_id`, **cuando** intenta crear o enviar el correo de confirmación, **entonces** la restricción `idempotency_key UNIQUE` (`confirm:<registration_id>`) impide un segundo envío (`<= 1` correo por confirmación).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** La confirmación indica en pantalla: `"Hemos enviado un resumen a tu correo (entorno de pruebas) y ya puedes verlo en Mis retos"`; plantilla de correo en `es-ES` claro, con contraste válido y enlace textual descriptivo (`NFR-02`, `NFR-03`, `NFR-04`).

---

### 2.5 Journey J05 — Mis retos y trayectoria del deportista (`AC-J05-01`..`AC-J05-05`)

> **Nota DoR de coordinación con `P1-004` (`D1-07`):** En los criterios `AC-J05-01`..`AC-J05-05`, las subvistas de área personal como **`/mis-retos/favoritos`** (para consultar y gestionar retos guardados sin sustituir `Trayectoria` en la navegación primaria) son **referencias funcionales provisionales alineadas con la propuesta de arquitectura de información `P1-004` (`INFORMATION_ARCHITECTURE_AND_ROUTES.md`) y sujetas a ratificación formal en `D1-07` (`P1-012`)**.

#### `AC-J05-01` — Separación clara entre próximo reto, inscripciones activas/favoritos e historial

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 6 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` en subruta `/mis-retos/favoritos` `D1-07` y detalle visual `D1-10`)
- **Rutas / Pantallas:** `/mis-retos`, `/mis-retos/favoritos` (referencia provisional `P1-004` sujeta a `D1-07`) y `/trayectoria`.
- **Roles permitidos vs denegados:** Solo `ATHLETE` autenticado consultando sus propios registros (`user_id === actor.userId`, RLS `auth.uid() = user_id`). `ANONYMOUS` redirige a `/entrar?returnTo=/mis-retos` (`401` en API). Acceso a registros de otro atleta denegado (`403`/`404`, `NT-02`).
- **Entidades y campos tocados:** `Registration` (`id`, `registration_code`, `status`, `event_id`, `event_modality_id`, `confirmed_at_utc`, `draft_expires_at_utc`), `Event` (`title`, `discipline`, `municipality`, `location_name`, `starts_at_utc`, `timezone = 'Europe/Madrid'`, `status`), `EventModality` (`name`, `distance_meters`), `Favourite` (`user_id`, `event_id`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** la cuenta `athlete-con-historial` (`atleta.historial@oak-demo.invalid` en `oak-seed.v1`) con inscripciones en distintos estados (`CONFIRMED` futuro, `DRAFT`, `PENDING_PAYMENT`, `CANCELLED`, `REFUNDED`, eventos pasados `COMPLETED` y `2` `Favourite`),
  - **Cuando** accede a `/mis-retos` y `/trayectoria`,
  - **Entonces**:
    1. `/mis-retos` destaca en primer lugar la tarjeta de su **próximo reto** (`Registration.status = 'CONFIRMED'` y `Event.starts_at_utc > NOW()` más cercano en el tiempo) con cuenta atrás en días/horas calculada sobre `Europe/Madrid`, modalidad, municipio y `registration_code`;
    2. Separa visual y estructuralmente el bloque de **inscripciones activas y borradores recuperables** (incluyendo estado `PENDING_PAYMENT` / acceso de reanudación a `DRAFT` vigente `<= 7 días` y pestaña/enlace a **`/mis-retos/favoritos`** provisional `D1-07`) del **historial pasado o cerrado** (`COMPLETED`, `CANCELLED`, `REFUNDED`);
    3. `/trayectoria` presenta la línea temporal e indicadores derivados de pruebas completadas (`CL-19`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Aislamiento entre deportistas — `NT-02`):_ **Dado** `athlete-nuevo-sin-retos` autenticado que solicita vía API o parámetro URL un `registrationId` de `athlete-con-historial`, **cuando** el servidor y RLS evalúan `user_id = auth.uid()`, **entonces** devuelven **`403`/`404`** y `0` filas ajenas.
  2. _(Exclusión de dorsal digital/QR y preparación — `Out-of-Scope V1` #8, #13):_ **Dado** la tarjeta de próximo reto en `/mis-retos`, **cuando** se inspecciona su contenido, **entonces** muestra detalles útiles de cita (`fecha`, `lugar`, `reglamento`, `contacto institucional`) sin ningún botón simulado de `Ver dorsal digital` ni pase Apple/Google Wallet.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Navegación primaria mantiene exactamente `Inicio`, `Explorar`, `Mis retos`, `Trayectoria` + control de cuenta (`/perfil`) sin desplazar `Trayectoria` en `320 px`; secciones estructuradas con encabezados `<h2>` claros y etiquetas de estado con icono SVG + texto (`Confirmada`, `Pendiente de pago`, `Borrador guardado`, `Cancelada`, `Reembolsada`) (`NFR-04`).

#### `AC-J05-02` — Aparición inmediata de inscripción `CONFIRMED` sin recarga manual forzada ni cachés obsoletas

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 6 · `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con coordinación de rutas `P1-004` / `D1-07`)
- **Rutas / Pantallas:** Transición desde `/inscripciones/:eventId/resultado` hacia `/mis-retos` y acceso directo posterior a `/mis-retos`.
- **Roles permitidos vs denegados:** Solo `ATHLETE` propietario (`user_id === actor.userId`, `NT-02`).
- **Entidades y campos tocados:** `Registration` (`status = 'CONFIRMED'`, `confirmed_at_utc`), `Event` (`PUBLISHED`, `CLOSED`, `COMPLETED`, `CANCELLED` cuando tenga inscripción propia — `ADR-003` §2.2 #3), `EventModality`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un deportista cuya inscripción acaba de transicionar a `CONFIRMED` en PostgreSQL (tanto tras webhook `checkout.session.completed` en Stripe test como tras confirmación gratuita `0 EUR`),
  - **Cuando** navega inmediatamente desde `/inscripciones/:eventId/resultado` pulsando `Ir a Mis retos` (o entra a `/mis-retos` sin ejecutar recarga dura manual `Ctrl+F5`),
  - **Entonces** `/mis-retos` realiza lectura fresca en servidor sin caché obsoleta (`no-store` / revalidación dinámica por usuario) y muestra al instante la nueva inscripción `CONFIRMED` en su sección correspondiente (`NFR-07` `p95 <= 500 ms`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Resend sandbox caído pero pago `SUCCEEDED` — `CL-15`):_ **Dado** que la confirmación en Stripe test tuvo éxito (`Registration = CONFIRMED`) pero el correo sandbox quedó en `CommunicationLog(FAILED)`, **cuando** el usuario entra a `/mis-retos`, **entonces** la inscripción confirmada aparece visible inmediatamente sin depender del estado del email.
  2. _(Evento cerrado posteriormente a `CLOSED` o `COMPLETED` — `CL-02`, `ADR-003` §2.2):_ **Dado** un evento que pasó a `CLOSED` o `COMPLETED` tras confirmarse la inscripción del atleta, **cuando** el atleta consulta `/mis-retos` o `/trayectoria`, **entonces** la política RLS permite leer ese evento en su historial personal aunque ya no sea inscribible en `/explorar`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Estado `Confirmada` legible por lector de pantalla, con fecha en `Europe/Madrid` y sin necesitar botón artificial de `Recargar manualmente` para ver datos recién confirmados (`NFR-04`, `NFR-07`).

#### `AC-J05-03` — Métricas de trayectoria derivadas únicamente de confirmados/completados y explicables

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 6 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]` (con nota de subrutas en `P1-004` / `D1-07`)
- **Rutas / Pantallas:** `/trayectoria`.
- **Roles permitidos vs denegados:** Solo `ATHLETE` autenticado sobre su propio historial (`user_id === actor.userId`, RLS). Prohibido cualquier endpoint o parámetro de cliente que escriba o manipule métricas (`INV-08`, `NT-02`).
- **Entidades y campos tocados:** Proyección de solo lectura sobre `Registration` (`status = 'CONFIRMED'`), `Event` (`status = 'COMPLETED'`, `municipality`, `discipline`), `EventModality` (`distance_meters`, `elevation_gain_meters`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** `athlete-con-historial` con `2` inscripciones `CONFIRMED` en eventos cuyo estado fue marcado administrativamente como `COMPLETED` por sus organizadores (`Trail La Pedriza Sur` en `Manzanares el Real` y `Carrera Camino de Santiago Colmenar` en `Colmenar Viejo`), además de `1` inscripción `CONFIRMED` futura (`PUBLISHED`), `1` `CANCELLED` y `1` `REFUNDED`,
  - **Cuando** visita `/trayectoria`,
  - **Entonces** el servidor calcula de forma determinista y en solo lectura:
    - **Retos completados:** suma exacta de registros con `Registration.status = 'CONFIRMED'` y `Event.status = 'COMPLETED'` (`2` retos; excluye `DRAFT`, `PENDING_PAYMENT`, `CANCELLED`, `REFUNDED` y futuros aún no `COMPLETED`);
    - **Kilómetros acumulados:** suma exacta de `EventModality.distance_meters / 1000` de esos mismos retos completados;
    - **Localidades recorridas:** conteo de `Event.municipality` distintos de esos retos completados;
      y muestra junto a las cifras una explicación textual clara en `es-ES` del criterio de cálculo (ej. _"Calculado automáticamente con tus inscripciones confirmadas en pruebas finalizadas por su organización"_), incluyendo opcionalmente el desglose de próximos retos confirmados como bloque aparte (`CL-19`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Intento de manipular métricas desde cliente — `INV-08`, `CL-19`):_ **Dado** un cliente que intenta enviar `completedChallenges = 99` o `totalKm = 500` en un payload o query, **cuando** consulta `/trayectoria` o invoca endpoints del módulo `journey`, **entonces** no existen mutaciones de escritura sobre métricas (`404`/`405`/`403`) y los valores provienen exclusivamente de la consulta agregada en servidor.
  2. _(Evento cancelado o inscripción reembolsada — `INV-08`):_ **Dado** una inscripción `REFUNDED` en `Senda de las Cárcavas` (`CANCELLED`), **cuando** se calculan las métricas de `/trayectoria`, **entonces** queda excluida de los totales completados.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Visualización de métricas o anillos de progreso utilizando tokens `viz.*`/`progress.*` con soporte textual completo (`D1-05`), animaciones de trazado/anillos detenidas bajo `prefers-reduced-motion` y lectura accesible de unidades (`"2 retos completados"`, `"34 kilómetros"`) (`NFR-04`).

#### `AC-J05-04` — Empty state útil con acceso directo al catálogo para cuentas sin eventos

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 6 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con subruta `/mis-retos/favoritos` provisional `P1-004` / `D1-07`)
- **Rutas / Pantallas:** `/mis-retos`, `/mis-retos/favoritos` (provisional `D1-07`) y `/trayectoria`.
- **Roles permitidos vs denegados:** `ATHLETE` autenticado sin inscripciones ni favoritos (`athlete-nuevo-sin-retos`, `atleta.nuevo@oak-demo.invalid`).
- **Entidades y campos tocados:** Consultas vacías sobre `Registration`, `Favourite` y proyección `journey`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** la cuenta sintética `athlete-nuevo-sin-retos` con `0` inscripciones y `0` favoritos (`oak-seed.v1`),
  - **Cuando** entra a `/mis-retos`, `/mis-retos/favoritos` (provisional `D1-07`) o `/trayectoria`,
  - **Entonces** cada vista muestra un estado vacío (`empty state`) claro, alentador y libre de errores (`CL-19`), explicando qué aparecerá ahí cuando complete o guarde su primer reto y ofreciendo un CTA primario específico `Explorar retos en Madrid` que navega directamente a `/explorar`.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Usuario tiene favoritos pero `0` inscripciones — `AC-J02-04`, `CL-19`):_ **Dado** un usuario con `0` inscripciones pero `1` reto guardado en `/mis-retos/favoritos`, **cuando** visita `/mis-retos`, **entonces** muestra el estado vacío de inscripciones acompañado de acceso directo a sus `1` reto guardado en Favoritos y a `/explorar`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Ilustración o icono SVG decorativo (`alt=""`), titular y texto con contraste `>= 4,5:1`, CTA `Explorar retos en Madrid` de al menos `48x48 px` y cero mensajes de culpa o presión (`BRAND_UX_CONTRACT.md` §3.3, §11.4; `NFR-04`).

#### `AC-J05-05` — Cero presión competitiva y cero datos clínicos o biométricos

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 6 · `G4`, `D1` · `[REGLA_CONTRACTUAL_CERRADA]` + `[CANDIDATO_D1]` (`D1-09` confirmación de cero datos de salud; `Out-of-Scope V1` #12 sin gamificación avanzada)
- **Rutas / Pantallas:** `/mis-retos`, `/trayectoria` y `/perfil`.
- **Roles permitidos vs denegados:** Todos los deportistas `ATHLETE`.
- **Entidades y campos tocados:** `AthleteProfile` (`health_or_clinical_data` inexistente/`blocked_by_D1_09`), proyección `journey` (`0` rankings, `0` niveles/insignias).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** cualquier deportista que consulta `/mis-retos`, `/trayectoria` o `/perfil`,
  - **Cuando** se renderizan textos, métricas, estados e interfaces de progreso,
  - **Entonces** se cumple estrictamente:
    1. **Cero presión competitiva:** no existen tablas de clasificación, rankings entre usuarios, comparativas de velocidad/posición, insignias ni niveles/títulos de gamificación (`Out-of-Scope V1` #12; `0` ocurrencias de los términos de `BANNED_DECK_TERMS`) ni mensajes culpabilizadores por inactividad (`BRAND_UX_CONTRACT.md` §3.3);
    2. **Cero datos clínicos/biométricos (`blocked_by_D1_09`, `CL-17`):** no se recogen, derivan ni muestran pulsaciones, VO2max, peso, alergias, grupo sanguíneo, lesiones ni integraciones con wearables (`Strava`/`Garmin`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Rechazo de campos clínicos o títulos gamificados en API/contrato — `CL-17`):_ **Dado** una petición de perfil o contrato de datos que pretenda incorporar campos de salud (`medicalConditions`, `heartRate`) o niveles de gamificación (`athleteTier`), **cuando** se valida contra el dominio V1, **entonces** el sistema rechaza la extensión fuera de alcance (`400`/`422`) manteniendo el bloqueo `blocked_by_D1_09` hasta resolución explícita del usuario en `D1`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Copy de progreso redactado en clave de constancia personal (_"Cada salida suma en tu camino"_), conforme al vocabulario preferido de `BRAND_UX_CONTRACT.md` §3.2 y sin prometer rendimiento deportivo garantizado (`NFR-04`).

---

### 2.6 Journey J06 — Creación y publicación de evento `/pro` (`AC-J06-01`..`AC-J06-06`)

#### `AC-J06-01` — Acceso por invitación cerrada (`72 h`, `SHA-256`) y aislamiento multi-tenant por rol

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G2`, `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** Canje de invitación (p. ej. `/pro/invitacion` o flujo de entrada autenticada `/pro`) y todas las rutas `/pro`, `/pro/eventos/**`.
- **Roles permitidos vs denegados:**
  - `ORG_OWNER` (`ACTIVE`): gestión completa de su `Organization`, miembros (`INVITED`/`ACTIVE`/`REVOKED`), eventos, participantes y comunicaciones de su `organization_id`.
  - `ORG_MANAGER` (`ACTIVE`): creación/edición/publicación/cierre/completado de eventos, participantes, CSV y briefings de su `organization_id` (sin revocar/promover `ORG_OWNER`).
  - `ORG_VIEWER` (`ACTIVE`): solo lectura de `/pro`, eventos propios, participantes y KPIs; denegado **`403 FORBIDDEN`** ante cualquier mutación (crear, editar, publicar, cambiar estados, invitar/revocar, enviar briefing).
  - `INVITED`, `REVOKED`, `ATHLETE` sin membresía `ACTIVE`, o miembro `ACTIVE` de otra organización (`Org 1` sobre `Org 2`): denegado **`403 FORBIDDEN`** o **`404 NOT_FOUND`** (`DRAFT` ajeno) en aplicación y **`FORCE ROW LEVEL SECURITY`** (`NT-01`, `NT-03`).
  - `ANONYMOUS`: redirigido a `/entrar` (`401` en API).
- **Entidades y campos tocados:** `Organization`, `OrganizationMembership` (`id`, `organization_id`, `user_id`, `org_role`, `status`, `invited_email` limpiado tras activar/expirar, `invitation_token_hash` `SHA-256` 64 hex, `invitation_expires_at_utc`, `accepted_at_utc`, `revoked_at_utc`), `Event` (`organization_id`), `AuditLog`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un usuario invitado (`organizer-org1-invited`) con token aleatorio criptográfico (`>= 256 bits`) cuyo hash `SHA-256` consta en `OrganizationMembership(status = 'INVITED', invitation_expires_at_utc > NOW())` dentro de la ventana de **`72 horas`**,
  - **Cuando** abre el enlace de invitación, autentica su cuenta (`User`) y confirma la aceptación,
  - **Entonces** el servidor verifica el digest `SHA-256` en constante tiempo, transiciona `OrganizationMembership` de `INVITED -> ACTIVE` en una transacción atómica, limpia `invited_email` y `invitation_token_hash` (`null`), registra `accepted_at_utc` + evento `MEMBERSHIP_ACCEPTED` en `AuditLog` sin PII, y habilita el acceso a `/pro` acotado estrictamente a su `organization_id` (`CL-20`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Token expirado `> 72 h` o reutilizado 2 veces — `CL-20`, `NT-03`):_ **Dado** un token de invitación vencido tras `72 horas` o ya canjeado previamente, **cuando** alguien intenta aceptarlo, **entonces** el servidor rechaza con **`403`/`410`** no enumerador y no activa ninguna membresía.
  2. _(Aislamiento cross-tenant `Org 1` vs `Org 2` — `CL-21`, `NT-01`):_ **Dado** `organizer-org1-active` (`org1.gestor@oak-demo.invalid`) intentando `GET/PATCH/POST` sobre el evento `carrera-jardines-tajo-aranjuez` (`DRAFT` de `Org 2`) o enviando `organizationId` de `Org 2` en el payload de creación, **cuando** actúa el caso de uso (`deny-by-default`) y `FORCE RLS`, **entonces** el servidor ignora cualquier `organizationId` manipulable por cliente o rechaza con **`404`** (para `DRAFT` ajeno) / **`403`** (`0` filas devueltas o modificadas).
  3. _(Miembro `INVITED`, `REVOKED` o `ORG_VIEWER` intentando operar — `CL-20`, `CL-21`, `NT-03`):_ **Dado** `organizer-org1-revoked` o `organizer-org2-viewer` intentando acceder a `/pro` o ejecutar `POST /pro/eventos`, **cuando** el servidor valida `status = 'ACTIVE'` y `org_role`, **entonces** devuelve **`403 FORBIDDEN`** sin modificar ningún recurso.
  4. _(Protección del último `ORG_OWNER` — `CL-20`):_ **Dado** una organización activa con un único `ORG_OWNER ACTIVE`, **cuando** intenta revocar o degradar su propio rol sin haber activado otro `ORG_OWNER`, **entonces** el dominio bloquea la operación con **`409 CONFLICT`**.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Inexistencia total de enlaces o formularios de "Regístrate como organizador" abiertos (`Out-of-Scope V1` #5); pantalla de `/pro` muestra el nombre de la organización activa en contexto y mensaje claro `403` si un usuario sin membresía intenta entrar (`NFR-03`, `NFR-04`).

#### `AC-J06-02` — Creación y edición de borrador `DRAFT` con medios seguros, modalidades, cupos, tarifas y contacto

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` para campos opcionales detallados en `D1-10` y derechos de imagen en `D1-12`)
- **Rutas / Pantallas:** `/pro/eventos/nuevo` y `/pro/eventos/:eventId` (editor por secciones).
- **Roles permitidos vs denegados:** Solo `ORG_OWNER` y `ORG_MANAGER` `ACTIVE` de esa `Organization`. `ORG_VIEWER`, `INVITED`, `REVOKED`, otras organizaciones y `ATHLETE` -> **`403`** / **`404`** (`NT-01`, `NT-03`).
- **Entidades y campos tocados:** `Event` (`slug`, `title`, `discipline = 'trail'|'running'`, `status = 'DRAFT'`, `region = 'Comunidad de Madrid'`, `municipality` allowlist `55`, `location_name`, `starts_at_utc`, `registration_closes_at_utc`, `timezone = 'Europe/Madrid'`, `regulation_summary`, `cancellation_policy_summary` `[CANDIDATO_D1]` `D1-08`, `public_contact_email`), `EventPrivateOps` (notas internas aisladas `N3 Confidencial`), `EventMedia` (`storage_path`, `mime_type`, `size_bytes`, `width_px`, `height_px`, `alt_text`, `rights_owner`, `provenance_note`), `EventModality`, `PriceTier`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** `organizer-org1-active` autenticado en `/pro/eventos/nuevo`,
  - **Cuando** completa por secciones el borrador del evento: contenido general (`title`, `discipline`, municipio madrileño y punto de salida), fechas/horas en `Europe/Madrid` (persistidas en UTC con `registration_closes_at_utc <= starts_at_utc`), sube una imagen `WebP`/`AVIF`/`JPEG`/`PNG` `<= 5 MB` con `alt_text`, añade modalidades (`distance_meters > 0`, `elevation_gain_meters >= 0`, `level`, `time_limit_minutes > 0`, `capacity_limit >= 1`), define uno o varios `PriceTier` en céntimos enteros `EUR` (`amount_cents >= 0`, `management_fee_cents >= 0`, `valid_from_utc <= valid_until_utc`, `max_quantity <= capacity_limit`), incluye reglamento y `public_contact_email` institucional, y guarda el borrador,
  - **Entonces** el servidor valida todos los invariantes Zod/dominio, sanea textos anti-XSS, verifica magic bytes de `EventMedia` eliminando metadatos EXIF antes de almacenar en Supabase Storage, separa las notas privadas en `EventPrivateOps`, persiste el evento en `Event.status = 'DRAFT'` (invisible en `/explorar`) y muestra confirmación de guardado en `es-ES`.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Subida de `.svg`, extensión falseada o fichero `> 5 MB` — `CL-22`, `NT-11`):_ **Dado** que el usuario intenta subir un archivo `.svg` (o un SVG renombrado a `.png`) o una imagen de `6 MB` en `EventMedia`, **cuando** el servidor inspecciona magic bytes y tamaño antes de escribir en Storage, **entonces** rechaza con **`400`/`415`/`413`** en `es-ES` (_"Formato no admitido: usa WebP, AVIF, JPEG o PNG de hasta 5 MB. No se permiten archivos SVG"_) y no almacena ningún fichero.
  2. _(Disciplina/municipio fuera de `D0` o fecha de cierre posterior al inicio — `CL-03`, `CL-22`):_ **Dado** un borrador con `discipline = 'ciclismo'`, `municipality = 'Ávila'` o `registration_closes_at_utc > starts_at_utc`, **cuando** intenta guardar, **entonces** el servidor rechaza (`422`) indicando el campo exacto y motivo en `es-ES`.
  3. _(Inyección XSS en título o reglamento — `NT-11`):_ **Dado** `<script>alert(1)</script>` en `title` o `regulation_summary`, **cuando** se guarda y visualiza en editor/preview, **entonces** se escapa sin ejecutarse en ningún contexto.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Editor por secciones navegable por teclado, etiquetas visibles en todos los campos, conversión clara a hora local `Europe/Madrid` con aviso de zona horaria, aviso de campos obligatorios vs opcionales, autoguardado o botón `Guardar borrador` con estado `Guardando...` / `Borrador guardado` anunciado en `aria-live="polite"` (`NFR-03`, `NFR-04`).

#### `AC-J06-03` — Checklist server-side obligatorio antes de publicar (`422` con lista exacta de faltantes)

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/pro/eventos/:eventId` (panel de revisión/checklist y acción `Publicar evento`).
- **Roles permitidos vs denegados:** Solo `ORG_OWNER` y `ORG_MANAGER` `ACTIVE` de la organización propietaria (`ORG_VIEWER` y otras orgs -> `403`/`404`, `NT-01`, `NT-03`).
- **Entidades y campos tocados:** `Event`, `EventModality`, `PriceTier`, `EventMedia`, `AuditLog`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento en `DRAFT` cuyos campos obligatorios han sido cumplimentados (`title`, `slug`, `discipline`, `municipality` en Madrid, `location_name`, `starts_at_utc` futura, `registration_closes_at_utc <= starts_at_utc`, `>= 1` `EventModality` con `capacity_limit >= 1`, `>= 1` `PriceTier` válido en `EUR` con ventana vigente, `regulation_summary`, `cancellation_policy_summary` y `public_contact_email` institucional, más `EventMedia` con `alt_text` si hay medios),
  - **Cuando** un `ORG_OWNER`/`ORG_MANAGER` pulsa `Publicar evento`,
  - **Entonces** el servidor ejecuta el **validador de checklist de dominio (`INV-02`)** dentro de la transacción de transición, comprueba que todas las reglas pasen, cambia `Event.status` de `DRAFT -> PUBLISHED`, inserta `EVENT_PUBLISHED` en `AuditLog` y el evento pasa a ser visible inmediatamente en `/explorar` y `/retos/:eventSlug`.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Publicación de borrador incompleto — `CL-22`, `INV-02`):_ **Dado** un `DRAFT` al que le falta `regulation_summary`, no tiene ningún `PriceTier` asignado o tiene `public_contact_email` vacío, **cuando** el organizador (o una llamada directa `POST` a la API) intenta publicar, **entonces** el servidor bloquea la transición con **`422 UNPROCESSABLE_ENTITY`**, mantiene `Event.status = 'DRAFT'` y devuelve la **lista estructurada exacta de elementos faltantes** (`missingChecklistItems`) para mostrarlos en UI con enlace directo a la sección correspondiente.
  2. _(Salto directo de estado vía petición manipulada — `NT-16`):_ **Dado** una petición que intenta forzar `status = 'PUBLISHED'` en un `PATCH` genérico sin invocar el comando de publicación, **cuando** la capa de aplicación la recibe, **entonces** rechaza mutaciones directas de estado (`400`/`422`).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Panel checklist visible antes de `Publicar evento` con icono + texto por cada requisito (`Completo` / `Pendiente`); al fallar la publicación, foco desplazado al resumen de errores vinculados a cada sección faltante (`NFR-04`).

#### `AC-J06-04` — Coincidencia de la vista previa `/pro/eventos/:eventId` con la ficha pública

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 5 · `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` para campos finos de ficha en `D1-10`)
- **Rutas / Pantallas:** Vista previa en `/pro/eventos/:eventId` vs ficha pública `/retos/:eventSlug`.
- **Roles permitidos vs denegados:** Vista previa accesible únicamente a miembros `ACTIVE` (`ORG_OWNER`, `ORG_MANAGER`, `ORG_VIEWER`) de la organización propietaria; `ANONYMOUS`, `ATHLETE` y otras orgs reciben **`404`** si el evento aún está `DRAFT` (`NT-01`, `NT-09`).
- **Entidades y campos tocados:** `Event`, `EventModality`, `PriceTier`, `EventMedia`, `Organization` (excluyendo expresamente `EventPrivateOps`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento en `DRAFT` o `PUBLISHED` configurado en `/pro/eventos/:eventId`,
  - **Cuando** el organizador abre su vista previa antes o después de publicar y se compara contra `/retos/:eventSlug`,
  - **Entonces** la vista previa reutiliza los mismos formateadores de contenido esencial (título, disciplina, fecha/hora `Europe/Madrid`, municipio y punto de salida, distancia/desnivel/nivel/tiempo límite por modalidad, cupo disponible, precios totales en `EUR`, reglamento, resumen de cancelación y contacto institucional `public_contact_email`, sin exponer `EventPrivateOps`) garantizando coincidencia exacta con la ficha pública (`CL-22`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Enlace de vista previa compartido por error con un `ANONYMOUS` antes de publicar — `NT-01`, `NT-09`):_ **Dado** un evento aún en `DRAFT`, **cuando** un visitante externo sin membresía `ACTIVE` de esa organización intenta abrir la URL de preview o `/retos/:eventSlug`, **entonces** recibe **`404`/`403`** sin filtrar datos del borrador.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Banner distintivo en la preview indicando `"Vista previa de borrador — aún no visible al público"` (con icono y texto, nunca solo color) y sin botones de inscripción reales activos dentro de la simulación (`NFR-04`).

#### `AC-J06-05` — Bloqueo de ediciones incompatibles con inscritos existentes

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/pro/eventos/:eventId` (edición de evento publicado o con reservas).
- **Roles permitidos vs denegados:** Solo `ORG_OWNER` y `ORG_MANAGER` `ACTIVE` de la organización propietaria (`403`/`404` resto).
- **Entidades y campos tocados:** `Event`, `EventModality` (`capacity_limit`, `reserved_count`), `PriceTier` (`amount_cents`, `management_fee_cents`, `valid_*`), `Registration` (`PENDING_PAYMENT`, `CONFIRMED`), `AuditLog`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento `PUBLISHED` que ya cuenta con inscripciones `CONFIRMED` o `PENDING_PAYMENT` (`reserved_count > 0`, ej. `10` inscritos confirmados en una modalidad de `capacity_limit = 50` con un `PriceTier` usado),
  - **Cuando** el organizador intenta una edición incompatible —como reducir `capacity_limit` por debajo de `reserved_count` (`5 < 10`), eliminar la `EventModality` usada, borrar o alterar el importe (`amount_cents`) de un `PriceTier` ya asociado a inscripciones, o despublicar (`PUBLISHED -> DRAFT`) existiendo reservas—,
  - **Entonces** el servicio de dominio **bloquea la mutación con `409 CONFLICT` (`CL-23`, `NT-16`)**, explica exactamente el motivo en `es-ES` (_"No puedes reducir el cupo por debajo de las 10 plazas ya reservadas ni modificar tarifas con inscritos"_), mantiene íntegras las inscripciones existentes, y permite únicamente operaciones seguras (aumentar `capacity_limit`, crear un nuevo `PriceTier` futuro o iniciar cancelación auditada del evento).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Despublicar `PUBLISHED -> DRAFT` con `0` inscritos vs `> 0` inscritos — `SYSTEM_ARCHITECTURE.md` §3.1):_ **Dado** un evento `PUBLISHED` con `0` reservas ni confirmaciones, **cuando** `ORG_OWNER` ejecuta `Pasar a borrador`, **entonces** la transición `PUBLISHED -> DRAFT` se permite y queda registrada en `AuditLog`; si existiera `>= 1` inscripción `PENDING_PAYMENT` o `CONFIRMED`, responde **`409 CONFLICT`**.
  2. _(Aumento seguro de cupo):_ **Dado** `reserved_count = 10` y `capacity_limit = 50`, **cuando** el organizador amplía `capacity_limit` a `80`, **entonces** el servidor actualiza a `80` (`remaining_spots = 70`) registrando el cambio en `AuditLog`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Campos protegidos muestran estado `read-only` o mensaje explicativo de bloqueo previo a editar; errores `409` vinculados por `aria-describedby` con explicación accionable (`NFR-04`).

#### `AC-J06-06` — Validación de máquina de estados de evento y registro inmutable en `AuditLog`

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` en políticas finas de cancelación/reembolso `D1-08`)
- **Rutas / Pantallas:** `/pro/eventos` y `/pro/eventos/:eventId` (acciones `Publicar evento`, `Cerrar inscripciones`, `Marcar prueba completada`, `Cancelar evento`).
- **Roles permitidos vs denegados:** Solo `ORG_OWNER` y `ORG_MANAGER` `ACTIVE` de la organización propietaria (`ORG_VIEWER` -> `403`, otras orgs -> `403`/`404`).
- **Entidades y campos tocados:** `Event` (`status`), `AuditLog` (`id`, `created_at_utc`, `correlation_id`, `actor_id`, `actor_role`, `organization_id`, `action`, `resource_type = 'Event'`, `resource_id`, `reason`, `metadata_safe` sin PII).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento perteneciente a la organización del `ORG_OWNER`/`ORG_MANAGER` autenticado,
  - **Cuando** ejecuta cualquier transición válida de la máquina de estados (`DRAFT -> PUBLISHED`, `PUBLISHED -> DRAFT` con `0` reservas, `PUBLISHED -> CLOSED`, `CLOSED -> COMPLETED`, o `DRAFT/PUBLISHED/CLOSED -> CANCELLED` aportando `reason` obligatorio),
  - **Entonces** el servicio de dominio valida precondiciones (ej. para `CANCELLED` exige `reason` no vacío; para `COMPLETED` exige `Event.status = 'CLOSED'` o evento ya celebrado según regla de dominio, habilitando automáticamente el cálculo en `/trayectoria` de los inscritos `CONFIRMED`), ejecuta la transición y escribe en la misma transacción una fila inmutable (`INSERT`-only) en `AuditLog` con `actor_id`, `actor_role`, `organization_id`, `created_at_utc` (UTC), `action`, `resource_id`, `reason` y cambio de estado (`from_status`, `to_status` en `metadata_safe`, `0` PII) (`CL-22`, `CL-23`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Transición inválida desde estado terminal — `NT-16`):_ **Dado** un evento en estado terminal `COMPLETED` o `CANCELLED`, **cuando** un usuario o endpoint intenta volver a `PUBLISHED` o `DRAFT`, **entonces** el servicio de dominio rechaza la transición (`409`/`422`) y no escribe alteraciones de estado.
  2. _(Cancelación sin motivo `reason`):_ **Dado** una petición de transición a `CANCELLED` sin campo `reason`, **cuando** el caso de uso la valida, **entonces** rechaza con **`400`/`422`** exigiendo motivo explícito auditado (`[CANDIDATO_D1]` política de reembolso en `D1-08`).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Acciones críticas (`Cancelar evento`, `Marcar prueba completada`) requieren diálogo de confirmación accesible con explicación de consecuencias (ej. impacto en visibilidad pública y `/trayectoria`), gestión de foco y botones específicos (`Confirmar cancelación de evento`, nunca `Aceptar`) (`NFR-03`, `NFR-04`).

---

### 2.7 Journey J07 — Participantes, conciliación, CSV y briefing `/pro` (`AC-J07-01`..`AC-J07-05`)

#### `AC-J07-01` — Consulta paginada y filtrable de participantes aislada por organización

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G2`, `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/pro/eventos/:eventId/participantes` (y vista contextual desde `/pro`).
- **Roles permitidos vs denegados:** Lectura permitida a miembros `ACTIVE` (`ORG_OWNER`, `ORG_MANAGER`, `ORG_VIEWER`) **únicamente de eventos pertenecientes a su `organization_id`**. Miembros de otra organización, `INVITED`, `REVOKED`, `ATHLETE` y `ANONYMOUS` reciben **`403`/`404`** por caso de uso y `FORCE RLS` (`NT-01`, `NT-03`).
- **Entidades y campos tocados:** `OrganizationMembership` (`ACTIVE`), `Event` (`organization_id`), `EventModality`, `Registration` (`registration_code`, `status`, `total_cents`, `confirmed_at_utc`), `RegistrationParticipant` (`full_name`, `email`, `phone`, `emergency_contact`, `club_or_team`, `document_number = null` `blocked_by_D1_09`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** `organizer-org1-active` (`ORG_OWNER` de `Org 1`) u `organizer-org2-viewer` (`ORG_VIEWER` de `Org 2`) accediendo a un evento de su propia organización en `/pro/eventos/:eventId/participantes`,
  - **Cuando** filtra por modalidad (`event_modality_id`) y estado de inscripción (`CONFIRMED`, `PENDING_PAYMENT`, `CANCELLED`, `REFUNDED`), o navega entre páginas,
  - **Entonces** el servidor verifica `OrganizationMembership.status = 'ACTIVE'` para el `organization_id` del evento, devuelve páginas acotadas de **`<= 50` filas por página** (`ADR-004` §2.4, `NFR-07` `p95 <= 500 ms`) con los datos operativos del participante (sin columna de `DNI`/`NIE`/pasaporte mientras `blocked_by_D1_09` esté vigente) y muestra cero registros de otras organizaciones (`CL-21`, `CL-24`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Acceso cross-tenant a participantes de otro club — `CL-21`, `NT-01`):_ **Dado** `organizer-org1-active` (`Org 1`) sustituyendo `:eventId` en URL/API por el UUID de `media-parque-alhondiga-getafe` (`Org 2`), **cuando** realiza la petición, **entonces** el servidor y `FORCE RLS` deniegan con **`403`** / **`404`** y `0` filas de participantes de `Org 2` son devueltas.
  2. _(Paginación abusiva `pageSize=5000` — `NT-13`):_ **Dado** una petición API solicitando `limit = 5000`, **cuando** Zod valida el contrato, **entonces** limita/rechaza por encima de `50` filas (`400`/`422`).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** En desktop tabla accesible con `<th>`; en móvil `320 px` (`CL-27`), conversión automática a tarjetas apiladas legibles sin scroll 2D forzoso; estados `loading` (skeleton), `empty` (_"Aún no hay participantes que coincidan con este filtro"_) y `error` con `Reintentar` (`NFR-04`, `NFR-07`).

#### `AC-J07-02` — Conciliación exacta al céntimo de KPIs de inscritos, ocupación e ingresos en modo `test`

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/pro` (Resumen) y `/pro/eventos/:eventId/analitica`.
- **Roles permitidos vs denegados:** Lectura permitida a `ORG_OWNER`, `ORG_MANAGER` y `ORG_VIEWER` `ACTIVE` de esa `Organization` (`403`/`404` resto, `NT-01`, `NT-03`).
- **Entidades y campos tocados:** Proyección agregada sobre `EventModality` (`capacity_limit`, `reserved_count`), `Registration` (`status = 'CONFIRMED'`, `total_cents`, `currency = 'EUR'`), `Payment` (`status = 'SUCCEEDED' | 'REFUNDED'`, `mode = 'test'`, `amount_cents`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento de `Org 1` o `Org 2` con inscripciones en distintos estados (`CONFIRMED` pagadas, `CONFIRMED` gratuita `0 EUR`, `PENDING_PAYMENT`, `DRAFT`, `CANCELLED` y `REFUNDED`),
  - **Cuando** un miembro `ACTIVE` consulta `/pro` o `/pro/eventos/:eventId/analitica`,
  - **Entonces** el servidor calcula en enteros céntimos `EUR` y expone de forma reconciliada al céntimo (`0` discrepancias, `CL-24`, `NFR-02`):
    - **Inscritos confirmados:** conteo exacto de `Registration` con `status = 'CONFIRMED'`;
    - **Ocupación:** `CONFIRMED` (y desglose de reservas temporales `PENDING_PAYMENT` si aplica) sobre `capacity_limit`;
    - **Ingresos brutos de prueba (`mode = 'test'`):** suma exacta en céntimos enteros `EUR` de `Payment(status = 'SUCCEEDED').amount_cents` vinculados a inscripciones `CONFIRMED` (excluyendo `DRAFT`, `PENDING_PAYMENT`, `FAILED`, `CANCELLED` y descontando/mostrando aparte `REFUNDED`), con etiqueta explícita `"Importes en entorno de pruebas (Stripe test) — Sin liquidaciones ni dinero real en V1"`.
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Inscripciones pendientes o fallidas nunca inflan ingresos — `CL-24`):_ **Dado** `2` borradores `DRAFT`, `1` `PENDING_PAYMENT` (`CREATED`) y `1` `Payment FAILED`, **cuando** se calculan los KPIs comerciales, **entonces** `0` céntimos de esos registros se suman al total de ingresos confirmados.
  2. _(Aislamiento de analítica entre organizaciones — `NT-01`):_ **Dado** `Org 1` consultando `/pro`, **cuando** se agregan KPIs, **entonces** únicamente incluyen eventos de `Org 1` sin mezclar cifras de `Org 2`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Etiqueta visible que indica modo `test` y explicación de cálculo junto a cada KPI (`BRAND_UX_CONTRACT.md` §10.6), lectura accesible de porcentajes y euros, paleta `viz.*` sujeta a `D1-05` acompañada siempre de etiquetas numéricas directas (`NFR-04`).

#### `AC-J07-03` — Exportación CSV UTF-8 anti-_formula injection_ (`'`) y registro en `AuditLog`

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G2`, `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]` (permiso de `ORG_VIEWER` acotado por defecto recomendado; revisable en `D1-10` `[CANDIDATO_D1]`)
- **Rutas / Pantallas:** Acción `Exportar participantes CSV` en `/pro/eventos/:eventId/participantes`.
- **Roles permitidos vs denegados:**
  - Permitido por defecto recomendado (alineado con `V1_SCOPE_AND_EXCLUSIONS.md` §3): `ORG_OWNER` y `ORG_MANAGER` `ACTIVE` de la `Organization` propietaria del evento.
  - **`ORG_VIEWER` (`ACTIVE`)** `[CANDIDATO_D1]` (`D1-10`): denegado **`403 FORBIDDEN`** en descarga masiva de PII por defecto conservador (`ORG_VIEWER` solo consulta en pantalla; pendiente de ratificación final en `D1-10` si se mantuviera solo lectura).
  - Miembros de otra organización, `INVITED`, `REVOKED`, `ATHLETE` y `ANONYMOUS`: denegado **`403`/`404`** (`NT-01`, `NT-03`).
- **Entidades y campos tocados:** `Event`, `EventModality`, `Registration` (`registration_code`, `status`, `total_cents`, `confirmed_at_utc`), `RegistrationParticipant` (`full_name`, `email`, `phone`, `emergency_contact`, `club_or_team`; cero `document_number` `blocked_by_D1_09`), `AuditLog` (`action = 'PARTICIPANTS_EXPORTED_CSV'`, `actor_id`, `actor_role`, `organization_id`, `resource_id = event_id`, `metadata_safe` sin PII).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un evento de `Org 1` donde un participante introdujo valores potencialmente peligrosos en su ficha (ej. `full_name = "=CMD(...)"`, `club_or_team = "+1+1"`, `"-2+3"`, `"@SUM(A1)"`, `"\t=1"`, `"\r=1"`),
  - **Cuando** `organizer-org1-active` (`ORG_OWNER`) pulsa `Exportar participantes CSV`,
  - **Entonces** el servidor:
    1. Verifica pertenencia `ACTIVE` y rol (`ORG_OWNER`/`ORG_MANAGER`) sobre el `organization_id` del evento;
    2. Genera el fichero CSV en **UTF-8** (`Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment`) escapando conforme a RFC 4180 y **anteponiendo comilla simple `'` a toda celda cuyo primer carácter (incluidos espacios iniciales) sea `=`, `+`, `-`, `@`, `\t` o `\r`** (`'=CMD(...)`, `'+1+1`, `'-2+3`, `'@SUM(A1)`, `'\t=1`, `'\r=1`, `CL-24`, `NT-08`);
    3. Formatea fechas en `Europe/Madrid` e importes en `EUR`;
    4. Registra una entrada inmutable en `AuditLog` (`action = 'PARTICIPANTS_EXPORTED_CSV'`, `actor_id`, `organization_id`, `resource_id`, conteo de filas y filtros aplicados en `metadata_safe`, **`0` PII en `AuditLog`**, `NT-14`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Intento de export cross-tenant o por `ORG_VIEWER` — `NT-01`, `NT-03`):_ **Dado** `organizer-org1-active` solicitando CSV de un evento de `Org 2`, o `organizer-org2-viewer` solicitando CSV de `Org 2`, **cuando** invoca el endpoint de exportación, **entonces** responde **`403`** / **`404`**, no descarga ningún archivo y no filtra datos de participantes.
  2. _(Celda con espacios previos al carácter peligroso — `NT-08`):_ **Dado** un valor `" =1+1"` con espacio inicial, **cuando** se serializa a CSV, **entonces** la sanitización detecta el disparador tras recorte inicial y neutraliza con `'` (`"' =1+1"`).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Botón específico `Exportar participantes CSV` (`>= 48x48 px`), aviso visible en `es-ES` indicando que la descarga queda registrada por seguridad/auditoría y estado de descarga anunciable (`aria-live="polite"`) (`NFR-03`, `NFR-04`).

#### `AC-J07-04` — Briefing en sandbox con selección explícita, vista previa y confirmación obligatoria

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 5 · `G3`, `G4` · `[REGLA_CONTRACTUAL_CERRADA]` (con `[CANDIDATO_D1]` en plantillas/campos de comunicación `D1-10`)
- **Rutas / Pantallas:** `/pro/eventos/:eventId/comunicaciones`.
- **Roles permitidos vs denegados:** Solo `ORG_OWNER` y `ORG_MANAGER` `ACTIVE` de la organización propietaria del evento. **`ORG_VIEWER` (`ACTIVE`)**, `INVITED`, `REVOKED`, otras organizaciones, `ATHLETE` y `ANONYMOUS` reciben **`403`/`404`** (`NT-01`, `NT-03`).
- **Entidades y campos tocados:** `Event` (`id`, `organization_id`), `Registration` (`CONFIRMED`), `CommunicationLog` (`communication_type = 'ORGANIZER_BRIEFING'`, `provider = 'resend_sandbox'`), `AuditLog`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** `organizer-org1-active` en `/pro/eventos/:eventId/comunicaciones` para un evento de `Org 1` con participantes `CONFIRMED`,
  - **Cuando** selecciona explícitamente destinatarios (por modalidad o selección explícita dentro de ese evento), redacta asunto y contenido operativo sanitizado, pulsa `Previsualizar briefing`, revisa la vista previa con el conteo exacto de destinatarios y marca confirmación explícita antes de pulsar `Confirmar y enviar briefing`,
  - **Entonces** el servidor valida pertenencia de cada destinatario (`registration_id` perteneciente exclusivamente a ese `event_id` y `organization_id` con estado `CONFIRMED` y sin restricción de bloqueo), exige token/bandera de preview previa confirmada, crea el lote en `CommunicationLog` y despacha vía `Resend sandbox` (`CL-25`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Intento de envío por `ORG_VIEWER` o hacia destinatarios de otra organización — `CL-21`, `CL-25`, `NT-01`, `NT-03`):_ **Dado** `organizer-org2-viewer` intentando enviar briefing, o una petición manipulada que incluye un `recipient_id` de `Org 2` dentro de un lote de `Org 1`, **cuando** el caso de uso valida permisos y pertenencia, **entonces** rechaza con **`403`** / **`422`** y envía `0` comunicaciones.
  2. _(Envío sin destinatarios seleccionados o sin pasar por vista previa — `CL-25`):_ **Dado** una petición con lista vacía de destinatarios o sin confirmación explícita de preview, **cuando** llega al servidor, **entonces** rechaza con **`400`/`422`** informando en `es-ES` qué requisito falta.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Lista de destinatarios accesible con checkboxes `>= 48x48 px` (`Seleccionar modalidad`), vista previa en diálogo o paso explícito antes de confirmar con etiqueta clara `Confirmar y enviar briefing a N participantes (entorno sandbox)`, sin botones genéricos (`NFR-04`).

#### `AC-J07-05` — Idempotencia de reintentos de briefing (`idempotency_key UNIQUE`) sin envíos duplicados

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5 · `G2`, `G3` · `[REGLA_CONTRACTUAL_CERRADA]`
- **Rutas / Pantallas:** `/pro/eventos/:eventId/comunicaciones` (estado del lote y acción `Reintentar envíos pendientes`).
- **Roles permitidos vs denegados:** `ORG_OWNER` y `ORG_MANAGER` `ACTIVE` de la `Organization` propietaria (`403`/`404` resto).
- **Entidades y campos tocados:** `CommunicationLog` (`id`, `idempotency_key = briefing:<batch_id>:<recipient_id> UNIQUE`, `event_id`, `recipient_user_id`, `communication_type = 'ORGANIZER_BRIEFING'`, `provider = 'resend_sandbox'`, `provider_message_id`, `status = 'PENDING'|'SENT'|'FAILED'`, `sent_at_utc`).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un lote de briefing `batch_id` dirigido a `5` participantes confirmados donde `3` pasan a `SENT` y `2` fallan transitoriamente (`FAILED` o timeout de `5 s` en `Resend sandbox`),
  - **Cuando** el organizador (o el _worker_ de reintento, o una doble pulsación de red) reintenta el envío sobre el mismo `batch_id`,
  - **Entonces** la restricción `idempotency_key UNIQUE` (`briefing:<batch_id>:<recipient_id>`) garantiza que los `3` destinatarios ya `SENT` queden omitidos y únicamente se intenten los `2` destinatarios pendientes/fallidos (`CL-25`, `NT-17`), resultando exactamente `1` correo sandbox por cada destinatario al finalizar sin duplicados (`0` duplicidades).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Doble envío simultáneo del mismo lote — `NT-17`):_ **Dado** dos peticiones concurrentes con el mismo `batch_id`, **cuando** ambas ejecutan el insert outbox `ON CONFLICT (idempotency_key) DO NOTHING`, **entonces** solo una procesa el envío por destinatario sin generar correos duplicados ni errores `500`.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Historial del envío en `/pro/eventos/:eventId/comunicaciones` muestra estado agregado por lote (`Enviados: X`, `Fallidos: Y`, sin exponer contenido raw ni PII en logs) y botón `Reintentar fallidos` habilitado únicamente cuando existan registros en `FAILED` (`NFR-03`, `NFR-04`).

---

### 2.8 Journey J08 — Administración y soporte mínimo auditable (`AC-J08-01`..`AC-J08-04`)

> **Nota DoR de coordinación con `P1-004` (`D1-07`):** En los criterios `AC-J08-01`..`AC-J08-04`, la ruta **`/soporte`** como punto de entrada mínimo acotado para `ADMIN` con MFA es una **referencia funcional provisional alineada con la propuesta de arquitectura de información `P1-004` (`INFORMATION_ARCHITECTURE_AND_ROUTES.md`) y sujeta a ratificación formal en `D1-07` (`P1-012`)**.

#### `AC-J08-01` — Localización puntual de inscripción por identificador exacto (`ADMIN` + MFA) sin búsqueda abierta de PII

- **Prioridad, Fase y Gates objetivo:** `P1` · Fase 5/7 · `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]` · _(Ruta `/soporte` sujeta a ratificación en `D1-07`, `P1-012`)_
- **Rutas / Pantallas:** `/soporte` (provisional `P1-004` / `D1-07`).
- **Roles permitidos vs denegados:** Exclusivamente `User` con `platform_role = 'ADMIN'` y **MFA activo verificado en sesión (`mfa_enabled = true`)**. `ADMIN` sin MFA, `ATHLETE`, `ORG_OWNER`, `ORG_MANAGER`, `ORG_VIEWER` y `ANONYMOUS` reciben **`403 FORBIDDEN`** (o `401`/redirección si anónimo, `NT-15`).
- **Entidades y campos tocados:** `User` (`platform_role = 'ADMIN'`, `mfa_enabled`), `Registration` (`id`, `registration_code`, `status`, `total_cents`, `created_at_utc`, `confirmed_at_utc`), `Event` (`title`, `status`), `EventModality` (`name`), `Payment` (`status`, `mode`, `amount_cents`), `AuditLog`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** la cuenta sintética `admin-soporte` (`admin.soporte@oak-demo.invalid`, `platform_role = 'ADMIN'`, MFA verificado en sesión activa),
  - **Cuando** accede a `/soporte` (provisional `D1-07`), introduce un identificador exacto (`registration_id` UUID o `registration_code` exacto formato `OAK-XXXX-XXXX` / `OAK-DEMO-XXXX-XXXX`) junto con el motivo obligatorio de la consulta (`reason`), y pulsa `Consultar inscripción`,
  - **Entonces** el sistema localiza y muestra únicamente el detalle puntual de esa inscripción (estado, modalidad, evento, resumen de pago test sin PAN/CVV y estado de envío `CommunicationLog`), sin exponer listados de otros usuarios ni buscadores abiertos de PII (`CL-26`, `NT-15`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Búsqueda abierta o con comodines `wildcard` de PII — `CL-26`, `NT-15`):_ **Dado** `ADMIN` intentando enviar búsqueda vacía, parcial (`%`), o por nombre/correo electrónico/teléfono (`atleta.historial@oak-demo.invalid`), **cuando** el servidor valida la consulta, **entonces** rechaza la petición con **`400`/`422`** (exigiendo UUID o `registration_code` completo y exacto; `0` endpoints de listado masivo de PII en el código).
  2. _(`ADMIN` sin MFA o `ATHLETE`/`ORG_OWNER` accediendo a `/soporte` — `NT-15`):_ **Dado** una cuenta `ADMIN` con MFA pendiente de verificar, o un `ORG_OWNER`/`ATHLETE` intentando abrir `/soporte`, **cuando** entra a la ruta o API, **entonces** recibe **`403 FORBIDDEN`** inmediato.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Formulario de `/soporte` con `<label>` claro (`Código exacto o UUID de inscripción` y `Motivo de la consulta`), botón específico `Consultar inscripción`, error comprensible si no existe el identificador sin listar sugerencias cercanas (`NFR-03`, `NFR-04`).

#### `AC-J08-02` — Motivo obligatorio (`reason`) y registro inmutable en `AuditLog` sin PII

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 5/7 · `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]` · _(Ruta `/soporte` sujeta a ratificación en `D1-07`, `P1-012`)_
- **Rutas / Pantallas:** `/soporte` (provisional `P1-004` / `D1-07`) y operaciones administrativas de soporte.
- **Roles permitidos vs denegados:** Solo `ADMIN` con MFA verificado (`403` resto). Prohibido `UPDATE`/`DELETE` sobre `AuditLog` para cualquier rol aplicativo (`BR-01`).
- **Entidades y campos tocados:** `AuditLog` (`id`, `created_at_utc`, `correlation_id`, `actor_id`, `actor_role = 'ADMIN'`, `action`, `resource_type = 'Registration'`, `resource_id`, `reason` obligatorio no vacío, `metadata_safe` sin PII).
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un `ADMIN` autenticado con MFA en `/soporte` que introduce un `registration_code` válido y un `reason` explícito (ej. `"Incidencia reportada en ticket de pruebas #104"`),
  - **Cuando** ejecuta la consulta puntual (`ADMIN_LOOKUP_BY_ID`) o cualquier acción de soporte permitida (ej. reintento de correo fallido de outbox),
  - **Entonces** el servidor inserta obligatoriamente en la misma operación una fila inmutable `INSERT`-only en `AuditLog` con `actor_id`, `actor_role = 'ADMIN'`, `action`, `resource_id`, `reason`, `correlation_id`, `created_at_utc` (UTC) y **`0` PII directa** (`0` nombres, `0` emails, `0` teléfonos ni tokens en `reason` validado / `metadata_safe`, `CL-26`, `NT-14`, `NT-15`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Operación `ADMIN` sin `reason` o solo espacios — `CL-26`, `NT-15`):_ **Dado** una petición de consulta o soporte enviada por `ADMIN` con `reason = ""` o `"   "`, **cuando** el caso de uso la recibe, **entonces** rechaza con **`400`/`422`** (`"El motivo operativo es obligatorio para registrar la auditoría"`) y no devuelve la inscripción.
  2. _(Intento de modificar o borrar `AuditLog` — `NFR-03`, `BR-01`):_ **Dado** la configuración de privilegios PostgreSQL del rol aplicativo, **cuando** se evalúa `AuditLog`, **entonces** `UPDATE` y `DELETE` están revocados en BD (`INSERT`-only) y los backups/rastreabilidad (`NFR-08`) conservan la pista íntegra sin PII (`NT-14`).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Campo `Motivo de la consulta` marcado como obligatorio (`required`), instrucciones previas explicando no introducir datos personales en el campo de motivo, error inline enlazado por `aria-describedby` (`NFR-03`, `NFR-04`, `NFR-08`).

#### `AC-J08-03` — Prohibición absoluta de impersonación silenciosa de cuentas

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 2/7 · `G5` · `[REGLA_CONTRACTUAL_CERRADA]` · _(Ruta `/soporte` sujeta a ratificación en `D1-07`, `P1-012`)_
- **Rutas / Pantallas:** Módulo `identity`, `/entrar`, `/soporte` (provisional `P1-004` / `D1-07`) y todas las rutas de sesión/app.
- **Roles permitidos vs denegados:** **Ningún rol** (ni siquiera `ADMIN` con MFA) posee facultad para iniciar sesión como otro `User` ni emitir tokens/cookies suplantando a un `ATHLETE` u organizador (`403` / inexistente).
- **Entidades y campos tocados:** `User`, sesión SSR `@supabase/ssr`, `AuditLog`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** la arquitectura completa de autenticación y las herramientas administrativas disponibles en `/soporte`,
  - **Cuando** un `ADMIN` opera en soporte o un auditor revisa las rutas, casos de uso y tokens de sesión de la plataforma,
  - **Entonces** no existe ningún botón, endpoint, parámetro `act_as`/`impersonate_user_id` ni mecanismo de intercambio de cookies que permita entrar en `/mis-retos`, `/perfil` o `/pro` suplantando silenciosamente la identidad de un deportista o miembro de organización (`CL-26`, `NT-15`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Petición o cabecera manipulada para actuar en nombre de otro usuario — `NT-15`):_ **Dado** un `ADMIN` (o atacante) que envía una cabecera o parámetro `x-impersonate-user-id` / `?asUser=<uuid>` contra rutas `/mis-retos`, `/perfil` o `/pro/**`, **cuando** el servidor deriva el `ActorContext`, **entonces** ignora totalmente la suplantación o responde **`403 FORBIDDEN`**, operando siempre con la identidad real autenticada en la cookie SSR verificada.
- **Requisitos UI `es-ES` y Accesibilidad verificables:** En `/soporte` la cabecera muestra claramente la identidad propia del operador (`Sesión de soporte: ADMIN`) y `0` controles de `"Entrar como usuario"` (`NFR-03`).

#### `AC-J08-04` — Prohibición de alteración directa de pagos o cupos fuera de transiciones de dominio auditadas

- **Prioridad, Fase y Gates objetivo:** `P0` · Fase 2/4 · `G3`, `G5` · `[REGLA_CONTRACTUAL_CERRADA]` · _(Ruta `/soporte` sujeta a ratificación en `D1-07`, `P1-012`)_
- **Rutas / Pantallas:** `/soporte` (provisional `P1-004` / `D1-07`), servicios de `payments`, `registration` y `organizer-ops`.
- **Roles permitidos vs denegados:** Ni `ADMIN`, ni `ORG_OWNER`, ni `ATHLETE` disponen de formulario o endpoint para editar manualmente `Payment.amount_cents`, `Payment.status`, `Registration.total_cents`, `EventModality.capacity_limit` (por debajo de `reserved_count`) o `EventModality.reserved_count` fuera de las máquinas de estado validadas (`403` / `409` / inexistente, `NT-15`, `NT-16`).
- **Entidades y campos tocados:** `Payment` (`amount_cents`, `status`), `Registration` (`total_cents`, `status`), `EventModality` (`capacity_limit`, `reserved_count`), `AuditLog`.
- **Escenario Principal (`Dado / Cuando / Entonces`):**
  - **Dado** un `ADMIN` consultando una inscripción en `/soporte` (provisional `D1-07`) ante una incidencia de pago o aforo,
  - **Cuando** revisa las operaciones disponibles en la herramienta mínima de soporte y la capa de dominio (`payments` / `registration`),
  - **Entonces** únicamente puede consultar el estado real, verificar conciliación o disparar operaciones idempotentes seguras permitidas por dominio (como reintentar un envío `CommunicationLog` fallido o liberar reservas expiradas mediante el servicio transaccional `releaseExpiredPendingReservation` auditado), quedando bloqueada toda edición directa de importes de pago, confirmación manual sin `Payment SUCCEEDED` o alteración directa de `reserved_count` (`INV-04`, `INV-06`, `CL-26`, `NT-15`, `NT-16`).
- **Escenarios Negativo / Borde / Autorización (`Dado / Cuando / Entonces`):**
  1. _(Intento de `ADMIN` de confirmar una inscripción impagada o cambiar importe de pago — `CL-26`, `NT-15`, `NT-16`):_ **Dado** una inscripción en `PENDING_PAYMENT` cuyo `Payment` está `CREATED` o `FAILED`, **cuando** un `ADMIN` o cualquier actor intenta invocar transición directa a `CONFIRMED` sin `Payment.status = 'SUCCEEDED'` (para `total_cents > 0`) o modificar `Payment.amount_cents`, **entonces** la máquina de estados del dominio rechaza la operación (`403`/`409`) y mantiene íntegras las invariantes contables y de auditoría (`NFR-08`).
- **Requisitos UI `es-ES` y Accesibilidad verificables:** Los valores de pago y cupo en `/soporte` se muestran en modo de solo lectura (`read-only`) con su explicación técnica en `es-ES` (_"Los pagos y reservas se actualizan únicamente mediante eventos verificados de pasarela o caducidad automática"_) (`NFR-03`, `NFR-04`).

---

## 3. Trazabilidad transversal hacia Prototipo (`P1-007`), Dominio (`P1-008`) y Matriz QA (`P1-010`)

### 3.1 Flujos críticos `P0` obligatorios para el prototipo navegable (`P1-007`)

De acuerdo con `MASTER_EXECUTION_PLAN.md` §12 (`P1-007`) y `BRAND_UX_CONTRACT.md` §14.3, el prototipo navegable responsive en los viewports de referencia (**`320x568`**, **`390x844`**, **`768x1024`**, **`1200x800`**, **`1440x900`**) debe demostrar de extremo a extremo estos recorridos críticos `P0` (más la demostración explícita de `AC-J02-04` Favoritos por mandato de `D0`) sin incluir ninguna capacidad excluida por `D0`:

| Flujo en prototipo `P1-007`                                              | Criterios `P0` cubiertos (+ `P1` clave)                                                      | Pantallas y estados mínimos a demostrar                                                                                                                                                                                                                                                                             | Exclusiones `D0` obligatoriamente ausentes                                                                   |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **F1. Descubrimiento y filtros responsive (`J01`)**                      | `AC-J01-01`, `AC-J01-02`, `AC-J01-04`, `AC-J01-06` (`+ AC-J01-03`, `AC-J01-05`)              | `/` y `/explorar` con búsqueda Madrid `trail`/`running`, _bottom sheet_ filtros en `320 px`/`390 px`, panel en `1440 px`, chips removibles, estados `loading`, `empty` (`Limpiar filtros`) y `error` (`Reintentar`), navegación 100 % teclado.                                                                      | Sin mapa interactivo ni conmutador lista/mapa; sin secciones `Para ti` IA; sin términos `BANNED_DECK_TERMS`. |
| **F2. Ficha de decisión, estados de cupo y Favoritos (`J02`)**           | `AC-J02-01`, `AC-J02-02`, `AC-J02-03` (`+ AC-J02-04`, `AC-J02-05`)                           | `/retos/:eventSlug` con info completa antes del CTA, comparativa de modalidades adaptada a `320 px` sin scroll 2D, estado `Agotado`/`Cerrado` honesto sin CTA engañoso, y botón `Guardar reto` (`AC-J02-04`) con redirección `returnTo` para `ANONYMOUS` hacia `/entrar`.                                           | Sin botón de dorsal digital; sin lista de espera; sin glifos Unicode de iconos (`♡`, `⌂`, `⌕`, `◉`, `⚙`).    |
| **F3. Acceso, perfil sin documento sensible y consentimiento (`J03`)**   | `AC-J03-01`, `AC-J03-02`, `AC-J03-03`, `AC-J03-04` (`+ AC-J03-05`)                           | `/entrar`, `/registro`, `/recuperar-acceso` (copy no enumerador) y `/perfil` (edición segura, bloque RGPD export/borrado, cero campos de DNI/salud).                                                                                                                                                                | Cero campos `DNI`/`NIE`/pasaporte (`blocked_by_D1_09`) y cero campos clínicos/biométricos.                   |
| **F4. Wizard de inscripción en 4 etapas y estados de pago test (`J04`)** | `AC-J04-01`, `AC-J04-02`, `AC-J04-04`, `AC-J04-06`, `AC-J04-07`, `AC-J04-08` (`+ AC-J04-03`) | `/inscripciones/:eventId/modalidad` -> `/datos` (precarga revisable) -> `/revision` (desglose `EUR`, consentimientos, botón `Continuar al pago` o `Confirmar inscripción gratuita` `0,00 EUR`) -> `/pago` (Stripe test) -> `/resultado` (`CONFIRMED`, `PENDING_PAYMENT`, `FAILED` + reintento, `409` última plaza). | Sin cupones promocionales, sin pagos reales, sin cesión de dorsal.                                           |
| **F5. Continuidad deportista sin presión competitiva (`J05`)**           | `AC-J05-01`, `AC-J05-02`, `AC-J05-03` (`+ AC-J05-04`, `AC-J05-05`)                           | `/mis-retos` (próximo reto, borradores, `/mis-retos/favoritos` provisional `D1-07`, historial), `/trayectoria` (métricas explicables + _empty state_).                                                                                                                                                              | Sin niveles/insignias/sellos/rankings ni wearables.                                                          |
| **F6. Workspace organizador `/pro` (`J06`–`J07`)**                       | `AC-J06-01..03`, `AC-J06-05..06`, `AC-J07-01..03`, `AC-J07-05` (`+ AC-J06-04`, `AC-J07-04`)  | `/pro`, `/pro/eventos/nuevo`, `/pro/eventos/:eventId` (editor, checklist `422`, preview), `/participantes` (filtros, CSV seguro), `/comunicaciones` (preview + confirmación briefing), `/analitica` (KPIs modo `test`).                                                                                             | Sin autoalta abierta de organizadores; sin facturación fiscal, payouts ni cronometraje en vivo.              |
| **F7. Soporte mínimo acotado (`J08`)**                                   | `AC-J08-02`, `AC-J08-03`, `AC-J08-04` (`+ AC-J08-01`)                                        | Entrada `/soporte` (provisional `D1-07`) con búsqueda únicamente por ID exacto + campo `reason` obligatorio + advertencia de solo lectura en pagos/cupos.                                                                                                                                                           | Sin buscador abierto por nombre/email ni botón de impersonación.                                             |

### 3.2 Invariantes funcionales y máquinas de estado para el modelo de dominio (`P1-008`)

El arquitecto de dominio (`P1-008`) debe implementar sin relajación las siguientes invariantes y transiciones verificables (conectadas a `SYSTEM_ARCHITECTURE.md` §3–§4):

| Invariante / Regla de Dominio                                               | Criterios `AC` que la exigen                                                 | Exigencia exacta para `P1-008` y `P2-002+`                                                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`INV-01` Aislamiento multi-tenant y RBAC `deny-by-default`**              | `AC-J06-01`, `AC-J06-04`, `AC-J07-01`, `AC-J07-03`, `AC-J07-04`, `AC-J08-01` | `OrganizationMembership.status = 'ACTIVE'` y `org_role` validados en caso de uso; protección del último `ORG_OWNER`; notas privadas aisladas en `EventPrivateOps`; segunda barrera `FORCE ROW LEVEL SECURITY`.                                                                                 |
| **`INV-02` Checklist de publicación y máquina de estados `Event`**          | `AC-J01-04`, `AC-J06-02`, `AC-J06-03`, `AC-J06-05`, `AC-J06-06`              | Transiciones válidas: `DRAFT -> PUBLISHED` (checklist completo `422`), `DRAFT -> CANCELLED`, `PUBLISHED -> DRAFT` (`0` reservas `409`), `PUBLISHED -> CLOSED`, `PUBLISHED/CLOSED -> CANCELLED` (`reason`), `CLOSED -> COMPLETED`; bloqueo `409` al reducir cupo o mutar tarifas con inscritos. |
| **`INV-03` Cero sobreventa y unicidad de inscripción activa**               | `AC-J02-03`, `AC-J04-01`, `AC-J04-04`, `AC-J04-06`                           | `SELECT ... FOR UPDATE` sobre `EventModality`; `CHECK (reserved_count <= capacity_limit)`; TTL `15 min` en `PENDING_PAYMENT` con liberación compensatoria; unicidad de inscripción activa (`PENDING_PAYMENT`/`CONFIRMED`) por `(user_id, event_modality_id)`.                                  |
| **`INV-04` Cálculo server-side `EUR` en céntimos enteros**                  | `AC-J04-02`, `AC-J04-04`, `AC-J07-02`, `AC-J08-04`                           | Todos los importes `INTEGER >= 0`, `currency = 'EUR'`; recálculo desde `PriceTier` vigente en BD; rechazo/ignorado de importes cliente; conciliación `Registration.total_cents === Payment.amount_cents`.                                                                                      |
| **`INV-05` Idempotencia webhooks Stripe y outbox `Resend`**                 | `AC-J04-05`, `AC-J04-08`, `AC-J07-05`                                        | `Payment.idempotency_key UNIQUE`, `PaymentWebhookEvent.provider_event_id UNIQUE ON CONFLICT DO NOTHING`, transiciones monótonas _out-of-order_, `CommunicationLog.idempotency_key UNIQUE` insertado en la misma TX de confirmación.                                                            |
| **`INV-06` Coherencia `CONFIRMED` <-> `Payment SUCCEEDED` o `0 EUR`**       | `AC-J04-04`, `AC-J04-07`, `AC-J08-04`                                        | Prohibida transición `DRAFT/PENDING_PAYMENT -> CONFIRMED` sin `Payment.status = 'SUCCEEDED'` salvo modalidad gratuita explícita (`total_cents === 0`); pantalla `/resultado` lee BD, nunca URL.                                                                                                |
| **`INV-07` Anonimización RGPD y preservación contable/auditoría (`BR-01`)** | `AC-J03-04`, `AC-J03-05`, `AC-J06-06`, `AC-J07-03`, `AC-J08-02`              | `ConsentRecord` append-only; `AuditLog` `INSERT`-only sin PII; borrado RGPD con `auth_time <= 15 min` anonimiza `User` (`@anon.oak.invalid`) y `RegistrationParticipant`, borra `AthleteProfile`/`Favourite`/`DRAFT` y preserva `Registration`/`Payment`/`ConsentRecord`/`AuditLog`.           |
| **`INV-08` Trayectoria derivada de solo lectura**                           | `AC-J05-01`, `AC-J05-02`, `AC-J05-03`, `AC-J05-05`                           | Agregados (`retos`, `km`, `localidades`) calculados en servidor únicamente sobre `Registration(CONFIRMED)` + `Event(COMPLETED)`, sin setters cliente ni datos clínicos.                                                                                                                        |
| **Idempotencia de `Favourite` y seguridad `returnTo`**                      | `AC-J02-04`                                                                  | `UNIQUE (user_id, event_id)` en `Favourite` (`ON CONFLICT DO NOTHING`); validación allowlist de rutas internas en `returnTo` anti-_open redirect_.                                                                                                                                             |
| **Higiene de medios (`EventMedia`) y CSV Export**                           | `AC-J02-05`, `AC-J06-02`, `AC-J07-03`                                        | Allowlist `webp`/`avif`/`jpeg`/`png` `<= 5 MB`, magic bytes, limpieza EXIF, **SVG prohibido**; CSV UTF-8 prefijado con `'` para `=`, `+`, `-`, `@`, `\t`, `\r` + `AuditLog`.                                                                                                                   |

### 3.3 Frontera abierta `D1` (`PENDING USER VALIDATION`) y valores por defecto recomendados

Ningún criterio aquí especificado auto-aprueba `D1-01..D1-14`. Los siguientes puntos quedan etiquetados como **`[CANDIDATO_D1]`** para su ratificación o ajuste por el usuario en **`P1-012` (`Gate D1`)**:

| Ítem `D1`             | Aspecto en `FUNCTIONAL_ACCEPTANCE_CRITERIA.md`                                                                                           | Valor por defecto recomendado para `P1-007` / `P1-008` / `P1-010`                                                                                                                           | Estado en `P1-003`        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **`D1-05` / `D1-11`** | Estados semánticos UI (`success`, `warning`, `danger`, `disabled`), gráficos `viz.*` y librería SVG                                      | Uso obligatorio de icono SVG + texto + etiqueta `es-ES` sin depender del color y sin glifos Unicode.                                                                                        | `PENDING USER VALIDATION` |
| **`D1-06`**           | Política lingüística `es-ES` y promesa/firma (`AC-J02-05`)                                                                               | Interfaz 100 % `es-ES`; mantener texto maestro en inglés o su equivalente aprobado tras decisión `D1-06`.                                                                                   | `PENDING USER VALIDATION` |
| **`D1-07`**           | Rutas y subvistas concretas (`AC-J02-04`, `AC-J05-*`, `AC-J08-*`, `AC-J04-01`)                                                           | **`/mis-retos/favoritos`** y **`/soporte`** (más etapas `/inscripciones/:eventId/*`) alineados con `P1-004` (`INFORMATION_ARCHITECTURE_AND_ROUTES.md`).                                     | `PENDING USER VALIDATION` |
| **`D1-08`**           | Políticas finas de cancelación, reembolso, facturación y validación visual 4 etapas (`AC-J02-01`, `AC-J04-01`, `AC-J04-07`, `AC-J06-06`) | Flujo visual de 4 etapas; resumen de política en ficha y cancelación auditada con `reason` obligatorio (`CANCELLED` / `REFUNDED` vía pasarela).                                             | `PENDING USER VALIDATION` |
| **`D1-09`**           | Perfil, edad mínima/menores, textos legales de consentimiento y bloqueo de documento/salud (`AC-J03-02`, `AC-J03-04`, `AC-J05-05`)       | Mantener **`blocked_by_D1_09`** (`document_type`/`document_number = null` y `0` datos clínicos/salud); validar `birth_date` opcional con criterio adulto por defecto hasta definir menores. | `PENDING USER VALIDATION` |
| **`D1-10`**           | Campos detallados opcionales de evento y permiso CSV de `ORG_VIEWER` (`AC-J06-02`, `AC-J06-04`, `AC-J07-03`)                             | Exigir campos mínimos de `oak-seed.v1` + `EventPrivateOps` aislado; restringir CSV export a `ORG_OWNER`/`ORG_MANAGER` (`403` para `ORG_VIEWER`).                                            | `PENDING USER VALIDATION` |
| **`D1-12`**           | Procedencia, derechos y pipeline AVIF/WebP de `EventMedia` (`AC-J02-05`, `AC-J06-02`)                                                    | Prohibidos PNG de decks; exigir variantes `AVIF`/`WebP` (`<= 350 KB` hero / `<= 40 KB` thumb) con `rights_owner` y `provenance_note`.                                                       | `PENDING USER VALIDATION` |

### 3.4 Matriz maestra de trazabilidad y checklist de verificación (`AC-01`..`AC-04`)

#### A. Cobertura integral `44/44` AC -> Entidades -> `CL` -> `NFR` -> `NT` -> Nivel de prueba `P1-010`

| ID AC       | Prio | Rutas principales                                                                     | Entidades (`16/16`)                                                                                                                                                    | `CL-*` (`28/28`)                            | `NFR-*` (`9/9`)              | `NT-*` (`17/17`)                   | Niveles `P1-010` / `P1-007`                                           |
| ----------- | ---- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------- | ---------------------------------- | --------------------------------------------------------------------- |
| `AC-J01-01` | `P0` | `/`, `/explorar`                                                                      | `Event`, `EventModality`, `PriceTier`, `EventMedia`, `Organization`                                                                                                    | `CL-06`, `CL-28`                            | `NFR-03`, `NFR-06`, `NFR-07` | `NT-09`                            | Integration, E2E, Prototipo `P0`                                      |
| `AC-J01-02` | `P0` | `/explorar`                                                                           | `Event`, `EventModality`                                                                                                                                               | `CL-06`                                     | `NFR-04`, `NFR-07`           | —                                  | Unit, Integration, E2E, Prototipo `P0`                                |
| `AC-J01-03` | `P1` | `/explorar?...`                                                                       | `Event`, `EventModality`                                                                                                                                               | `CL-04`, `CL-06`                            | `NFR-03`, `NFR-04`           | `NT-11`, `NT-12`                   | E2E (back/forward)                                                    |
| `AC-J01-04` | `P0` | `/`, `/explorar`, `/retos/:eventSlug`                                                 | `Event`, `EventModality`                                                                                                                                               | `CL-02`, `CL-03`                            | `NFR-03`                     | `NT-09`                            | Unit, Integration + RLS, E2E, Prototipo `P0`                          |
| `AC-J01-05` | `P1` | `/`, `/explorar`                                                                      | `Event`, `EventModality`, `PriceTier`                                                                                                                                  | `CL-06`, `CL-28`                            | `NFR-04`, `NFR-06`           | `NT-13`                            | E2E, A11y                                                             |
| `AC-J01-06` | `P0` | `/`, `/explorar` (`320 px`)                                                           | `Event`                                                                                                                                                                | `CL-27`                                     | `NFR-04`, `NFR-09`           | —                                  | E2E (`5` viewports + teclado), `axe` + `NVDA`/móvil, Prototipo `P0`   |
| `AC-J02-01` | `P0` | `/retos/:eventSlug`                                                                   | `Event`, `Organization`, `EventModality`, `PriceTier`, `EventMedia`                                                                                                    | `CL-02`                                     | `NFR-03`, `NFR-04`           | `NT-01`, `NT-09`                   | Integration, E2E, Prototipo `P0`                                      |
| `AC-J02-02` | `P0` | `/retos/:eventSlug`                                                                   | `EventModality`, `PriceTier`                                                                                                                                           | `CL-02`, `CL-27`                            | `NFR-04`, `NFR-09`           | —                                  | Integration, E2E (`320 px`), Prototipo `P0`                           |
| `AC-J02-03` | `P0` | `/retos/:eventSlug`, `/inscripciones/:eventId/*`                                      | `Event`, `EventModality`, `Registration`                                                                                                                               | `CL-02`, `CL-03`                            | `NFR-03`                     | `NT-16`                            | Unit, Integration, E2E, Prototipo `P0`                                |
| `AC-J02-04` | `P1` | `/explorar`, `/retos/:eventSlug`, `/entrar`, `/mis-retos/favoritos` _(prov. `D1-07`)_ | `Favourite`, `Event`, `User`                                                                                                                                           | `CL-04`, `CL-05`                            | `NFR-03`, `NFR-04`           | `NT-02`, `NT-09`, `NT-12`          | Unit, Integration + RLS, E2E, Prototipo (`D0`)                        |
| `AC-J02-05` | `P1` | `/`, `/explorar`, `/retos/:eventSlug`                                                 | `Event`, `EventMedia`                                                                                                                                                  | `CL-22`                                     | `NFR-04`, `NFR-06`           | `NT-11`                            | Unit, E2E, Visual Review                                              |
| `AC-J03-01` | `P0` | `/registro`, `/entrar`, `/recuperar-acceso`                                           | `User`, `ConsentRecord`                                                                                                                                                | `CL-28`                                     | `NFR-03`, `NFR-04`           | `NT-09`, `NT-12`, `NT-13`          | Unit, Integration, Contract, E2E, DAST, Prototipo `P0`                |
| `AC-J03-02` | `P0` | `/perfil`                                                                             | `AthleteProfile` (`blocked_by_D1_09`)                                                                                                                                  | `CL-16`, `CL-17`                            | `NFR-03`, `NFR-04`           | `NT-02`, `NT-11`                   | Unit, Integration + RLS, E2E, Prototipo `P0`                          |
| `AC-J03-03` | `P0` | `/inscripciones/:eventId/datos`, `/revision`                                          | `AthleteProfile`, `RegistrationParticipant`, `User`                                                                                                                    | `CL-08`, `CL-16`                            | `NFR-03`, `NFR-04`           | `NT-02`                            | Integration, E2E, Prototipo `P0`                                      |
| `AC-J03-04` | `P0` | `/registro`, `/inscripciones/:eventId/revision`, `/perfil`                            | `ConsentRecord`                                                                                                                                                        | `CL-18`                                     | `NFR-03`, `NFR-04`           | `NT-02`, `NT-14`                   | Integration (append-only), E2E, Prototipo `P0`                        |
| `AC-J03-05` | `P1` | `/perfil`                                                                             | `User`, `AthleteProfile`, `ConsentRecord`, `Favourite`, `Registration`, `RegistrationParticipant`, `Payment`, `OrganizationMembership`, `CommunicationLog`, `AuditLog` | `CL-18`, `CL-20`                            | `NFR-03`, `NFR-04`           | `NT-14`, `NT-17`                   | Integration (re-auth + anonimización), E2E, Sec                       |
| `AC-J04-01` | `P0` | `/inscripciones/:eventId/{modalidad,datos,revision,pago,resultado}`                   | `Registration`, `RegistrationParticipant`, `ConsentRecord`, `Event`                                                                                                    | `CL-04`, `CL-07`                            | `NFR-03`, `NFR-04`           | `NT-02`, `NT-12`                   | Integration, E2E, Prototipo `P0`                                      |
| `AC-J04-02` | `P0` | `/inscripciones/:eventId/{modalidad,revision,pago,resultado}`                         | `PriceTier`, `Registration`                                                                                                                                            | `CL-08`, `CL-12`, `CL-13`                   | `NFR-02`, `NFR-04`           | `NT-07`                            | Unit (`100%` ramas), E2E, Prototipo `P0`                              |
| `AC-J04-03` | `P1` | `/inscripciones/:eventId/*`, `/mis-retos`                                             | `Registration`, `RegistrationParticipant`, `PriceTier`                                                                                                                 | `CL-08`                                     | `NFR-03`, `NFR-04`           | `NT-02`                            | Integration, E2E cross-session                                        |
| `AC-J04-04` | `P0` | `/inscripciones/:eventId/revision`, `/pago`                                           | `Event`, `EventModality`, `PriceTier`, `Registration`, `Payment`, `CommunicationLog`                                                                                   | `CL-01`, `CL-08`, `CL-09`, `CL-12`, `CL-13` | `NFR-01`, `NFR-02`, `NFR-03` | `NT-04`, `NT-07`, `NT-10`, `NT-13` | Unit (`100%` ramas), Integration, Contract, Prototipo `P0`            |
| `AC-J04-05` | `P0` | `/inscripciones/:eventId/pago`, `POST /api/webhooks/stripe`                           | `Payment`, `PaymentWebhookEvent`, `Registration`, `CommunicationLog`, `AuditLog`                                                                                       | `CL-10`, `CL-14`, `CL-15`                   | `NFR-02`, `NFR-03`, `NFR-05` | `NT-05`, `NT-06`, `NT-14`          | Unit (`100%` ramas), Integration (`20x`), Load, Sec                   |
| `AC-J04-06` | `P0` | Reserva / confirmación última plaza                                                   | `EventModality`, `Registration`, `Payment`                                                                                                                             | `CL-01`, `CL-09`                            | `NFR-01`, `NFR-05`           | `NT-04`                            | Integration (`25` paralelas), Load, Prototipo `P0` (`409`)            |
| `AC-J04-07` | `P0` | `/inscripciones/:eventId/resultado`                                                   | `Registration`, `Payment`, `Event`, `EventModality`                                                                                                                    | `CL-09`, `CL-10`, `CL-11`                   | `NFR-02`, `NFR-04`, `NFR-05` | `NT-02`, `NT-10`, `NT-16`          | Unit, Integration, E2E (éxito/fallo/cancel/reintento), Prototipo `P0` |
| `AC-J04-08` | `P0` | `/inscripciones/:eventId/resultado`, `/mis-retos`, Resend sandbox                     | `Registration`, `CommunicationLog`                                                                                                                                     | `CL-12`, `CL-14`, `CL-15`                   | `NFR-02`, `NFR-05`           | `NT-17`                            | Integration (outbox), E2E, Prototipo `P0`                             |
| `AC-J05-01` | `P0` | `/mis-retos`, `/mis-retos/favoritos` _(prov. `D1-07`)_, `/trayectoria`                | `Registration`, `Event`, `EventModality`, `Favourite`                                                                                                                  | `CL-19`                                     | `NFR-03`, `NFR-04`           | `NT-02`                            | Integration, E2E, Prototipo `P0`                                      |
| `AC-J05-02` | `P0` | `/mis-retos`                                                                          | `Registration`, `Event`, `EventModality`                                                                                                                               | `CL-02`, `CL-15`                            | `NFR-04`, `NFR-07`           | `NT-02`                            | Integration + RLS, E2E, Prototipo `P0`                                |
| `AC-J05-03` | `P0` | `/trayectoria`                                                                        | `Registration`, `Event`, `EventModality`                                                                                                                               | `CL-19`                                     | `NFR-03`, `NFR-04`           | `NT-02`                            | Unit (`100%` cálculo), Integration, E2E, Prototipo `P0`               |
| `AC-J05-04` | `P1` | `/mis-retos`, `/mis-retos/favoritos` _(prov. `D1-07`)_, `/trayectoria`                | `Registration`, `Favourite`                                                                                                                                            | `CL-19`                                     | `NFR-04`                     | —                                  | E2E (`athlete-nuevo-sin-retos`), A11y                                 |
| `AC-J05-05` | `P1` | `/mis-retos`, `/trayectoria`, `/perfil`                                               | `AthleteProfile` (`blocked_by_D1_09`), proyección `journey`                                                                                                            | `CL-17`, `CL-19`                            | `NFR-03`, `NFR-04`           | —                                  | Unit/Schema check, E2E, Revisión `D1-09`                              |
| `AC-J06-01` | `P0` | `/pro/**`, flujo invitación cerrada                                                   | `Organization`, `OrganizationMembership`, `Event`, `AuditLog`                                                                                                          | `CL-20`, `CL-21`                            | `NFR-03`, `NFR-04`           | `NT-01`, `NT-03`, `NT-09`          | Unit (`100%` authz), Integration + RLS, E2E, Prototipo `P0`           |
| `AC-J06-02` | `P0` | `/pro/eventos/nuevo`, `/pro/eventos/:eventId`                                         | `Event`, `EventPrivateOps`, `EventMedia`, `EventModality`, `PriceTier`                                                                                                 | `CL-22`                                     | `NFR-03`, `NFR-04`           | `NT-01`, `NT-03`, `NT-11`          | Unit, Integration (upload sin SVG/EXIF), E2E, Prototipo `P0`          |
| `AC-J06-03` | `P0` | `/pro/eventos/:eventId` (checklist publicación)                                       | `Event`, `EventModality`, `PriceTier`, `EventMedia`, `AuditLog`                                                                                                        | `CL-22`                                     | `NFR-03`, `NFR-04`           | `NT-01`, `NT-03`, `NT-16`          | Unit (`100%` ramas), Integration (`422`), E2E, Prototipo `P0`         |
| `AC-J06-04` | `P1` | `/pro/eventos/:eventId` (preview) vs `/retos/:eventSlug`                              | `Event`, `EventModality`, `PriceTier`, `EventMedia`, `Organization`                                                                                                    | `CL-22`                                     | `NFR-03`, `NFR-04`           | `NT-01`, `NT-09`                   | Integration, E2E                                                      |
| `AC-J06-05` | `P0` | `/pro/eventos/:eventId`                                                               | `Event`, `EventModality`, `PriceTier`, `Registration`, `AuditLog`                                                                                                      | `CL-23`                                     | `NFR-03`, `NFR-04`           | `NT-16`                            | Unit (`100%` ramas), Integration (`409`), E2E, Prototipo `P0`         |
| `AC-J06-06` | `P0` | `/pro/eventos`, `/pro/eventos/:eventId`                                               | `Event`, `OrganizationMembership`, `AuditLog`                                                                                                                          | `CL-22`, `CL-23`                            | `NFR-03`, `NFR-04`           | `NT-03`, `NT-14`, `NT-16`          | Unit (`100%` estados), Integration, E2E, Prototipo `P0`               |
| `AC-J07-01` | `P0` | `/pro`, `/pro/eventos/:eventId/participantes`                                         | `OrganizationMembership`, `Event`, `EventModality`, `Registration`, `RegistrationParticipant`                                                                          | `CL-21`, `CL-24`                            | `NFR-03`, `NFR-04`, `NFR-07` | `NT-01`, `NT-03`, `NT-13`          | Integration + RLS, E2E, Prototipo `P0`                                |
| `AC-J07-02` | `P0` | `/pro`, `/pro/eventos/:eventId/analitica`                                             | `EventModality`, `Registration`, `Payment`                                                                                                                             | `CL-24`                                     | `NFR-02`, `NFR-04`           | `NT-01`, `NT-03`                   | Unit, Integration (reconciliación), E2E, Prototipo `P0`               |
| `AC-J07-03` | `P0` | `/pro/eventos/:eventId/participantes` (CSV)                                           | `Registration`, `RegistrationParticipant`, `AuditLog`                                                                                                                  | `CL-24`                                     | `NFR-03`, `NFR-04`           | `NT-01`, `NT-03`, `NT-08`, `NT-14` | Unit (`'`), Integration, E2E, Prototipo `P0`                          |
| `AC-J07-04` | `P1` | `/pro/eventos/:eventId/comunicaciones`                                                | `Event`, `Registration`, `CommunicationLog`, `AuditLog`                                                                                                                | `CL-25`                                     | `NFR-03`, `NFR-04`           | `NT-01`, `NT-03`                   | Integration, E2E                                                      |
| `AC-J07-05` | `P0` | `/pro/eventos/:eventId/comunicaciones`                                                | `CommunicationLog`                                                                                                                                                     | `CL-25`                                     | `NFR-03`, `NFR-04`           | `NT-17`                            | Unit (`100%` ramas), Integration (idempotencia), E2E, Prototipo `P0`  |
| `AC-J08-01` | `P1` | `/soporte` _(prov. `P1-004` / `D1-07`)_                                               | `User`, `Registration`, `Event`, `EventModality`, `Payment`, `AuditLog`                                                                                                | `CL-26`                                     | `NFR-03`, `NFR-04`           | `NT-15`                            | Integration + RLS, E2E, Sec                                           |
| `AC-J08-02` | `P0` | `/soporte` _(prov. `P1-004` / `D1-07`)_                                               | `AuditLog`                                                                                                                                                             | `CL-26`                                     | `NFR-03`, `NFR-04`, `NFR-08` | `NT-14`, `NT-15`                   | Unit, Integration (`INSERT`-only + `0` PII), E2E, Prototipo `P0`      |
| `AC-J08-03` | `P0` | `identity`, `/soporte` _(prov. `P1-004` / `D1-07`)_                                   | `User`, `AuditLog`                                                                                                                                                     | `CL-26`                                     | `NFR-03`                     | `NT-15`                            | Unit, Integration, Sec/DAST, Prototipo `P0`                           |
| `AC-J08-04` | `P0` | `/soporte` _(prov. `P1-004` / `D1-07`)_, `payments`, `registration`                   | `Payment`, `Registration`, `EventModality`, `AuditLog`                                                                                                                 | `CL-26`                                     | `NFR-02`, `NFR-03`, `NFR-08` | `NT-15`, `NT-16`                   | Unit, Integration, Sec, Prototipo `P0`                                |

#### B. Checklist de verificación completa de `P1-003` (`AC-01`..`AC-04`)

- **Cobertura de criterios funcionales:** `44/44` IDs exactos (`AC-J01-01..06` [6], `AC-J02-01..05` [5], `AC-J03-01..05` [5], `AC-J04-01..08` [8], `AC-J05-01..05` [5], `AC-J06-01..06` [6], `AC-J07-01..05` [5], `AC-J08-01..04` [4]) con escenarios `Dado / Cuando / Entonces` felices, negativos, de autorización y de accesibilidad.
- **Inclusión y exclusiones `D0`:** Favoritos (`AC-J02-04`) incluido con sesión, `returnTo` seguro e idempotencia; `0` criterios positivos para ninguna de las `15` exclusiones `Out-of-Scope V1` (sin mapa interactivo, sin dorsal digital, sin wearables, sin IA, sin red social, sin pagos `live`).
- **Cobertura transversal:** `28/28` casos límite (`CL-01..CL-28`), `16/16` entidades mínimas (+ `EventPrivateOps`), `9/9` requisitos no funcionales (`NFR-01..NFR-09`) y `17/17` pruebas negativas de seguridad (`NT-01..NT-17`) explícitamente trazados.
- **Frontera `D1` y coordinación `P1-004`:** Rutas `/mis-retos/favoritos` y `/soporte` marcadas expresamente como **referencias funcionales provisionales alineadas con `P1-004` (`INFORMATION_ARCHITECTURE_AND_ROUTES.md`) y sujetas a ratificación formal en `D1-07` (`P1-012`)**; ítems `D1-05..D1-12` marcados como `[CANDIDATO_D1]` (`PENDING USER VALIDATION`) y campos sensibles/clínicos con **`blocked_by_D1_09`**.
- **Higiene de datos y marca:** `0` PII real, `0` direcciones de correo fuera de `.invalid` (`@oak-demo.invalid` / `@anon.oak.invalid`), `0` secretos literales y `0` ocurrencias de los `8` términos ilustrativos catalogados en `V1_SCOPE_AND_EXCLUSIONS.md` §5.3 y `BANNED_DECK_TERMS` (`data/fixtures/schema.ts`).
