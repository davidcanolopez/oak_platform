# Evidencia P1-006 — Inventario de Componentes UI, Estados y Criterios WCAG 2.2 AA V1

- **Task ID:** `P1-006`
- **Owner:** `ux-brand`
- **Peer Reviewer:** `qa-e2e` (`!=` `ux-brand`)
- **Release Guardian:** `release-guardian`
- **Rama y base:** `feat/p1-006-component-inventory` desde `master @ 3551da0201e3c9f42a6c5717058f999229516545`, sincronizada fast-forward con `origin/master @ 07915003f52af1607353d9b629cdefbfeba118f3` (incluye `P1-003`)
- **Candidate SHA:** `PENDIENTE_COMMIT (SHA completo tras commit sobre origin/master @ 07915003f52af1607353d9b629cdefbfeba118f3 informado en handoff)`
- **Pull Request:** `CI en PR: PENDIENTE DE EJECUCIÓN EN PR (PR hacia master abierto tras commit/push; URL, número, Run ID y resultados reales de 3/3 checks informados en el handoff, sin fusionar)`

## 1. Resultado observable y criterios cubiertos (`AC-01`..`AC-04`)

- **`AC-01` (Familias `§11.1`, rutas `P1-004`, tokens `tokens.oak.v1.json` y sistema SVG `D1-11`):** `PASS` — `docs/brand/COMPONENT_AND_STATE_INVENTORY.md` (§2–§3) especifica **`16` familias completas (`F-01`..`F-16`, `>= 15` obligatorias)** mapeadas a todas las rutas de `INFORMATION_ARCHITECTURE_AND_ROUTES.md` (`/`..`/pro/**`, `/mis-retos/favoritos`, `/soporte`) y roles (`ANONYMOUS`, `ATHLETE`, `ORG_OWNER`, `ORG_MANAGER`, `ORG_VIEWER`, `INVITED`/`REVOKED`, `ADMIN + MFA`), con copy específico `es-ES`, asignación exacta a claves reales de `docs/brand/tokens.oak.v1.json` (bordes funcionales UI `>= 3.0:1` en `border.control.*` / `status.*.border.*` y `oak.color.line` reservado exclusivamente como divisor decorativo) y catálogo mínimo de `28` iconos SVG (`lucide-react v1.75.0` / SVG inline local, `viewBox="0 0 24 24"`, `strokeWidth="2"`) en reemplazo de todo glifo Unicode.
- **`AC-02` (Matriz completa de estados `§11.2`–`§11.4`):** `PASS` — Define los **`9` estados universales interactivos** (`Default`, `Hover`, `Focus visible >= 3 px`, `Active / pressed`, `Selected / current`, `Disabled` con borde discontinuo + explicación textual nunca solo opacidad, `Loading` conservando dimensiones + `aria-busy="true"`, `Error` y `Success` con icono SVG + texto), su matriz cruzada sobre las `16` familias, los **`9` estados de formulario** (`empty`, `filled`, `focus`, `optional / required`, `invalid` pre-envío seguro y post-envío con `<label>` persistente, `aria-describedby` y `FormErrorSummary`, `disabled`, `read-only`, `loading / verification pending`) y los **`9` estados de contenido** (`initial loading`, `delayed loading`, `empty result`, `filtered empty result`, `partial data`, `stale data`, `recoverable error`, `non-recoverable / permission error 403/404/410`, `offline / retry`) con cobertura por ruta.
- **`AC-03` (WCAG 2.2 AA, exclusiones `D0`, `blocked_by_D1_09` y gobernanza `D1`):** `PASS` — Garantiza objetivos `>= 48x48 CSS px` (`>= 8 px` separación), anillo de foco `>= 3 px` (`offset >= 2 px`) no oculto por barras sticky, reflow `320 px` sin scroll horizontal en los `5` viewports (tablas convertidas a tarjetas en `320–767 px`), `zoom 200 %`, trampa/retorno de foco + `Escape` en modales/_bottom sheets_, `prefers-reduced-motion` CSS + JS (`durationOverrideMs: 0`), notas de verificación `NVDA` + `TalkBack`/`VoiceOver`, excepción documentada `muted.700` sobre `sand.300` (`4.4954:1`), prohibición explícita de los `7` pares cromáticos, `0` controles `Out-of-Scope V1` (mapa/dorsal/gamificación/wearables), `0` campos `blocked_by_D1_09` (`DNI`/clínicos) y marcado explícito **`PENDING_D1_APPROVAL`** para `D1-02`, `D1-04`, `D1-05`, `D1-06`, `D1-07`, `D1-08`, `D1-09`, `D1-10`, `D1-11` y `D1-12`.
- **`AC-04` (Calidad local, alcance, seguridad y estado de PR CI):** `PASS` en verificación local pre-commit tras sincronizar con `origin/master @ 07915003f52af1607353d9b629cdefbfeba118f3` — Trabajo acotado estrictamente a los `5` `allowed_paths` con EOL `LF` y UTF-8 sin BOM, Prettier markdown (`--ignore-path .gitignore`) en `exit 0`, verificación Node/TSX read-only de tokens, `16` familias, `9+9+9` estados, `assertNoBannedMockData()` (`0` hallazgos), `0` glifos Unicode de iconos activos, `0` correos fuera de `.invalid`, `19/19 MATCH` SHA-256 sobre `sites/**` y `9/9` checks locales base en `exit 0` (`19` archivos lint con `0` warnings, `5` suites / `32/32` unit tests con `0` skips, `100 %` cobertura `src/`). **CI en PR: PENDIENTE DE EJECUCIÓN EN PR** (el PR hacia `master` se abre inmediatamente tras el commit y los `3/3` checks + Run ID se informan en el handoff, sin fusionar).

## 2. Seguridad, privacidad y accesibilidad

- `0` secretos y `0` PII real (`security:secrets` `PASS`, `files=178`, `findings=0`; `security:sca` `PASS`, `high=0, critical=0, moderate=4, low=0`).
- `0` ocurrencias de los `8` términos ilustrativos de `BANNED_DECK_TERMS` (`assertNoBannedMockData()` `PASS`); todos los ejemplos emplean exclusivamente `oak-seed.v1` y correos `@oak-demo.invalid`.
- Aislamiento por rol respetado en la especificación UI: `ORG_VIEWER` sin botones mutables ni exportación oculta no autorizada; `/pro` conmutador visible solo si `Membership = ACTIVE`; `/soporte` oculto y restringido a `ADMIN + MFA` con `reason`; `blocked_by_D1_09` en `100 %` de formularios y tablas.
- Separación estricta de `border.control.*` (`>= 3.0:1`) frente a `oak.color.line` (`decorativeOnly: true`) y prohibición de los `7` pares cromáticos de `CONTRAST_MATRIX.md`.

## 3. Rollback y limitaciones

- **Impacto en BD / migraciones / código productivo:** Ninguno (entregable documental Fase 1; `src/**`, `tests/**`, `data/**`, `sites/**`, `tokens.oak.v1.json` y `BRAND_UX_CONTRACT.md` intactos).
- **Rollback verificado:** Cerrar el PR sin fusionar y eliminar la rama `feat/p1-006-component-inventory` (o `git revert` vía PR si ya hubiera sido integrado).

## 4. Riesgos residuales y desviaciones

- **Sin desviaciones de `allowed_paths`:** retirada únicamente la copia _untracked_ ajena `docs/agentic/packets/P1-003.md` dentro del worktree aislado antes de sincronizar con `origin/master @ 07915003f52af1607353d9b629cdefbfeba118f3` (que ya incorpora `P1-003` en el historial común).
- **Riesgos residuales:** (1) Todos los elementos marcados como `PENDING_D1_APPROVAL` (`D1-02`, `D1-04`, `D1-05`, `D1-06..D1-12`) permanecen sujetos a validación explícita del usuario en `P1-012` sobre el prototipo `P1-007` antes de iniciar `P2-007`; (2) en host Windows local, `gitleaks` no está instalado en `PATH` (`NOT_INSTALLED_IN_LOCAL_PATH`), mitigado mediante la ejecución obligatoria de `Gitleaks` en el workflow CI `SCA & Secret Scan (Gitleaks)` sobre el PR (`PENDIENTE DE EJECUCIÓN EN PR` hasta push/apertura de PR).
