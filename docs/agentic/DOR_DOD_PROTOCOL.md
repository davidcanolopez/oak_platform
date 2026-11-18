# Protocolo Operativo de DoR, DoD, Handoffs, Invalidación y Excepciones — OAK

- **Task ID:** `P0-008`
- **Versión:** `1.0`
- **Fuentes normativas:** `AGENTS.md`, `docs/agentic/MASTER_EXECUTION_PLAN.md` (§8.3, §9, §15, §16, §17), `docs/agentic/QUALITY_GATES.md` (§2–§4, §7–§11), `docs/agentic/TASK_PACKET_TEMPLATE.md`, `docs/brand/G0_BRAND_UX_BASELINE.md`, `docs/security/THREAT_MODEL.md`, `docs/qa/TEST_STRATEGY.md`

---

## 1. Máquina de estados obligatoria (`QUALITY_GATES.md` §4)

Secuencia válida única (sin saltos):

```text
PROPUESTA -> READY -> DESARROLLO -> PEER_REVIEW -> QA -> NO_FUNCIONAL -> ACEPTADA -> DESPLEGADA
```

Estados auxiliares/terminales:
- `BLOCKED`: falta decisión, dependencia externa o capacidad de entorno (requiere causa, owner y siguiente acción).
- `FAIL`: incumplimiento verificable de criterio, cobertura, seguridad, accesibilidad o evidencia.
- `INVALIDATED`: evidencia previamente válida dejó de serlo por un cambio posterior (§4).
- `CANCELADA`: tarea retirada explícitamente por el usuario.

| Transición | Condición mínima obligatoria | Autoridad que valida |
|---|---|---|
| `PROPUESTA -> READY` | Paquete `TASK_PACKET_TEMPLATE.md` completo (0 `POR_DEFINIR`), dependencias en `PASS`/`ACEPTADA`, `base_sha` fijado y `allowed_paths` disjuntos | `release-guardian` |
| `READY -> DESARROLLO` | Rama/worktree aislado creado desde `base_sha` con `status: "READY"` y único owner asignado | `orquestador-oak` |
| `DESARROLLO -> PEER_REVIEW` | Implementación acotada a `allowed_paths`, `delivery_report` (§12) completo con `candidate_sha`, comandos reales y carpeta `docs/evidence/<semana>/<task-id>/` | `owner_agent` |
| `PEER_REVIEW -> QA` | Revisión independiente (`reviewer_agent != owner_agent`) emitida en `PASS` con checklist §14 sin bloqueantes | `reviewer_agent` |
| `QA -> NO_FUNCIONAL` | `G1`–`G4` aplicables reproducidos en `PASS` sobre el `candidate_sha` exacto en checkout limpio | `qa-e2e` / `release-guardian` |
| `NO_FUNCIONAL -> ACEPTADA` | `G5`/`G6` aplicables en `PASS`, `0` defectos `P0`/`P1` abiertos (y `D2` cuando aplique) | `release-guardian` (único autorizado) |
| `ACEPTADA -> DESPLEGADA` | `D3` aprobada por usuario, artefacto inmutable por SHA/digest y `G7` en `PASS` tras smoke y observación | `usuario` (`D3`) + `release-guardian` (`G7`) |

---

## 2. Definition of Ready (DoR) — Entrada a `READY`

Una tarea pasa de `PROPUESTA` a `READY` **únicamente** si cumple los 8 controles:

- [ ] **DoR-01 — Identidad y fronteras:** `task_id`, `owner_agent` único, `reviewer_agent` distinto del owner, `guardian_agent: "release-guardian"`, `base_sha` exacto, `allowed_paths` y `forbidden_paths` sin solapamiento con tareas activas.
- [ ] **DoR-02 — Dependencias satisfechas:** Todas las tareas y gates predecesores constan en `PASS` / `ACEPTADA` en `TASK_BOARD.md` / `GATE_STATUS.md`.
- [ ] **DoR-03 — Criterios verificables:** Criterios `AC-xx` atómicos (Dado/Cuando/Entonces), prioridades `P0–P3` y reglas de negocio trazadas.
- [ ] **DoR-04 — Datos sintéticos y cuentas:** Fixtures y cuentas de prueba definidos sin PII real ni datos ilustrativos prohibidos del deck.
- [ ] **DoR-05 — Riesgos identificados:** Impacto explícito en PII, autenticación, autorización, pagos, cupo, migraciones, API y accesibilidad (WCAG 2.2 AA / 5 viewports cuando aplique UI).
- [ ] **DoR-06 — Contratos disponibles:** Contratos DTO/API/Zod o mocks versionados disponibles cuando dependa de otro módulo.
- [ ] **DoR-07 — Plan de pruebas y comandos:** Comandos canónicos aplicables de `QUALITY_GATES.md` §5/`ADR-002` (sin placeholders tras `G0`), casos negativos, concurrencia e idempotencia cuando apliquen.
- [ ] **DoR-08 — Exclusiones y rollback:** `scope.out` explícito y procedimiento de rollback documentado.

---

## 3. Definition of Done (DoD) — Entrega y Aceptación

Una tarea solo puede cerrarse como `ACEPTADA` cuando cumple:

- [ ] **DoD-01 — Calidad estática (`G1`):** Formato limpio, ESLint `--max-warnings=0`, TypeScript `strict` sin errores, `build` reproducible y `secret-scan` con `0` secretos.
- [ ] **DoD-02 — Revisión independiente (`PEER_REVIEW`):** Aprobada por `reviewer_agent != owner_agent`; el autor nunca aprueba su propio cambio ni sus pruebas.
- [ ] **DoD-03 — Suite automatizada (`G2–G4`):** Tests unitarios, integración, contrato y E2E aplicables ejecutados en `PASS` (`0` skips/`only`/cuarentenas; cobertura `>=85 %` líneas, `>=80 %` ramas, `>=90 %` diff y `100 %` ramas críticas).
- [ ] **DoD-04 — Estados completos de UI (`BRAND_UX_CONTRACT.md` §11):** Cubiertos `loading`, `empty`, `error`, `disabled`, `permission denied`, `default`, `hover`, `focus visible`, `success` cuando aplique UI.
- [ ] **DoD-05 — Accesibilidad y responsive (`G5`):** Teclado sin trampas, foco visible `>=3 px`, objetivos `>=48x48 px`, contraste AA sin pares prohibidos, zoom `200 %`, reflow `320 px` (`5` viewports), `reduced-motion` CSS/JS, `axe` `0` critical/serious y lectura manual cuando aplique.
- [ ] **DoD-06 — Seguridad y privacidad (`G5` / `THREAT_MODEL.md`):** Pruebas negativas (`NT-*`), aislamiento multi-tenant, `0` Critical/High y `0` PII/tokens/credenciales en logs, Sentry, fixtures o capturas.
- [ ] **DoD-07 — Documentación y contratos actualizados:** ADRs, esquemas, OpenAPI/Zod, runbooks y matrices sincronizados.
- [ ] **DoD-08 — Evidencia completa por SHA:** Carpeta `docs/evidence/<semana>/<task-id>/` con `summary.md`, `commands.txt`, informes legibles por máquina y `approvals.md` ligados al `candidate_sha`.
- [ ] **DoD-09 — Cero defectos bloqueantes:** `0` defectos `P0` o `P1` abiertos asociados a la tarea.
- [ ] **DoD-10 — Reproducción independiente del Guardian:** `release-guardian` repite los comandos clave desde checkout/worktree limpio sobre el `candidate_sha` exacto y emite `PASS`.

---

## 4. Protocolo de Handoff de 10 puntos (`MASTER_EXECUTION_PLAN.md` §16)

Todo handoff entre agentes (`DEV -> PEER_REVIEW`, `FE <-> BE`, `DEV -> QA`, `QA -> RG`) debe incluir explícitamente los **10 campos obligatorios**:

1. **Task ID y estado solicitado** (ej. `P4-006 -> PEER_REVIEW`).
2. **Resultado observable y criterios cubiertos** (`AC-*` verificados).
3. **Alcance exacto y archivos modificados** (todos dentro de `allowed_paths`).
4. **Commits y migraciones** (SHA completo de 40 caracteres y scripts SQL si aplican).
5. **Contratos / API / eventos modificados** (o `NINGUNO`).
6. **Comandos ejecutados y resultado** (comandos exactos no interactivos, código de salida y duración).
7. **Evidencias y rutas** (`docs/evidence/<semana>/<task-id>/...` y artefactos máquina).
8. **Riesgos, deuda y preguntas abiertas** (incluyendo limitaciones conocidas).
9. **Procedimiento de rollback** (pasos verificables y reversibilidad de migración si aplica).
10. **Receptor y siguiente acción** (agente concreto y verificación esperada).

**Reglas específicas por frontera:**
- **`FE <-> BE`:** `BE` entrega schema Zod, ejemplos, códigos de error, matriz de permisos y fixtures antes de integrar; `FE` desarrolla contra mocks del mismo contrato; `QA` ejecuta contract tests; todo cambio incompatible reabre tareas consumidoras (`INVALIDATED`).
- **`Desarrollo -> QA`:** El autor entrega tests unitarios/integración de su nivel; `QA` valida happy path, límites, permisos negativos, errores, reintentos, accesibilidad y concurrencia.
- **`QA -> Release Guardian`:** `QA` entrega resultados completos (nunca una selección parcial); `RG` reproduce desde checkout limpio y acepta o veta con requisito fallido.

---

## 5. Matriz de Invalidación Automática por Cambio (`QUALITY_GATES.md` §8)

Un veredicto `PASS` deja de ser válido en cuanto cambia cualquier elemento que afecte a su conclusión. La evidencia **nunca se arrastra** entre SHAs distintos.

| # | Tipo de cambio posterior al SHA certificado | Gates que deben repetirse como mínimo |
|---:|---|---|
| 1 | Código de aplicación | `G1`, `G2`, `G4` y gates afectados |
| 2 | Regla de dominio | `G1`, `G2`, `G3`, `G4` |
| 3 | Contrato API | `G1`, `G3`, `G4`, `G5`, `G6` |
| 4 | Esquema o migración | `G1`, `G3`, `G4`, `G6`, `G7` |
| 5 | Lockfile o runtime | `G1`, `G2`, `G3`, `G4`, `G5`, `G6` |
| 6 | Autenticación / autorización | `G1`, `G2`, `G3`, `G4`, `G5`, `G6` |
| 7 | Pago o webhook | `G1`, `G2`, `G3`, `G4`, `G5`, `G6` |
| 8 | UI, tokens o navegación | `G1`, `G2`, `G4` y accesibilidad/rendimiento de `G5` |
| 9 | Infraestructura o configuración | `G5`, `G6`, `G7` |
| 10 | Observabilidad o alertas | `G6`, `G7` |
| 11 | Artefacto después de certificar | Todos los gates aplicables |

Procedimiento ante disparador: `release-guardian` marca la tarea/gate como `INVALIDATED`, registra el SHA disparador y devuelve el flujo al primer estado que deba reejecutarse.

---

## 6. Defectos y Protocolo de Excepciones (`WAIVED_BY_USER`)

### 6.1 Severidades (`QUALITY_GATES.md` §9)
- **`P0` (Crítico):** pérdida/corrupción de datos, brecha, cobro incorrecto, sobreventa, caída total o imposibilidad de recuperar. **Bloquea todo.**
- **`P1` (Alto):** journey principal imposible, autorización incorrecta, incumplimiento WCAG AA grave, migración o rollback inseguro. **Bloquea aceptación y release.**
- **`P2` (Medio):** degradación relevante con alternativa temporal segura. Requiere responsable y fecha antes del release.
- **`P3` (Bajo):** defecto cosmético sin impacto funcional o de riesgo apreciable. Entra en backlog trazado.

### 6.2 Excepciones (`QUALITY_GATES.md` §10 y `MASTER_EXECUTION_PLAN.md` §17)
- **Autoridad exclusiva:** **Únicamente el usuario** puede aprobar una excepción. Ni `orquestador-oak`, ni `release-guardian`, ni el autor pueden concederla ni inferirla.
- **Límite absoluto (no dispensable):** Prohibido conceder excepciones para vulnerabilidades `Critical`/`High`, pérdida de datos, sobreventa o cobros incorrectos.
- **Registro obligatorio:** Toda excepción se registra como **`WAIVED_BY_USER`** (nunca como `PASS`) con los **10 campos exactos**:
  1. `exception_id`
  2. `usuario que aprueba y timestamp UTC`
  3. `gate, requisito y SHA afectados`
  4. `riesgo concreto y peor consecuencia`
  5. `motivo de negocio`
  6. `controles compensatorios`
  7. `responsable`
  8. `fecha de expiración`
  9. `condición de retirada`
  10. `plan y fecha de corrección`
- Al cambiar el `commit_sha`, vencer `fecha de expiración` o ampliarse el riesgo, la excepción caduca automáticamente y vuelve a ser necesaria aprobación explícita.
