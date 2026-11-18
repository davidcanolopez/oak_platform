# Plantilla Canónica de Carpeta de Evidencias y Manifiesto de Gate

Cada tarea crea `docs/evidence/<semana>/<task-id>/` (p. ej. `docs/evidence/W01/P0-008/`) sin secretos ni PII real.

---

## 1. Estructura estándar de carpeta (`MASTER_EXECUTION_PLAN.md` §15)

| Archivo / Subcarpeta | Aplicabilidad | Contenido mínimo obligatorio |
|---|---|---|
| `summary.md` | Siempre | Alcance ejecutado, criterios `AC-*`, `candidate_sha`, resultado, riesgos residuales y conclusión |
| `commands.txt` | Siempre | Comandos exactos no interactivos, códigos de salida y salidas crudas resumidas |
| `approvals.md` | Siempre | Tabla con `owner`, `reviewer_agent` (!= owner), `release-guardian` y `usuario` cuando aplique (`D0`–`D3`), ligados al SHA |
| `gate-manifest.json` | En cierres de gate (`G0`–`G7`) | Manifiesto legible por máquina con los campos de §2 |
| `test-results/` | Cuando apliquen tests | JUnit XML / JSON / HTML de unit, integration, contract y E2E |
| `coverage/` | Cuando aplique código | Porcentaje de líneas, ramas y diff coverage + 100 % ramas críticas |
| `screenshots/` | Cuando aplique UI | Capturas deterministas `320`, `390`, `768`, `1200`, `1440`; estados normal/empty/error/loading/disabled/focus |
| `a11y/` | Cuando aplique UI | Informe `axe-core` JSON y checklist manual (`NVDA` + lector móvil, teclado, zoom `200 %`, reflow `320 px`, `reduced-motion`) |
| `security/` | Cuando aplique | Salidas `SAST`, `SCA`, `SECRET_SCAN`, `DAST` y `SBOM` sin secretos |
| `performance/` | Cuando aplique | Reportes `CWV`, `Lighthouse CI`, bundle budget y carga |
| `migration/` | Cuando aplique DB | Logs de `migrate:fresh`, `migrate:previous`, `rollback` y `seed` idempotente |
| `deployment/` | Cuando aplique staging/prod | URL, deployment ID, digest inmutable, `smoke` y objetivo de `rollback` |

---

## 2. Plantilla de Manifiesto de Gate (`QUALITY_GATES.md` §7)

Todo cierre de gate (`G0`–`G7`) genera un artefacto JSON que conserva exactamente estos campos:

```json
{
  "task_id": "P0-000",
  "gate_id": "G0",
  "commit_sha": "<SHA_40_CHARS>",
  "base_sha": "<BASE_SHA_40_CHARS>",
  "environment": {
    "os": "<OS>",
    "node": "24.16.0",
    "pnpm": "10.34.9",
    "runtime": "<detalle>"
  },
  "started_at": "<YYYY-MM-DDTHH:MM:SSZ>",
  "finished_at": "<YYYY-MM-DDTHH:MM:SSZ>",
  "commands": [
    {
      "token": "<CANONICAL_TOKEN>",
      "command": "<comando_exacto>",
      "exit_code": 0,
      "duration_ms": 0
    }
  ],
  "thresholds": {
    "description": "<umbrales aplicados>"
  },
  "results": {
    "description": "<valores obtenidos>"
  },
  "artifacts": [
    {
      "path": "docs/evidence/<semana>/<task-id>/<archivo>",
      "name": "<nombre>",
      "format": "<json|xml|md|txt|html>",
      "sha256": "<SHA256_HEX>"
    }
  ],
  "defects": [],
  "reviewer": "release-guardian",
  "status": "PASS",
  "reason": "<explicación breve y verificable>"
}
```

---

## 3. Plantilla base de `summary.md`

```markdown
# Evidencia <TASK_ID> — <Título>

- **Task ID:** `<TASK_ID>`
- **Owner:** `<owner_agent>`
- **Peer Reviewer:** `<reviewer_agent>`
- **Release Guardian:** `release-guardian`
- **Base SHA:** `<base_sha>`
- **Candidate SHA:** `<candidate_sha_en_handoff>`

## 1. Resultado observable y criterios cubiertos
- `<AC-01>`: PASS/FAIL — enlace a evidencia.

## 2. Seguridad, privacidad y accesibilidad (si aplica)
- `0` secretos y `0` PII real confirmados en logs, fixtures, capturas y documentos.
- Resultados `a11y` / pruebas negativas `NT-*`: `<resumen o NO_APLICA justificado>`.

## 3. Rendimiento, migración y rollback (si aplica)
- Presupuestos / migración / rollback verificado: `<resumen o NO_APLICA justificado>`.

## 4. Riesgos residuales y desviaciones
- `<riesgos o NINGUNO>`
```
