# Resumen de entrega P1-003 — Criterios funcionales verificables V1 (`Given / When / Then`)

- **Task ID:** `P1-003`
- **Owner funcional:** `analista-funcional` (`PFA` — autor exclusivo del contenido funcional)
- **Materialización y verificación técnica:** `documentacion-handoff`
- **Peer Reviewer asignado:** `orquestador-oak` (`!= analista-funcional` y `!= documentacion-handoff`)
- **Guardian asignado:** `release-guardian`
- **Rama y base:** `feat/p1-003-functional-ac` desde `master @ cdebd34cc0674f26e8d868437003862b88fb07dd` (dependencia `P1-002 = ACEPTADA`)
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD (informado en handoff; un commit no puede autoreferenciar su propio SHA; rama feat/p1-003-functional-ac)`
- **Pull Request:** `PR en feat/p1-003-functional-ac hacia master (URL, número y Run ID informados en handoff tras gh pr checks; sin fusionar hasta PEER_REVIEW PASS y veredicto ACEPTADA)`

## 1. Alcance funcional entregado y criterios cubiertos (`AC-01`..`AC-04`)

- **AC-01 (`44/44` IDs en formato `Dado / Cuando / Entonces` + `D0`):** `docs/product/FUNCTIONAL_ACCEPTANCE_CRITERIA.md` especifica de forma determinista y verificable la totalidad de los `44` requisitos `AC-J01-01..AC-J08-04` organizados en `8` journeys (`J01` `01..06`, `J02` `01..05`, `J03` `01..05`, `J04` `01..08`, `J05` `01..05`, `J06` `01..06`, `J07` `01..05`, `J08` `01..04`), incluyendo **Favoritos (`AC-J02-04`)** tras `D0 = APPROVED` y con `0` criterios positivos para capacidades `Out-of-Scope V1` (sin mapa interactivo, sin dorsal digital, sin wearables, sin IA, sin pagos `live`).
- **AC-02 (Permisos, invariantes server-side, `CL-01..CL-28` y `16/16` entidades):** Cada criterio declara rutas, roles permitidos y denegados (`401`/`403`/`404`/`409`/`422`/`429`), entidades y campos afectados (`16/16` entidades mínimas + `EventPrivateOps`), escenarios negativos/borde enlazados a **`28/28` casos límite (`CL-01..CL-28`)** y **`17/17` pruebas negativas (`NT-01..NT-17`)**, reglas server-side (`EUR` céntimos enteros, `TIMESTAMPTZ UTC` + `'Europe/Madrid'`, `SELECT ... FOR UPDATE` en `25` paralelas / `1` plaza, TTL `15 min`, `DRAFT 7 días`, idempotencia `Idempotency-Key`/webhooks `20x`/outbox Resend, `auth_time <= 15 min`, CSV `'`, bloqueo **`blocked_by_D1_09`**) y requisitos UI `es-ES` + accesibilidad `WCAG 2.2 AA` (`NFR-04`).
- **AC-03 (Trazabilidad `P1-007`/`P1-008`/`P1-010`, coordinación `P1-004` y frontera `D1`):** La Sección 3 define la tabla de flujos críticos `P0` para el prototipo `P1-007`, la tabla de invariantes `INV-01..INV-08` y máquinas de estado para `P1-008`, y la matriz completa `44/44` AC -> entidades -> `CL` -> `NFR-01..NFR-09` -> `NT-01..NT-17` -> niveles de prueba `P1-010`. Las rutas `/mis-retos/favoritos` y `/soporte` quedan marcadas explícitamente como **referencias funcionales provisionales alineadas con `P1-004` (`INFORMATION_ARCHITECTURE_AND_ROUTES.md`) y sujetas a ratificación formal en `D1-07` (`P1-012`)**, manteniendo `D1-05..D1-12` como `[CANDIDATO_D1]` (`PENDING USER VALIDATION`) y `blocked_by_D1_09` activo.
- **AC-04 (Higiene documental y preparación de handoff):** `0` PII real, `0` correos fuera de sufijo `.invalid` (`@oak-demo.invalid` / `@anon.oak.invalid`), `0` secretos literales y `0` ocurrencias de los `8` términos ilustrativos de `BANNED_DECK_TERMS` (`V1_SCOPE_AND_EXCLUSIONS.md` §5.3).

## 2. Verificación técnica y controles ejecutados

- **Checks locales base (`9/9`):** `PASS` (`exit 0`, `0` warnings, `0` skips; detalle en `commands.txt`) ejecutados tras la última edición documental con EOL `LF` y Markdown formateado:
  - `corepack pnpm install --frozen-lockfile` (`exit 0`, `+1074 packages` / `Lockfile is up to date`, `pnpm v10.34.9`)
  - `corepack pnpm run format:check` (`exit 0`, `reports/static/prettier.log`) + `corepack pnpm exec prettier --check --ignore-path .gitignore docs/product/FUNCTIONAL_ACCEPTANCE_CRITERIA.md docs/evidence/W02/P1-003/summary.md docs/evidence/W02/P1-003/approvals.md` (`exit 0`, `All matched files use Prettier code style!`)
  - `corepack pnpm run lint` (`exit 0`, `19` archivos, `0` errors, `0` warnings, `reports/static/eslint.json`)
  - `corepack pnpm run typecheck` (`exit 0`, `tsc --noEmit` `0` errors, `reports/static/tsc.log`)
  - `corepack pnpm run test:unit` (`exit 0`, `5` test files passed, `32/32` tests passed, `0` failed, `0` skipped, `reports/unit/junit.xml`)
  - `corepack pnpm run test:coverage` (`exit 0`, `100 %` en `src/`: `37/37` lines, `38/38` stmts, `9/9` funcs, `23/23` branches, `reports/coverage/coverage-summary.json`)
  - `corepack pnpm run build` (`exit 0`, Next.js `16.4.6` Turbopack, rutas `/`, `/_not-found`, `/api/health`, `reports/build/next-build.log`)
  - `corepack pnpm run security:sca` (`exit 0`, `1301` deps, `high=0, critical=0, moderate=4, low=0`, `reports/security/sca-audit.json`)
  - `corepack pnpm run security:secrets` (`exit 0`, `files=168`, `secretlintFindingsCount=0`, `oakFindingsCount=0`, `gitleaks=NOT_INSTALLED_IN_LOCAL_PATH`, `reports/security/secret-scan.json`; Gitleaks `v8.30.1` obligatorio en PR CI)
- **Controles documentales read-only (`PASS`, `exit 0`):**
  - Verificados `44/44` IDs `AC-J01-01..AC-J08-04` con bloques `**Dado**` / `**Cuando**` / `**Entonces**` y escenarios negativos, `9/9` `NFR-01..NFR-09`, `28/28` `CL-01..CL-28`, `16/16` entidades mínimas y `17/17` `NT-01..NT-17`.
  - Presencia explícita verificada de `blocked_by_D1_09` (`19` ocurrencias), `[CANDIDATO_D1]` (`24`), `PENDING USER VALIDATION`, nota de coordinación `P1-004` / `D1-07`, `/mis-retos/favoritos` (`19`) y `/soporte` (`27`).
  - `0` correos reales/fuera de `.invalid`, `0` ocurrencias de `BANNED_DECK_TERMS` (Python NFD + `assertNoBannedMockData()` `PASS` sobre los `5` entregables), `0` CRLF / `0` BOM en los `5` `allowed_paths`, diff limitado exclusivamente a los `5` `allowed_paths` y `19/19 MATCH` SHA-256 sobre `sites/**`.
- **CI GitHub Actions PR:** `Static Quality & Unit Tests`, `Production Build` y `SCA & Secret Scan (Gitleaks)` ejecutados tras `git push` y apertura del PR hacia `master` (URL, número de PR, Run ID y `3/3` checks en `PASS` informados en handoff, sin fusionar).

## 3. Riesgos residuales, rollback y siguiente estado

- **Riesgos residuales:**
  1. Las rutas provisionales `/mis-retos/favoritos`, `/soporte` y las etapas de inscripción (`/inscripciones/:eventId/*`) quedan alineadas con `P1-004`, pero requieren ratificación explícita en `D1-07` (`P1-012`) antes de congelarse en `P1-013`.
  2. Los detalles finos de `D1-08` (políticas de cancelación/reembolso), `D1-09` (edad/menores, consentimientos y confirmación de `blocked_by_D1_09`) y `D1-10` (campos opcionales de evento y alcance exacto de `ORG_VIEWER` en export CSV) permanecen `PENDING USER VALIDATION` hasta `P1-012`.
  3. Condición heredada de entorno `G0`: `gitleaks` no está en PATH local Windows y se ejecuta obligatoriamente con `v8.30.1` en CI Linux sobre el PR; persisten `4` avisos `moderate` en devDependencies transitivas (`0` High/Critical).
- **Rollback:** Cerrar el PR sin fusionar y eliminar la rama `feat/p1-003-functional-ac` (o `git revert` vía PR si hubiera sido integrado), sin impacto en `src/**`, migraciones ni `sites/**`.
- **Estado solicitado tras materialización y checks verdes:** `PEER_REVIEW` hacia `orquestador-oak` (`!= analista-funcional` y `!= documentacion-handoff`), previo a auditoría final de `release-guardian`.
