# Evidencia P0-002 — Tablero de Tareas, Ruta Crítica y Baseline de Requisitos

- **Task ID:** `P0-002`
- **Owner:** `orquestador-oak` (`SUP`)
- **Reviewer designado:** `analista-funcional`
- **Guardian:** `release-guardian`
- **Base SHA:** `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`

## 1. Resumen de entregables

1. `docs/agentic/TASK_BOARD.md` y `docs/evidence/W01/P0-002/board-export.json`:
   - `114` tareas totales cargadas (`113` de `MASTER_EXECUTION_PLAN.md` §12 + `P0-011` añadida con trazabilidad explícita al requisito #14 de `QUALITY_GATES.md` §6 `G0`), todas con campo `wave`, `owner_agent` único, `reviewer_agent` independiente, dependencias, gate de salida y estado.
   - `P0-001` marcada como `ACEPTADA` (`87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`); `P0-002`, `P0-003`, `P0-006`, `P0-007` en `READY`; resto de Fase 0 y el 100 % de Fases 1–8 en `PROPUESTA` hasta `G0 PASS` y validación `D0`.
   - Ruta crítica calculada en el DAG completo: `54` nodos encadenados hasta `P8-011`.
2. `docs/agentic/REQUIREMENTS_BASELINE.md`:
   - Los `44` criterios mínimos `AC-J01-01`..`AC-J08-04` y `9` objetivos no funcionales (`NFR-01`..`NFR-09`) priorizados explícitamente en `P0`/`P1`/`P2`, con fase objetivo y gates aplicables.

## 2. Desviaciones declaradas respecto a `MASTER_EXECUTION_PLAN.md` §12

1. Adición de `P0-011` (`ux-brand`) para cubrir explícitamente el requisito #14 de `docs/agentic/QUALITY_GATES.md` §6 (`G0`).
2. Endurecimiento de dependencias en `P0-009` (añadidas `P0-004` y `P0-006` además de `P0-003`) para validar fixtures contra el scaffold real y la clasificación de datos sin colisión de rutas.
3. Inclusión explícita de `P0-001`, `P0-002` y `P0-011` en las dependencias de cierre de `P0-010` (además de `P0-003..P0-009`).

## 3. Verificaciones ejecutadas (comandos exactos en `commands.txt`)

- Validación positiva de invariantes (`exit 0`): `PASS tasks=114 ac=44 nfr=9 pii=0 cycles=0`.
- Prueba negativa de ciclo sintético (`exit 1`): `CYCLE_DETECTED:P0-001`.
- Revisión manual de `0` PII/emails personales/secretos en todos los artefactos de `P0-002`.

## 4. Riesgos residuales y limitaciones

- Los criterios `AC-J01..AC-J08` se expandirán a escenarios Given/When/Then en `P1-003` tras `G0 PASS` y validación `D0`.
- `AC-J02-04` (`Favoritos`) permanece sujeta a confirmación binaria en `D0`.
- Los umbrales numéricos de `NFR-06` y `NFR-07` quedan referidos a `ADR-004` (`P0-003`), actualmente en estado `READY` y pendiente de cierre antes de `G0 PASS`.
