# CI/CD Baseline de OAK (`.github/workflows/ci.yml`)

Este documento describe el pipeline de integración continua de fase `G0` para OAK, los checks obligatorios para la protección de la rama `master`, los artefactos conservados, la configuración futura de GitHub Environments/secretos y el procedimiento reproducible para demostrar bloqueo ante fallo intencional.

Fuentes normativas: `QUALITY_GATES.md` (§3, §5, §6), `docs/adr/ADR-001-stack-and-modular-monolith.md` (§2.1, §2.2), `docs/adr/ADR-002-canonical-commands-and-environments.md` (§2, §3, §4) y `.github/CODEOWNERS`.

## 1. Disparadores, permisos y concurrencia

- **Archivo del workflow:** `.github/workflows/ci.yml` (`name: CI Baseline`).
- **Disparadores:**
  - `pull_request` hacia `master`.
  - `push` sobre `master`.
- **Permisos mínimos (`GITHUB_TOKEN`):** `permissions: { contents: read }` en nivel raíz del workflow; ningún job solicita permisos de escritura ni de comentarios en PR.
- **Concurrencia:** `group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}` con `cancel-in-progress: true`, evitando ejecuciones obsoletas al actualizar un PR.
- **Variables no interactivas de workflow:** `COREPACK_ENABLE_DOWNLOAD_PROMPT=0` y `NEXT_TELEMETRY_DISABLED=1`.
- **Credenciales de checkout:** `persist-credentials: false` en todos los jobs.

## 2. Versiones y acciones fijadas

Todas las dependencias de ejecución del pipeline están fijadas sin etiquetas móviles (`@main`, `@master`, `@latest` o `@vX` suelto). Los commit SHAs de 40 caracteres se verificaron mediante `git ls-remote` contra GitHub:

| Componente                     | Referencia fijada                                        | Tag de origen verificado                                                   | Rol en CI                                                        |
| ------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `actions/checkout`             | `34e114876b0b11c390a56381ad16ebd13914f8d5`               | `v4.3.1`                                                                   | Checkout reproducible (`fetch-depth: 0` en `security`)           |
| `actions/setup-node`           | `49933ea5288caeca8642d1e84afbd3f7d6820020`               | `v4.4.0`                                                                   | Instalación de Node `24.16.0` leyendo `.nvmrc`                   |
| `actions/cache`                | `0057852bfaa89a56745cba8c7296529d2fc39830`               | `v4.3.0`                                                                   | Caché determinista del store `pnpm` por hash de `pnpm-lock.yaml` |
| `actions/upload-artifact`      | `ea165f8d65b6e75b540449e92b4886f43607fa02`               | `v4.6.2`                                                                   | Subida incondicional (`if: always()`) de `reports/**`            |
| `node` / `corepack`            | `.nvmrc` (`24.16.0`) / `packageManager` (`pnpm@10.34.9`) | Exacto                                                                     | Paridad total local/CI (`corepack enable` + aserción de versión) |
| `gitleaks` (binario Linux x64) | `v8.30.1` (`gitleaks_8.30.1_linux_x64.tar.gz`)           | SHA-256 `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb` | Escaneo obligatorio de secretos en historial Git                 |

**Motivo de binario `gitleaks` fijado por SHA-256 en lugar de `gitleaks/gitleaks-action`:** el binario oficial `gitleaks` bajo licencia MIT no exige `GITLEAKS_LICENSE` en repositorios de organización ni permisos de escritura para comentar en PRs, funciona bajo `contents: read` e integra nativamente con `scripts/security/secret-scan.mjs` (cuando `gitleaks` está en `PATH`, `corepack pnpm run security:secrets` lo invoca obligatoriamente y un paso posterior falla cerrado si `gitleaks.available !== true` o `gitleaks.status !== "PASS"`).

**Exclusión puntual y trazada en `.gitleaksignore`:** el archivo `.gitleaksignore` en la raíz del repositorio contiene exclusivamente el fingerprint histórico verificado `e27ba6fa6fdf640de0e09ec722e304be6527b92e:data/fixtures/oak-seed.v1.json:generic-api-key:96`, correspondiente a un falso positivo sintético de entropía en el campo `accountKey` (etiqueta de organizador invitado de prueba en línea 96 del dataset de `P0-009`, sin secretos ni PII real), autorizado mediante `DoR PASS` del `release-guardian`. Queda prohibido deshabilitar reglas globales de `gitleaks` o añadir fingerprints sin verificación independiente previa.

## 3. Jobs del pipeline y checks ejecutados

Todos los jobs corren sobre `ubuntu-latest` con `timeout-minutes: 15`, validan que `node -p 'process.versions.node'` coincide exactamente con `.nvmrc` (`24.16.0`), activan `corepack enable`, restauran caché del store `pnpm` y ejecutan `corepack pnpm install --frozen-lockfile`.

| Job ID            | Nombre de status check en GitHub | Comandos ejecutados                                                                                                                                                   | Artefactos generados bajo `reports/**`                                                                                                 |
| ----------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `static-and-unit` | `Static Quality & Unit Tests`    | `corepack pnpm install --frozen-lockfile`, `format:check`, `lint`, `typecheck`, `test:unit`, `test:coverage`                                                          | `reports/static/prettier.log`, `reports/static/eslint.json`, `reports/static/tsc.log`, `reports/unit/junit.xml`, `reports/coverage/**` |
| `build`           | `Production Build`               | `corepack pnpm install --frozen-lockfile`, `build`                                                                                                                    | `reports/build/next-build.log`                                                                                                         |
| `security`        | `SCA & Secret Scan (Gitleaks)`   | `corepack pnpm install --frozen-lockfile`, descarga SHA-256 verificada de `gitleaks v8.30.1`, `security:sca`, `security:secrets` + aserción obligatoria de `gitleaks` | `reports/security/sca-audit.json`, `reports/security/secret-scan.json`, `reports/security/gitleaks.json`                               |

Los `21` scripts restantes de `package.json` (`test:integration`, `test:contract`, `db:migrate:fresh`, `db:migrate:previous`, `db:seed:check`, `test:e2e:*`, `test:a11y*`, `security:sast`, `security:dast`, `security:sbom`, `test:perf`, `test:load`, `deploy:*`, `test:smoke`, `ops:*`) permanecen en modo fail-closed (`exit 2`, `"status": "FAIL_CLOSED_NOT_IMPLEMENTED"`) conforme a `ADR-002` §2.4 y se incorporarán progresivamente a CI cuando sus paquetes de Fase 2–7 implementen cada capacidad.

## 4. Artefactos publicados (`if: always()`)

Cada job ejecuta `actions/upload-artifact` con `if: always()`, `path: reports/**`, `retention-days: 30` y `if-no-files-found: warn`:

- `reports-static-and-unit-<github.run_id>-<github.run_attempt>`
- `reports-build-<github.run_id>-<github.run_attempt>`
- `reports-security-<github.run_id>-<github.run_attempt>`

El uso de nombres diferenciados por job evita colisiones en `actions/upload-artifact@v4` cuando los tres jobs corren en paralelo, y `if: always()` asegura la conservación de logs e informes máquina incluso cuando un gate devuelve código distinto de cero.

## 5. Branch Protection obligatorio en `master`

La rama `master` en `https://github.com/davidcanolopez/oak_platform` cuenta con protección real configurada y verificada mediante `gh api repos/davidcanolopez/oak_platform/branches/master/protection`:

1. **Pull Request obligatorio antes de fusionar:**
   - `Require a pull request before merging`: activado.
   - `Dismiss stale pull request approvals when new commits are pushed`: activado (`dismiss_stale_reviews: true`).
   - `Require conversation resolution before merging`: activado (`required_conversation_resolution: true`).
   - **Nota operativa en modo repositorio individual (`davidcanolopez`):** mientras el repositorio en GitHub tenga un único colaborador humano (`davidcanolopez`), GitHub impide aprobar su propio Pull Request en la UI; por ello, `required_approving_review_count` se fija en `0` y `require_code_owner_reviews` en `false` con `enforce_admins: true`, `dismiss_stale_reviews: true`, `required_conversation_resolution: true` y los `3` checks estrictos obligatorios, mientras la revisión independiente previa al merge la garantiza obligatoriamente el gobierno OAK mediante `auditor-no-funcional` (`PEER_REVIEW`) y `release-guardian` (`ACEPTADA`). Al incorporarse un segundo colaborador humano al repositorio, deberá elevarse `required_approving_review_count` a `>= 1` y activar `require_code_owner_reviews: true` (respaldado por `.github/CODEOWNERS`).
2. **Status checks obligatorios (`Require status checks to pass before merging`):**
   - `Require branches to be up to date before merging` (`strict: true`): activado.
   - Checks requeridos exactos:
     - `Static Quality & Unit Tests`
     - `Production Build`
     - `SCA & Secret Scan (Gitleaks)`
3. **Integridad de historial y administradores:**
   - `enforce_admins`: activado (`true`, sin bypass para administradores).
   - `Allow force pushes`: desactivado (`false`).
   - `Allow deletions`: desactivado (`false`).

## 6. GitHub Environments y secretos futuros

Siguiendo `ADR-002` §3 y §4, el pipeline de `G0` no requiere secretos externos. Cuando se activen `preview` (Fase 2), `staging` (Fase 5) y `producción` (Fase 8, previa aprobación `D3`), los secretos deberán residir exclusivamente en GitHub Environments / Vercel Encrypted Env Vars (nunca en el repositorio):

| Entorno GitHub | Reglas de protección recomendadas                                                                                                                              | Variables / Secretos esperados (solo nombres; valores externos)                                                                                                                                                                                                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preview`      | Rama/PR sin acceso a datos de staging ni producción; pagos live bloqueados (`APP_ENV=preview`, `OAK_ENABLE_LIVE_PAYMENTS=false`)                               | `APP_ENV`, `NEXT_PUBLIC_APP_URL`, `DATABASE_URL`, `MIGRATION_DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `OAK_EMAIL_FROM`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `G3_TEST_DATABASE_URL` |
| `staging`      | Despliegue desde rama/tag RC tras `G1–G4`; `APP_ENV=staging`, `OAK_ENABLE_LIVE_PAYMENTS=false`                                                                 | Mismo catálogo anterior apuntando a proyecto Supabase Staging, Stripe modo `test`, Resend sandbox y `DAST_TARGET_URL` / `PLAYWRIGHT_BASE_URL`                                                                                                                                                                                                           |
| `production`   | **Required Reviewers** obligatorios; despliegue manual/protegido solo tras `G6`, `D2`, `D3` y tag inmutable; `APP_ENV=production`, `OAK_ALLOW_DEMO_SEED=false` | Mismo catálogo productivo + aprobación explícita separada en `D3` antes de habilitar `OAK_ENABLE_LIVE_PAYMENTS=true`                                                                                                                                                                                                                                    |

## 7. Procedimiento reproducible de prueba de fallo intencional en PR

### 7.1 En repositorio GitHub con remoto conectado

1. Crear una rama temporal desde `master` actualizado (`git checkout -b test/ci-intentional-failure master`).
2. Introducir un cambio mínimo determinista que viole un check obligatorio (por ejemplo, una asignación de tipo incompatible en un archivo TypeScript temporal bajo `src/` sin PII ni secretos), hacer commit y subir la rama al remoto.
3. Abrir un Pull Request hacia `master` (sin auto-merge).
4. Comprobar en la pestaña **Checks** del PR que el job `Static Quality & Unit Tests` falla en el paso `Run TypeScript typecheck` (`exit != 0`), que el botón de merge permanece **bloqueado** por Branch Protection y que el artefacto `reports-static-and-unit-<run_id>-<run_attempt>` se sube igualmente (`if: always()`) conteniendo `reports/static/tsc.log` con el error de compilación.
5. Cerrar el PR de prueba sin fusionar y eliminar la rama temporal remota y local (`git branch -D test/ci-intentional-failure`).

### 7.2 Pre-verificación local antes de abrir PR

1. Con el árbol limpio, introducir temporalmente un archivo sintético en `src/` o `tests/unit/` con un error controlado de tipos o aserción unitaria (sin PII, correos reales ni literales de secretos).
2. Ejecutar exactamente el comando canónico afectado (`corepack pnpm run typecheck` o `corepack pnpm run test:unit`), verificar código de salida distinto de `0` y capturar la salida junto con el informe generado bajo `reports/` en `docs/evidence/W01/P0-005/intentional-failure.log`.
3. Revertir por completo la inyección temporal (`git status --short` sin archivos temporales) y reejecutar de principio a fin todos los checks activos `G0` (`format:check`, `lint`, `typecheck`, `test:unit`, `test:coverage`, `build`, `security:sca`, `security:secrets`) verificando `exit 0`.
