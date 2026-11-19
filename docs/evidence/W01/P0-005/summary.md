# Evidencia P0-005 — CI Baseline Obligatorio en PR, Artefactos y Fallo Intencional

- **Task ID:** `P0-005`
- **Owner:** `devops-release`
- **Peer Reviewer designado:** `auditor-no-funcional`
- **Release Guardian:** `release-guardian`
- **Rama:** `feat/p0-005-ci-baseline`
- **Base SHA:** `fc8ff5107bcbd2b8735d55588120525f3fbdcd2f`
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD` (commit en `feat/p0-005-ci-baseline` informado en el handoff de entrega)
- **Estado de ejecución remota PR:** `PR_REMOTE_EXECUTION = BLOCKED_PENDING_REMOTE` (`git remote -v` vacío y `gh` CLI ausente en el repositorio local)

## 1. Alcance entregado

1. **Workflow CI reproducible ([`.github/workflows/ci.yml`](../../../.github/workflows/ci.yml)):**
   - Disparadores `pull_request` hacia `master` y `push` sobre `master`, con `concurrency` (`cancel-in-progress: true`), `permissions: { contents: read }`, `COREPACK_ENABLE_DOWNLOAD_PROMPT=0`, `NEXT_TELEMETRY_DISABLED=1` y `persist-credentials: false`.
   - Todas las acciones fijadas por SHA completo de 40 caracteres verificado vía `git ls-remote` contra GitHub:
     - `actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5` (`v4.3.1`, `fetch-depth: 0` en `security`).
     - `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020` (`v4.4.0`, leyendo `.nvmrc` `24.16.0`).
     - `actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830` (`v4.3.0`, caché determinista del store `pnpm` por hash de `pnpm-lock.yaml`).
     - `actions/upload-artifact@ea165f8d65b6e75b540449e92b4886f43607fa02` (`v4.6.2`, subida de `reports/**` con `if: always()` y retención `30` días).
   - Tres jobs en paralelo (`static-and-unit`, `build`, `security`): validan coincidencia exacta de Node con `.nvmrc`, ejecutan `corepack enable`, `corepack pnpm install --frozen-lockfile`, los `9` checks activos `G0` (`format:check`, `lint`, `typecheck`, `test:unit`, `test:coverage`, `build`, `security:sca`, `security:secrets`) más el binario fijado de `gitleaks v8.30.1` (SHA-256 `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`) con aserción fail-closed en `security` de que `gitleaks.available === true && gitleaks.status === "PASS"`.
2. **Documentación operativa de CI/CD y Branch Protection ([`docs/ops/CI_CD.md`](../../../docs/ops/CI_CD.md)):**
   - Documentación exacta de los 3 jobs, checks obligatorios (`Static Quality & Unit Tests`, `Production Build`, `SCA & Secret Scan (Gitleaks)`), reglas de Branch Protection para `master`, retención de artefactos `reports/**`, inventario de secretos externos para futuros GitHub Environments (`preview`, `staging`, `production`) sin valores reales ni PII, y procedimiento reproducible de prueba de fallo intencional en PR y en local.
3. **Demostración controlada de fallo intencional ([`intentional-failure.log`](intentional-failure.log)):**
   - Sonda sintética temporal `src/shared/__ci_intentional_failure_probe__.ts` con error de tipo `TS2322` ejecutada vía `corepack pnpm run typecheck` (`exit_code: 2`), capturada en `intentional-failure.log` (sin PII ni secretos) y revertida por completo antes de reejecutar en verde los checks `G0`.

## 2. Trazabilidad de Criterios de Aceptación (`P0-005`)

| AC      | Resultado                                                  | Evidencia verificada                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AC-01` | **PASS**                                                   | `.github/workflows/ci.yml` y `docs/ops/CI_CD.md` validados sintáctica y estructuralmente en Python (`CI_YAML_VALIDATION=PASS`), `permissions.contents == 'read'`, `0` tags móviles, `12/12` usos de acciones fijados por SHA 40-hex, Node `.nvmrc` (`24.16.0`), `corepack enable`, `9/9` checks activos `G0` + `gitleaks v8.30.1` SHA-256 verificado, `actions/upload-artifact` de `reports/**` con `if: always()` en los 3 jobs y `0` secretos/PII. |
| `AC-02` | **PASS**                                                   | Fallo controlado de `typecheck` capturado en `docs/evidence/W01/P0-005/intentional-failure.log` (`exit 2`, error `TS2322`), sonda revertida al 100 % y los `9/9` checks activos `G0` ejecutados en verde (`exit 0`, `0` warnings) tras la última edición sobre el candidato final.                                                                                                                                                                   |
| `AC-03` | **BLOCKED (remoto) / PASS (validación fail-closed local)** | `git remote -v` vacío y `gh` CLI `NOT_FOUND`: **`PR_REMOTE_EXECUTION = BLOCKED_PENDING_REMOTE`**. Se declara honestamente `BL-01` en `P0-005.md` y en este informe sin equiparar la ejecución local ni la validación YAML a un PR real en GitHub.                                                                                                                                                                                                    |

## 3. Seguridad, privacidad, accesibilidad, rendimiento y rollback

- **Seguridad y privacidad:** `permissions: { contents: read }`, `persist-credentials: false`, `0` secretos y `0` PII real confirmados por `corepack pnpm run security:secrets` y `corepack pnpm run security:sca` (`0` High/Critical; `4` moderate heredados de herramientas dev de `P0-004`). En local Windows `gitleaks` reporta `NOT_INSTALLED_IN_LOCAL_PATH`; en CI `ubuntu-latest` su ejecución conjunta es obligatoria mediante descarga SHA-256 verificada.
- **Accesibilidad / Migración:** `NO_APLICA` (paquete puramente de infraestructura CI/CD y documentación operativa, sin UI ni cambios de esquema).
- **Rendimiento / Build:** Caché determinista de store `pnpm` por hash de `pnpm-lock.yaml`, `concurrency.cancel-in-progress: true` y `corepack pnpm run build` limpio (`exit 0`).
- **Rollback:** Descartar rama `feat/p0-005-ci-baseline` antes de fusionar o `git revert <sha>` en `master`; la inyección temporal de prueba de fallo fue eliminada y verificada con `git status --short src/` vacío.

## 4. Riesgos residuales y bloqueos

- **`BL-01` (`PR_REMOTE_EXECUTION = BLOCKED_PENDING_REMOTE`):** Falta remoto GitHub configurado y `gh` CLI para abrir un PR real, ejecutar el workflow en `ubuntu-latest` (incluido `gitleaks v8.30.1` real en CI) y activar Branch Protection en `master`. Requiere provisión de remoto GitHub por el usuario o excepción explícita aprobada por el usuario al auditar `G0` (`P0-010`).
- **Heredado de `P0-004`:** `4` avisos `moderate` en dependencias transitivas de desarrollo (`esbuild`/`lhci`/`storybook`), `0` High/Critical.
