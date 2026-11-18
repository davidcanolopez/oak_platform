# Evidencia P0-011 — Baseline G0 de Identidad de Marca y Criterios UX Accesibles

- **Task ID:** `P0-011`
- **Owner:** `ux-brand`
- **Reviewer designado:** `auditor-no-funcional`
- **Guardian:** `release-guardian`
- **Rama:** `feat/p0-011-brand-ux-baseline`
- **Base SHA:** `bd3cf59b9f228dffa9c8be66eb4e624723e995b9`

## 1. Resumen de entregables

1. `docs/brand/G0_BRAND_UX_BASELINE.md`:
   - **Jerarquía normativa y fuentes (`BRAND_UX_CONTRACT.md` §1.1–§1.3):** orden de precedencia, inventario de los 2 decks estáticos inmutables (`18` slides en `sites/oak-brand-deck/dist/index.html` y `19` slides declaradas en `#total` / `23` `<section>` en `sites/oak-web-design-deck/dist/index.html`), prohibición de copiar su CSS/JS de presentación (tamaños `4–11 px`, `scroll-snap-type`, `preventDefault()`, filtros CSS, variables `--mist`/`--forest-deep`/`--deep`, Google Fonts) e inventario `reference-only` de los **6 assets** (`oak-logo.png`, `oak-mark.svg`, `topography.svg`, `oak-runner.png`, `oak-cyclist.png`, `oak-community.png`), incluyendo el bloqueo de rendimiento/derechos de los PNG pesados `1672x941` (`8,249,712` bytes combinados).
   - **Tokens, tipografía, movimiento y contraste (§4–§5, §8):** los `10` tokens primitivos y `17` tokens semánticos base, prohibición de `#FFFFFF`/`#000000` e invención de paletas de estado previas a `D1-05`, los `14` pares de contraste aprobados (`>= 4.50:1`), los **4 pares cromáticos prohibidos** (`Orange/Sand`, `Sky/Sand`, `Cream/Orange`, `Lime/Sand-Cream`), familias `Sora`/`Inter` (`>= 12 px`, sin peso `650`) y tokens provisionales de movimiento.
   - **Política lingüística `es-ES`, voz OAK y datos mock prohibidos (§1.4, §3):** español de España por defecto, excepciones acotadas de inglés, tono prohibido, copy transaccional, navegación provisional y exclusión explícita de los datos ilustrativos del deck (`David Cano`, `Trail del Robledal`, `Pedales de Guadarrama`, `10K Madrid Rio`, `Sierra Norte Trail`, `oak.run`, `Explorer`, `Pathfinder`).
   - **Criterios UX accesibles mínimos (§11–§14, `QUALITY_GATES.md` §6 `G5`):** conformidad **`WCAG 2.2 AA`**, los **5 viewports** (`320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900`), foco visible `3 px`, objetivos táctiles `48x48 px`, zoom `200 %`, reflow `320 px`, `prefers-reduced-motion` en CSS y JS, estados obligatorios (§11.2–§11.4) y verificación manual en **`NVDA`** + lector móvil (`TalkBack`/`VoiceOver`).
   - **Checklist de no contaminación para `P0-004`** y **lista íntegra de los 14 blockers abiertos `D1-01..D1-14`** (§15.1), declarando explícitamente que **`D1` permanece `PENDING USER VALIDATION`**.
2. `docs/evidence/W01/P0-011/{summary.md,commands.txt,approvals.md}` y actualización de `docs/agentic/packets/P0-011.md`.

## 2. Verificaciones ejecutadas (comandos exactos y salida real en `commands.txt`)

- Verificación reproducible en Python (`exit 0`) sobre `docs/brand/G0_BRAND_UX_BASELINE.md` y entregables `P0-011`:
  - `14/14` blockers `D1-01..D1-14` presentes y marcados como abiertos/bloqueantes (`PENDING USER VALIDATION`).
  - `6/6` assets de referencia (`oak-logo.png`, `oak-mark.svg`, `topography.svg`, `oak-runner.png`, `oak-cyclist.png`, `oak-community.png`) y restricción `1672x941` verificados.
  - `4/4` pares cromáticos prohibidos (`Orange/Sand`, `Sky/Sand`, `Cream/Orange`, `Lime/Sand-Cream`) verificados.
  - `5/5` viewports (`320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900`), `WCAG 2.2 AA`, `3 px`, `48x48 px`, `200 %`, `320 px`, `prefers-reduced-motion` CSS/JS, `NVDA` + `TalkBack`/`VoiceOver` y datos mock prohibidos verificados.
  - `0` emails personales y `0` secretos detectados en todos los entregables de `P0-011`.
- Verificación de alcance limpio (`git diff --name-only`): `0` cambios en `sites/**`, `docs/brand/BRAND_UX_CONTRACT.md`, `src/**`, `docs/adr/**`, `docs/security/**`, `docs/qa/**`, `docs/agentic/GATE_STATUS.md` ni `docs/agentic/DECISION_LOG.md`.

## 3. Riesgos residuales y limitaciones declaradas

- **Gate `D1` sigue `PENDING USER VALIDATION`:** los 14 blockers `D1-01..D1-14` permanecen abiertos hasta la Fase 1 (`P1-012`); esta línea base protege el arranque de `P0-004` y `P0-009` pero no autoriza congelar tokens, masters vectoriales, fuentes locales, iconos ni pantallas definitivas en Fase 0.
- **Activos y licencias pendientes (`D1-03`, `D1-04`, `D1-12`):** la librería de producción carece todavía de wordmark vectorial, registro de licencia para `Sora`/`Inter` locales `WOFF2` y registro de derechos/derivados optimizados para fotografía.
- **Paleta semántica de estado (`D1-05`):** los tokens `success`, `warning`, `danger` y `disabled` quedan bloqueados hasta su contraste y validación en `D1`.
