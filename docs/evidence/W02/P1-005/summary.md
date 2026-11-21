# Evidencia P1-005 — Paquete Canónico de Tokens de Marca y Matriz Matemática de Contraste AA

- **Task ID:** `P1-005`
- **Owner:** `ux-brand`
- **Peer Reviewer:** `qa-e2e`
- **Release Guardian:** `release-guardian`
- **Rama:** `feat/p1-005-canonical-tokens`
- **Base SHA (`master`):** `7082984e639f62653f1b46af53d1399b3d04ced0`
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD` (en `feat/p1-005-canonical-tokens`, informado junto a PR URL y Run ID en el handoff)

## 1. Resultado observable y criterios cubiertos

1. **Artefactos entregados exclusivamente dentro de `allowed_paths`:**
   - [`docs/brand/tokens.oak.v1.json`](../../../../docs/brand/tokens.oak.v1.json): paquete canónico legible por máquina (`oak.canonical.v1`) con los `10` primitivos exactos de `BRAND_UX_CONTRACT.md` §4.2 sin alteración silenciosa (`forest.950`, `forest.700`, `ground.900`, `lime.400`, `orange.500`, `sky.400`, `sand.300`, `cream.100`, `muted.700`, `line`), `24` primitivos candidatos para `D1-05` y bordes UI, `17` semánticos base §4.3 (`surface.*`, `text.*`, `action.*`, `progress.*`, `info.*`, `focus.*`), `6` semánticos de borde (distinguiendo `border.divider.decorative` `oak.color.line` de `border.control.* >= 3.0:1`), `38` tokens candidatos `D1-05` (`status.success.*`, `status.warning.*`, `status.danger.*`, `status.disabled.*`, `viz.*`, todos con `candidateForD1Approval: true`, `gateStatus: "PENDING_D1_APPROVAL"` y `requiresTextAndIcon: true`), escala tipográfica `Sora`/`Inter` (`8` tokens `>= 12 px`, pesos `400/500/600/700/800`, prohibido `650`, política `local-woff2-subsetted` sin `fonts.googleapis.com` pendiente `D1-04`), espaciado (`13` pasos base `4 px`), radios (`6`), elevación (`4` tintadas sin `#000000`), breakpoints (`320/768/1200` + `designCanvasPx: 1440` + `5` viewports), foco (`>= 3 px`, `offset >= 2 px`), objetivos táctiles (`>= 48x48 px`), movimiento (`motion.*` + `prefers-reduced-motion`) y sección `contrastAudit`.
   - [`docs/brand/CANONICAL_TOKENS_AND_CONTRAST.md`](../../../../docs/brand/CANONICAL_TOKENS_AND_CONTRAST.md): especificación normativa completa alineada con `BRAND_UX_CONTRACT.md` (§4–§8, §11–§13, §15.1) y `G0_BRAND_UX_BASELINE.md`, manteniendo `Gate D1 = PENDING USER VALIDATION`.
   - [`docs/brand/CONTRAST_MATRIX.md`](../../../../docs/brand/CONTRAST_MATRIX.md): matriz matemática WCAG 2.2 sRGB (`0.04045`) con ratios exactos a `4` decimales sin redondeo favorable y redondeados a `2` decimales (`3` vectores ancla, `20` pares base aprobados, `45` pares candidatos `D1-05`, `27` pares de bordes funcionales UI/foco `>= 3.0:1`, `2` divisores decorativos `oak.color.line`, `7` pares prohibidos y matriz completa `9×9`).
   - [`tests/unit/brand-tokens.test.ts`](../../../../tests/unit/brand-tokens.test.ts): `6` suites deterministas en Vitest (`0` skips) cumpliendo ESLint estricto (`eslint-plugin-security`, `@microsoft/eslint-plugin-sdl`, `jsx-a11y`, `strict` TS) y Prettier.

2. **Trazabilidad de criterios de aceptación (`AC-01..AC-04`):**
   - `AC-01`: **PASS (candidato a revisión)** — Cobertura 100 % de primitivos §4.2, semánticos base §4.3, tipografía `Sora`/`Inter` (`>= 12 px`, pesos `400..800` sin `650`, política local WOFF2 sin `fonts.googleapis.com`), espaciado, radios, elevación, breakpoints (`320/768/1200/1440`), `focus >= 3 px` (`offset >= 2 px`), touch `>= 48x48 px` y `motion` + `reduced-motion`, sin `#FFFFFF`/`#000000` en paleta OAK ni variables `--mist`/`--forest-deep`/`--deep`.
   - `AC-02`: **PASS (candidato a revisión)** — Todos los estados `status.success.*`, `status.warning.*`, `status.danger.*`, `status.disabled.*` y `viz.*` llevan `candidateForD1Approval: true`, `gateStatus: "PENDING_D1_APPROVAL"`, requisito obligatorio de texto/icono además del color (en `disabled`, atributo nativo + borde discontinuo sin depender solo de opacidad) y superan `>= 4.5000:1` exacto sobre `sand.300`, `cream.100`, `surface.light/dark`, `forest.700` y `forest.950` (`4.6128:1..11.8257:1`).
   - `AC-03`: **PASS (candidato a revisión)** — Calibración sRGB con anclas independientes (`#FFFFFF/#000000 = 21.0`, `#17211B/#E3D4BB = 11.34`, `#FF6B35/#E3D4BB = 1.94`) y prueba frontera (`4.49:1` en `#4D6259/#E3D4BB = 4.4907:1` rechazado); excepción limítrofe heredada de `muted.700` (`#4D6258`) sobre `sand.300` (`#E3D4BB`) documentada en `4.4954:1` sin redondear (`4.50:1` redondeado) frente a `4.8515:1` sobre `cream.100` con recomendación abierta para `D1-02`/`D1-05`; distinción de `oak.color.line` decorativo (`1.3670:1` 8-bit sobre `sand.300`) frente a bordes UI/foco `>= 3.0000:1`; y rechazo explícito en documentación y tests de `Orange/Sand`, `Sky/Sand`, `Cream/Orange`, `Lime/Sand`, `Lime/Cream`, `Orange/Cream` (`2.0984:1`) y `Sky/Cream` (`1.7192:1`).
   - `AC-04`: **PASS (candidato a revisión)** — Tras la última edición, los `9` checks locales base (`install --frozen-lockfile`, `format:check`, `lint` `0` warnings, `typecheck`, `test:unit` `32/32` `0` skips, `test:coverage` `100 %` en `src/`, `build`, `security:sca` y `security:secrets`) pasan con `exit 0`; `sites/**` mantiene `19/19 MATCH` SHA-256; `src/**` queda intacto; `0` PII real ni términos prohibidos de deck; PR hacia `master` verificado en GitHub Actions (`3/3` checks en el handoff sin fusionar).

## 2. Seguridad, privacidad y accesibilidad

- `0` secretos, `0` PII real y `0` referencias activas a `fonts.googleapis.com` (`security:secrets` -> `PASS`, `files=153`, `findings=0`; `security:sca` -> `PASS`, `high=0, critical=0`).
- Verificación matemática `WCAG 2.2 AA` ejecutada en Vitest sobre `80`+ pares positivos/borderline/UI/foco/decorativos/prohibidos (`>= 4.5:1` texto funcional, `>= 3.0:1` UI/foco), `focus >= 3 px` (`offset >= 2 px`), `touchTarget >= 48x48 px`, `prefers-reduced-motion` y política no-color-only.

## 3. Rendimiento, migración y rollback

- Build de producción `next build` limpio (`exit 0`, Turbopack `16.4.6`).
- Política tipográfica `local-woff2-subsetted` compatible con presupuesto `LCP <= 2,5 s` (`ADR-004`).
- Migraciones DB: `NO_APLICA` (paquete de especificación Fase 1 sin cambios en `src/` ni esquema SQL).
- **Rollback:** cerrar el Pull Request sin fusionar y eliminar la rama `feat/p1-005-canonical-tokens` (o `git revert <sha>` vía PR si llegara a integrarse).

## 4. Riesgos residuales y desviaciones

- **Sin desviaciones de `allowed_paths`:** retirado únicamente el archivo *untracked* ajeno `docs/agentic/packets/P1-001.md` en el worktree aislado al inicializar la rama.
- **Riesgos y dependencias abiertas de Gate `D1`:**
  1. `Gate D1` permanece `PENDING USER VALIDATION` (`P1-012`): los tokens propuestos de `D1-05` (`status.*`, `viz.*`) y la resolución definitiva del caso limítrofe `muted.700/sand.300` (`4.4954:1`) requieren ratificación explícita del usuario.
  2. Los binarios locales `.woff2` de `Sora`/`Inter` y su registro de licencias siguen abiertos en `D1-04`.
  3. `gitleaks` local no está instalado en Windows; se ejecuta obligatoriamente en CI Ubuntu (`gitleaks v8.30.1`) sobre el PR.
  4. Persisten `4` avisos `moderate` en devDependencies transitivas (`security:sca`, `high=0, critical=0`).

