# Evidencia P0-004 — Inicialización de Aplicación, Lockfile, .gitattributes y 30 Comandos Canónicos

- **Task ID:** `P0-004`
- **Owner:** `devops-release`
- **Reviewers designados:** `backend-datos`, `frontend`
- **Guardian:** `release-guardian`
- **Rama:** `feat/p0-004-app-bootstrap`
- **Base SHA:** `5ef220194d5e2295cdb8c2ab595e3cccf1975438`
- **Commit candidato:** Ver `git rev-parse HEAD` en `feat/p0-004-app-bootstrap` reportado en el handoff de entrega
- **Fecha UTC:** `2026-11-18T22:05:00Z`

## 1. Alcance entregado

1. **Configuración de runtime, Git, calidad y entorno:**
   - [`.nvmrc`](../../../.nvmrc) (`24.16.0`), [`.npmrc`](../../../.npmrc) (`save-exact=true`, `engine-strict=true`, `strict-peer-dependencies=true`, `auto-install-peers=true`), [`.gitattributes`](../../../.gitattributes) (`* text=auto eol=lf` + `sites/** -text` según `ADR-002` §5, restaurando `19/19 MATCH` SHA-256 en `sites/**`), [`.gitignore`](../../../.gitignore) (añadido `/reports/`), [`.github/CODEOWNERS`](../../../.github/CODEOWNERS) (equipos funcionales sin PII ni correos personales), [`.env.example`](../../../.env.example) (variables documentadas sin valores reales ni secretos).
   - [`.prettierrc.json`](../../../.prettierrc.json), [`.prettierignore`](../../../.prettierignore), [`tsconfig.json`](../../../tsconfig.json) (`strict: true`, `noUncheckedIndexedAccess: true`), [`next.config.ts`](../../../next.config.ts) (cabeceras de seguridad base, `poweredByHeader: false`), [`postcss.config.mjs`](../../../postcss.config.mjs), [`eslint.config.mjs`](../../../eslint.config.mjs) (`eslint-config-next`, `typescript-eslint`, `eslint-plugin-security`, `@microsoft/eslint-plugin-sdl` y `no-restricted-imports` bloqueando acceso DB/infra desde `src/app/**`, `src/components/**` y dominio), [`vitest.config.ts`](../../../vitest.config.ts) (proyecto `unit`, cobertura V8 hacia `reports/coverage`, umbrales `lines: 85`, `branches: 80`), [`playwright.config.ts`](../../../playwright.config.ts) (5 viewports de referencia y proyectos multimotor con `retries: 0`), [`README.md`](../../../README.md).
2. **Manifiesto y lockfile deterministas:**
   - [`package.json`](../../../package.json) con las **51 versiones npm exactas** fijadas en `ADR-001` §2.2 (`0` rangos flotantes, sin `@secretlint/secretlint-rule-preset-recommend` ni `@electric-sql/pglite-socket`), `"packageManager": "pnpm@10.34.9+sha512..."`, `"type": "module"`, los **30 comandos canónicos** de `ADR-002` y `pnpm.overrides` exacto (`@cyclonedx/cdxgen>body-parser: 2.4.0`) mitigando `GHSA-27r3-jxmh-p828` (`CVE-2026-111181`, High).
   - [`pnpm-lock.yaml`](../../../pnpm-lock.yaml) generado con `corepack pnpm install` y verificado con `corepack pnpm install --frozen-lockfile`.
3. **Scripts CI y de seguridad:**
   - [`scripts/ci/run-and-capture.mjs`](../../../scripts/ci/run-and-capture.mjs) (captura portable de logs a `reports/` sin `shell: true` ni warnings `DEP0190`).
   - [`scripts/ci/fail-closed-gate.mjs`](../../../scripts/ci/fail-closed-gate.mjs) (para los 21 tokens futuros: emite JSON `"status": "FAIL_CLOSED_NOT_IMPLEMENTED"` en `reports/` y termina con `exit 2`).
   - [`scripts/security/secret-scan.mjs`](../../../scripts/security/secret-scan.mjs) (`secretlint@14.0.1` configurado programáticamente con `@secretlint/secretlint-rule-preset-recommend` + reglas deterministas OAK sobre `git ls-files -z --cached --others --exclude-standard` + `gitleaks` aditivo cuando existe en `PATH`).
   - [`scripts/security/run-sca.ts`](../../../scripts/security/run-sca.ts) (`corepack pnpm audit --audit-level=high --json` escribiendo `reports/security/sca-audit.json` y fallando cerrado ante High/Critical o error).
4. **Scaffold técnico mínimo de aplicación (`src/`) y pruebas unitarias (`tests/unit/`):**
   - [`src/shared/env.ts`](../../../src/shared/env.ts): esquema Zod discriminado por `APP_ENV` (`local | preview | staging | production`) fail-closed y guardia fatal contra `sk_live_`/`pk_live_` u `OAK_ENABLE_LIVE_PAYMENTS=true` fuera de producción autorizada.
   - [`src/styles/tokens.css`](../../../src/styles/tokens.css) y [`src/app/globals.css`](../../../src/app/globals.css): placeholder técnico mínimo `#E3D4BB` fondo / `#17211B` texto (`11.34:1`), foco `3 px` (`#12372A`) y `prefers-reduced-motion`, sin congelar tokens `D1`, sin paletas status y sin CSS/JS/assets de `sites/**` ni Google Fonts externas.
   - [`src/app/layout.tsx`](../../../src/app/layout.tsx) (`lang="es"`), [`src/app/page.tsx`](../../../src/app/page.tsx) (placeholder técnico en español con `<h1>` único, sin promesas ni journeys `J01..J08`), [`src/app/api/health/route.ts`](../../../src/app/api/health/route.ts) (`GET /api/health` sin PII ni secretos).
   - [`tests/unit/health.test.ts`](../../../tests/unit/health.test.ts), [`tests/unit/env.test.ts`](../../../tests/unit/env.test.ts) y [`tests/unit/page.test.tsx`](../../../tests/unit/page.test.tsx): `12/12` tests en `PASS`, `100%` cobertura en `lines`, `statements`, `functions` y `branches`.

## 2. Trazabilidad de Criterios de Aceptación (`P0-004`)

| AC | Resultado | Evidencia verificada |
|---|---|---|
| `AC-01` | **PASS** | Los **9/9 comandos activos G0** (`install --frozen-lockfile`, `format:check`, `lint`, `typecheck`, `test:unit`, `test:coverage`, `build`, `security:sca`, `security:secrets`) terminan con `exit 0` y `0` warnings en ESLint/TS/Vitest; cobertura `100%` líneas (`32/32`) y `100%` ramas (`21/21`) en `src/`; informes escritos en `reports/`. |
| `AC-02` | **PASS** | `30/30` tokens canónicos de `QUALITY_GATES.md §5` asignados sin placeholders `<>` (`1` nativo `pnpm` + `8` scripts activos + `21` scripts fail-closed); los **21/21 scripts futuros** escriben `"status": "FAIL_CLOSED_NOT_IMPLEMENTED"` en `reports/` y devuelven `exit 2`. |
| `AC-03` | **PASS** | `env.test.ts` demuestra fallo cerrado ante variables faltantes, `OAK_ALLOW_DEMO_SEED=true` en `production` y `sk_live_`/`pk_live_` fuera de `production` autorizada; prueba negativa de `secret-scan` detecta secretos/email sintéticos en fichero temporal externo (`exit 1`, artefacto `reports/security/secret-scan-negative.json`, fichero temporal eliminado); `0` rangos flotantes en `package.json`; `0` colores/CSS/JS/mock de `sites/**` en `src/`; `19/19 MATCH` SHA-256 en `sites/**`; `eslint` bloquea `no-restricted-imports` en `src/app/**`. |

## 3. Rollback y Riesgos Residuales

- **Rollback:** Descartar la rama `feat/p0-004-app-bootstrap` antes del merge a `master`, o revertir el commit de integración mediante `git revert <sha>` (reabriendo `P0-005` y `P0-009` si ya dependían).
- **Riesgos y limitaciones residuales:**
  1. `gitleaks` y `docker` no están preinstalados en el entorno Windows local; `<SECRET_SCAN>` ejecuta `secretlint@14.0.1` + reglas deterministas OAK en local y habilitará `gitleaks` aditivo en CI Linux (`P0-005`).
  2. Existen `4` avisos `moderate` en dependencias transitivas de herramientas de desarrollo (`esbuild`/`lhci`/`storybook`), sin `High` ni `Critical` (`0`/`0`), bajo seguimiento para `G5`.
  3. Se aplicó `pnpm.overrides` exacto (`@cyclonedx/cdxgen>body-parser: 2.4.0`) para remediar `CVE-2026-111181` (`high`) en una subdependencia opcional de `cdxgen@12.9.2`.
  4. Los `21` comandos de fases futuras permanecen en `exit 2` (`FAIL_CLOSED_NOT_IMPLEMENTED`); `G0` sigue abierto hasta completar `P0-005`, `P0-008`, `P0-009` y el veredicto global `P0-010`.
