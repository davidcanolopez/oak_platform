# Sistema Canónico de Design Tokens y Reglas de Contraste — OAK (`v1`)

## 1. Control documental y estado respecto a Gate D1

| Campo                          | Valor                                                             |
| ------------------------------ | ----------------------------------------------------------------- |
| Paquete origen                 | `P1-005` (`feat/p1-005-canonical-tokens`)                         |
| Contrato normativo base        | `docs/brand/BRAND_UX_CONTRACT.md` (`v0.1`, §4–§8, §11–§13, §15.1) |
| Línea base previa              | `docs/brand/G0_BRAND_UX_BASELINE.md` (`P0-011` / `G0 = PASS`)     |
| Artefacto legible por máquina  | `docs/brand/tokens.oak.v1.json` (`oak.canonical.v1`)              |
| Matriz matemática de contraste | `docs/brand/CONTRAST_MATRIX.md`                                   |
| Verificación automatizada      | `tests/unit/brand-tokens.test.ts` (Vitest, `0` skips)             |
| Estado de Gate D1              | **`PENDING USER VALIDATION`** (`docs/agentic/DECISION_LOG.md`)    |

> **Declaración explícita de gobernanza (`BR-01`):** Este paquete publica el contrato canónico legible por máquina (`tokens.oak.v1.json`) como **insumo verificable para Gate `D1`** (`P1-012` / `P1-013`). Ningún cambio toca `src/**` ni congela unilateralmente la aprobación del usuario:
>
> - **`D1-02`**: queda especificado al 100 % (color, tipografía, espaciado, radios, elevación, breakpoints, foco, objetivos táctiles y movimiento), pendiente de congelación formal en `D1`.
> - **`D1-04` (parcial)**: fija la escala tipográfica `Sora`/`Inter`, pesos permitidos y política `local-woff2-subsetted` sin `fonts.googleapis.com`; los binarios `WOFF2` y el registro de licencias permanecen pendientes hasta `D1`.
> - **`D1-05`**: todos los tokens nuevos de estado (`status.success.*`, `status.warning.*`, `status.danger.*`, `status.disabled.*`) y visualización (`viz.*`) llevan la marca explícita **`candidateForD1Approval: true`** y requieren confirmación del usuario en `D1`.

---

## 2. Autoridad, herencia de decks y prohibiciones absolutas

1. **Precedencia normativa:** rige la jerarquía de `AGENTS.md` y `BRAND_UX_CONTRACT.md` §1.1. Los decks bajo `sites/**` son exclusivamente referencia visual e inmutable (`19/19 MATCH` SHA-256).
2. **Prohibición de tokens y hacks de los decks:** queda prohibido usar en producción o en el sistema de diseño las variables `--mist`, `--forest-deep`, `--deep`, los valores de texto atenuado heredados del deck (`#7d8d84`, `#6d776f`, `#203c31`), tamaños `< 12 px` (`4–11 px`), el peso sintetizado `650`, los breakpoints `560/650/760/900/1000 px` y los filtros CSS sobre logotipos.
3. **Prohibición de `#FFFFFF` y `#000000` en paleta de marca OAK:** el blanco puro y el negro puro están prohibidos como superficies, textos o sombras de marca OAK (`§4.2`). Solo son admisibles dentro de contenido de terceros no controlado por OAK (pasarela de pago, mapas embebidos o medios subidos por usuarios).
4. **Cero valores hexadecimales dispersos en aplicación:** cuando comience la implementación en `src/` (`P2-007`, tras `D1`), los componentes deberán consumir tokens semánticos derivados de `tokens.oak.v1.json` y nunca valores hexadecimales ad hoc.
5. **Política lingüística `es-ES`:** todo texto de interfaz, error, estado, etiqueta o ayuda derivado de estos tokens debe redactarse en español de España (`es-ES`), en _sentence case_ para párrafos, valores y errores, manteniendo la voz clara, activa y alentadora de OAK (`§3`).

---

## 3. Sistema cromático (`color.primitive` y `color.semantic`)

### 3.1 Primitivos base preservados (`BRAND_UX_CONTRACT.md` §4.2)

Los **10 primitivos core** del contrato se preservan literalmente sin alteración silenciosa:

| Token primitivo        | Valor exacto             | Rol previsto                                                                                      |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| `oak.color.forest.950` | `#08291F`                | Superficies inversas profundas y secciones inmersivas                                             |
| `oak.color.forest.700` | `#12372A`                | Color principal de marca, navegación y texto fuerte                                               |
| `oak.color.ground.900` | `#17211B`                | Texto primario sobre superficies claras y brillantes                                              |
| `oak.color.lime.400`   | `#B7F34A`                | Progreso, descubrimiento y acción positiva de avance                                              |
| `oak.color.orange.500` | `#FF6B35`                | Acción principal y acento de siguiente reto                                                       |
| `oak.color.sky.400`    | `#28B7E9`                | Acento informativo o de descubrimiento                                                            |
| `oak.color.sand.300`   | `#E3D4BB`                | Lienzo por defecto (`surface.canvas`)                                                             |
| `oak.color.cream.100`  | `#EADCC5`                | Superficie elevada clara (`surface.raised`) y texto inverso                                       |
| `oak.color.muted.700`  | `#4D6258`                | Texto secundario sobre superficies claras aprobadas (ver excepción limítrofe §3.3)                |
| `oak.color.line`       | `rgba(18, 55, 42, 0.18)` | Divisores y líneas decorativas sobre superficies claras (NO apto para bordes funcionales ni foco) |

### 3.2 Tokens semánticos base (`BRAND_UX_CONTRACT.md` §4.3)

| Token semántico               | Primitivo mapeado      | Valor     | Uso obligatorio                                                                                      |
| ----------------------------- | ---------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `surface.canvas`              | `oak.color.sand.300`   | `#E3D4BB` | Fondo de página por defecto                                                                          |
| `surface.raised`              | `oak.color.cream.100`  | `#EADCC5` | Tarjetas, láminas y superficies de formulario                                                        |
| `surface.brand`               | `oak.color.forest.700` | `#12372A` | Navegación de marca o secciones fuertes                                                              |
| `surface.inverse`             | `oak.color.forest.950` | `#08291F` | Secciones inmersivas y contenido inverso                                                             |
| `text.primary`                | `oak.color.ground.900` | `#17211B` | Contenido principal sobre superficies claras/brillantes                                              |
| `text.secondary`              | `oak.color.muted.700`  | `#4D6258` | Contenido de apoyo (preferir sobre `surface.raised` `#EADCC5`; sobre `sand.300` solo texto no denso) |
| `text.brand`                  | `oak.color.forest.700` | `#12372A` | Encabezados de marca sobre superficies claras                                                        |
| `text.inverse`                | `oak.color.cream.100`  | `#EADCC5` | Contenido sobre superficies `forest`                                                                 |
| `action.primary.background`   | `oak.color.orange.500` | `#FF6B35` | Llamadas a la acción primarias                                                                       |
| `action.primary.foreground`   | `oak.color.ground.900` | `#17211B` | Texto e iconos sobre acciones primarias                                                              |
| `action.secondary.foreground` | `oak.color.forest.700` | `#12372A` | Acción secundaria sobre superficie clara                                                             |
| `progress.background`         | `oak.color.lime.400`   | `#B7F34A` | Progreso, completado y avance                                                                        |
| `progress.foreground`         | `oak.color.forest.700` | `#12372A` | Texto o icono sobre superficies de progreso                                                          |
| `info.background`             | `oak.color.sky.400`    | `#28B7E9` | Énfasis informativo únicamente                                                                       |
| `info.foreground`             | `oak.color.ground.900` | `#17211B` | Texto o icono sobre énfasis informativo                                                              |
| `focus.on-light`              | `oak.color.forest.700` | `#12372A` | Anillo de foco sobre `sand`, `cream`, `lime`, `orange` o `sky`                                       |
| `focus.on-dark`               | `oak.color.lime.400`   | `#B7F34A` | Anillo de foco sobre superficies `forest`                                                            |

### 3.3 Excepción limítrofe heredada (`muted.700` sobre `sand.300`) y recomendación para Gate D1

El cálculo sRGB exacto WCAG 2.2 (umbral `0.04045`, sin redondeo favorable) de `oak.color.muted.700` (`#4D6258`) sobre `oak.color.sand.300` (`#E3D4BB`) arroja **`4.4954:1`** (`4.50:1` redondeado a 2 decimales). En contraste, sobre `oak.color.cream.100` (`#EADCC5` / `surface.raised`) alcanza **`4.8515:1`** (`4.85:1`).

- **Regla operativa vigente hasta `D1`:** `muted.700` sobre `sand.300` se documenta como **excepción limítrofe heredada de `BRAND_UX_CONTRACT.md` §4.4**, restringida exclusivamente a texto secundario no denso. Para texto denso o pequeño sobre `sand.300`, es obligatorio usar `text.primary` (`ground.900`, `11.3413:1`) o `text.brand` (`forest.700`, `8.9692:1`), o bien situar el bloque sobre `surface.raised` (`cream.100`, donde `muted.700` cumple `4.8515:1` exacto).
- **Recomendación abierta para `D1-02` / `D1-05` (`P1-012`):** valorar en `D1` o bien oscurecer un paso mínimo `oak.color.muted.700` (por ejemplo a `#4C6157` = `4.5648:1` exacto sobre `sand.300` / `4.9265:1` sobre `cream.100`, o `#4B6056` = `4.6355:1` sobre `sand.300` / `5.0027:1` sobre `cream.100`), o bien prohibir formalmente `text.secondary` sobre `surface.canvas` y restringirlo a `surface.raised`.

### 3.4 Divisores decorativos vs. bordes funcionales de controles UI (`WCAG 2.2` SC 1.4.11)

`oak.color.line` (`rgba(18, 55, 42, 0.18)`) compuesto sobre `sand.300` (`#BDB8A1` en sRGB de 8 bits) produce solo **`1.3670:1`** (`1.37:1`), y sobre `cream.100` (`#C3BEA9`) **`1.3804:1`** (`1.38:1`). Por ello:

| Token                          | Valor                                               | Naturaleza          | Ratio mínimo | Uso permitido / prohibido                                                                                                                                                                           |
| ------------------------------ | --------------------------------------------------- | ------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `border.divider.decorative`    | `oak.color.line` (`rgba(18, 55, 42, 0.18)`)         | Decorativo          | N/A          | **Solo** separadores visuales o líneas de rejilla/tabla donde el contenido no dependa del borde para identificar controles interactivos. **Prohibido** en inputs, checkboxes, radios, chips o foco. |
| `border.divider.onDark`        | `oak.color.line.dark` (`rgba(234, 220, 197, 0.18)`) | Decorativo (`D1`)   | N/A          | Separadores decorativos sobre `forest.700` / `forest.950`.                                                                                                                                          |
| `border.control.default`       | `oak.color.stone.600` (`#5D6C63`)                   | Funcional UI (`D1`) | `>= 3.0:1`   | Bordes por defecto de campos de formulario, checkboxes, radios, chips y botones secundarios (`3.7991:1` sobre `sand.300`; `4.1001:1` sobre `cream.100`).                                            |
| `border.control.strong`        | `oak.color.forest.700` (`#12372A`)                  | Funcional UI (`D1`) | `>= 3.0:1`   | Borde activo, seleccionado o de alta jerarquía sobre claro (`8.9692:1` / `9.6797:1`).                                                                                                               |
| `border.control.onDark`        | `oak.color.stone.400` (`#7A8E82`)                   | Funcional UI (`D1`) | `>= 3.0:1`   | Bordes de controles interactivos sobre `forest.700` (`3.7487:1`) y `forest.950` (`4.4675:1`).                                                                                                       |
| `border.control.strong.onDark` | `oak.color.cream.100` (`#EADCC5`)                   | Funcional UI (`D1`) | `>= 3.0:1`   | Borde activo/seleccionado sobre oscuro (`9.6797:1` / `11.5358:1`).                                                                                                                                  |

### 3.5 Propuesta candidata para `D1-05`: `status.*` y `viz.*` (`candidateForD1Approval: true`)

Todos los tokens de esta sección están marcados en `tokens.oak.v1.json` con `"candidateForD1Approval": true`, `"gateStatus": "PENDING_D1_APPROVAL"` y `"requiresTextAndIcon": true`. **Ningún estado ni serie gráfica puede comunicar información únicamente mediante el color** (`WCAG 2.2` SC 1.4.1, `BRAND_UX_CONTRACT.md` §11.2, §11.5, §13.3). Además, los colores propuestos evitan reutilizar `orange.500` o `lime.400` como semántica universal sobre claro:

#### A. Estados semánticos (`status.*`)

| Estado                                            | Tokens sobre claro (`sand.300` / `cream.100`)                                                     | Tokens sobre oscuro (`forest.700` / `forest.950`)                                                | Significante obligatorio no cromático                                                                                                                                                                                      |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`status.success`** (Verde pino esmeralda)       | `fg/border`: `#115E3B` (`5.3574:1` / `5.7818:1`) · `surface.light`: `#D4E8D4` (`fg` = `6.0611:1`) | `fg/border`: `#6DE39C` (`8.1700:1` / `9.7366:1`) · `surface.dark`: `#0E3B28` (`fg` = `7.8321:1`) | Icono SVG de verificación (_check_) + mensaje explícito de confirmación y siguiente acción en `es-ES` + región `aria-live` proporcionada.                                                                                  |
| **`status.warning`** (Ámbar ocre profundo)        | `fg/border`: `#734200` (`5.7415:1` / `6.1963:1`) · `surface.light`: `#F3E2B5` (`fg` = `6.5212:1`) | `fg/border`: `#F5C44E` (`8.0271:1` / `9.5663:1`) · `surface.dark`: `#33250B` (`fg` = `9.1393:1`) | Icono SVG de triángulo de advertencia + texto explicativo de condición o límite en `es-ES`. Distinto de `action.primary` (`#FF6B35`).                                                                                      |
| **`status.danger`** (Carmesí terracota)           | `fg/border`: `#9E1C28` (`5.4332:1` / `5.8637:1`) · `surface.light`: `#F5D7D3` (`fg` = `5.8642:1`) | `fg/border`: `#FF8F8F` (`5.9650:1` / `7.1088:1`) · `surface.dark`: `#3B1519` (`fg` = `7.3265:1`) | Icono SVG de error + texto descriptivo en _sentence case_ con acción de recuperación enlazado con `aria-describedby` y resumen al inicio del formulario.                                                                   |
| **`status.disabled`** (Piedra pizarra desaturada) | `fg/border`: `#44544B` (`5.5060:1` / `5.9422:1`) · `surface.light`: `#D4C9B6` (`fg` = `4.9052:1`) | `fg/border`: `#9EB1A6` (`5.7880:1` / `6.8978:1`) · `surface.dark`: `#1A372D` (`fg` = `5.7074:1`) | Atributo nativo `disabled` / `aria-disabled="true"`, borde discontinuo (`1px dashed`) y eliminación de elevación/relleno activo + texto explicativo cuando proceda. **Prohibido** comunicar `disabled` solo con `opacity`. |

#### B. Visualización de datos (`viz.*`)

Todas las series sobre fondos claros u oscuros superan **`>= 4.5:1` exacto** (permitiendo tanto trazos/barras `>= 3.0:1` como etiquetas directas de datos y leyendas `>= 4.5:1`) y deben acompañarse de marcador geométrico, patrón de trazo o etiqueta directa:

| Token                 | Sobre claro (`sand.300` / `cream.100`)                           | Sobre oscuro (`forest.700` / `forest.950`)                       | Distinción no cromática                          |
| --------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| `viz.series.1`        | `forest.700` `#12372A` (`8.9692:1` / `9.6797:1`)                 | `lime.400` `#B7F34A` (`9.9230:1` / `11.8257:1`)                  | Trazo continuo / marcador círculo + etiqueta     |
| `viz.series.2`        | `sienna.700` `#9A340E` (`5.0151:1` / `5.4124:1`)                 | `orange.500` `#FF6B35` (`4.6128:1` / `5.4973:1`)                 | Trazo discontinuo / marcador cuadrado + etiqueta |
| `viz.series.3`        | `teal.700` `#0B5D7C` (`5.0160:1` / `5.4134:1`)                   | `sky.400` `#28B7E9` (`5.6304:1` / `6.7100:1`)                    | Trazo punteado / marcador triángulo + etiqueta   |
| `viz.series.4`        | `plum.700` `#5D4585` (`5.4234:1` / `5.8530:1`)                   | `cream.100` `#EADCC5` (`9.6797:1` / `11.5358:1`)                 | Patrón rayado / marcador rombo + etiqueta        |
| `viz.axis`            | `sage.700` `#42574D` (`5.3296:1` / `5.7518:1`)                   | `sage.300` `#A8BBB0` (`6.4772:1` / `7.7192:1`)                   | Unidades explícitas y valores legibles           |
| `viz.tooltip`         | `cream.100` `#EADCC5` sobre `forest.950` `#08291F` (`11.5358:1`) | `cream.100` `#EADCC5` sobre `forest.950` `#08291F` (`11.5358:1`) | Tooltip accesible por teclado y puntero          |
| `viz.grid.decorative` | `oak.color.line` (`rgba(18, 55, 42, 0.18)`)                      | `oak.color.line.dark` (`rgba(234, 220, 197, 0.18)`)              | Meramente decorativa (`decorativeOnly: true`)    |

---

## 4. Tipografía (`Sora` / `Inter` y política `D1-04`)

- **Familias:** `Sora` (display: títulos de página, encabezados de sección, hero y métricas clave) e `Inter` (interfaz: navegación, cuerpo, formularios, tablas y etiquetas).
- **Pesos permitidos:** `400`, `500`, `600`, `700`, `800`. **Prohibido** sintetizar peso `650`.
- **Tamaño mínimo absoluto:** `12 px` (`type.label`). **Prohibidos** tamaños `< 12 px` (`4–11 px` de los decks).
- **Entrega (`D1-04` parcial):** estrategia **`local-woff2-subsetted`** servida localmente desde la aplicación, compatible con `LCP <= 2,5 s` (`ADR-004`). **Prohibida** toda dependencia en tiempo de ejecución hacia `fonts.googleapis.com` o `fonts.gstatic.com`. La entrega de los binarios `.woff2` y sus registros de licencia queda abierta en `D1-04`.

| Token             | Familia |                   Tamaño | Line height |       Peso(s) | Uso                                                                                 |
| ----------------- | ------- | -----------------------: | ----------: | ------------: | ----------------------------------------------------------------------------------- |
| `type.display`    | `Sora`  | `clamp(48px, 5vw, 72px)` |      `0.98` |         `700` | Hero marketing y hero principal de producto únicamente                              |
| `type.heading.xl` | `Sora`  | `clamp(40px, 4vw, 48px)` |      `1.05` |         `700` | Título de página (`<h1>`)                                                           |
| `type.heading.lg` | `Sora`  |                   `32px` |      `1.10` |         `600` | Sección principal                                                                   |
| `type.heading.md` | `Sora`  |                   `24px` |      `1.20` |         `600` | Tarjeta o subsección                                                                |
| `type.heading.sm` | `Sora`  |                   `20px` |      `1.25` |         `600` | Encabezado compacto                                                                 |
| `type.body`       | `Inter` |                   `16px` |      `1.50` |         `400` | Cuerpo por defecto y valores de formulario                                          |
| `type.body.small` | `Inter` |                   `14px` |      `1.45` | `400` / `500` | Texto de apoyo                                                                      |
| `type.label`      | `Inter` |                   `12px` |      `1.25` | `600` / `700` | Etiquetas y _overlines_ (mayúsculas solo en textos breves con tracking `>= 0.08em`) |

---

## 5. Espaciado, radios, elevación y sistema responsive (`D1-02`)

### 5.1 Escala de espaciado (`baseUnit = 4 px`, candidato `D1-02`)

- Tokens: `space.0` (`0px`), `space.1` (`4px`), `space.2` (`8px`), `space.3` (`12px`), `space.4` (`16px`), `space.5` (`20px`), `space.6` (`24px`), `space.8` (`32px`), `space.10` (`40px`), `space.12` (`48px`), `space.16` (`64px`), `space.20` (`80px`), `space.24` (`96px`).
- Contenedor y retícula propuestos para `D1`: `containerMaxWidthPx = 1320`, `gutter`: `16 px` (móvil) / `24 px` (tablet y desktop), `pagePaddingX`: `16 px` (móvil) / `32 px` (tablet) / `48 px` (desktop).

### 5.2 Radios y elevación (candidatos `D1-02`)

- **Radios:** `radius.none` (`0px`), `radius.sm` (`4px`), `radius.md` (`8px`), `radius.lg` (`16px`), `radius.xl` (`24px`), `radius.full` (`9999px`).
- **Elevación (tintada en `forest.700`/`forest.950`, sin `#000000`):**
  - `elevation.none`: `none`
  - `elevation.sm`: `0 2px 8px rgba(18, 55, 42, 0.08)` (tarjetas sobre lienzo)
  - `elevation.md`: `0 8px 24px rgba(18, 55, 42, 0.12)` (barras fijas, _popovers_, menús)
  - `elevation.lg`: `0 20px 48px rgba(8, 41, 31, 0.20)` (diálogos modales y _bottom sheets_ móviles)
- **Z-index:** `base: 0`, `sticky: 20`, `overlay: 40`, `modal: 50`, `toast: 60`.

### 5.3 Breakpoints canónicos y suite de 5 viewports (`BRAND_UX_CONTRACT.md` §12)

| Modo      | Rango         | Columnas |  Gutter | Nota normativa                                                   |
| --------- | ------------- | -------: | ------: | ---------------------------------------------------------------- |
| `mobile`  | `320–767 px`  |      `4` | `16 px` | Reflow obligatorio sin scroll horizontal a `320 px`              |
| `tablet`  | `768–1199 px` |      `8` | `24 px` | Jerarquía apilada con acciones secundarias contextuales          |
| `desktop` | `>= 1200 px`  |     `12` | `24 px` | `1440 px` es el lienzo principal de diseño, **no** el breakpoint |

- **Viewports de referencia obligatorios:** `320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900`.
- **Zoom y reflow:** usable al `200 %` de zoom y sin desplazamiento horizontal a `320 CSS px`.

---

## 6. Foco, objetivos táctiles y movimiento (`BRAND_UX_CONTRACT.md` §8, §11.2, §13)

| Criterio                     | Token / Valor                                                                                                                                                           | Regla obligatoria                                                                                                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Foco visible**             | `ringWidthPx: 3`, `ringOffsetPx: 2`, `focus.on-light` (`#12372A`) / `focus.on-dark` (`#B7F34A`)                                                                         | Anillo visible de al menos `3 px` con separación `>= 2 px`, contraste `>= 3.0:1` (`>= 4.61:1` sobre todos los fondos aprobados) y nunca oculto tras cabeceras o barras _sticky_.                              |
| **Objetivos táctiles**       | `minWidthPx: 48`, `minHeightPx: 48`, `minAdjacentGapPx: 8`                                                                                                              | Todo objetivo de puntero mide al menos `48 x 48 CSS px` con separación suficiente para evitar activaciones accidentales.                                                                                      |
| **Movimiento**               | `motion.fast` (`160 ms`), `motion.standard` (`240 ms`), `motion.reveal` (`480 ms`), `motion.route.max` (`1200 ms`), `motion.ease.out` (`cubic-bezier(0.16, 1, 0.3, 1)`) | Orienta o comunica progreso sin bloquear la interacción del usuario.                                                                                                                                          |
| **`prefers-reduced-motion`** | `@media (prefers-reduced-motion: reduce)` + `matchMedia` en JS                                                                                                          | Elimina trazado de rutas, pulsaciones, parallax, _smooth scrolling_, _skeleton shimmer_ y transformaciones no esenciales (`durationOverrideMs: 0`), manteniendo cambios de estado inmediatos y comprensibles. |
