# Matriz Matemática de Contraste WCAG 2.2 AA — OAK (`v1`)

## 1. Metodología matemática sRGB (`WCAG 2.2`) y vectores ancla

Todos los ratios de este documento y de `docs/brand/tokens.oak.v1.json` se calculan mediante la definición oficial de luminancia relativa sRGB de **WCAG 2.2**:

1. Para cada canal normalizado $c \in \{R_{8}/255,\; G_{8}/255,\; B_{8}/255\}$:
   $$c_{\text{lin}} = \begin{cases} c / 12.92 & \text{si } c \le 0.04045 \\ ((c + 0.055) / 1.055)^{2.4} & \text{si } c > 0.04045 \end{cases}$$
2. Luminancia relativa:
   $$L = 0.2126 \cdot R_{\text{lin}} + 0.7152 \cdot G_{\text{lin}} + 0.0722 \cdot B_{\text{lin}}$$
3. Ratio de contraste entre dos colores con luminancias $L_{\max} \ge L_{\min}$:
   $$\text{CR} = \frac{L_{\max} + 0.05}{L_{\min} + 0.05}$$
4. **Regla anti-redondeo favorable (`P1-005`):** se reporta siempre el **ratio exacto a 4 decimales** junto al redondeado a 2 decimales. Todo par nuevo (`D1-05`) y todo par de texto funcional aprobado debe cumplir **`>= 4.5000:1` exacto** (incluso en tipografía grande, `BRAND_UX_CONTRACT.md` §4.4), salvo la única excepción limítrofe heredada y documentada de `muted.700` sobre `sand.300` (`4.4954:1` sin redondear / `4.50:1` redondeado). Los bordes funcionales de controles UI e indicadores de foco deben cumplir **`>= 3.0000:1` exacto** (`WCAG 2.2` SC 1.4.11 y 2.4.11/2.4.13).

### 1.1 Vectores ancla independientes de calibración

| Vector ancla             | Primer plano | Fondo     | Ratio exacto (4 dec.) | Ratio redondeado (2 dec.) | Rol                                                    |
| ------------------------ | ------------ | --------- | --------------------: | ------------------------: | ------------------------------------------------------ |
| Blanco / Negro (externo) | `#FFFFFF`    | `#000000` |           `21.0000:1` |                 `21.00:1` | Calibración máxima WCAG (prohibidos en marca OAK)      |
| Ground / Sand            | `#17211B`    | `#E3D4BB` |           `11.3413:1` |                 `11.34:1` | Ancla positiva OAK (`text.primary` / `surface.canvas`) |
| Orange / Sand            | `#FF6B35`    | `#E3D4BB` |            `1.9444:1` |                  `1.94:1` | Ancla negativa prohibida OAK (`§4.5`)                  |

---

## 2. Pares base aprobados (`BRAND_UX_CONTRACT.md` §4.4 y §4.3)

Incluye los `14` pares explícitos de `§4.4` más los `6` pares semánticos implícitos derivados de `surface.raised` (`#EADCC5`) y `surface.brand` (`#12372A`) en `§4.3`:

| ID            | Primer plano (Token / Hex)              | Fondo (Token / Hex)                     |   Ratio exacto |   Redondeado |        >= 4.5000 exacto        | Estado y regla normativa                                                                                                                                                                                   |
| ------------- | --------------------------------------- | --------------------------------------- | -------------: | -----------: | :----------------------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base-01`     | `text.primary` (`#17211B`)              | `surface.canvas` (`#E3D4BB`)            |    `11.3413:1` |    `11.34:1` |              PASS              | Permitido (`§4.4`); preferido sobre `sand.300`                                                                                                                                                             |
| `base-02`     | `text.brand` (`#12372A`)                | `surface.canvas` (`#E3D4BB`)            |     `8.9692:1` |     `8.97:1` |              PASS              | Permitido (`§4.4`); títulos y acciones secundarias                                                                                                                                                         |
| **`base-03`** | **`text.secondary` (`#4D6258`)**        | **`surface.canvas` (`#E3D4BB`)**        | **`4.4954:1`** | **`4.50:1`** | **EXCEPCIÓN (`4.4954 < 4.5`)** | **Excepción limítrofe heredada de `§4.4`:** restringido a texto secundario **no denso**; usar `ground.900` (`11.3413:1`) para texto pequeño o denso, o `surface.raised` (`4.8515:1`). Ver nota `D1` abajo. |
| `base-04`     | `text.inverse` (`#EADCC5`)              | `surface.brand` (`#12372A`)             |     `9.6797:1` |     `9.68:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-05`     | `text.inverse` (`#EADCC5`)              | `surface.inverse` (`#08291F`)           |    `11.5358:1` |    `11.54:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-06`     | `progress.foreground` (`#12372A`)       | `progress.background` (`#B7F34A`)       |     `9.9230:1` |     `9.92:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-07`     | `text.primary` (`#17211B`)              | `progress.background` (`#B7F34A`)       |    `12.5473:1` |    `12.55:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-08`     | `text.brand` (`#12372A`)                | `action.primary.background` (`#FF6B35`) |     `4.6128:1` |     `4.61:1` |              PASS              | Permitido (`§4.4`); se prefiere `ground.900` (`5.8328:1`)                                                                                                                                                  |
| `base-09`     | `action.primary.foreground` (`#17211B`) | `action.primary.background` (`#FF6B35`) |     `5.8328:1` |     `5.83:1` |              PASS              | Permitido y preferido para CTA primario (`§4.4`)                                                                                                                                                           |
| `base-10`     | `info.foreground` (`#17211B`)           | `info.background` (`#28B7E9`)           |     `7.1194:1` |     `7.12:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-11`     | `text.brand` (`#12372A`)                | `info.background` (`#28B7E9`)           |     `5.6304:1` |     `5.63:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-12`     | `focus.on-dark` (`#B7F34A`)             | `surface.inverse` (`#08291F`)           |    `11.8257:1` |    `11.83:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-13`     | `action.primary.background` (`#FF6B35`) | `surface.inverse` (`#08291F`)           |     `5.4973:1` |     `5.50:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-14`     | `info.background` (`#28B7E9`)           | `surface.inverse` (`#08291F`)           |     `6.7100:1` |     `6.71:1` |              PASS              | Permitido (`§4.4`)                                                                                                                                                                                         |
| `base-15`     | `text.primary` (`#17211B`)              | `surface.raised` (`#EADCC5`)            |    `12.2397:1` |    `12.24:1` |              PASS              | Implícito `§4.3`: texto primario en tarjetas/formularios                                                                                                                                                   |
| `base-16`     | `text.brand` (`#12372A`)                | `surface.raised` (`#EADCC5`)            |     `9.6797:1` |     `9.68:1` |              PASS              | Implícito `§4.3`: encabezados y acción secundaria en tarjetas                                                                                                                                              |
| `base-17`     | `text.secondary` (`#4D6258`)            | `surface.raised` (`#EADCC5`)            |     `4.8515:1` |     `4.85:1` |              PASS              | Implícito `§4.3`: cumple `>= 4.5000:1` exacto sobre `cream.100`                                                                                                                                            |
| `base-18`     | `focus.on-dark` (`#B7F34A`)             | `surface.brand` (`#12372A`)             |     `9.9230:1` |     `9.92:1` |              PASS              | Implícito `§4.3`: `lime.400` sobre `forest.700`                                                                                                                                                            |
| `base-19`     | `action.primary.background` (`#FF6B35`) | `surface.brand` (`#12372A`)             |     `4.6128:1` |     `4.61:1` |              PASS              | Implícito `§4.3`: `orange.500` sobre `forest.700`                                                                                                                                                          |
| `base-20`     | `info.background` (`#28B7E9`)           | `surface.brand` (`#12372A`)             |     `5.6304:1` |     `5.63:1` |              PASS              | Implícito `§4.3`: `sky.400` sobre `forest.700`                                                                                                                                                             |

> **Recomendación abierta para `D1-02` / `D1-05` (`P1-012`):** `oak.color.muted.700` (`#4D6258`) se preserva sin alteración silenciosa en `P1-005` conforme a `BRAND_UX_CONTRACT.md` §4.2, pero su valor exacto sobre `sand.300` (`4.4954:1`) queda `0.0046` por debajo de `4.5000:1` sin redondeo favorable. Para cerrarlo definitivamente en Gate `D1`, se recomienda optar entre:
>
> 1. Ajustar `oak.color.muted.700` a **`#4C6157`** (`4.5648:1` sobre `sand.300` / `4.9265:1` sobre `cream.100`) o **`#4B6056`** (`4.6355:1` sobre `sand.300` / `5.0027:1` sobre `cream.100`); o
> 2. Restringir `text.secondary` exclusivamente a `surface.raised` (`cream.100`, `4.8515:1`) y prohibirlo sobre `surface.canvas` (`sand.300`).

---

## 3. Pares candidatos `D1-05`: `status.*` y `viz.*` (`candidateForD1Approval: true`)

Todos los pares candidatos de `D1-05` cumplen **`>= 4.5000:1` exacto sin redondeo favorable** sobre sus superficies asignadas y requieren **texto + icono/significante no cromático además del color**:

| ID                        | Token primer plano (`Hex`)                       | Token fondo (`Hex`)                         | Ratio exacto | Redondeado | >= 4.5000 exacto | Estado                         |
| ------------------------- | ------------------------------------------------ | ------------------------------------------- | -----------: | ---------: | :--------------: | ------------------------------ |
| `d1-success-fg-sand`      | `status.success.foreground.onLight` (`#115E3B`)  | `surface.canvas` (`#E3D4BB`)                |   `5.3574:1` |   `5.36:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-success-fg-cream`     | `status.success.foreground.onLight` (`#115E3B`)  | `surface.raised` (`#EADCC5`)                |   `5.7818:1` |   `5.78:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-success-fg-tint`      | `status.success.foreground.onLight` (`#115E3B`)  | `status.success.surface.light` (`#D4E8D4`)  |   `6.0611:1` |   `6.06:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-success-fg-forest`    | `status.success.foreground.onDark` (`#6DE39C`)   | `surface.brand` (`#12372A`)                 |   `8.1700:1` |   `8.17:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-success-fg-deep`      | `status.success.foreground.onDark` (`#6DE39C`)   | `surface.inverse` (`#08291F`)               |   `9.7366:1` |   `9.74:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-success-fg-darktint`  | `status.success.foreground.onDark` (`#6DE39C`)   | `status.success.surface.dark` (`#0E3B28`)   |   `7.8321:1` |   `7.83:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-warning-fg-sand`      | `status.warning.foreground.onLight` (`#734200`)  | `surface.canvas` (`#E3D4BB`)                |   `5.7415:1` |   `5.74:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-warning-fg-cream`     | `status.warning.foreground.onLight` (`#734200`)  | `surface.raised` (`#EADCC5`)                |   `6.1963:1` |   `6.20:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-warning-fg-tint`      | `status.warning.foreground.onLight` (`#734200`)  | `status.warning.surface.light` (`#F3E2B5`)  |   `6.5212:1` |   `6.52:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-warning-fg-forest`    | `status.warning.foreground.onDark` (`#F5C44E`)   | `surface.brand` (`#12372A`)                 |   `8.0271:1` |   `8.03:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-warning-fg-deep`      | `status.warning.foreground.onDark` (`#F5C44E`)   | `surface.inverse` (`#08291F`)               |   `9.5663:1` |   `9.57:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-warning-fg-darktint`  | `status.warning.foreground.onDark` (`#F5C44E`)   | `status.warning.surface.dark` (`#33250B`)   |   `9.1393:1` |   `9.14:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-danger-fg-sand`       | `status.danger.foreground.onLight` (`#9E1C28`)   | `surface.canvas` (`#E3D4BB`)                |   `5.4332:1` |   `5.43:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-danger-fg-cream`      | `status.danger.foreground.onLight` (`#9E1C28`)   | `surface.raised` (`#EADCC5`)                |   `5.8637:1` |   `5.86:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-danger-fg-tint`       | `status.danger.foreground.onLight` (`#9E1C28`)   | `status.danger.surface.light` (`#F5D7D3`)   |   `5.8642:1` |   `5.86:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-danger-fg-forest`     | `status.danger.foreground.onDark` (`#FF8F8F`)    | `surface.brand` (`#12372A`)                 |   `5.9650:1` |   `5.97:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-danger-fg-deep`       | `status.danger.foreground.onDark` (`#FF8F8F`)    | `surface.inverse` (`#08291F`)               |   `7.1088:1` |   `7.11:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-danger-fg-darktint`   | `status.danger.foreground.onDark` (`#FF8F8F`)    | `status.danger.surface.dark` (`#3B1519`)    |   `7.3265:1` |   `7.33:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-disabled-fg-sand`     | `status.disabled.foreground.onLight` (`#44544B`) | `surface.canvas` (`#E3D4BB`)                |   `5.5060:1` |   `5.51:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-disabled-fg-cream`    | `status.disabled.foreground.onLight` (`#44544B`) | `surface.raised` (`#EADCC5`)                |   `5.9422:1` |   `5.94:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-disabled-fg-tint`     | `status.disabled.foreground.onLight` (`#44544B`) | `status.disabled.surface.light` (`#D4C9B6`) |   `4.9052:1` |   `4.91:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-disabled-fg-forest`   | `status.disabled.foreground.onDark` (`#9EB1A6`)  | `surface.brand` (`#12372A`)                 |   `5.7880:1` |   `5.79:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-disabled-fg-deep`     | `status.disabled.foreground.onDark` (`#9EB1A6`)  | `surface.inverse` (`#08291F`)               |   `6.8978:1` |   `6.90:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-disabled-fg-darktint` | `status.disabled.foreground.onDark` (`#9EB1A6`)  | `status.disabled.surface.dark` (`#1A372D`)  |   `5.7074:1` |   `5.71:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s1-sand`          | `viz.series.1.onLight` (`#12372A`)               | `surface.canvas` (`#E3D4BB`)                |   `8.9692:1` |   `8.97:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s1-cream`         | `viz.series.1.onLight` (`#12372A`)               | `surface.raised` (`#EADCC5`)                |   `9.6797:1` |   `9.68:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s2-sand`          | `viz.series.2.onLight` (`#9A340E`)               | `surface.canvas` (`#E3D4BB`)                |   `5.0151:1` |   `5.02:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s2-cream`         | `viz.series.2.onLight` (`#9A340E`)               | `surface.raised` (`#EADCC5`)                |   `5.4124:1` |   `5.41:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s3-sand`          | `viz.series.3.onLight` (`#0B5D7C`)               | `surface.canvas` (`#E3D4BB`)                |   `5.0160:1` |   `5.02:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s3-cream`         | `viz.series.3.onLight` (`#0B5D7C`)               | `surface.raised` (`#EADCC5`)                |   `5.4134:1` |   `5.41:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s4-sand`          | `viz.series.4.onLight` (`#5D4585`)               | `surface.canvas` (`#E3D4BB`)                |   `5.4234:1` |   `5.42:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s4-cream`         | `viz.series.4.onLight` (`#5D4585`)               | `surface.raised` (`#EADCC5`)                |   `5.8530:1` |   `5.85:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-axis-sand`        | `viz.axis.onLight` (`#42574D`)                   | `surface.canvas` (`#E3D4BB`)                |   `5.3296:1` |   `5.33:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-axis-cream`       | `viz.axis.onLight` (`#42574D`)                   | `surface.raised` (`#EADCC5`)                |   `5.7518:1` |   `5.75:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s1-forest`        | `viz.series.1.onDark` (`#B7F34A`)                | `surface.brand` (`#12372A`)                 |   `9.9230:1` |   `9.92:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s1-deep`          | `viz.series.1.onDark` (`#B7F34A`)                | `surface.inverse` (`#08291F`)               |  `11.8257:1` |  `11.83:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s2-forest`        | `viz.series.2.onDark` (`#FF6B35`)                | `surface.brand` (`#12372A`)                 |   `4.6128:1` |   `4.61:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s2-deep`          | `viz.series.2.onDark` (`#FF6B35`)                | `surface.inverse` (`#08291F`)               |   `5.4973:1` |   `5.50:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s3-forest`        | `viz.series.3.onDark` (`#28B7E9`)                | `surface.brand` (`#12372A`)                 |   `5.6304:1` |   `5.63:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s3-deep`          | `viz.series.3.onDark` (`#28B7E9`)                | `surface.inverse` (`#08291F`)               |   `6.7100:1` |   `6.71:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s4-forest`        | `viz.series.4.onDark` (`#EADCC5`)                | `surface.brand` (`#12372A`)                 |   `9.6797:1` |   `9.68:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-s4-deep`          | `viz.series.4.onDark` (`#EADCC5`)                | `surface.inverse` (`#08291F`)               |  `11.5358:1` |  `11.54:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-axis-forest`      | `viz.axis.onDark` (`#A8BBB0`)                    | `surface.brand` (`#12372A`)                 |   `6.4772:1` |   `6.48:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-axis-deep`        | `viz.axis.onDark` (`#A8BBB0`)                    | `surface.inverse` (`#08291F`)               |   `7.7192:1` |   `7.72:1` |       PASS       | `candidateForD1Approval: true` |
| `d1-viz-tooltip`          | `viz.tooltip.foreground` (`#EADCC5`)             | `viz.tooltip.background` (`#08291F`)        |  `11.5358:1` |  `11.54:1` |       PASS       | `candidateForD1Approval: true` |

_(Los bordes de estado `status.{success,warning,danger,disabled}.border.*` comparten los valores hexadecimales anteriores y cumplen también `>= 4.9052:1` exacto sobre sus superficies claras y oscuras)._

---

## 4. Divisores decorativos vs. bordes funcionales de controles UI y anillos de foco (`>= 3.0000:1`)

| Categoría                      | Token (`Hex` / `RGBA`)                                      | Superficie (`Hex`)                                          |                  Ratio exacto |           Redondeado |   Umbral   | Regla                                                                                                      |
| ------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------: | -------------------: | :--------: | ---------------------------------------------------------------------------------------------------------- |
| **Divisor decorativo**         | `oak.color.line` (`rgba(18,55,42,0.18)` -> 8-bit `#BDB8A1`) | `surface.canvas` (`#E3D4BB`)                                | `1.3670:1` (`1.3687:1` float) |             `1.37:1` | Decorativo | **Prohibido** como borde funcional de input/checkbox/radio o anillo de foco; solo separadores decorativos. |
| **Divisor decorativo**         | `oak.color.line` (`rgba(18,55,42,0.18)` -> 8-bit `#C3BEA9`) | `surface.raised` (`#EADCC5`)                                | `1.3804:1` (`1.3768:1` float) |             `1.38:1` | Decorativo | Solo separadores decorativos sobre tarjeta/lámina.                                                         |
| **Borde funcional UI**         | `border.control.default` (`#5D6C63`)                        | `surface.canvas` (`#E3D4BB`)                                |                    `3.7991:1` |             `3.80:1` | `>= 3.0:1` | PASS (`SC 1.4.11`): campos, checkboxes, radios y chips en `sand.300`                                       |
| **Borde funcional UI**         | `border.control.default` (`#5D6C63`)                        | `surface.raised` (`#EADCC5`)                                |                    `4.1001:1` |             `4.10:1` | `>= 3.0:1` | PASS (`SC 1.4.11`): campos, checkboxes, radios y chips en `cream.100`                                      |
| **Borde funcional UI**         | `border.control.strong` (`#12372A`)                         | `surface.canvas` (`#E3D4BB`) / `surface.raised` (`#EADCC5`) |       `8.9692:1` / `9.6797:1` |  `8.97:1` / `9.68:1` | `>= 3.0:1` | PASS (`SC 1.4.11`): controles seleccionados/activos sobre claro                                            |
| **Borde funcional UI**         | `border.control.onDark` (`#7A8E82`)                         | `surface.brand` (`#12372A`) / `surface.inverse` (`#08291F`) |       `3.7487:1` / `4.4675:1` |  `3.75:1` / `4.47:1` | `>= 3.0:1` | PASS (`SC 1.4.11`): controles en secciones oscuras                                                         |
| **Borde funcional UI**         | `border.control.strong.onDark` (`#EADCC5`)                  | `surface.brand` (`#12372A`) / `surface.inverse` (`#08291F`) |      `9.6797:1` / `11.5358:1` | `9.68:1` / `11.54:1` | `>= 3.0:1` | PASS (`SC 1.4.11`): controles activos sobre oscuro                                                         |
| **Anillo de foco (`>= 3 px`)** | `focus.on-light` (`#12372A`)                                | `sand.300` (`#E3D4BB`)                                      |                    `8.9692:1` |             `8.97:1` | `>= 3.0:1` | PASS (`SC 2.4.11/2.4.13`)                                                                                  |
| **Anillo de foco (`>= 3 px`)** | `focus.on-light` (`#12372A`)                                | `cream.100` (`#EADCC5`)                                     |                    `9.6797:1` |             `9.68:1` | `>= 3.0:1` | PASS (`SC 2.4.11/2.4.13`)                                                                                  |
| **Anillo de foco (`>= 3 px`)** | `focus.on-light` (`#12372A`)                                | `lime.400` (`#B7F34A`)                                      |                    `9.9230:1` |             `9.92:1` | `>= 3.0:1` | PASS (`SC 2.4.11/2.4.13`)                                                                                  |
| **Anillo de foco (`>= 3 px`)** | `focus.on-light` (`#12372A`)                                | `orange.500` (`#FF6B35`)                                    |                    `4.6128:1` |             `4.61:1` | `>= 3.0:1` | PASS (`SC 2.4.11/2.4.13`; offset `>= 2 px`)                                                                |
| **Anillo de foco (`>= 3 px`)** | `focus.on-light` (`#12372A`)                                | `sky.400` (`#28B7E9`)                                       |                    `5.6304:1` |             `5.63:1` | `>= 3.0:1` | PASS (`SC 2.4.11/2.4.13`)                                                                                  |
| **Anillo de foco (`>= 3 px`)** | `focus.on-dark` (`#B7F34A`)                                 | `forest.700` (`#12372A`)                                    |                    `9.9230:1` |             `9.92:1` | `>= 3.0:1` | PASS (`SC 2.4.11/2.4.13`)                                                                                  |
| **Anillo de foco (`>= 3 px`)** | `focus.on-dark` (`#B7F34A`)                                 | `forest.950` (`#08291F`)                                    |                   `11.8257:1` |            `11.83:1` | `>= 3.0:1` | PASS (`SC 2.4.11/2.4.13`)                                                                                  |

---

## 5. Pares cromáticos PROHIBIDOS (`BRAND_UX_CONTRACT.md` §4.5 y auditoría `surface.raised`)

Queda **terminantemente prohibido** utilizar cualquiera de los siguientes **7 pares** para texto, etiquetas, enlaces o iconos significativos (incluyendo la extensión explícita de `Orange/Cream` y `Sky/Cream` sobre tarjetas/formularios `surface.raised`):

|   # | Par prohibido                       | Primer plano (`Hex`)     | Fondo (`Hex`)            | Ratio exacto | Redondeado | Regla normativa                                                                    |
| --: | ----------------------------------- | ------------------------ | ------------------------ | -----------: | ---------: | ---------------------------------------------------------------------------------- |
|   1 | **Orange/Sand**                     | `orange.500` (`#FF6B35`) | `sand.300` (`#E3D4BB`)   |   `1.9444:1` |   `1.94:1` | **PROHIBIDO** (`§4.5`) para texto e iconos significativos                          |
|   2 | **Sky/Sand**                        | `sky.400` (`#28B7E9`)    | `sand.300` (`#E3D4BB`)   |   `1.5930:1` |   `1.59:1` | **PROHIBIDO** (`§4.5`) para texto e iconos significativos                          |
|   3 | **Cream/Orange**                    | `cream.100` (`#EADCC5`)  | `orange.500` (`#FF6B35`) |   `2.0984:1` |   `2.10:1` | **PROHIBIDO** (`§4.5`) para texto e iconos significativos                          |
|  4a | **Lime/Sand** (`Lime/Sand-Cream`)   | `lime.400` (`#B7F34A`)   | `sand.300` (`#E3D4BB`)   |   `1.1063:1` |   `1.11:1` | **PROHIBIDO** (`§4.5`) para texto e iconos significativos                          |
|  4b | **Lime/Cream** (`Lime/Sand-Cream`)  | `lime.400` (`#B7F34A`)   | `cream.100` (`#EADCC5`)  |   `1.0251:1` |   `1.03:1` | **PROHIBIDO** (`§4.5`) para texto e iconos significativos                          |
|   5 | **Orange/Cream** (`surface.raised`) | `orange.500` (`#FF6B35`) | `cream.100` (`#EADCC5`)  |   `2.0984:1` |   `2.10:1` | **PROHIBIDO** (`P1-005`) para texto e iconos significativos sobre `surface.raised` |
|   6 | **Sky/Cream** (`surface.raised`)    | `sky.400` (`#28B7E9`)    | `cream.100` (`#EADCC5`)  |   `1.7192:1` |   `1.72:1` | **PROHIBIDO** (`P1-005`) para texto e iconos significativos sobre `surface.raised` |

> **Nota sobre acentos decorativos:** `orange.500`, `sky.400` y `lime.400` solo pueden aparecer sobre `sand.300` o `cream.100` como adornos puramente no textuales cuando toda la información y affordance permanezca disponible sin depender del color (`§4.5`).

---

## 6. Matriz simétrica completa `9×9` de los primitivos sólidos §4.2 (referencia rápida)

Valores redondeados a 2 decimales con fórmula WCAG 2.2 sRGB (`0.04045`). Cualquier celda `< 4.50` es **inválida para texto funcional** (y `< 3.00` inválida incluso para gráficos/controles no textuales):

| Primer plano \\ Fondo  | `forest.950` | `forest.700` | `ground.900` | `muted.700` | `orange.500` | `sky.400` | `lime.400` | `sand.300` | `cream.100` |
| ---------------------- | -----------: | -----------: | -----------: | ----------: | -----------: | --------: | ---------: | ---------: | ----------: |
| `forest.950` `#08291F` |         1.00 |         1.19 |         1.06 |        2.38 |         5.50 |      6.71 |      11.83 |      10.69 |       11.54 |
| `forest.700` `#12372A` |         1.19 |         1.00 |         1.26 |        2.00 |         4.61 |      5.63 |       9.92 |       8.97 |        9.68 |
| `ground.900` `#17211B` |         1.06 |         1.26 |         1.00 |        2.52 |         5.83 |      7.12 |      12.55 |      11.34 |       12.24 |
| `muted.700` `#4D6258`  |         2.38 |         2.00 |         2.52 |        1.00 |         2.31 |      2.82 |       4.97 |     4.50\* |        4.85 |
| `orange.500` `#FF6B35` |         5.50 |         4.61 |         5.83 |        2.31 |         1.00 |      1.22 |       2.15 |       1.94 |        2.10 |
| `sky.400` `#28B7E9`    |         6.71 |         5.63 |         7.12 |        2.82 |         1.22 |      1.00 |       1.76 |       1.59 |        1.72 |
| `lime.400` `#B7F34A`   |        11.83 |         9.92 |        12.55 |        4.97 |         2.15 |      1.76 |       1.00 |       1.11 |        1.03 |
| `sand.300` `#E3D4BB`   |        10.69 |         8.97 |        11.34 |      4.50\* |         1.94 |      1.59 |       1.11 |       1.00 |        1.08 |
| `cream.100` `#EADCC5`  |        11.54 |         9.68 |        12.24 |        4.85 |         2.10 |      1.72 |       1.03 |       1.08 |        1.00 |

`\*` **`muted.700` / `sand.300`** = **`4.4954:1` sin redondear** (`4.50:1` redondeado), única excepción limítrofe documentada (§2).
