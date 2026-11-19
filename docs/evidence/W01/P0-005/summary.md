# Evidencia P0-005 — CI Baseline Obligatorio en PR, Branch Protection y Fallo Intencional

- **Task ID:** `P0-005`
- **Owner:** `devops-release`
- **Peer Reviewer designado:** `auditor-no-funcional`
- **Release Guardian:** `release-guardian`
- **Rama:** `feat/p0-005-ci-baseline`
- **Base SHA:** `7ce3f5c931bc449dcebddfe8110a52fc1c154f4d`
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD` (commit en `feat/p0-005-ci-baseline` informado en el handoff de entrega)
- **Repositorio remoto:** `https://github.com/davidcanolopez/oak_platform.git` (`gh` autenticado como `davidcanolopez`)

## 1. Alcance entregado

1. **Workflow CI reproducible ([`.github/workflows/ci.yml`](../../../../.github/workflows/ci.yml)):**
   - Disparadores `pull_request` hacia `master` y `push` sobre `master`, con `concurrency` (`cancel-in-progress: true`), `permissions: { contents: read }`, `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`, `NEXT_TELEMETRY_DISABLED=1` y `persist-credentials: false`.
   - Todas las acciones fijadas por SHA completo de 40 caracteres verificado vía `git ls-remote` contra GitHub:
     - `actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5` (`v4.3.1`, `fetch-depth: 0` en `security`).
     - `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020` (`v4.4.0`, leyendo `.nvmrc` `24.16.0`).
     - `actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830` (`v4.3.0`, caché determinista del store `pnpm` por hash de `pnpm-lock.yaml`).
     - `actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02` (`v4.6.2`, subida de `reports/**` con `if: always()` y retención `30` días).
   - Tres jobs en paralelo (`static-and-unit`, `build`, `security`): validan coincidencia exacta de Node con `.nvmrc`, ejecutan `corepack enable`, `corepack pnpm install --frozen-lockfile`, los `9` checks activos `G0` (`format:check`, `lint`, `typecheck`, `test:unit`, `test:coverage`, `build`, `security:sca`, `security:secrets`) más el binario fijado de `gitleaks v8.30.1` (SHA-256 `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`) con aserción fail-closed en `security` de que `gitleaks.available === true && gitleaks.status === "PASS"`.
2. **Documentación operativa de CI/CD y Branch Protection ([`docs/ops/CI_CD.md`](../../../../docs/ops/CI_CD.md)):**
   - Documentación exacta de los 3 jobs, checks obligatorios (`Static Quality & Unit Tests`, `Production Build`, `SCA & Secret Scan (Gitleaks)`), configuración real aplicada en `master` mediante `gh api` (con nota operativa para cuenta GitHub individual `davidcanolopez`: `required_approving_review_count: 0` y `require_code_owner_reviews: false` hasta incorporar un segundo colaborador humano, manteniendo `enforce_admins: true`, `strict: true`, `dismiss_stale_reviews: true`, `required_conversation_resolution: true`, `allow_force_pushes: false`, `allow_deletions: false`, y revisión independiente obligatoria OAK vía `auditor-no-funcional` + `release-guardian`), retención de artefactos `reports/**`, inventario de secretos externos futuros y procedimiento reproducible de prueba de fallo intencional.
3. **Exclusión puntual auditada ([`.gitleaksignore`](../../../../.gitleaksignore)):**
   - Incluye únicamente el fingerprint histórico verificado de `P0-009` (`e27ba6fa6fdf640de0e09ec722e304be6527b92e:data/fixtures/oak-seed.v1.json:generic-api-key:96`), correspondiente a un falso positivo de entropía en el campo `accountKey` de la cuenta de prueba invitada en línea 96 (sin secretos ni PII real), autorizado mediante `DoR PASS` del `release-guardian` sin relajar reglas globales ni tocar `data/`, `src/`, `tests/` o `scripts/`.
4. **Demostración controlada de fallo intencional en local y en PR real de GitHub ([`intentional-failure.log`](intentional-failure.log)):**
   - En local: sonda temporal `src/shared/__ci_intentional_failure_probe__.ts` con error `TS2322` ejecutada vía `corepack pnpm run typecheck` (`exit_code: 2`) y revertida al 100 %.
   - En GitHub PR `#1` (`https://github.com/davidcanolopez/oak_platform/pull/1`, rama efímera `test/ci-intentional-failure`, `headSha: 246ad88f05eb87091d94afc3de26f5dc05291fad`, Run `44801103940`): `Static Quality & Unit Tests` falló en `Run TypeScript typecheck` (`TS2322`), `Production Build` falló en `TS2322`, el PR quedó con `mergeStateStatus = BLOCKED` por Branch Protection en `master` y los 3 artefactos `reports-*` se subieron con `if: always()`. PR cerrado sin fusionar y rama borrada en local y remoto.

## 2. Trazabilidad de Criterios de Aceptación (`P0-005`)

| AC      | Resultado | Evidencia verificada                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AC-01` | **PASS**  | `.github/workflows/ci.yml` y `docs/ops/CI_CD.md` validados sintáctica y estructuralmente en Python (`CI_YAML_VALIDATION=PASS`), `permissions.contents == 'read'`, `0` tags móviles, `12/12` usos de acciones fijados por SHA 40-hex, Node `.nvmrc` (`24.16.0`), `corepack enable`, `9/9` checks activos `G0` + `gitleaks v8.30.1` SHA-256 verificado + `.gitleaksignore` puntual autorizado, `actions/upload-artifact` de `reports/**` con `if: always()` en los 3 jobs y `0` secretos/PII. |
| `AC-02` | **PASS**  | Fallo controlado de `typecheck` capturado tanto en local (`exit 2`) como en PR `#1` de GitHub (Run `44801103940`, `mergeStateStatus: BLOCKED`, artefactos `reports-*` subidos) en `docs/evidence/W01/P0-005/intentional-failure.log`; rama temporal borrada y los `9/9` checks activos `G0` ejecutados en verde (`exit 0`, `4` archivos / `26` tests, `100%` cobertura en `src/`) tras la última edición sobre el candidato final.                                                          |
| `AC-03` | **PASS**  | `origin` configurado (`https://github.com/davidcanolopez/oak_platform.git`), `gh` autenticado, Branch Protection real en `master` verificado vía `gh api GET` (`strict: true` sobre los 3 checks, `enforce_admins: true`, `allow_force_pushes: false`, `allow_deletions: false`) y verificación en PR de `feat/p0-005-ci-baseline` -> `master` (ver URL de PR y Run ID en el handoff sobre este `candidate_sha`).                                                                           |

## 3. Seguridad, privacidad, accesibilidad, rendimiento y rollback

- **Seguridad y privacidad:** `permissions: { contents: read }`, `persist-credentials: false`, `0` secretos y `0` PII real confirmados por `corepack pnpm run security:secrets` (`files=145, findings=0`) y `corepack pnpm run security:sca` (`0` High/Critical; `4` moderate heredados de herramientas dev de `P0-004`). Exclusión única y auditada en `.gitleaksignore` para `e27ba6fa6fdf640de0e09ec722e304be6527b92e:data/fixtures/oak-seed.v1.json:generic-api-key:96`.
- **Accesibilidad / Migración:** `NO_APLICA` (paquete de infraestructura CI/CD y documentación operativa, sin UI ni cambios de esquema).
- **Rendimiento / Build:** Caché determinista de store `pnpm` por hash de `pnpm-lock.yaml`, `concurrency.cancel-in-progress: true` y `corepack pnpm run build` limpio (`exit 0`).
- **Rollback:** Descartar rama `feat/p0-005-ci-baseline` antes de fusionar o `git revert <sha>` en `master`; la sonda local y la rama efímera de PR `#1` fueron eliminadas por completo.

## 4. Riesgos residuales y desviaciones documentadas

- **Desviación temporal de Branch Protection en cuenta individual:** `required_approving_review_count: 0` y `require_code_owner_reviews: false` mientras `davidcanolopez` sea el único colaborador GitHub; compensado con `enforce_admins: true`, `strict: true` y revisión obligatoria OAK (`auditor-no-funcional` y `release-guardian`). Debe elevarse a `>= 1` al añadir un segundo colaborador humano.
- **Entorno local Windows vs CI Linux:** `gitleaks` reporta `NOT_INSTALLED_IN_LOCAL_PATH` en Windows, mientras que en CI `ubuntu-latest` corre de forma obligatoria y fail-closed con binario `v8.30.1` SHA-256 verificado.
- **Heredado de `P0-004`:** `4` avisos `moderate` en dependencias transitivas de desarrollo (`esbuild`/`lhci`/`storybook`), `0` High/Critical.
