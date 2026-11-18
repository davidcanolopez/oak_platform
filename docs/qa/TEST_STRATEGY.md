# Estrategia integral de pruebas de OAK (`TEST_STRATEGY`)

- **Paquete:** `P0-007` (Fase 0 — Baseline y preparación de `G0`)
- **Owner:** `qa-e2e`
- **Estado normativo:** Estrategia base pre-implementación alineada con `AGENTS.md`, `docs/agentic/QUALITY_GATES.md`, `docs/agentic/MASTER_EXECUTION_PLAN.md`, `docs/brand/BRAND_UX_CONTRACT.md` y `docs/agentic/DECISION_LOG.md`.
- **Nota de gobierno:** Las decisiones de producto `D0` y `D1` permanecen en `PENDING USER VALIDATION` y los comandos canónicos reales (`<UNIT_TEST>`, `<E2E_CRITICAL>`, etc.) serán resueltos en `P0-004` antes de cerrar `G0`.

---

## 1. Propósito y jerarquía normativa

Esta estrategia define cómo se diseñan, ejecutan, miden y certifican las pruebas automatizadas y manuales en toda la plataforma web responsive de OAK (experiencia del deportista y workspace del organizador). Su objetivo es exigir la calidad correcta desde el primer módulo, evitar pruebas ad-hoc y asegurar que ningún incremento avance sin evidencia reproducible ligada a un commit SHA inmutable.

En caso de conflicto entre fuentes, prevalece estrictamente el orden fijado en `AGENTS.md`:
1. `docs/agentic/DECISION_LOG.md` (decisiones explícitas del usuario `D0`–`D3`).
2. `docs/agentic/MASTER_EXECUTION_PLAN.md`.
3. `docs/agentic/QUALITY_GATES.md`.
4. `docs/brand/BRAND_UX_CONTRACT.md`.
5. Los decks estáticos bajo `sites/` únicamente como referencia visual (nunca como código ni datos de producción).

---

## 2. Diseño paralelo de QA antes de implementación e independencia

De acuerdo con `MASTER_EXECUTION_PLAN.md` §8.4 y §16.2:

1. **Diseño previo o paralelo (shift-left real):** QA diseña los casos de prueba, los casos negativos, las invariantes a verificar y los requisitos de fixture **antes o en paralelo al desarrollo**, nunca después de terminar la feature.
   - En **Fase 1 (`P1-010`)**, QA enlaza cada criterio funcional `AC-J01-01`..`AC-J08-04` con su suite objetivo, caso negativo y fixture sintética antes de abrir las fases de implementación (`P2`–`P6`).
   - En cada paquete de trabajo (`P2`–`P8`), ningún cambio pasa a `READY` sin plan de pruebas explícito, cuenta/fixture sintética y criterios observables en la plantilla del paquete.
2. **Derivación basada en criterios y riesgos:** Los tests se derivan de los criterios de aceptación (`§13`), invariantes críticas de dominio (`§7.5`), amenazas de seguridad, requisitos de accesibilidad (`BRAND_UX_CONTRACT.md` §13) y riesgos de negocio (cobros, cupos, privacidad y aislamiento multi-tenant), **no** copiando detalles internos de la implementación ya escrita.
3. **Independencia estricta y prohibición de auto-aprobación:**
   - El autor del código incluye las pruebas unitarias/componente/integración propias de su paquete, pero **QA** posee y valida las suites independientes de integración, contratos, E2E, regresión, concurrencia y trazabilidad.
   - **QA no repara el código de producto bajo prueba:** cuando detecta un fallo, documenta y devuelve el defecto al owner correspondiente (`FE`, `BE` o `SRE`).
   - El **Release Guardian** es independiente de todos los implementadores y de QA, reproduce los comandos desde un checkout limpio sobre el SHA candidato y conserva veto absoluto.
4. **Regresión TDD obligatoria en defectos (`P6-009` y posteriores):** Toda corrección de un defecto `P0` o `P1` debe incluir al menos una prueba automatizada que **falle antes** del fix y **pase después**.

---

## 3. Pirámide de pruebas de OAK

La estrategia adopta una pirámide de 9 capas complementarias adaptada al monolito modular (TypeScript strict, Next.js App Router, PostgreSQL/Supabase, Stripe Checkout en modo test y correo en sandbox):

| Capa / Tipo | Objetivo principal | Stack previsto (`P0-003`/`P0-004`) | Alcance y cuándo corre | Gate |
| --- | --- | --- | --- | --- |
| **1. Unit (`unit`)** | Validar reglas puras de dominio, cálculo de precios en minor units, cupos, transiciones de estado, validaciones Zod y sanitización sin I/O | `Vitest` | En cada PR, en local y antes de `PEER_REVIEW`; ejecución rápida y determinista | `G2` |
| **2. Component (`component`)** | Verificar componentes UI aislados, estados interactivos/de formulario, semántica ARIA, `aria-describedby`, foco y `prefers-reduced-motion` | `Vitest` + `Testing Library` + `Storybook` | En cada PR con cambios de UI/tokens; sin lógica crítica exclusiva en cliente | `G2` |
| **3. Integration (`integration`)** | Probar casos de uso reales contra DB efímera/aislada: integridad referencial, restricciones únicas, transacciones atómicas de última plaza, RLS/multi-tenant, migraciones (`fresh` y `N-1`) e idempotencia de seed | `Vitest` / test runner + PostgreSQL/Supabase local aislado | En cada PR que toque dominio, DB, RLS, authz o pagos; obligatorio antes de QA | `G3` |
| **4. Contract (`contract`)** | Verificar compatibilidad entre schemas versionados FE↔BE (mocks `MSW` vs handlers reales), payloads y firmas de Stripe Checkout/webhooks y adaptador de correo sandbox | Esquemas `Zod` / OpenAPI / `MSW` / fixtures de webhook Stripe test | En cada cambio de contrato API, webhook o adaptador externo | `G3` |
| **5. E2E (`e2e`)** | Validar journeys completos `J01..J08` en navegador real (`Chromium`, `Firefox`, `WebKit`), desktop y móvil, incluyendo flujos de error, recuperación de borrador y reintentos | `Playwright` (`<E2E_CRITICAL>`, `<E2E_FULL>`, `<E2E_FLAKE_CHECK>`) | `E2E_CRITICAL` en PR/merge; `E2E_FULL` + `E2E_FLAKE_CHECK` (3x) en incremento/RC/release | `G4` |
| **6. Visual Regression (`visual regression`)** | Detectar regresiones visuales en los 5 viewports obligatorios y estados clave tras Gate D1 (ver `BROWSER_VIEWPORT_MATRIX.md`) | `Playwright` screenshots deterministas + revisión visual | En cada PR con cambios UI/tokens/copy crítica y cierre de fase | `G4` |
| **7. Accessibility (`a11y`)** | Garantizar cumplimiento **WCAG 2.2 AA** con escaneo automático + auditoría manual de teclado, foco, zoom `200 %`, reflow `320 px`, `reduced-motion` y lectores de pantalla (`NVDA` + lector móvil) | `axe-core` + `Lighthouse CI` + protocolo manual (`BROWSER_VIEWPORT_MATRIX.md`) | `axe-core` en PR/E2E; protocolo manual completo en flujos modificados y `P7-001` | `G5` |
| **8. Security & Privacy (`security`)** | Prevenir vulnerabilidades OWASP Top 10, fugas multi-tenant, secretos, abuso de pagos/webhooks, formula injection y exposición de PII | `<SAST>`, `<SCA>`, `<SECRET_SCAN>`, `<DAST>`, `<SBOM>` + tests negativos authz | `SECRET_SCAN`/`SAST`/`SCA` en PR; `DAST` autenticado/no autenticado y revisión manual en `P4-012`/`P7-005`/`P7-006` | `G1`, `G5` |
| **9. Load & Resilience (`load/resilience`)** | Verificar Core Web Vitals, presupuestos de bundle/latencia, concurrencia en última plaza, degradación controlada ante fallos externos y drills de backup/restore y rollback | `Lighthouse CI` + pruebas de carga/concurrencia HTTP/DB + drills staging | CWV/bundle en cambios UI; carga/concurrencia en `P4-011` y `P7-003`; restore/rollback en `P7-009`/`P7-010` | `G5`, `G6` |

### 3.1 Foco obligatorio por dominio crítico (invariantes `§7.5`)

Toda suite que cubra estos módulos debe incluir pruebas explícitas (positivas y negativas):
- **Precios y moneda:** almacenamiento y cálculo exclusivo en minor units enteras (`céntimos EUR`, sin punto flotante); el servidor recalcula subtotal, tasas/gastos de gestión y total ignorando cualquier importe manipulado desde el cliente.
- **Cupo y concurrencia:** reserva transaccional atómica; bajo `N` peticiones simultáneas para la **última plaza** disponible (`cupo = 1`), exactamente `1` petición confirma y `N-1` reciben rechazo limpio sin sobreventa ni doble cobro.
- **Autorización y aislamiento multi-tenant:** política `deny-by-default` en casos de uso y defensa en profundidad mediante RLS en PostgreSQL. Pruebas negativas cruzadas entre atleta A vs atleta B, organizador Org 1 vs Org 2, miembro `INVITED`/`REVOKED` vs `ACTIVE`, usuario anónimo y soporte/admin sin mutación directa de pagos ni cupos.
- **Transiciones de estado:** máquinas de estado cerradas para `Event` (`DRAFT`, `PUBLISHED`, `CLOSED`, `CANCELLED`, `COMPLETED`), `Registration` (`DRAFT`, `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `REFUNDED`), `Payment` (`CREATED`, `REQUIRES_ACTION`, `SUCCEEDED`, `FAILED`, `REFUNDED`) y `Membership` (`INVITED`, `ACTIVE`, `REVOKED`); toda transición ilegal debe fallar de forma explícita y auditable.
- **Idempotencia y webhooks:** envío repetido de creación de checkout con misma `idempotency_key`, webhooks Stripe duplicados, reintentos de confirmación y eventos **fuera de orden** (ej. fallo/cancelación tardía después de `SUCCEEDED` o llegada invertida) deben preservar exactamente un registro confirmado, un pago y un correo enviado.
- **Tiempo y zona horaria:** almacenamiento en `UTC` y conversión explícita a la zona horaria del evento (`Europe/Madrid` en el beachhead inicial), con pruebas en cambios de hora (DST) y cierres de inscripción al límite exacto de minuto.
- **Exportaciones y comunicaciones:** neutralización de *CSV formula injection* (prefijos `=`, `+`, `-`, `@`, `\t`, `\r`), encoding UTF-8 consistente, registro de auditoría en cada exportación y confirmación/selección explícita sin duplicados en briefings.

---

## 4. Umbrales no negociables por Gate (`G2`–`G5`)

Los siguientes umbrales derivan directamente de `QUALITY_GATES.md` §6 y `MASTER_EXECUTION_PLAN.md` §10–§11. Un comando canónico solo devuelve código de salida `0` si satisface el 100 % de sus umbrales aplicables.

| Gate | Métrica / Requisito | Umbral obligatorio | Regla de fallo |
| --- | --- | --- | --- |
| **G2 · Unitarios y componentes** | Resultado de tests unitarios aplicables | `100 %` en `PASS` | Cualquier fallo produce `FAIL` |
| **G2 · Cobertura global** | Cobertura de líneas | **`>= 85 %` líneas** | Por debajo de `85 %` = `FAIL` |
| **G2 · Cobertura global** | Cobertura de ramas | **`>= 80 %` ramas** | Por debajo de `80 %` = `FAIL` |
| **G2 · Cobertura incremental** | Cobertura del diff del cambio (`diff coverage`) | **`>= 90 %` diff** | Por debajo de `90 %` = `FAIL` |
| **G2 · Dominios críticos** | Ramas relevantes en **precio**, **cupo/capacidad**, **autorización (`authz`)**, **transiciones de estado (`estados`)**, **inscripción/pagos/reembolsos** e **idempotencia** | **`100 %` de ramas relevantes** | Cualquier rama descubierta = `FAIL` |
| **G2 · Higiene de suite** | Tests omitidos (`skip`), aislados (`only`) o en cuarentena | **`0`** (salvo `WAIVED_BY_USER`) | Presencia de `skip`/`only` = `FAIL` |
| **G3 · Integración, contratos y datos** | Contratos, DB migración `fresh`, DB migración `N-1`, `SEED_IDEMPOTENCY_CHECK`, RLS, concurrencia última plaza e idempotencia webhooks | `100 %` en `PASS` e invariantes §7.5 preservados | Cualquier fallo, sobreventa, doble correo o fuga cross-tenant = `FAIL` (`P0`/`P1`) |
| **G4 · QA funcional y E2E** | Escenarios funcionales P0 y P1 (`J01`–`J08`) en Chromium, Firefox y WebKit (desktop + móvil) | **`100 %` P0 y P1 en `PASS`**; cada `AC-Jxx-yy` enlazado a prueba y evidencia | Cualquier escenario P0/P1 fallido o AC sin traza = `FAIL` |
| **G4 · Estabilidad / Anti-flake** | Ejecución consecutiva completa (`<E2E_FLAKE_CHECK>`) | **`0 %` de flakes en 3 ejecuciones consecutivas** | Un solo fallo intermitente = `FAIL` |
| **G4 · Defectos abiertos** | Defectos abiertos de severidad `P0` o `P1` | **`0`** | Cualquier `P0`/`P1` abierto bloquea el gate |
| **G5 · Seguridad y privacidad** | `<SAST>`, `<SCA>`, `<SECRET_SCAN>`, `<DAST>`, `<SBOM>` y authz negativa | **`0` Critical / `0` High**, **`0` secretos**, `0` PII en logs/evidencias | Cualquier Critical/High o secreto = `FAIL` (veto SEC/RG) |
| **G5 · Accesibilidad** | `<A11Y_AUTOMATED>` (`axe-core`) + `<A11Y_MANUAL>` (WCAG 2.2 AA) | **`0` hallazgos `serious` o `critical`**; conformidad manual AA (`NVDA` + lector móvil) | Violación AA grave o trampa de teclado = `FAIL` (`P1`) |
| **G5 · Rendimiento web** | Core Web Vitals p75 sobre móvil representativo (`<PERFORMANCE>`) | **`LCP <= 2,5 s`**, **`INP <= 200 ms`**, **`CLS <= 0,1`** | Superar presupuesto = `FAIL` |
| **G5 · Lighthouse CI móvil** | Puntuación en rutas clave | **`>= 90` rendimiento**, **`>= 95` accesibilidad** | Inferior al umbral = `FAIL` |
| **G5 · API, bundle y carga** | Latencia API normal, regresión y carga/concurrencia (`<LOAD_TEST>`) | API **`p95 <= 500 ms`**; regresión latencia/peso **`<= 10 %`**; `0` pérdida/corrupción/sobreventa | Regresión > 10 % o corrupción bajo carga = `FAIL` |
| **G6 · Resiliencia operativa** | Backup/restore y rollback en staging | **`RPO <= 24 h`**, **`RTO <= 4 h`**, smoke post-despliegue y post-rollback en `PASS` | Fallo de restore o pérdida de confirmados = `FAIL` (`P0`/`P1`) |

---

## 5. Cobertura obligatoria de estados UI y estados de formulario (`BRAND_UX_CONTRACT.md` §11)

Ninguna pantalla o componente interactivo se da por probado verificando únicamente el estado feliz poblado. Toda suite de componente, E2E y revisión visual/a11y debe ejercitar y comprobar los estados siguientes cuando apliquen al flujo.

### 5.1 Estados UI obligatorios de página, región y componente (§11.2 y §11.4)

| Estado UI | Qué debe verificarse en pruebas automatizadas y manuales |
| --- | --- |
| **`loading`** | Carga inicial y carga demorada/skeletons: preserva dimensiones (sin salto CLS), bloquea doble envío/activación duplicada, anuncia estado a lectores de pantalla (`aria-busy` / live region controlada), respeta `prefers-reduced-motion` y no oculta errores indefinidamente. |
| **`empty`** | Resultado vacío inicial (ej. `Mis retos` o `Trayectoria` sin inscripciones, `/pro/eventos` sin eventos) y resultado vacío tras filtros en `/explorar`: ofrece mensaje claro en español (`es-ES`) y siguiente acción útil (ir al catálogo, limpiar filtros o crear evento). |
| **`error`** | Error recuperable (fallo temporal de red, pago rechazado/expirado), pérdida de red/offline con recuperación mediante reintento, y error no recuperable: explica el problema y la acción de recuperación, no depende solo del color (texto + icono + rol semántico) y conserva el borrador cuando corresponda. |
| **`disabled`** | Controles deshabilitados (ej. evento cerrado o sin cupo, botón durante envío, transición prohibida): no interactivos por ratón ni teclado, expuestos programáticamente (`disabled` o `aria-disabled` coherente con el patrón accesible) y nunca comunicados únicamente mediante opacidad. |
| **`permission denied`** | Dos variantes obligatorias: **(a)** usuario no autenticado intentando ruta protegida o favoritos -> redirección limpia a `/entrar` preservando `return-to` y filtros sin filtrar datos; **(b)** usuario autenticado sin rol o de otra organización intentando mutar/leer recurso ajeno -> rechazo `403`/RLS con mensaje seguro sin fuga de existencia ni datos de otra organización. |
| **Otros estados universales (§11.2 / §11.4)** | `default` (nombre accesible y contraste válido), `hover` (sin desplazamiento de layout), `focus visible` (anillo `3 px` con contraste >= `3:1`, sin quedar oculto por elementos pegajosos), `active/pressed`, `selected/current` (visual y programático), `success` (confirmación durable y siguiente paso claro, nunca solo color), `partial data` (campos opcionales ausentes como desnivel no aplicable) y `stale data` (cuando la frescura de cupo/pago importe). |

### 5.2 Estados de formulario obligatorios (`BRAND_UX_CONTRACT.md` §11.3)

Cada formulario de producto (registro, login, recuperación, perfil, wizard de inscripción en 4 etapas y editor/comunicaciones de organizador) debe cubrir en pruebas de componente y E2E los requisitos siguientes:

- **Etiquetas persistentes:** todo campo tiene `<label>` visible permanente; el `placeholder` **nunca** sustituye a la etiqueta.
- **Matriz completa de estados por campo (§11.3):**
  1. `empty` (vacío inicial con indicación clara de formato si aplica),
  2. `filled` (valor válido ingresado y conservado entre pasos/borrador),
  3. `focus` (foco visible de `3 px` sin obstrucción),
  4. `optional` / `required` (distinción visible y programática `required` / `aria-required`),
  5. `invalid before submission` (validación temprana únicamente cuando sea segura y no interrumpa al usuario mientras escribe),
  6. `invalid after submission` (mensaje adyacente al campo enlazado con `aria-describedby`, resumen de errores al inicio del formulario fallido y anuncio sin mover inesperadamente el foco salvo intención explícita hacia el resumen),
  7. `disabled` (no editable ni enfocable de forma engañosa, contraste válido),
  8. `read-only` (dato reutilizado/bloqueado expuesto como `readonly` legible por lector de pantalla, diferenciable de editable),
  9. `loading` / `verification pending` (ej. comprobación de cupo o envío de checkout con prevención de doble clic/Enter).

---

## 6. Política anti-flake, prohibición de skips y preservación de trazas

Basado en `QUALITY_GATES.md` §3, §6 G2/G4 y `MASTER_EXECUTION_PLAN.md` §11:

1. **Tolerancia cero (`0 %` flake en 3 ejecuciones):**
   - La suite E2E de certificación (`<E2E_FLAKE_CHECK>`) debe ejecutarse **3 veces consecutivas** sobre el mismo commit SHA limpio obteniendo `100 %` de éxito en las 3 ejecuciones (`0` fallos, `0` reintentos ocultos).
   - **Un test flaky es FAIL:** si un test falla en la ejecución 1 y pasa en la 2 o en un reintento automático, el gate queda en **FAIL** hasta corregir la causa raíz.
2. **Prohibición absoluta de skips y reintentos encubiertos:**
   - Cero `.skip`, `.only`, `fixme`, pruebas comentadas o suites en cuarentena (`QUALITY_GATES.md` §6 G2). Su detección en CI o revisión independiente produce `FAIL` inmediato salvo `WAIVED_BY_USER` vigente y acotada.
   - Los pipelines de certificación de `G4` y `P8-001` deben ejecutar Playwright con **`retries: 0`** para que ningún fallo intermitente quede oculto.
3. **Reglas técnicas para escribir tests deterministas:**
   - Prohibido usar esperas fijas arbitrarias (`waitForTimeout`, `sleep`); usar exclusivamente aserciones *web-first* ligadas a señales observables en DOM, red o estado persistido.
   - Congelar reloj/fechas y zona horaria en fixtures y capturas visuales.
   - Cada suite/worker E2E o integración trabaja con su propio aislamiento de datos o transacción limpia sobre seed determinista, sin depender del orden de ejecución de otros tests.
   - Deshabilitar animaciones no esenciales mediante `prefers-reduced-motion: reduce` en regresiones visuales y estabilizar la carga de fuentes/imágenes antes de interactuar o capturar.
4. **Conservación de trazas, vídeos y capturas (`G4` y defectos):**
   - Configurar Playwright para conservar `trace`, `video` y `screenshot` en todo fallo (`retain-on-failure` / `on-first-failure` con `retries: 0`) y en ejecuciones de evidencia certificadas cuando aporten prueba de flujo/responsive.
   - Antes de archivar cualquier traza, vídeo, captura o reporte JUnit/JSON bajo `docs/evidence/`, verificar que no contiene tokens, cabeceras `Authorization`, payloads crudos de pago ni PII real.

---

## 7. Severidades de defectos (`P0`–`P3`) y flujo de triage

Alineado con `QUALITY_GATES.md` §9 y `MASTER_EXECUTION_PLAN.md` §17:

| Severidad | Definición | Impacto en Gate y Release |
| --- | --- | --- |
| **P0 · Bloqueante crítico** | Pérdida o corrupción de datos, brecha de seguridad o aislamiento multi-tenant, cobro incorrecto o duplicado, **sobreventa de cupo**, caída total o imposibilidad de recuperar sistema/datos. | **Veto inmediato.** Detiene el gate, el release y cualquier tarea dependiente. **No admite excepción de calidad.** |
| **P1 · Bloqueante alto** | Journey principal (`J01`–`J07`) roto o imposible, autorización incorrecta, incumplimiento WCAG 2.2 AA grave (`critical`/`serious` o bloqueo por teclado), resultado/KPI materialmente falso, migración o rollback inseguro. | **Bloquea aceptación de tarea, gate y release.** Debe quedar en `0` abiertos para `G4`–`G7`. |
| **P2 · Medio** | Degradación relevante de función secundaria o fricción significativa con alternativa temporal (`workaround`) segura y sin impacto de datos, cobro, seguridad ni bloqueo AA. | Puede postergarse **solo** mediante decisión de triage documentada con **responsable y fecha límite** previa al release (`G7`). |
| **P3 · Menor** | Defecto cosmético o de detalle sin impacto funcional, de seguridad, de privacidad ni de accesibilidad apreciable. | Entra en backlog trazado con prioridad explícita; no bloquea el release. |

### 7.1 Formato mínimo de reporte de defecto (`MASTER_EXECUTION_PLAN.md` §16.2)

Todo defecto abierto por QA o por revisión no funcional debe incluir:
- `defect_id`, `task_id` afectado, `commit_sha` exacto, `severity` (`P0`–`P3`) y `owner_agent`.
- Entorno, navegador y viewport exactos (ej. `Firefox latest / 320x568`).
- Pasos deterministas de reproducción y referencia a la fixture sintética utilizada (sin PII).
- Resultado esperado vs. resultado real observado.
- Evidencia adjunta sanitizada (extracto de log sin PII, `trace`, `screenshot` o `video`).
- Requisito de verificación al cierre: el owner corrige y entrega test de regresión (para P0/P1); QA reproduce en limpio sobre el nuevo SHA.

### 7.2 Excepciones de calidad

Ningún agente (`QA`, `SUP`, `auditor-no-funcional`, `Release Guardian`) puede rebajar una severidad para facilitar un pase ni aprobar una excepción. Únicamente el usuario (`USR`) puede emitir una excepción (`WAIVED_BY_USER`) siguiendo `QUALITY_GATES.md` §10 (con `exception_id`, timestamp UTC, SHA, riesgo, compensación, responsable y fecha de expiración), y **nunca** para vulnerabilidades `Critical`/`High`, pérdida de datos, sobreventa o cobros incorrectos.

---

## 8. Reglas de datos sintéticos, seguridad en pruebas y prohibición de PII

De cumplimiento obligatorio en todas las fases (`AGENTS.md`, `QUALITY_GATES.md` §3, `BRAND_UX_CONTRACT.md` §1.4 y `.agents/rules/oak-security-data.md`):

1. **Cero PII real en el repositorio y en ejecución de pruebas:**
   - Queda estrictamente prohibido introducir nombres reales, apellidos reales, direcciones postales reales, teléfonos reales, documentos de identidad reales, correos electrónicos personales o datos bancarios reales en fixtures, seeds, tests, capturas, vídeos, trazas o logs.
   - Los datos ilustrativos de los decks (`BRAND_UX_CONTRACT.md` §1.4) son material visual no normativo: **no** deben reutilizarse como constantes de producción, precios contractuales ni cuentas personales reales.
2. **Dataset sintético oficial (`P0-009`):**
   - Todas las pruebas de integración, E2E y regresión visual consumirán el dataset sintético versionado e idempotente definido en `P0-009` (mínimo `2` organizaciones independientes para probar aislamiento cross-tenant, `12` eventos en la Comunidad de Madrid con distintas disciplinas, modalidades y estados límite: `DRAFT`, `PUBLISHED`, `CLOSED`, `CANCELLED`, `COMPLETED`, últimas plazas `cupo = 1`, agotado y evento gratuito si aplica).
   - Cualquier correo sintético utilizado en fixtures de test debe pertenecer exclusivamente a dominios reservados RFC 2606 (`*.example.invalid` / `*.test`) generados determinísticamente por rol de prueba, sin parecer ni coincidir con buzones reales.
3. **Pagos y entorno sandbox:**
   - Todos los flujos de pago operan exclusivamente contra **Stripe en modo test** con tarjetas de prueba oficiales de Stripe y webhooks firmados de test. Jamás se habilitan cobros reales ni claves live en desarrollo, tests o staging.
   - Los correos transaccionales de confirmación y briefings se verifican únicamente contra el proveedor en **modo sandbox**.
4. **Sanitización de evidencias:**
   - Antes de guardar logs, dumps JSON, trazas Playwright o capturas bajo `docs/evidence/`, se ejecuta escaneo automático de secretos y patrones de PII/emails personales (`0` coincidencias).

---

## 9. Comandos canónicos e invalidación automática de evidencia

### 9.1 Catálogo de tokens canónicos vinculados a QA (`QUALITY_GATES.md` §5)

Hasta completar `P0-004`, los tokens siguientes actúan como referencias canónicas de planificación. **Después de `G0`, cualquier token sin resolver produce `FAIL` automático:**

- Estática y seguridad de cambios (`G1`): `<INSTALL_LOCKED>`, `<FORMAT_CHECK>`, `<LINT>`, `<TYPECHECK>`, `<BUILD>`, `<SECRET_SCAN>`.
- Unitarios y cobertura (`G2`): `<UNIT_TEST>`, `<COVERAGE>`.
- Integración, contratos y datos (`G3`): `<INTEGRATION_TEST>`, `<CONTRACT_TEST>`, `<DB_MIGRATE_FRESH>`, `<DB_MIGRATE_FROM_PREVIOUS>`, `<SEED_IDEMPOTENCY_CHECK>`.
- Funcional E2E y estabilidad (`G4`): `<E2E_CRITICAL>`, `<E2E_FULL>`, `<E2E_FLAKE_CHECK>`.
- No funcional (`G5`): `<A11Y_AUTOMATED>`, `<A11Y_MANUAL>`, `<SAST>`, `<SCA>`, `<DAST>`, `<SBOM>`, `<PERFORMANCE>`, `<LOAD_TEST>`.
- Operación y staging (`G6`–`G7`): `<DEPLOY_PREVIEW>`, `<DEPLOY_STAGING>`, `<SMOKE_TEST>`, `<OBSERVABILITY_CHECK>`, `<BACKUP_RESTORE_DRILL>`, `<ROLLBACK_DRILL>`.

### 9.2 Reglas de invalidación automática (`QUALITY_GATES.md` §8)

La evidencia de QA **nunca se arrastra entre commits SHA**. Todo `PASS` previo queda `INVALIDATED` y obliga a reejecutar como mínimo las suites indicadas cuando cambia:

| Tipo de cambio posterior | Suites / Gates mínimos que deben repetirse |
| --- | --- |
| Código de aplicación | `G1`, `G2` (`unit`/`component`), `G4` (`E2E` afectados) |
| Regla de dominio (precio, cupo, estados, elegibilidad) | `G1`–`G4` (incluyendo 100 % ramas críticas y concurrencia) |
| Contrato API / schema | `G1`, `G3` (`contract`/`integration`), `G4`, `G5`, `G6` |
| Esquema DB o migración | `G1`, `G3` (`fresh` + `N-1` + `seed`), `G4`, `G6`, `G7` |
| Lockfile o runtime | `G1`–`G6` completos |
| Autenticación, autorización o RLS | `G1`–`G6` (incluyendo batería negativa cross-tenant y DAST) |
| Flujo de pago o webhook | `G1`–`G6` (incluyendo idempotencia, replay y duplicados) |
| UI, tokens, tipografía o navegación | `G1`, `G2` (`component`), `G4` (`E2E` + visual 5 viewports) y `G5` (`a11y` + `performance`) |
| Infraestructura o configuración | `G5`–`G7` |
| Observabilidad o alertas | `G6` y `G7` |
| Artefacto tras certificar | Todos los gates aplicables sobre el nuevo SHA |

---

## 10. Referencias cruzadas de la estrategia QA

- Matriz de navegadores, los 5 viewports obligatorios, reglas de regresión visual y plan WCAG 2.2 AA (`NVDA` + lector de pantalla móvil): [`docs/qa/BROWSER_VIEWPORT_MATRIX.md`](BROWSER_VIEWPORT_MATRIX.md).
- Plantilla maestra de trazabilidad `AC-J01-01`..`AC-J08-04` lista para `P1-010`: [`docs/qa/TRACEABILITY_MATRIX_TEMPLATE.md`](TRACEABILITY_MATRIX_TEMPLATE.md).