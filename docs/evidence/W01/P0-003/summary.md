# Evidencia P0-003 — ADRs de Arquitectura, Comandos Canónicos, Integraciones y Presupuestos

- **Task ID:** `P0-003`
- **Owner:** `arquitecto-seguridad` (`ARCH`)
- **Reviewers designados:** `devops-release`, `backend-datos`
- **Guardian:** `release-guardian`
- **Rama:** `feat/p0-003-architecture-adrs`
- **Base SHA:** `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`
- **Fecha UTC:** `2026-11-18T21:30:00Z`

## 1. Alcance entregado

Se han redactado y verificado los cuatro Architecture Decision Records (`ADR-001` a `ADR-004`) y la arquitectura de referencia (`SYSTEM_ARCHITECTURE.md`) requeridos para habilitar `P0-004` (inicialización de aplicación y scripts), `P0-005` (CI), `P0-009` (dataset y cuentas demo) y el avance hacia `G0`:

1. [`docs/adr/ADR-001-stack-and-modular-monolith.md`](../../../adr/ADR-001-stack-and-modular-monolith.md):
   - Stack de **53 paquetes/herramientas** con versiones exactas fijadas `X.Y.Z` sin rangos flotantes, compatibles con **Node `24.16.0` LTS** y **`corepack` `0.35.0`** (`pnpm@10.34.9`, `next@16.4.6`, `react@19.3.1`, `typescript@5.9.3`, `tailwindcss@4.3.5`, `radix-ui@1.8.1`, `lucide-react@1.75.0`, `zod@4.6.7`, `vitest@5.1.1`, `@playwright/test@1.65.1`, `@axe-core/playwright@4.14.0`, `eslint@9.39.5`, `prettier@3.10.1`, `@supabase/supabase-js@2.119.1`, `pg@8.23.1`, `stripe@23.1.0`, `resend@6.39.0`, `@sentry/nextjs@11.14.0`, `secretlint@14.0.1`, `autocannon@9.0.0`, `@lhci/cli@0.16.1`, `@cyclonedx/cdxgen@12.9.2`, `@electric-sql/pglite@0.5.16`).
   - Motivo técnico verificado para fijar `pnpm@10.34.9` (`bin/pnpm.cjs` soportado por `corepack 0.35.0`), `typescript@5.9.3` (`typescript-eslint` `<6.1.0` y `msw` `>=5.9.x`), `eslint@9.39.5` (peers de `eslint-config-next@16.4.6`), `auto-install-peers=true` en `.npmrc`, eliminación de `@secretlint/secretlint-rule-preset-recommend` (incluido nativamente en `secretlint@14.0.1`) y uso directo de `@electric-sql/pglite@0.5.16` sin `pglite-socket`.
   - Arquitectura de monolito modular único desplegable (`BR-01`, prohibición de microservicios, colas distribuidas y Kubernetes en V1).
   - Estrategia estratificada y fail-closed para PostgreSQL/Supabase efímero en `G3` ante la ausencia local de `docker` y `supabase` CLI globales (`supabase start` / Postgres 17 efímero en CI o Docker local para certificación `G3 PASS`; `@electric-sql/pglite` únicamente como pre-validación dev local etiquetada `NO_CERTIFIES_G3`).
2. [`docs/adr/ADR-002-canonical-commands-and-environments.md`](../../../adr/ADR-002-canonical-commands-and-environments.md):
   - Mapeo 1 a 1 de los **30/30 tokens canónicos** de `QUALITY_GATES.md §5`: **9 activos en `G0`** (`<INSTALL_LOCKED>`, `<FORMAT_CHECK>`, `<LINT>`, `<TYPECHECK>`, `<UNIT_TEST>`, `<COVERAGE>`, `<BUILD>`, `<SCA>`, `<SECRET_SCAN>`) y **21 fail-closed** (`exit 2 != 0`) hasta su fase de activación, con captura portable de `reports/` vía Node/TS wrapper.
   - Diseño reproducible de `<SECRET_SCAN>` en local sin `gitleaks` preinstalado globalmente (`secretlint@14.0.1` + reglas OAK sobre `git ls-files -z --cached --others --exclude-standard`, más `gitleaks` aditivo cuando exista en `PATH`/CI, nunca `echo ok` ni omitido).
   - Matriz completa de los 4 entornos (`local`, `preview`, `staging`, `producción`), gestión externa de secretos con validación Zod fail-closed (`<DATABASE_URL>`, `<MIGRATION_DATABASE_URL>`, etc.) y recomendación de `.gitattributes` para `P0-004` (`eol=lf` + `sites/** -text` preservando hashes SHA-256 de `P0-001`).
3. [`docs/adr/ADR-003-auth-tenancy-and-integrations.md`](../../../adr/ADR-003-auth-tenancy-and-integrations.md):
   - Auth SSR por cookies `HttpOnly` (`@supabase/ssr`), alta cerrada por invitación para organizadores, re-autenticación reciente para exportación/borrado y MFA admin.
   - RBAC y autorización server-side `deny-by-default` + `FORCE ROW LEVEL SECURITY` preservada mediante pool `pg` confinado en `src/shared/infrastructure/db/` con rol sin `BYPASSRLS` y `withRlsContext` (`SET LOCAL ROLE` + `request.jwt.claims`), políticas corregidas para catálogo `PUBLISHED` e historial inscrito, aislamiento por tabla privada/vista de PII del organizador y prohibición explícita `UI -> tablas`.
   - Inventario contractual de integraciones (Supabase/PostgreSQL `<DATABASE_URL>`, Stripe Checkout modo test con webhooks firmados e idempotentes, Resend sandbox con outbox transaccional, Sentry con scrubber anti-PII) y prohibiciones estrictas (dinero real, payouts, flotantes monetarios, timestamps locales sin UTC, CSV formula injection, PII en logs/fixtures).
4. [`docs/adr/ADR-004-migrations-recovery-and-budgets.md`](../../../adr/ADR-004-migrations-recovery-and-budgets.md):
   - Estrategia `expand/migrate/contract`, compatibilidad `N-1`/`N` y rollback sin pérdida.
   - Seed sintético determinista e idempotente (`P0-009` / `P2-003`) bloqueado en producción.
   - Política de backup/restore (`RPO <= 24h`, `RTO <= 4h` con desglose en minutos) y anonimización RGPD.
   - Presupuestos numéricos explícitos `G0`/`G5`: JS First-Load (`<= 160 KB` público, `<= 190 KB` atleta, `<= 220 KB` `/pro`), transferencia por ruta (`<= 600–900 KB`), CWV p75 (`LCP <= 2.5 s`, `INP <= 200 ms`, `CLS <= 0.1`, `TTFB <= 800 ms`), Lighthouse móvil (`>= 90` perf / `>= 95` a11y), perfil de carga (`20 RPS` sostenidos 5 min, `60 RPS` burst 60 s, `25` paralelas sobre última plaza con `0` sobreventa, `20` webhooks duplicados/desordenados) y SLO API (`p95 <= 500 ms` interno, error rate `5xx <= 0.5%` normal / `<= 1.0%` burst).
5. [`docs/architecture/SYSTEM_ARCHITECTURE.md`](../../../architecture/SYSTEM_ARCHITECTURE.md):
   - Diagrama de 4 capas y dirección de dependencias, catálogo de los 10 módulos de dominio en DAG estrictamente acíclico (`payments -> registration -> communications`, sin ciclos), máquinas de estado (`Event`, `Registration` incluyendo `0 EUR` con `SELECT ... FOR UPDATE` + outbox, `Payment`, `OrganizationMembership`), 8 invariantes (`§7.5`), secuencia de reserva + compensación ante fallo/timeout Stripe (`5s`) + outbox transaccional pre-`COMMIT` en webhook y estructura de directorios objetivo para `P0-004`.

## 2. Trazabilidad de Criterios de Aceptación (`P0-003`)

| AC | Resultado | Evidencia verificada |
|---|---|---|
| `AC-01` | **PASS (candidato a revisión)** | `ADR-001` fija `53` versiones exactas compatibles con Node `24.16.0`/`corepack 0.35.0` (`0` rangos flotantes verificados por script), alternativas evaluadas, criterios de reversibilidad y estrategia de `pnpm`, `<SECRET_SCAN>` y DB efímera `G3`. |
| `AC-02` | **PASS (candidato a revisión)** | `ADR-002` mapea `30/30` tokens canónicos de `QUALITY_GATES.md §5` (`9` activos en `G0` + `21` fail-closed verificados por script), matriz de 4 entornos e inventario de integraciones (`ADR-003`); `ADR-004` define presupuestos cuantitativos explícitos `G0`/`G5`. |
| `AC-03` | **PASS (candidato a revisión)** | `ADR-001..004` y `SYSTEM_ARCHITECTURE.md` prohíben `UI -> tablas`, lógica crítica solo en cliente, secretos en repo, flotantes para moneda y timestamps locales sin UTC, e incluyen condiciones explícitas de invalidación en cada ADR; `0` PII/emails/secretos verificados. |

## 3. Rollback de `P0-003` y Limitaciones Residuales

- **Rollback:** Descartar la rama `feat/p0-003-architecture-adrs` antes del merge, o emitir ADR supercedente si ya estuviera integrado en `master` (invalidando y reabriendo tareas dependientes `P0-004`/`P0-009` según `QUALITY_GATES.md §8`).
- **Riesgos y limitaciones residuales declarados:**
  1. Las comprobaciones de compatibilidad de versiones se verificaron contra metadatos del registro npm (`engines` y `peerDependencies`), pero la instalación real del lockfile (`pnpm install --frozen-lockfile`) no ocurre hasta `P0-004`.
  2. La certificación final `G3` con PostgreSQL 17 / Supabase efímero requiere runner con Docker (CI GitHub Actions o host Docker local); en el host Windows actual sin Docker solo es viable pre-validación local con `pglite`.
  3. `G0` permanece en `FAIL` hasta completar `P0-002`, `P0-004..P0-009` y emitir `P0-010` (`release-guardian`). `D0` y `D1` continúan `PENDING USER VALIDATION`.

