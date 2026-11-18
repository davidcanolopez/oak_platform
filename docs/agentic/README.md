# Paquete de ejecución multiagente de OAK

Este directorio convierte la definición de producto y los decks de OAK en un sistema de trabajo ejecutable por Codex o Antigravity. La plataforma todavía no existe: el primer objetivo es obtener `G0 PASS`, no empezar por pantallas.

## Orden de lectura

1. [`../../AGENTS.md`](../../AGENTS.md): constitución común y límites de autoridad.
2. [`MASTER_EXECUTION_PLAN.md`](MASTER_EXECUTION_PLAN.md): alcance, arquitectura, fases, tareas, dependencias y criterios funcionales.
3. [`QUALITY_GATES.md`](QUALITY_GATES.md): supervisor independiente, estados, gates G0-G7 y evidencia.
4. [`../brand/BRAND_UX_CONTRACT.md`](../brand/BRAND_UX_CONTRACT.md): contrato operativo derivado de los decks.
5. [`TASK_PACKET_TEMPLATE.md`](TASK_PACKET_TEMPLATE.md): contrato de cada tarea entre owner, reviewer, QA y Guardian.
6. [`DECISION_LOG.md`](DECISION_LOG.md): las cuatro decisiones que requieren al usuario.
7. [`GATE_STATUS.md`](GATE_STATUS.md): estado técnico actual.

## Cómo arrancar

- **Codex:** abre el repositorio y copia [`PROMPT_CODEX.md`](PROMPT_CODEX.md) en un chat nuevo.
- **Antigravity:** abre el repositorio, comprueba que ha descubierto `AGENTS.md`, `.agents/rules/` y `.agents/agents/`, y sigue [`PROMPT_ANTIGRAVITY.md`](PROMPT_ANTIGRAVITY.md).

En ambos casos, exige que el Orquestador mantenga un `release-guardian` independiente. Los implementadores no pueden aprobar sus propios cambios y ningún incremento dependiente avanza sin `PASS` reproducible.

## Roles disponibles

Los briefs portables están en `../../.agents/agents/`:

- `orquestador-oak`: coordinación y ruta crítica;
- `release-guardian`: supervisor con veto;
- `analista-funcional`: historias, criterios y UAT;
- `arquitecto-seguridad`: ADR, dominio, privacidad y amenazas;
- `ux-brand`: IA, tokens, componentes y prototipo;
- `frontend`: interfaz responsive y accesible;
- `backend-datos`: servicios, datos, permisos y pagos de prueba;
- `qa-e2e`: integración, E2E, concurrencia y regresión;
- `auditor-no-funcional`: seguridad, accesibilidad, rendimiento y resiliencia;
- `devops-release`: CI/CD, observabilidad, backup y rollback;
- `documentacion-handoff`: README, runbooks, guía de demo y entrega operativa final.

Codex puede recrear estos roles al delegar. Antigravity puede descubrirlos directamente como custom subagents.

## Intervención del usuario

El usuario actúa únicamente como validador:

| Decisión | Resultado a validar |
| --- | --- |
| D0 | Beachhead, alcance, datos, pagos de prueba y exclusiones |
| D1 | Prototipo navegable, arquitectura de información y contrato de marca/UX |
| D2 | UAT de la beta completa en staging |
| D3 | Autorización de release del artefacto exacto recomendado por el Guardian |

Las elecciones técnicas reversibles, correcciones y validaciones intermedias son responsabilidad de los agentes. Solo el usuario puede aceptar una excepción de calidad o ampliar el alcance.

## Estado inicial

`G0 = FAIL`: no hay todavía aplicación, lockfile, esquema, tests ni CI. Los decks bajo `sites/` son referencias visuales estáticas. El Orquestador debe ejecutar primero P0-001 a P0-010 y no iniciar features antes de que el Guardian registre `G0 PASS`.

