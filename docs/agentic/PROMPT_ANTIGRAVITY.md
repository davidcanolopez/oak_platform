# Prompt de arranque para Antigravity

Antigravity descubre `AGENTS.md`, las reglas de `.agents/rules/` y los agentes de `.agents/agents/`. Para este proyecto conviene usar `/teamwork`; si el plan contratado no lo incluye, usa `/swarm` con un coordinador, un Release Guardian y un verificador por cada dos a cuatro implementadores.

## Paso 1 Plan revisable

```text
/plan Audita el estado actual de OAK y prepara la ejecución de la Fase 0. Lee AGENTS.md, docs/agentic/MASTER_EXECUTION_PLAN.md, docs/agentic/QUALITY_GATES.md, docs/brand/BRAND_UX_CONTRACT.md, docs/agentic/GATE_STATUS.md y docs/agentic/DECISION_LOG.md. No modifiques código de producto. Produce paquetes de trabajo atómicos para llegar a G0 PASS y una propuesta D0. Debes incluir un Release Guardian independiente que reproduzca la evidencia y bloquee el avance si falta cualquier requisito.
```

Revisa el artefacto de plan. Solo debe pedir validación sobre D0; las elecciones técnicas reversibles se resuelven mediante ADRs.

## Paso 2 Ejecución multiagente

```text
/teamwork Ejecuta el plan aprobado de OAK empezando por Fase 0. Usa los agentes de .agents/agents y mantén release-guardian activo e independiente en todos los hitos. El Orquestador no implementa; delega tareas no solapadas. Ningún agente aprueba su propio trabajo. No avances a la siguiente fase sin PASS vigente del gate anterior. Reproduce pruebas desde un checkout limpio, liga cada evidencia al task_id y SHA, reabre gates afectados por cambios y corrige todos los P0/P1 antes de integrar. Limita al usuario a D0, D1, D2 y D3. No habilites pagos reales ni producción sin autorización explícita.
```

## Política recomendada

- Permisos: `Default` o `Auto` con sandbox; evita `Turbo`.
- Workspaces: `branch` para implementadores; `inherit` o checkout limpio de solo lectura para Guardian y auditores.
- Paralelismo: máximo tres implementadores más un verificador/Guardian; baja el número cuando compartan esquema o contratos.
- Seguimiento: usa `/agents` para estado y el tablero de Teamwork/Swarm para handoffs públicos.
- El primer resultado aceptable es `G0 PASS`; no una pantalla nueva.

