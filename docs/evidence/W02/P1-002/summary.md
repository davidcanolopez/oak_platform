# Resumen de entrega P1-002 — Persona deportista, persona organizador, casos límite y catálogo lógico de datos V1

- **Task ID:** `P1-002`
- **Owner funcional:** `analista-funcional` (`PFA` — autor exclusivo del contenido funcional)
- **Materialización y verificación técnica:** `documentacion-handoff`
- **Peer Reviewer asignado:** `orquestador-oak` (`!= analista-funcional` y `!= documentacion-handoff`)
- **Guardian asignado:** `release-guardian`
- **Rama y base:** `feat/p1-002-personas-data-catalog` desde `master @ 1a22dacb468d141d0e0707540be2d02abda743df` (dependencia `P1-001 = ACEPTADA` desde `db0bfd9499cb32817e1b7a19fb2a76859a520f38`; paquete realineado sin cambios de alcance tras merge de `P1-005`)
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD (informado en handoff; rama feat/p1-002-personas-data-catalog)`
- **Pull Request:** `PR en feat/p1-002-personas-data-catalog hacia master (URL, número y Run ID informados en handoff tras gh pr checks)` (sin fusionar hasta `PEER_REVIEW` PASS y veredicto `ACEPTADA`)

## 1. Alcance funcional entregado y criterios cubiertos (`AC-01`..`AC-04`)

- **AC-01 (Personas operativas V1 y disciplina epistemológica):** `docs/product/PERSONAS_AND_DATA_CATALOG.md` (§1–§2) separa explícitamente `[HIPOTESIS_DE_PRODUCTO]` (pendiente de validación en `P6-007` / `D2` con `>= 5` deportistas y `>= 2` organizadores en `staging`), `[REGLA_CONTRACTUAL_CERRADA]` (`D0`/`ADR`/`P1-001`) y `[CANDIDATO_D1]` (`D1-08`..`D1-10` en `P1-012`), sin entrevistas ni personas reales. Define:
  - **Deportista (`ANONYMOUS` / `ATHLETE`)** con `2` arquetipos sintéticos madrileños (`S-DEP-01` trail de sierra y `S-DEP-02` running popular de iniciación, correos `@oak-demo.invalid`, alineados con `oak-seed.v1`), dispositivos `320 px..1440+ px`, accesibilidad `WCAG 2.2 AA` (teclado, foco `>= 3 px`, `>= 48x48 px`, `zoom 200 %`, lector de pantalla `NVDA` + móvil, `prefers-reduced-motion`, errores en `es-ES`), JTBD, dolores, objeciones de confianza, uso idempotente de **Favoritos (`AC-J02-04`)**, recorrido `J01..J05` y metas cuantitativas (`>= 85 %` completitud E2E, `0` sobreventa).
  - **Organizador por invitación cerrada (`ORG_OWNER`, `ORG_MANAGER`, `ORG_VIEWER`, bloqueo `INVITED`/`REVOKED`)** en clubes/promotores de Madrid, incorporación exclusiva por token `SHA-256` (`72 h`), JTBD, dolores, objeciones, flujo `/pro` (`J06`–`J07`) sin documento sensible hasta `D1-09` ni facturación/cronometraje en vivo, y meta `100 %` de publicación/conciliación/export seguro.
  - **Frontera con Admin / Soporte mínimo (`ADMIN`, `AC-J08-01..04`)** con MFA obligatorio, localización estricta por `registration_id`/`registration_code` sin búsqueda wildcard de PII, `reason` obligatorio en `AuditLog`, prohibición total de impersonación silenciosa y prohibición de alteración directa de pagos o cupos en BD.
- **AC-02 (Catálogo de casos límite `CL-01..CL-28`):** Cobertura verificable de `44/44` AC (`AC-J01-01..AC-J08-04`) y `9/9` NFR (`NFR-01..NFR-09`): concurrencia última plaza (`25` peticiones / `1` plaza -> `1` reserva + `24` `409 CONFLICT`), bloqueo de eventos `CLOSED`/`CANCELLED`/`COMPLETED`/fuera de plazo/`remainingSpots = 0`, anónimo en Favoritos (`AC-J02-04`) o inscripción con `returnTo` anti-_open redirect_ y conservación de filtros URL, recuperación cross-device `DRAFT` (`7 días` / purga `30 días`) y bloqueo de saltos de etapa, retención `PENDING_PAYMENT` (`TTL 15 min`), Stripe `test` fallo/cancelación/timeout (`> 5 s`)/modalidad gratuita `0 EUR`, manipulación de precios cliente rechazada, webhooks duplicados/desordenados/firma inválida y fallo de Resend sandbox sin revertir confirmación, reutilización de `AthleteProfile` con snapshot inmutable en `RegistrationParticipant`, bloqueo `D1-09` de `DNI`/menores/datos clínicos, export/borrado RGPD (`auth_time <= 15 min`) con conservación anonimizada, invitación `72 h` caducada/revocada/cross-tenant y protección de último `ORG_OWNER`, bloqueos `AC-J06-05` con inscritos, checklist `AC-J06-03` con lista exacta de faltantes, CSV anti-_formula injection_ (`'`), paginación `/pro` (`<= 50`), briefing sandbox idempotente, soporte `AC-J08` y degradación UI/accesibilidad.
- **AC-03 (Catálogo lógico de las `16/16` entidades mínimas):** Especificación campo a campo para `User`, `AthleteProfile`, `ConsentRecord`, `Organization`, `OrganizationMembership`, `Event`, `EventModality`, `PriceTier`, `EventMedia`, `Favourite`, `Registration`, `RegistrationParticipant`, `Payment`, `PaymentWebhookEvent`, `CommunicationLog` y `AuditLog` (más nota de separación `EventPrivateOps` por RLS de fila). Todos los campos incluyen tipo/unidad (`EUR` en `INTEGER >= 0` céntimos, `TIMESTAMPTZ UTC` + `Event.timezone = 'Europe/Madrid'`), obligatoriedad (`required` | `optional` | `blocked_by_D1_09`), fuente de verdad, clasificación exacta usando las **`6` clases oficiales (`N1 Pública`, `N2 Interna`, `N3 Confidencial`, `N4 PII`, `N5 Financiera/Pago`, `N6 Secreto`)** de `DATA_CLASSIFICATION_RETENTION.md` §2, retención/anonimización RGPD, tabla resumen de campos bloqueados (`blocked_by_D1_09` y prohibiciones permanentes PCI/secretos), manteniendo `D1-08..D1-10` como `PENDING USER VALIDATION`.
- **AC-04 (Trazabilidad, prohibiciones y preparación de handoff):** Matriz `44/44` AC / `9/9` NFR / `16/16` entidades, frontera `D0` vs `D1` explícita, `0` PII real, `0` correos fuera de `.invalid` y `0` ocurrencias de los `8` términos mock de decks catalogados en `V1_SCOPE_AND_EXCLUSIONS.md` §5.3 (`BANNED_DECK_TERMS`).

## 2. Verificación técnica y controles ejecutados

- **Checks locales base (`9/9`):** `PASS` (`exit 0`, `0` warnings, `0` skips; detalle en `commands.txt`) ejecutados tras la última edición documental con EOL `LF` y Markdown formateado:
  - `corepack pnpm install --frozen-lockfile` (`exit 0`, `+1074 packages` / `Lockfile is up to date`, `pnpm v10.34.9`)
  - `corepack pnpm run format:check` (`exit 0`, `reports/static/prettier.log`) + `corepack pnpm exec prettier --check --ignore-path .gitignore docs/product/PERSONAS_AND_DATA_CATALOG.md` (`exit 0`, `All matched files use Prettier code style!`)
  - `corepack pnpm run lint` (`exit 0`, `19` archivos, `0` errors, `0` warnings, `reports/static/eslint.json`)
  - `corepack pnpm run typecheck` (`exit 0`, `tsc --noEmit` `0` errors, `reports/static/tsc.log`)
  - `corepack pnpm run test:unit` (`exit 0`, `5` test files passed, `32/32` tests passed, `0` failed, `0` skipped, `reports/unit/junit.xml`)
  - `corepack pnpm run test:coverage` (`exit 0`, `100 %` en `src/`: `37/37` lines, `38/38` stmts, `9/9` funcs, `23/23` branches, `reports/coverage/coverage-summary.json`)
  - `corepack pnpm run build` (`exit 0`, Next.js `16.4.6` Turbopack, rutas `/`, `/_not-found`, `/api/health`, `reports/build/next-build.log`)
  - `corepack pnpm run security:sca` (`exit 0`, `1301` deps, `high=0, critical=0, moderate=4, low=0`, `reports/security/sca-audit.json`)
  - `corepack pnpm run security:secrets` (`exit 0`, `files=163`, `secretlintFindingsCount=0`, `oakFindingsCount=0`, `gitleaks=NOT_INSTALLED_IN_LOCAL_PATH`, `reports/security/secret-scan.json`; Gitleaks `v8.30.1` obligatorio en PR CI)
- **Controles documentales read-only (`PASS`, `exit 0`):**
  - Presencia verificada de `16/16` entidades mínimas, `6/6` clases oficiales (`N1 Pública`..`N6 Secreto`), `blocked_by_D1_09` (`7` ocurrencias), `HIPOTESIS_DE_PRODUCTO` (`9` ocurrencias), cobertura `44/44` AC (`AC-J01..AC-J08`) y `9/9` NFR (`NFR-01..NFR-09`).
  - `0` correos reales/fuera de `.invalid`, `0` ocurrencias de `BANNED_DECK_TERMS` (normalizado NFD) en los `5` entregables, `0` CRLF en los `5` `allowed_paths`, diff limitado exclusivamente a los `5` `allowed_paths` y `19/19 MATCH` sobre `sites/**`.
- **CI GitHub Actions PR:** `Static Quality & Unit Tests`, `Production Build` y `SCA & Secret Scan (Gitleaks)` — ejecutados tras `git push` y apertura del PR hacia `master` (URL, número de PR, Run ID y `3/3` checks en `PASS` informados en handoff, sin fusionar).

## 3. Riesgos residuales, rollback y siguiente estado

- **Riesgos residuales:**
  1. Las hipótesis de comportamiento y adopción (`[HIPOTESIS_DE_PRODUCTO]`) no constituyen evidencia empírica hasta su validación formal en `P6-007` / `D2` (`>= 5` deportistas y `>= 2` organizadores en `staging`).
  2. Los ítems `D1-08` (políticas finas de cancelación/reembolso/fallo), `D1-09` (edad/menores, consentimientos y confirmación de no recogida de documento sensible/salud) y `D1-10` (campos finos de evento/organizador) permanecen `PENDING USER VALIDATION` hasta `P1-012`.
  3. Operativos heredados `G0`: `gitleaks` no instalado en PATH Windows local (ejecutado con `v8.30.1` en CI PR Ubuntu) y `4` avisos `moderate` en devDependencies transitivas (`0` High/Critical).
- **Rollback:** Cerrar el PR sin fusionar y eliminar la rama `feat/p1-002-personas-data-catalog` (o `git revert` vía PR si hubiera sido integrado), sin impacto en código de aplicación, migraciones ni `sites/**`.
- **Estado solicitado tras materialización:** `PEER_REVIEW` hacia `orquestador-oak` (`!= analista-funcional` y `!= documentacion-handoff`), previo a auditoría final de `release-guardian`.
