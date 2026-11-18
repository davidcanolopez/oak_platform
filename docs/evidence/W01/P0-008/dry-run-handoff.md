# [SIMULACRO_FICTICIO] Prueba Completa de Handoff, Rechazo `FAIL`, Invalidación y Reentrega `PASS`

> **ADVERTENCIA EXPLÍCITA:** Este documento es un **[SIMULACRO_FICTICIO]** exigido por `P0-008` (`MASTER_EXECUTION_PLAN.md` §12). Todos los nombres de tareas simuladas, SHAs (`0000...dead`, `0000...cafe`), métricas e identificadores son **sintéticos y ficticios**; no representan producto implementado ni evidencia de release.

---

## 1. Escenario `[SIMULACRO_FICTICIO]`

- **Tarea ficticia simulada:** `PX-SIM-04` — *Endpoint y formulario de borrador de inscripción* (`owner: backend-datos`, `reviewer: arquitecto-seguridad`, `qa: qa-e2e`, `guardian: release-guardian`).
- **Tarea consumidora afectada (`FE`):** `PX-SIM-08` — *Vista de revisión de inscripción* (previamente en `ACEPTADA` sobre `base_sha: 0000000000000000000000000000000000000001`).

---

## 2. Entrega Inicial (Rechazada — `FAIL` + `INVALIDATED`)

### 2.1 Handoff de 10 puntos enviado por el autor `[SIMULACRO_FICTICIO]`
1. **Task ID y estado solicitado:** `PX-SIM-04 -> PEER_REVIEW`.
2. **Resultado observable y criterios cubiertos:** Supuesto cumplimiento de `AC-SIM-01`.
3. **Alcance exacto y archivos modificados:** `src/modules/registration/draft.ts`, `src/shared/contracts/registration.schema.ts`.
4. **Commits y migraciones:** `000000000000000000000000000000000000dead` (sin migración).
5. **Contratos / API / eventos modificados:** Cambio no avisado en `RegistrationDraftDto` (renombrado `priceCents` -> `amountMinor`).
6. **Comandos ejecutados y resultado:** *"Los tests unitarios pasaron en mi máquina"* *(sin comando exacto ni código de salida)*.
7. **Evidencias y rutas:** `docs/evidence/WXX/PX-SIM-04/summary.md` *(falta `commands.txt` y cobertura)*.
8. **Riesgos, deuda y preguntas abiertas:** *"Ninguno"*.
9. **Procedimiento de rollback:** `git revert 000000000000000000000000000000000000dead`.
10. **Receptor y siguiente acción:** `arquitecto-seguridad` (`PEER_REVIEW`) y `release-guardian`.

### 2.2 Dictamen de Rechazo e Invalidación `[SIMULACRO_FICTICIO]`
- **Decisión de `arquitecto-seguridad` (`PEER_REVIEW`):** **`FAIL`** (vuelve a `DESARROLLO`).
  - Motivo 1: Afirmación narrativa en campo 6; faltan comandos reproducibles y reporte de cobertura (`QUALITY_GATES.md` §3).
  - Motivo 2: Cambio de contrato API `RegistrationDraftDto` fuera de alcance declarado sin actualizar consumidores (`MASTER_EXECUTION_PLAN.md` §16.1).
- **Acción automática de `release-guardian` (§8 de `QUALITY_GATES.md`):**
  - Emite estado **`INVALIDATED`** sobre la tarea consumidora `PX-SIM-08` (disparador #3: *Contrato API*, invalidando sus gates `G1`, `G3`, `G4`, `G5`, `G6`) y devuelve `PX-SIM-08` a `PROPUESTA` hasta estabilizar el contrato versionado.

---

## 3. Reentrega Corregida y Aceptación Independiente (`PASS`) `[SIMULACRO_FICTICIO]`

### 3.1 Handoff de 10 puntos de reentrega `[SIMULACRO_FICTICIO]`
1. **Task ID y estado solicitado:** `PX-SIM-04 -> PEER_REVIEW -> QA -> ACEPTADA`.
2. **Resultado observable y criterios cubiertos:** `AC-SIM-01` (`PASS`), contrato versionado v1 preservado sin ruptura hacia `PX-SIM-08`.
3. **Alcance exacto y archivos modificados:** `src/modules/registration/draft.ts`, `tests/unit/registration-draft.test.ts`, `docs/evidence/WXX/PX-SIM-04/{summary.md,commands.txt,approvals.md}`.
4. **Commits y migraciones:** `000000000000000000000000000000000000cafe` (revertido el cambio de contrato incompatible).
5. **Contratos / API / eventos modificados:** `NINGUNO` (mantiene `RegistrationDraftDto v1`).
6. **Comandos ejecutados y resultado:**
   - `corepack pnpm run lint` (`exit_code: 0`)
   - `corepack pnpm run typecheck` (`exit_code: 0`)
   - `corepack pnpm run test:coverage` (`exit_code: 0`, `94 %` líneas, `91 %` ramas, `100 %` ramas críticas)
7. **Evidencias y rutas:** `docs/evidence/WXX/PX-SIM-04/{summary.md,commands.txt,gate-manifest.json,approvals.md}`.
8. **Riesgos, deuda y preguntas abiertas:** Ningún P0/P1; `PX-SIM-08` requiere revalidación tras confirmar contrato v1.
9. **Procedimiento de rollback:** `git revert 000000000000000000000000000000000000cafe`.
10. **Receptor y siguiente acción:** `release-guardian` para reproducción en worktree limpio.

### 3.2 Manifiesto de cierre simulado (`14` campos de `QUALITY_GATES.md` §7) `[SIMULACRO_FICTICIO]`
```json
{
  "task_id": "PX-SIM-04",
  "gate_id": "G2",
  "commit_sha": "000000000000000000000000000000000000cafe",
  "base_sha": "0000000000000000000000000000000000000001",
  "environment": { "os": "simulated", "node": "24.16.0", "pnpm": "10.34.9" },
  "started_at": "2026-11-18T21:00:00Z",
  "finished_at": "2026-11-18T21:00:12Z",
  "commands": [
    { "token": "<UNIT_TEST>", "command": "corepack pnpm run test:unit", "exit_code": 0, "duration_ms": 1200 },
    { "token": "<COVERAGE>", "command": "corepack pnpm run test:coverage", "exit_code": 0, "duration_ms": 1800 }
  ],
  "thresholds": { "lines_min": 85, "branches_min": 80, "critical_branches_min": 100 },
  "results": { "lines_pct": 94.0, "branches_pct": 91.0, "critical_branches_pct": 100.0 },
  "artifacts": [
    { "path": "docs/evidence/WXX/PX-SIM-04/summary.md", "name": "summary.md", "format": "md", "sha256": "0000000000000000000000000000000000000000000000000000000000000000" }
  ],
  "defects": [],
  "reviewer": "release-guardian",
  "status": "PASS",
  "reason": "[SIMULACRO_FICTICIO] Reproducción independiente en checkout limpio superó G1/G2 sin defectos P0/P1 ni PII."
}
```
