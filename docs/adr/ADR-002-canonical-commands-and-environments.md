# ADR-002: Catálogo de los 30 comandos canónicos, matriz de entornos, secretos y política CRLF/LF

- **Estado:** Propuesto (en revisión independiente por `devops-release` y `backend-datos` para `G0`)
- **Fecha:** 2026-11-18
- **Autores:** `arquitecto-seguridad` (`ARCH`)
- **Paquete:** `P0-003`
- **Fuentes normativas:** `QUALITY_GATES.md` (§3, §5, §6, §7, §8), `MASTER_EXECUTION_PLAN.md` (§6.4, §12), `docs/evidence/W01/P0-001/inventory.json`

## 1. Contexto

`QUALITY_GATES.md §5` define **30 tokens canónicos** (`<INSTALL_LOCKED>` hasta `<ROLLBACK_DRILL>`) que deben quedar mapeados 1 a 1 en comandos reales, no interactivos, reproducibles desde clon limpio y con salida legible por máquina antes de cerrar `G0`.

A la fecha de `P0-003`:
1. No existe aún `package.json` ni código de aplicación (se inicializan en `P0-004`).
2. `gitleaks`, `docker`, `supabase` y `pnpm` globales no están preinstalados en el entorno Windows local (`inventory.json`), donde además `git config core.autocrlf` está en `true`.
3. Solo un subconjunto exacto de **9 comandos** debe ejecutarse en verde (`exit 0`) al finalizar `P0-004` para el cierre de `G0`, mientras que los **21 comandos restantes** (que dependen de DB, API, UI, staging o simulacros de fases 2–7) deben estar registrados y **fallar cerrado (`exit != 0`)** hasta que su paquete correspondiente implemente la capacidad real.

## 2. Decisión: Mapeo 1 a 1 de los 30 comandos canónicos

### 2.1 Reglas generales de ejecución

- Todos los comandos Node/JS se invocan mediante `corepack pnpm ...` (o script de `package.json` ejecutado vía `corepack pnpm run <script>`), garantizando la versión fijada `pnpm@10.34.9` sin exigir instalación global previa.
- Todos los scripts emiten artefactos máquina en `reports/<categoria>/` (ruta excluida en `.gitignore`). Para garantizar portabilidad Windows PowerShell / Linux Bash, los scripts que no disponen de bandera nativa `--output-file` (`format:check`, `typecheck`, `build`) se envuelven en un ejecutor Node/TS (`scripts/ci/run-and-capture.mjs` o configuración `coverage.reportsDirectory: "reports/coverage"` en Vitest) que crea el directorio y escribe el fichero de salida sin depender de redirecciones de shell.
- Ningún comando simula éxito con `echo ok`, `true`, `--passWithNoTests` ni `--force`.

### 2.2 Los 9 comandos ACTIVOS en `G0` (obligatorios `exit 0` desde clon limpio en `P0-004`)

| # | Token canónico (`QUALITY_GATES.md §5`) | Script `package.json` (`P0-004`) | Comando real no interactivo | Artefacto máquina | Criterio de `exit 0` en `G0` |
|---:|---|---|---|---|---|
| 1 | `<INSTALL_LOCKED>` | *(nativo pnpm)* | `corepack pnpm install --frozen-lockfile` | `pnpm-lock.yaml` + log CI | Instala exactamente el lockfile sin modificarlo |
| 2 | `<FORMAT_CHECK>` | `format:check` | `node scripts/ci/run-and-capture.mjs --out reports/static/prettier.log -- corepack pnpm exec prettier --check .` | `reports/static/prettier.log` | `0` archivos desalineados (LF consistente) |
| 3 | `<LINT>` | `lint` | `corepack pnpm exec eslint . --max-warnings=0 --format json --output-file reports/static/eslint.json` | `reports/static/eslint.json` | `0` errores y `0` warnings |
| 4 | `<TYPECHECK>` | `typecheck` | `node scripts/ci/run-and-capture.mjs --out reports/static/tsc.log -- corepack pnpm exec tsc --noEmit` | `reports/static/tsc.log` | `0` errores TypeScript en modo `strict` |
| 5 | `<UNIT_TEST>` | `test:unit` | `corepack pnpm exec vitest run --project unit --reporter=default --reporter=junit --outputFile=reports/unit/junit.xml` | `reports/unit/junit.xml` | 100% tests unitarios reales en PASS; 0 skips/only |
| 6 | `<COVERAGE>` | `test:coverage` | `corepack pnpm exec vitest run --project unit --coverage --coverage.reportsDirectory=reports/coverage --coverage.reporter=json-summary --coverage.reporter=lcov --coverage.reporter=text` | `reports/coverage/coverage-summary.json` | Líneas `>= 85%`, ramas `>= 80%` (y diff `>= 90%` en PR) |
| 7 | `<BUILD>` | `build` | `node scripts/ci/run-and-capture.mjs --out reports/build/next-build.log -- corepack pnpm exec next build` | `reports/build/next-build.log` + `.next/` | Build reproducible de producción con `exit 0` |
| 8 | `<SCA>` | `security:sca` | `corepack pnpm exec tsx scripts/security/run-sca.ts --report reports/security/sca-audit.json` | `reports/security/sca-audit.json` | Ejecuta `corepack pnpm audit --audit-level=high --json` y escribe el artefacto; falla si hay `Critical`/`High` o error de auditoría |
| 9 | `<SECRET_SCAN>` | `security:secrets` | `node scripts/security/secret-scan.mjs` | `reports/security/secret-scan.json` | Escaneo real reproducible en local/CI sin requerir `gitleaks` global (ver §2.3) |

### 2.3 Diseño detallado de `<SECRET_SCAN>` reproducible sin `gitleaks` global

Para cumplir `QUALITY_GATES.md §3` (fail-closed, reproducible en clon limpio local y CI) con `gitleaks.installed = false` en el entorno actual:

1. **Motor primario incluido en el repositorio (`devDependencies`):** `scripts/security/secret-scan.mjs` enumera los archivos rastreados **y** nuevos archivos locales no ignorados mediante `git ls-files -z --cached --others --exclude-standard`, excluyendo únicamente extensiones binarias verificadas (`.png`, `.jpg`, `.webp`, `.avif`, `.woff2`, `.ico`, `.docx`, `.xlsx`), y ejecuta:
   - **`secretlint` (`14.0.1`)** (que ya incluye de serie el preset `@secretlint/secretlint-rule-preset-recommend` desde v14, sin requerir el paquete deprecado separado) con salida JSON estructurada (`reports/security/secret-scan.json`).
   - **Reglas deterministas específicas de OAK:** detección de claves privadas (`-----BEGIN ... PRIVATE KEY-----`), prefijos de claves reales de Stripe (`sk_live_`, `pk_live_`), tokens de Resend, tokens personales Supabase, valores JWT reales en `SUPABASE_SERVICE_ROLE_KEY`, cadenas de conexión Postgres con contraseña no sintética y correos reales fuera de dominios reservados RFC 2606 (`.invalid`, `.example`, `.test`).
2. **Capa aditiva cuando `gitleaks` está disponible (CI `ubuntu-latest` en `P0-005` o local si se instala):** Si `gitleaks` existe en `PATH`, el script ejecuta adicionalmente `gitleaks detect --source . --no-banner --redact --report-format json --report-path reports/security/gitleaks.json` y fusiona su veredicto. Si `gitleaks` no está en local, la comprobación **NO simula éxito**: ejecuta íntegramente `secretlint` + reglas OAK sobre el 100% de archivos textuales rastreados y devuelve `exit 1` ante cualquier hallazgo o fallo de ejecución. En CI (`P0-005`) la ejecución conjunta con `gitleaks` es obligatoria.

### 2.4 Los 21 comandos FAIL-CLOSED hasta su fase de activación

En `P0-004`, todos estos scripts existirán en `package.json` invocando un guardián explícito (`node scripts/ci/fail-closed-gate.mjs --token <TOKEN> --phase <FASE> --report <RUTA>`), que escribe un informe JSON con `"status": "FAIL_CLOSED_NOT_IMPLEMENTED"` y sale con **`exit 2`** (`!= 0`). Queda prohibido que devuelvan `exit 0` antes de implementar sus pruebas reales en el paquete designado.

| # | Token canónico (`QUALITY_GATES.md §5`) | Script `package.json` | Fase / Paquete de activación | Comando real al activarse | Artefacto máquina esperado |
|---:|---|---|---|---|---|
| 10 | `<INTEGRATION_TEST>` | `test:integration` | Fase 2 (`P2-002`/`P2-010`, Gate `G3`) | `corepack pnpm exec tsx scripts/db/with-ephemeral-pg.ts -- corepack pnpm exec vitest run --project integration --reporter=junit --outputFile=reports/integration/junit.xml` | `reports/integration/junit.xml` |
| 11 | `<CONTRACT_TEST>` | `test:contract` | Fase 2/3 (`P2-010`/`P3-001`, Gate `G3`) | `corepack pnpm exec vitest run --project contract --reporter=junit --outputFile=reports/contract/junit.xml` | `reports/contract/junit.xml` |
| 12 | `<DB_MIGRATE_FRESH>` | `db:migrate:fresh` | Fase 2 (`P2-002`, Gate `G3`) | `corepack pnpm exec tsx scripts/db/migrate-fresh.ts --report reports/db/migrate-fresh.json` | `reports/db/migrate-fresh.json` |
| 13 | `<DB_MIGRATE_FROM_PREVIOUS>` | `db:migrate:previous` | Fase 2 (`P2-002`, Gate `G3`) | `corepack pnpm exec tsx scripts/db/migrate-from-previous.ts --report reports/db/migrate-previous.json` | `reports/db/migrate-previous.json` |
| 14 | `<SEED_IDEMPOTENCY_CHECK>` | `db:seed:check` | Fase 2 (`P2-003`, Gate `G3`) | `corepack pnpm exec tsx scripts/db/seed-idempotency-check.ts --report reports/db/seed-check.json` | `reports/db/seed-check.json` |
| 15 | `<E2E_CRITICAL>` | `test:e2e:critical` | Fase 2 (`P2-008`/`P2-010`, Gate `G4`) | `corepack pnpm exec playwright test --project=chromium-desktop --project=chromium-mobile --grep "@p0"` | `reports/e2e/critical-results.json` |
| 16 | `<E2E_FULL>` | `test:e2e:full` | Fase 4/6 (`P4-011`/`P6-010`, Gate `G4`) | `corepack pnpm exec playwright test` (Chromium, Firefox, WebKit; 5 viewports) | `reports/e2e/full-results.json` |
| 17 | `<E2E_FLAKE_CHECK>` | `test:e2e:flake` | Fase 2/4/8 (`P2-010`/`P8-001`, Gate `G4`/`G7`) | `corepack pnpm exec tsx scripts/qa/e2e-flake-check.ts --runs 3 --report reports/e2e/flake-check.json` | `reports/e2e/flake-check.json` |
| 18 | `<A11Y_AUTOMATED>` | `test:a11y` | Fase 2 (`P2-007`/`P2-008`, Gate `G5`) | `corepack pnpm exec playwright test --grep "@a11y"` (`@axe-core/playwright`) | `reports/a11y/axe-results.json` |
| 19 | `<A11Y_MANUAL>` | `test:a11y:manual-check` | Fase 7 (`P7-001`, Gate `G5`) | `corepack pnpm exec tsx scripts/qa/verify-a11y-manual-signoff.ts --report reports/a11y/manual-signoff.json` | `reports/a11y/manual-signoff.json` |
| 20 | `<SAST>` | `security:sast` | Fase 2/7 (`P2-005`/`P7-005`, Gate `G5`) | `corepack pnpm exec tsx scripts/security/run-sast.ts --sarif reports/security/sast.sarif` (`eslint-plugin-security` + `@microsoft/eslint-plugin-sdl` + Semgrep en CI) | `reports/security/sast.sarif` |
| 21 | `<DAST>` | `security:dast` | Fase 5/7 (`P5-013`/`P7-006`, Gate `G5`) | `corepack pnpm exec tsx scripts/security/run-dast.ts --target $DAST_TARGET_URL --report reports/security/dast.json` | `reports/security/dast.json` |
| 22 | `<SBOM>` | `security:sbom` | Fase 7 (`P7-005`, Gate `G5`/`G7`) | `corepack pnpm exec cdxgen -t js -o reports/security/sbom.cdx.json` | `reports/security/sbom.cdx.json` |
| 23 | `<PERFORMANCE>` | `test:perf` | Fase 7 (`P7-003`, Gate `G5`) | `corepack pnpm exec tsx scripts/perf/run-perf-gate.ts --report reports/perf/perf-gate.json` (`@lhci/cli` + presupuestos bundle ADR-004) | `reports/perf/perf-gate.json` |
| 24 | `<LOAD_TEST>` | `test:load` | Fase 7 (`P7-003`/`P7-004`, Gate `G5`) | `corepack pnpm exec tsx scripts/perf/run-load-test.ts --report reports/perf/load-test.json` (`autocannon`) | `reports/perf/load-test.json` |
| 25 | `<DEPLOY_PREVIEW>` | `deploy:preview` | Fase 2 (`P2-001`, Gate `G6`) | `corepack pnpm exec tsx scripts/ops/deploy.ts --env preview --report reports/ops/deploy-preview.json` | `reports/ops/deploy-preview.json` |
| 26 | `<DEPLOY_STAGING>` | `deploy:staging` | Fase 5 (`P5-013`, Gate `G6`) | `corepack pnpm exec tsx scripts/ops/deploy.ts --env staging --report reports/ops/deploy-staging.json` | `reports/ops/deploy-staging.json` |
| 27 | `<SMOKE_TEST>` | `test:smoke` | Fase 5 (`P5-013`, Gate `G6`/`G7`) | `corepack pnpm exec tsx scripts/ops/smoke-test.ts --report reports/ops/smoke.json` | `reports/ops/smoke.json` |
| 28 | `<OBSERVABILITY_CHECK>` | `ops:observability-check` | Fase 2/7 (`P2-009`/`P7-008`, Gate `G6`) | `corepack pnpm exec tsx scripts/ops/check-observability.ts --report reports/ops/observability.json` | `reports/ops/observability.json` |
| 29 | `<BACKUP_RESTORE_DRILL>` | `ops:backup-restore-drill` | Fase 7 (`P7-009`, Gate `G6`) | `corepack pnpm exec tsx scripts/ops/backup-restore-drill.ts --report reports/ops/backup-restore.json` | `reports/ops/backup-restore.json` |
| 30 | `<ROLLBACK_DRILL>` | `ops:rollback-drill` | Fase 7 (`P7-010`, Gate `G6`) | `corepack pnpm exec tsx scripts/ops/rollback-drill.ts --report reports/ops/rollback.json` | `reports/ops/rollback.json` |

## 3. Matriz de los 4 Entornos (`local`, `preview`, `staging`, `producción`)

| Dimensión | `local` | `preview` (PR) | `staging` | `producción` |
|---|---|---|---|---|
| **Propósito** | Desarrollo y feedback unitario/UI/integración | Validación aislada por PR y QA visual | Equivalente pre-release, UAT `D2`, perf/carga/DAST/drills `G6` | Servicio operativo final (solo tras `G6`, `D2`, `D3` y `G7`) |
| **Hosting App** | `http://127.0.0.1:3000` | Vercel Preview efímero por rama | Proyecto/entorno Vercel Staging fijo | Proyecto/entorno Vercel Production |
| **PostgreSQL / Auth** | PGlite local o `supabase start` / proyecto dev aislado | Proyecto/branch Supabase de preview aislado (sin datos staging/prod) | Proyecto Supabase Staging dedicado | Proyecto Supabase Producción aislado |
| **Seed & Datos** | Datos sintéticos deterministas (`P0-009`) | Datos sintéticos efímeros de preview | Datos sintéticos/anonimizados reproducibles | Datos reales; **prohibido** ejecutar seed demo (`OAK_ALLOW_DEMO_SEED=false`) |
| **Pagos (Stripe)** | Claves `test` o MSW mocks locales | Claves `test` únicamente | Claves `test` únicamente | V1: modo `test` por defecto; pagos reales **deshabilitados** salvo aprobación explícita separada en `D3` |
| **Email (Resend)** | Sink en memoria / logs estructurados sin envío real | Sandbox / dominio sink sintético | Sandbox controlado (sin emails reales externos) | Dominio verificado con SPF/DKIM/DMARC (solo tras `D3`) |
| **Observabilidad** | Logs JSON en consola, Sentry desactivado | Logs Vercel + Sentry `env=preview` sin PII | Logs + Sentry `env=staging` + alertas simuladas `G6` | Logs + Sentry `env=production` + alertas activas enlazadas a runbook |
| **Control de Acceso** | Cuentas demo locales sin PII real | Acceso protegido por Vercel Auth / cuentas demo | Equivalente a prod + protección anti-indexación (`noindex`) | Acceso público rutas catálogo; `/pro` y admin con RBAC + MFA |
| **Despliegue** | Manual local | Automático por PR tras `G1` | Automático desde rama/tag RC tras `G1–G4` | **Solo manual/protegido** tras `D3`, tag inmutable y digest certificado |

## 4. Gestión Externa de Secretos y Validación Fail-Closed

1. **Almacenamiento permitido por entorno:**
   - `local`: únicamente `.env.local` (ignorado en `.gitignore`), construido a partir de `.env.example` (que solo contiene nombres de variable documentados y descripciones sin valores reales).
   - `preview` y `staging`: GitHub Actions Environment Secrets (`preview`, `staging`) y Vercel Environment Variables con ámbito restringido al entorno correspondiente.
   - `producción`: GitHub Environment `production` con **Required Reviewers** + Vercel Production Encrypted Environment Variables + bóveda/gestor del usuario fuera de Git.
2. **Validación al arranque (`src/shared/env.ts`):**
   - Esquema Zod discriminado por `APP_ENV` (`local | preview | staging | production`).
   - Si falta cualquier secreto obligatorio para el modo activo (p. ej. `<DATABASE_URL>` con rol aplicativo sin `BYPASSRLS`, `<MIGRATION_DATABASE_URL>` en tareas CLI de migración, `<STRIPE_WEBHOOK_SECRET>`, `<SUPABASE_SERVICE_ROLE_KEY>`, `<NEXT_PUBLIC_SUPABASE_URL>`), la aplicación **falla al arrancar / en la petición sin degradar silenciosamente**.
   - Guardia explícita anti-cobro real accidental: si `APP_ENV !== "production"` o `OAK_ENABLE_LIVE_PAYMENTS !== "true"`, cualquier clave Stripe en modo live provoca terminación inmediata con error fatal.
3. **Rotación y no-exposición:** Ningún secreto se imprime en logs, respuestas HTTP, trazas Sentry ni artefactos de `docs/evidence/**`.

## 5. Recomendación de `.gitattributes` para `P0-004` (Windows `core.autocrlf=true`)

En `P0-001` y `P0-003` se ha verificado que el entorno Windows del workspace tiene `git config core.autocrlf = true`. Sin un archivo `.gitattributes`, Git convierte `LF -> CRLF` en el checkout local de Windows, provocando fallos falsos en `prettier --check .`, diferencias en hashes y corrupción (`\r`) en scripts shell ejecutados en CI Linux.

Se prescribe que `P0-004` cree en la raíz el archivo `.gitattributes` con estas reglas exactas:

```gitattributes
# Política por defecto: texto normalizado a LF en índice y working tree
* text=auto eol=lf

# Código fuente, configuración, SQL, Markdown y scripts siempre con LF
*.ts text eol=lf
*.tsx text eol=lf
*.js text eol=lf
*.mjs text eol=lf
*.cjs text eol=lf
*.json text eol=lf
*.css text eol=lf
*.md text eol=lf
*.sql text eol=lf
*.yml text eol=lf
*.yaml text eol=lf
*.sh text eol=lf
*.svg text eol=lf

# Binarios explícitos (sin conversión de fin de línea)
*.png binary
*.jpg binary
*.jpeg binary
*.webp binary
*.avif binary
*.woff2 binary
*.ico binary
*.docx binary
*.xlsx binary
*.pdf binary

# Inmutabilidad de artefactos visuales congelados en P0-001 (no renormalizar)
sites/** -text
```

- **Regla crítica de aplicación en `P0-004`:** Marcar `sites/** -text` garantiza que los 19 archivos bajo `sites/oak-brand-deck/` y `sites/oak-web-design-deck/` conserven exactamente los hashes SHA-256 certificados en `docs/evidence/W01/P0-001/sha256-sites.txt` entre Windows y Linux. Al introducir `.gitattributes`, `P0-004` verificará explícitamente `19/19 MATCH` sobre `sites/**`.

## 6. Consecuencias y Condiciones de Invalidación

- **Consecuencias:** `P0-004` hereda una especificación exacta de los 30 scripts de `package.json`, sus umbrales de salida y su separación entre 9 activos en `G0` y 21 fail-closed.
- **Invalidación:** Este ADR queda invalidado si se cambia el nombre o semántica de cualquiera de los 30 tokens de `QUALITY_GATES.md §5`, si algún comando fail-closed devuelve `exit 0` antes de su fase real, si `<SECRET_SCAN>` se reemplaza por un no-op, o si se introduce algún secreto en el repositorio o en `.env.example`.

