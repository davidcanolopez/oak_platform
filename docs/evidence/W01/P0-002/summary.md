# Evidencia P0-002 — Tablero de Tareas, Ruta Crítica y Baseline de Requisitos

- **Task ID:** `P0-002`
- **Owner:** `orquestador-oak` (`SUP`)
- **Reviewer designado:** `analista-funcional`
- **Guardian:** `release-guardian`
- **Base SHA:** `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`

## 1. Resumen de entregables

1. `docs/agentic/TASK_BOARD.md` y `docs/evidence/W01/P0-002/board-export.json`:
   - `114` tareas totales cargadas (`113` de `MASTER_EXECUTION_PLAN.md` §12 + `P0-011` añadida con trazabilidad explícita para el requisito #14 de `QUALITY_GATES.md` §6 `G0`).
   - `P0-001` marcada como `ACEPTADA` (`87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`); `P0-002`, `P0-003`, `P0-006`, `P0-007` en `READY`; resto de Fase 0 y el 100 % de Fases 1–8 en `PROPUESTA` hasta `G0 PASS` y validación `D0`.
   - Ruta crítica calculada en el DAG completo: `54` nodos encadenados hasta `P8-011`.
2. `docs/agentic/REQUIREMENTS_BASELINE.md`:
   - Los `44` criterios mínimos `AC-J01-01`..`AC-J08-04` y `9` objetivos no funcionales (`NFR-01`..`NFR-09`) priorizados explícitamente en `P0`/`P1`/`P2` y enlazados a fases y gates.

## 2. Verificaciones ejecutadas (incluyendo casos negativos)

- Validación DAG y esquema sobre `board-export.json`: `0` ciclos, `0` dependencias inexistentes, `0` auto-revisiones (`owner == reviewer`), `0` tareas de Fase 1+ fuera de `PROPUESTA`.
- Prueba negativa sintética sobre detector de ciclos y auto-revisión: verificada detección y rechazo explícito (`exit != 0` / excepción en comprobador) ante un ciclo inyectado en memoria.
- Escaneo regex de secretos y PII/emails personales sobre `TASK_BOARD.md`, `REQUIREMENTS_BASELINE.md`, `board-export.json` y `docs/evidence/W01/P0-002/*`: `0` coincidencias.

## 3. Riesgos residuales y limitaciones

- Los IDs `AC-J01..AC-J08` deberán expandirse a escenarios Given/When/Then durante `P1-003` tras `G0 PASS` y validación `D0`.
- `AC-J02-04` (`Favoritos`) permanece sujeta a la confirmación binaria de `D0`.
