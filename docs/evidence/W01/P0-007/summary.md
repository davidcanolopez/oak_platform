# Evidencia P0-007 — Estrategia de Pruebas, Matriz de Navegadores/5 Viewports, Accesibilidad y Trazabilidad

- **Task ID:** `P0-007`
- **Owner:** `qa-e2e`
- **Reviewer designado:** `auditor-no-funcional`
- **Guardian:** `release-guardian`
- **Rama:** `feat/p0-007-qa-strategy`
- **Base SHA:** `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`
- **Candidate SHA:** Ver SHA completo en el handoff de entrega y `git rev-parse HEAD` sobre `feat/p0-007-qa-strategy` (sin referencia circular dentro del commit).
- **Fecha UTC:** `2026-11-18T21:28:00Z`

---

## 1. Alcance ejecutado dentro de `allowed_paths`

Se limpió la rama aislada `feat/p0-007-qa-strategy` basada en `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7` (retirando de la copia local del worktree únicamente los archivos untracked ajenos `docs/agentic/packets/P0-002.md`, `P0-003.md`, `P0-006.md` sin alterar archivos prohibidos) y se entregaron exclusivamente los artefactos autorizados:

1. [`docs/qa/TEST_STRATEGY.md`](../../../qa/TEST_STRATEGY.md):
   - Principio de diseño paralelo de QA antes de implementación (`MASTER_EXECUTION_PLAN.md` §8.4, `P1-010`), derivación desde criterios de aceptación, invariantes `§7.5` y riesgos, e independencia QA/Release Guardian.
   - Pirámide de 9 capas (`unit`, `component`, `integration`, `contract`, `E2E`, `visual regression`, `a11y`, `security`, `load/resilience`).
   - Umbrales `G2`–`G6` exactos: `100 %` unitarios PASS, `>= 85 %` líneas, `>= 80 %` ramas, `>= 90 %` diff, `100 %` ramas relevantes en precio/cupo/authz/estados/inscripción-pagos-reembolsos/idempotencia, `0` skips/only/cuarentenas, `0 %` flake en `3` ejecuciones consecutivas, CWV p75 (`LCP <= 2,5 s`, `INP <= 200 ms`, `CLS <= 0,1`), Lighthouse CI móvil (`>= 90` perf, `>= 95` a11y), API `p95 <= 500 ms`, regresión `<= 10 %` y RPO `<= 24 h` / RTO `<= 4 h`.
   - Cobertura obligatoria de estados UI (`loading`, `empty`, `error`, `disabled`, `permission denied` + `default`, `hover`, `focus visible`, `active/pressed`, `selected/current`, `success`, `partial data`, `stale data`) y de los 9 estados de formulario de `BRAND_UX_CONTRACT.md` §11.3.
   - Política anti-flake (`0 %` en 3 runs con `retries: 0`, prohibición de `waitForTimeout`/skips, retención de trazas/vídeos/capturas sin PII), severidades `P0`–`P3`, reglas de datos sintéticos sin PII (`P0-009`), catálogo de comandos canónicos e invalidación automática por SHA.
2. [`docs/qa/BROWSER_VIEWPORT_MATRIX.md`](../../../qa/BROWSER_VIEWPORT_MATRIX.md):
   - Matriz de navegadores: 2 últimas versiones estables de **Chrome**, **Edge**, **Firefox**, **Safari** (desktop) más **Safari iOS** y **Chrome Android** (móvil).
   - Los **5 viewports obligatorios**: `320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900` alineados con los breakpoints `320–767`, `768–1199`, `>= 1200 px`.
   - Contrato determinista de regresión visual (`BRAND_UX_CONTRACT.md` §14): baselines post-D1, seed fijo sin PII, fechas/TZ/random congelados, espera de fuentes/imágenes, animaciones/caret desactivados, 5 viewports, mismo locale/tema, masking acotado, inventario de páginas/estados y prohibición de pares de contraste inválidos y glifos Unicode.
   - Plan WCAG 2.2 AA (`axe-core` automático `0` critical/serious + Lighthouse `>= 95` + verificación manual de teclado sin trampas, foco visible `3 px`, objetivos `48x48 px`, zoom `200 %`, reflow `320 px`, `prefers-reduced-motion` CSS/JS, contraste y revisión manual con **`NVDA`** + lector móvil **`TalkBack`** / **`VoiceOver`**).
3. [`docs/qa/TRACEABILITY_MATRIX_TEMPLATE.md`](../../../qa/TRACEABILITY_MATRIX_TEMPLATE.md):
   - Plantilla precargada con el **100 % de los 44 criterios mínimos** `AC-J01-01`..`AC-J08-04` de `MASTER_EXECUTION_PLAN.md` §13 más 10 requisitos transversales no funcionales (`NFR-01`..`NFR-10`), con columnas para prioridad, tipo de prueba, caso negativo/borde asociado, fixture sintética, ID/ruta de test, comando canónico, evidencia por SHA, gate y estado, lista para instanciación en `P1-010` y cierre en `P8-002`.
4. Paquete y evidencias actualizadas: `docs/agentic/packets/P0-007.md` (`status: "PEER_REVIEW"`, §12 y §13) y `docs/evidence/W01/P0-007/{summary.md,commands.txt,approvals.md}`.

---

## 2. Resumen de verificaciones reproducibles

- Conteo y coincidencia exacta de criterios: `44/44` IDs (`AC-J01-01`..`AC-J08-04`) extraídos de `MASTER_EXECUTION_PLAN.md` §13 verificados presentes en `TRACEABILITY_MATRIX_TEMPLATE.md`.
- Cobertura estructural verificada por script Python: 5 viewports (`320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900`), 6 navegadores desktop/móvil, `NVDA` + `TalkBack`/`VoiceOver`, `axe-core`, foco `3 px`, `48x48 px`, zoom `200 %`, reflow `320 px`, `prefers-reduced-motion`, 5 estados UI obligatorios + estados de formulario §11.3, umbrales `G2`–`G5`, política anti-flake `0 %` / 3 ejecuciones y severidades `P0`–`P3`.
- Escaneo de seguridad/privacidad: `0` secretos, `0` emails personales, `0` PII en todos los archivos entregados.
- Verificación de rutas y working tree: cambios limitados estrictamente a los 7 `allowed_paths`; `sites/**`, `docs/brand/**`, `docs/security/**`, `docs/adr/**` y `docs/agentic/GATE_STATUS.md` intactos.

---

## 3. Riesgos residuales y limitaciones declaradas

- **Pre-código y pre-runner (`P0-004`):** al ser una tarea documental de estrategia de Fase 0, aún no existe aplicación, suite ejecutable de Vitest/Playwright ni comandos canónicos reales resueltos (dependen de `P0-004` y fases 2+).
- **Decisiones `D0` y `D1` pendientes:** `DECISION_LOG.md` mantiene `D0` y `D1` en `PENDING USER VALIDATION`; cualquier ajuste de alcance o tokens/rutas en `D0`/`D1` o en `P1-003`/`P1-009` obligará a actualizar la matriz antes de abrir Fase 2.
- **Dataset sintético (`P0-009`):** las referencias concretas de fixture se enlazarán en `P1-010` una vez aceptado `P0-009`.
- **Gate G0:** permanece en `FAIL` hasta completar los paquetes restantes de Fase 0 y emitir el veredicto independiente `P0-010` por `release-guardian`.