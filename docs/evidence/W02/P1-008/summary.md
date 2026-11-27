# Evidencia P1-008 — Modelo de dominio, relaciones, máquinas de estado e invariantes V1

- **Task ID:** `P1-008`
- **Owner:** `arquitecto-seguridad` (`ARCH` / `SEC`)
- **Peer Reviewer asignado:** `auditor-no-funcional` (`!= arquitecto-seguridad`)
- **Guardian asignado:** `release-guardian`
- **Rama y base:** `feat/p1-008-domain-model-invariants` desde `master @ 07915003f52af1607353d9b629cdefbfeba118f3` (dependencia `P1-003 = ACEPTADA`)
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD (informado en handoff; un commit no puede autoreferenciar su propio SHA; rama feat/p1-008-domain-model-invariants)`
- **Pull Request:** `PR en feat/p1-008-domain-model-invariants hacia master (URL, número y Run ID informados en handoff tras gh pr checks; sin fusionar hasta PEER_REVIEW PASS y veredicto ACEPTADA)`

## 1. Alcance entregado y criterios cubiertos (`AC-01`..`AC-04`)

- **`AC-01` (`10` módulos DAG, `16/16` entidades + `EventPrivateOps`, índices críticos y Value Objects):** `PASS` — [`docs/architecture/DOMAIN_MODEL_AND_INVARIANTS.md`](../../../architecture/DOMAIN_MODEL_AND_INVARIANTS.md) (§2–§3) consolida el grafo acíclico (DAG) de los `10` módulos con propietario único de escritura por agregado, el diagrama Mermaid `erDiagram` (cero etiquetas HTML) y la tabla completa de `PK`, `FK`, restricciones `UNIQUE` e índices críticos (`p95 <= 500 ms`, `ADR-004`) para las **`16/16` entidades mínimas + `EventPrivateOps`** (`ADR-003` §2.2), destacando el índice único parcial de inscripción activa `(user_id, event_modality_id) WHERE status IN ('PENDING_PAYMENT', 'CONFIRMED')`, `Favourite` `PK (user_id, event_id)`, y claves `idempotency_key UNIQUE` / `provider_event_id UNIQUE`. Define todos los Value Objects inmutables (`MoneyEurCents` en `INTEGER >= 0` `'EUR'`, `UtcTimestamp` + `EventTimezone = 'Europe/Madrid'`, `MadridMunicipality` sobre `55` municipios, `Discipline = 'trail' | 'running'`, **`SafeInternalReturnTo` admitiendo exacto `"/"` además de `^\/[a-z0-9]`** con query params `P1-004` §3.4 y `intent=fav&eventId=<uuid>`, `RegistrationCode`, `SafeCsvCell`, `EventMediaRule` sin SVG/EXIF y **`blocked_by_D1_09`**).
- **`AC-02` (`4/4` máquinas de estado con matriz válida/inválida e invariantes `INV-01..INV-12` en 3 capas):** `PASS` — (§4–§6) especifica los diagramas `stateDiagram-v2` (sin HTML) y tablas completas de transiciones válidas e inválidas rechazadas (`400`/`401`/`403`/`404`/`409`/`410`/`422`/`429`) para **`Event`**, **`Registration`**, **`Payment`** y **`OrganizationMembership`**, incluyendo expresamente la guardia `Event.PUBLISHED -> DRAFT` que exige **AMBOS `0` inscripciones `CONFIRMED` y `0` reservas activas `PENDING_PAYMENT`** (`AC-J06-05` `L637`), `SELECT ... FOR UPDATE`, `TTL 15 min` dual (sweeper + liberación bajo demanda), `TX_COMP` (`> 5 s`), `confirmFreeRegistration` (`0 EUR`), outbox `CommunicationLog` en la misma TX y `AuditLog` inmutable sin PII. Detalla **`INV-01..INV-12`** en 3 capas (Dominio/Aplicación, PostgreSQL/Constraints/Locks/`FORCE RLS` y `AuditLog`) con trazabilidad integral a **`44/44` `AC-J01-01..AC-J08-04`**, **`28/28` `CL-01..CL-28`** y **`17/17` `NT-01..NT-17`**.
- **`AC-03` (Frontera `D0`, `blocked_by_D1_09`, cierre técnico para `P1-009` y `D1` no auto-aprobado):** `PASS` — (§7) cierra las decisiones técnicas reversibles para `P1-009` / `P2-002` (unicidad activa parcial, ventana `DRAFT 7/30 días`, estrategia dual `TTL 15 min`, armonización de query params bajo `P1-004` §3.4 y sobre de errores estructurado traducible a `es-ES`), mantiene `0` capacidades `Out-of-Scope V1`, preserva **`blocked_by_D1_09`** (`document_type = null`, `document_number = null`, `0` datos clínicos), prohíbe impersonación silenciosa o mutación directa BD en `ADMIN` (`AC-J08-03..04`), y mantiene **`D1-07..D1-10`** (más `D1-05`, `D1-06`, `D1-11`, `D1-12`) en **`PENDING USER VALIDATION`** hasta `P1-012`.
- **`AC-04` (Calidad, alcance acotado, higiene documental y CI):** `PASS` — Diff acotado exclusivamente a los `5` `allowed_paths` con EOL `LF`, UTF-8 sin BOM, Prettier markdown limpio (`--ignore-path .gitignore`), `0` PII real, `0` correos fuera de `.invalid`, `0` ocurrencias de `BANNED_DECK_TERMS` (`assertNoBannedMockData()` `PASS`), `19/19 MATCH` SHA-256 en `sites/**` y checks locales + PR CI en verde (sin fusionar).

## 2. Verificación técnica y controles ejecutados

- **Checks locales base (`9/9`):** `PASS` (`exit 0`, `0` warnings, `0` skips; detalle en [`commands.txt`](commands.txt)) ejecutados tras la última edición documental con EOL `LF` y Markdown formateado:
  - `corepack pnpm install --frozen-lockfile` (`exit 0`, `+1074 packages` / `Lockfile is up to date`, `pnpm v10.34.9`)
  - `corepack pnpm run format:check` (`exit 0`, `reports/static/prettier.log`) + `corepack pnpm exec prettier --check --ignore-path .gitignore docs/architecture/DOMAIN_MODEL_AND_INVARIANTS.md docs/evidence/W02/P1-008/summary.md docs/evidence/W02/P1-008/approvals.md` (`exit 0`, `All matched files use Prettier code style!`)
  - `corepack pnpm run lint` (`exit 0`, `19` archivos, `0` errors, `0` warnings, `reports/static/eslint.json`)
  - `corepack pnpm run typecheck` (`exit 0`, `tsc --noEmit` `0` errors, `reports/static/tsc.log`)
  - `corepack pnpm run test:unit` (`exit 0`, `5` test files passed, `32/32` tests passed, `0` failed, `0` skipped, `reports/unit/junit.xml`)
  - `corepack pnpm run test:coverage` (`exit 0`, `100 %` en `src/`: `37/37` lines, `38/38` stmts, `9/9` funcs, `23/23` branches, `reports/coverage/coverage-summary.json`)
  - `corepack pnpm run build` (`exit 0`, Next.js `16.4.6` Turbopack, rutas `/`, `/_not-found`, `/api/health`, `reports/build/next-build.log`)
  - `corepack pnpm run security:sca` (`exit 0`, `1301` deps, `high=0, critical=0, moderate=4, low=0`, `reports/security/sca-audit.json`)
  - `corepack pnpm run security:secrets` (`exit 0`, `files=178`, `secretlintFindingsCount=0`, `oakFindingsCount=0`, `gitleaks=NOT_INSTALLED_IN_LOCAL_PATH`, `reports/security/secret-scan.json`; Gitleaks `v8.30.1` obligatorio en PR CI)
- **Controles documentales read-only:** Verificación integral de `16/16` entidades mínimas + `EventPrivateOps`, `10/10` módulos DAG, `4/4` máquinas de estado, `INV-01..INV-12`, `44/44` `AC-*`, `28/28` `CL-*`, `17/17` `NT-*`, guardia `PUBLISHED -> DRAFT` (`0 CONFIRMED` y `0 PENDING_PAYMENT`), `blocked_by_D1_09`, `6` bloques Mermaid sin HTML, `assertNoBannedMockData()` `PASS` (`5/5`), `0` emails fuera de `.invalid`, `0` CRLF / BOM y `19/19 MATCH` SHA-256 sobre `sites/**`.
- **CI GitHub Actions PR:** `Static Quality & Unit Tests`, `Production Build` y `SCA & Secret Scan (Gitleaks)` ejecutados tras push y apertura del PR hacia `master` (sin fusionar).

## 3. Riesgos residuales, rollback y siguiente estado

- **Riesgos residuales:**
  1. Los ítems **`D1-05..D1-12`** (`D1-07` rutas `/mis-retos/favoritos` y `/soporte`, `D1-08` políticas finas de cancelación/reembolso, `D1-09` confirmación de `blocked_by_D1_09` y reglas de menores, `D1-10` campos opcionales y permiso CSV de `ORG_VIEWER`) permanecen en **`PENDING USER VALIDATION`** hasta `P1-012`.
  2. La verificación en runtime PostgreSQL (`FORCE RLS`, `SELECT ... FOR UPDATE` en `25` paralelas, webhooks `20x`, outbox y migración `N-1 -> N`) queda delegada conforme al plan a `P2-002..P2-006` y `P4-003..P4-011` (`G3`/`G5`).
  3. Condición heredada de entorno `G0`: `gitleaks` no está en `PATH` local Windows (`NOT_INSTALLED_IN_LOCAL_PATH`) y se certifica obligatoriamente con `v8.30.1` en CI Linux sobre el PR; persisten avisos `moderate` en devDependencies transitivas (`0` High/Critical en `security:sca`).
- **Rollback:** Cerrar el PR sin fusionar y eliminar la rama `feat/p1-008-domain-model-invariants` (o `git revert` vía PR si hubiera sido integrado), sin impacto en `src/**`, `data/**`, migraciones ni `sites/**`.
- **Estado recomendado siguiente:** `PEER_REVIEW` por **`auditor-no-funcional`** (`!= arquitecto-seguridad`), previo a auditoría final de `release-guardian`.
