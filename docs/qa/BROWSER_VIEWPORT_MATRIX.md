# Matriz de navegadores, los 5 viewports, regresión visual y accesibilidad (`BROWSER_VIEWPORT_MATRIX`)

- **Paquete:** `P0-007` (Fase 0 — Baseline y preparación de `G0`)
- **Owner:** `qa-e2e`
- **Fuentes normativas:** `docs/brand/BRAND_UX_CONTRACT.md` (§4.4–§4.5, §5.2, §8, §11.2, §12, §13 y §14), `docs/agentic/MASTER_EXECUTION_PLAN.md` (§4, §11 y §12) y `docs/agentic/QUALITY_GATES.md` (§6 G4–G5).

---

## 1. Propósito

Este documento fija la matriz obligatoria de compatibilidad entre navegadores desktop y móvil, los **5 viewports** de verificación responsive y visual, las reglas deterministas de regresión visual y el plan completo de verificación automática y manual **WCAG 2.2 Nivel AA**.

---

## 2. Matriz de navegadores soportados

De acuerdo con `MASTER_EXECUTION_PLAN.md` §4 y `QUALITY_GATES.md` §6 G4, OAK debe validarse en las **2 últimas versiones estables** de los navegadores desktop y móviles siguientes:

| Plataforma | Navegador | Motor | Versión soportada | Cobertura automatizada (`Playwright`) | Verificación en navegador / dispositivo real | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| **Desktop** | **Google Chrome** | `Chromium` | **2 últimas versiones estables** | Proyecto `chromium-desktop` en `<E2E_CRITICAL>` y `<E2E_FULL>` | Smoke + `NVDA` en Windows | `P0` |
| **Desktop** | **Microsoft Edge** | `Chromium` | **2 últimas versiones estables** | Cobertura de motor Chromium + proyecto/canal `msedge` en RC/G4 | Smoke crítico + contraste/teclado | `P0` |
| **Desktop** | **Mozilla Firefox** | `Gecko` | **2 últimas versiones estables** | Proyecto `firefox-desktop` en `<E2E_FULL>` y journeys críticos G4 | `NVDA` en Windows + zoom `200 %` | `P0` |
| **Desktop** | **Apple Safari** | `WebKit` | **2 últimas versiones estables** | Proyecto `webkit-desktop` en `<E2E_FULL>` y journeys críticos G4 | Verificación Safari macOS pre-release cuando aplique | `P0` |
| **Móvil** | **Safari iOS** | `WebKit` móvil | **2 últimas versiones estables** | Proyecto `webkit-mobile` (emulación iOS + viewport móvil) en `<E2E_FULL>` | Safari iOS + **VoiceOver** en flujos móviles críticos | `P0` |
| **Móvil** | **Chrome Android** | `Chromium` móvil | **2 últimas versiones estables** | Proyecto `chromium-mobile` (emulación Android + viewport móvil) en `<E2E_CRITICAL>` y `<E2E_FULL>` | Chrome Android + **TalkBack** en flujos móviles críticos | `P0` |

### 2.1 Reglas de cobertura multimotor

1. **Paridad entre motores:** Un journey `P0` o `P1` no puede aprobarse probando únicamente `Chromium`; `G4` exige ejecución en `Chromium`, `Firefox` y `WebKit`, además de cobertura desktop y móvil.
2. **Fijación de versiones en CI:** El lockfile de Playwright (`P0-004`/`P2-010`) fijará las revisiones exactas de Chromium, Firefox y WebKit en CI para evitar derivas no reproducibles entre el entorno del agente y el del `Release Guardian`.
3. **Política ante diferencias específicas de motor:** Cualquier fallo funcional, de foco o de desbordamiento exclusivo de `WebKit`/Safari o `Firefox` en un journey `P0`/`P1` se clasifica al menos como `P1` y bloquea el gate.

---

## 3. Los 5 viewports obligatorios y reglas responsive

Para conciliar los viewports de diseño del deck (`390`, `768`, `1440`) con los requisitos de reflow WCAG 2.2 AA (`320 px`) y el umbral mínimo de escritorio (`1200 px`) definidos en `BRAND_UX_CONTRACT.md` §12.1 y §12.3, toda suite responsive, visual y de accesibilidad debe cubrir obligatoriamente los **5 viewports** siguientes:

| ID | Viewport (`ancho x alto`) | Modo canónico (`§12.1`) | Columnas | Objetivo principal de verificación |
| --- | --- | --- | --- | --- |
| **VP-01** | **`320x568`** | **Mobile** (`320–767 px`) | `4` | Reflow WCAG 2.2 AA a `320 CSS px`, **cero scroll horizontal**, legibilidad sin solapamientos, controles >= `48x48 px`, formularios y tablas adaptadas |
| **VP-02** | **`390x844`** | **Mobile** (`320–767 px`) | `4` | Flujo móvil estándar: navegación inferior/principal, bottom sheet de filtros, CTA sin tapar errores/foco, teclado virtual y flujo de pago |
| **VP-03** | **`768x1024`** | **Tablet** (`768–1199 px`) | `8` | Transición de diseño apilado a rejilla de 8 columnas, paneles de organizador, modales y tarjetas comparativas |
| **VP-04** | **`1200x800`** | **Desktop mínimo** (`>= 1200 px`) | `12` | Punto de entrada exacto al modo Desktop (`1200 px`): filtros visibles en escritorio sin colapso, barra de navegación completa y tablas operativas |
| **VP-05** | **`1440x900`** | **Desktop principal** (`>= 1200 px`) | `12` | Lienzo principal de diseño: jerarquía hero/catálogo, comparativa de modalidades, resumen de inscripción y workspace `/pro` |

### 3.1 Invariantes responsive que QA debe comprobar (`BRAND_UX_CONTRACT.md` §12.2)

- **Adaptación estructural real:** la jerarquía visual cambia por breakpoint; se rechaza cualquier vista móvil que simplemente escale hacia abajo la maqueta de escritorio.
- **Filtros por modo:** visibles en escritorio (`1200x800` y `1440x900`) y accesibles mediante `dialog` o `bottom sheet` en móvil (`320x568` y `390x844`) con gestión correcta de foco y cierre por `Escape`.
- **Tablas sin scroll 2D primario:** la tabla de participantes/eventos del organizador (`/pro`) y comparativas de modalidades deben transformarse en tarjetas o listas accesibles en `320x568` y `390x844`, sin exigir scroll bidimensional para completar tareas primarias.
- **CTA pegajoso seguro:** si existe un CTA fijo/pegajoso en móvil en `/retos/:eventSlug` o inscripción, no puede cubrir mensajes de error, campos enfocados ni controles de navegación.
- **Continuidad entre viewports:** un flujo multipaso (ej. borrador de inscripción) permite pausar y reanudar al cambiar de viewport o dispositivo autenticado.

---

## 4. Contrato determinista de regresión visual (`BRAND_UX_CONTRACT.md` §14)

### 4.1 Autoridad del baseline

- Los decks estáticos bajo `sites/oak-brand-deck/` y `sites/oak-web-design-deck/` **no** son baselines píxel a píxel de producto.
- Los baselines visuales de producción se generan exclusivamente a partir de una implementación aprobada tras **Gate D1** utilizando los tokens canónicos, tipografías locales `WOFF2` (`Sora` e `Inter`) y masters vectoriales aprobados.

### 4.2 Siete reglas obligatorias de captura determinista (§14.2)

Toda captura de regresión visual en Playwright debe garantizar:
1. **Datos sintéticos fijos:** utilizar únicamente el dataset seed congelado (`P0-009`), sin PII real ni valores aleatorios.
2. **Reloj, zona horaria y aleatoriedad congelados:** fijar `clock` en navegador/servidor, zona horaria explícita (`Europe/Madrid` sobre timestamps `UTC`) y generadores deterministas.
3. **Carga completa de fuentes e imágenes:** esperar explícitamente a `document.fonts.ready` y a la decodificación completa de todas las imágenes (`WebP`/`AVIF`) antes de capturar.
4. **Animaciones y caret desactivados:** inyectar/activar `prefers-reduced-motion: reduce`, desactivar transiciones CSS/JS y ocultar el parpadeo del caret (`caret-color: transparent` en estado de captura estática cuando proceda).
5. **Ejecución en los 5 viewports:** capturar toda pantalla crítica al menos en `320x568`, `390x844`, `768x1024`, `1200x800` y `1440x900` (o subconjunto justificado para vistas exclusivamente operativas documentadas en D1).
6. **Mismo tema, locale y estado de datos:** fijar `locale: "es-ES"` y estado inicial exacto para cada captura.
7. **Enmascaramiento mínimo:** ocultar únicamente regiones externas no deterministas documentadas (por ejemplo, elementos de terceros fuera del control del repositorio).

### 4.3 Páginas y estados mínimos obligatorios de baseline (§14.3)

| Ruta / Vista | Estados obligatorios a capturar | Viewports mínimos |
| --- | --- | --- |
| `/` (Inicio público) | Normal poblado, `loading`/skeleton y `error` | `320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900` |
| `/explorar` (Descubrimiento) | Sin filtros, filtros activos visibles/chips, `empty` (0 resultados) y `bottom sheet`/`dialog` móvil | Los 5 viewports |
| `/retos/:eventSlug` (Ficha) | Disponible, últimas plazas / casi lleno, agotado (`sold-out`, sin CTA engañoso) y cancelado (`cancelled`) | Los 5 viewports |
| `/inscripciones/:eventId/*` (4 etapas) | `modalidad`, `datos` (normal + errores de validación + `readonly` reutilizado), `revision` (consentimientos) y `pago` | Los 5 viewports |
| `/inscripciones/:eventId/resultado` | `succeeded`, `pending`, `cancelled` y `failed` | Los 5 viewports |
| `/mis-retos` | `empty` (sin eventos) y poblado (próximo reto + activas) | Los 5 viewports |
| `/trayectoria` | `empty` y poblado con historial y métricas explicables | Los 5 viewports |
| `/pro` y `/pro/eventos*` | Resumen `/pro`, listado `/pro/eventos`, tabla/lista de participantes (`/pro/eventos/:eventId/participantes`) en `empty`, `loading` y poblado | `390x844`, `768x1024`, `1200x800`, `1440x900` (+ reflow `320x568` en tareas primarias) |
| Navegación móvil y foco | Menú móvil, `bottom sheet` y **estado de foco visible por teclado (`3 px`)** en cada página crítica | Los 5 viewports |

### 4.4 Criterios de revisión visual (§14.4)

Un diff visual no aprobado bloquea la transición del paquete. El revisor (`BRUX` / `QA` / `auditor-no-funcional`) verifica siempre:
- Fidelidad de tokens semánticos y tipografía (`Sora` / `Inter`, etiquetas `>= 12 px`, nunca tamaños `4–10 px` de los decks).
- Integridad del logotipo sin deformación ni filtros CSS sobre PNG.
- Recorte de fotografía y contraste de overlay sobre imágenes.
- Ausencia de overflow horizontal y solapamientos en cada uno de los 5 viewports.
- Visibilidad del foco de teclado (`3 px`), estados (`loading`, `empty`, `error`, `disabled`, `selected`).
- **Prohibiciones absolutas de marca/accesibilidad:** cero uso de pares prohibidos (`#FF6B35` naranja sobre `#E3D4BB` arena `1.94:1`, `#28B7E9` cielo sobre `#E3D4BB` arena `1.59:1`, `#EADCC5` crema sobre `#FF6B35` naranja `2.10:1`, lima `#B7F34A` sobre arena/crema, blanco `#FFFFFF` o negro `#000000` puros como superficies de marca), cero iconos Unicode (`⌂`, `⌕`, `◉`, `⚙`, `♡`) y cero textos ilustrativos o anotaciones de los decks.
- **Regla anti-autoaprobación:** un umbral numérico de tolerancia de píxeles puede filtrar ruido subpíxel, pero **nunca** autoaprueba cambios de layout, tipografía, color de marca, logotipo o jerarquía de acciones críticas.

---

## 5. Plan de accesibilidad WCAG 2.2 Nivel AA

El objetivo de producción de OAK es **WCAG 2.2 Nivel AA** (`QUALITY_GATES.md` §6 G5 y `BRAND_UX_CONTRACT.md` §13). Pasar un escáner automático es condición necesaria, pero **insuficiente** sin verificación manual.

### 5.1 Verificación automática (`<A11Y_AUTOMATED>`)

1. **`axe-core` en Playwright y pruebas de componente:**
   - Se ejecuta sobre todas las rutas críticas (`J01`–`J08`), en estados `default`, `empty`, `error`, `disabled`, modales/bottom sheets abiertos y formularios con errores de validación, cubriendo viewport desktop (`1200x800`/`1440x900`) y móvil (`320x568`/`390x844`).
   - **Umbral G5:** **`0` violaciones `critical` o `serious`**. Cualquier hallazgo `moderate` o `minor` se registra y triaga con owner.
2. **Lighthouse CI móvil:**
   - **Umbral G5:** puntuación de accesibilidad **>= `95`**.

### 5.2 Verificación manual obligatoria (`<A11Y_MANUAL>`)

Antes de que una historia de UI o el release candidate (`P7-001`) supere `G5`, QA y `auditor-no-funcional` ejecutan y documentan los 8 controles manuales siguientes:

| Control WCAG 2.2 AA | Criterio medible de aceptación en OAK |
| --- | --- |
| **1. Navegación por teclado sin trampas** | Todos los journeys (`J01`–`J07` y `/pro`) son 100 % operables sin ratón (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, flechas). Existe `skip link` al contenido principal, el orden de foco sigue el orden de lectura, los diálogos/bottom sheets atrapan el foco solo mientras están abiertos y lo devuelven al disparador al cerrar. **Cero trampas de teclado.** |
| **2. Foco visible `3 px` y no oculto** | Todo elemento interactivo muestra un anillo de foco mínimo equivalente a **`3 px`** (`focus.on-light` `#12372A` sobre claro, `focus.on-dark` `#B7F34A` sobre oscuro), con separación de al menos `2 px` cuando sea necesaria, contraste **>= `3:1`** frente a colores adyacentes y sin quedar tapado por cabeceras o CTAs pegajosos. |
| **3. Objetivos táctiles `48x48 px`** | Todos los botones, enlaces de acción, chips, checkboxes/radios (o su área clicable extendida) y controles de cierre tienen al menos **`48 x 48 CSS px`** (`BRAND_UX_CONTRACT.md` §11.2 y `MASTER_EXECUTION_PLAN.md` §11), con separación suficiente para evitar toques accidentales. |
| **4. Zoom al `200 %` y Reflow `320 px`** | **(a)** Zoom del navegador al **`200 %`** (sobre viewport desktop base `1200x800` / `1440x900`) sin pérdida de texto, controles ni solapamientos; **(b)** Reflow completo a **`320 CSS px`** (`320x568`) sin scroll horizontal de página ni truncamiento ilegible. |
| **5. `prefers-reduced-motion: reduce`** | Con la preferencia activa en sistema/navegador, se suprimen trazados de ruta, pulsos de skeleton, parallax, *smooth scrolling* y animaciones no esenciales **incluidas las iniciadas por JavaScript**, manteniendo inmediatas y comprensibles las transiciones de estado. |
| **6. Contraste de color y no solo color** | Todo texto funcional UI alcanza contraste **`>= 4.5:1`** (`BRAND_UX_CONTRACT.md` §4.4), iconos/bordes de control `>= 3:1`, cero pares prohibidos (`§4.5`) y ningún estado (`error`, `success`, `disabled`, ocupación) se comunica solo por color, forma o posición. |
| **7. Estructura semántica y formularios** | Atributo `lang="es"` correcto, título de página único y descriptivo, exactamente **un `<h1>`** por página, jerarquía lógica `h1`–`h3`, landmarks (`header`, `nav`, `main`, `footer`), `alt=""` en decorativas y descriptivo en informativas, nombre accesible en botones solo-icono, `<label>` persistente en inputs, errores adyacentes enlazados con `aria-describedby` + resumen inicial y `aria-live` sin spam ni robo de foco. |
| **8. Lectores de pantalla (`NVDA` + lector móvil)** | Recorrido completo y verificado con **`NVDA`** (en Windows con Chrome o Firefox) **y** al menos **un lector de pantalla móvil** (**`TalkBack`** en Chrome Android y/o **`VoiceOver`** en Safari iOS) comprobando lectura natural de precios, fechas, distancias, desnivel, estados de error, botones, diálogos/bottom sheets y confirmaciones. |

### 5.3 Matriz de cobertura de lectores de pantalla por flujo crítico

| Flujo crítico | Desktop (`NVDA` + Chrome/Firefox) | Móvil (`TalkBack` Chrome Android / `VoiceOver` Safari iOS) | Viewports asociados | Evidencia requerida en `G5` / `P7-001` |
| --- | --- | --- | --- | --- |
| **J01 · Descubrimiento y filtros (`/`, `/explorar`)** | Obligatorio (filtros, chips removibles, resultados, empty/error) | Obligatorio (apertura/cierre `bottom sheet` filtros y lectura de tarjetas) | `320x568`, `390x844`, `1200x800`, `1440x900` | Acta manual `a11y` + `axe-core` JSON |
| **J02 · Ficha de evento (`/retos/:eventSlug`)** | Obligatorio (jerarquía antes del CTA, modalidades, agotado/cerrado) | Obligatorio (CTA móvil, comparación modalidades, favoritos/return-to) | `320x568`, `390x844`, `768x1024`, `1440x900` | Acta manual `a11y` + capturas foco |
| **J03 · Cuenta y perfil (`/entrar`, `/registro`, `/perfil`)** | Obligatorio (errores `aria-describedby`, resumen, labels, `readonly`) | Obligatorio (teclado móvil, errores adyacentes, consentimientos) | `320x568`, `390x844`, `1200x800` | Acta manual `a11y` + `axe-core` JSON |
| **J04 · Inscripción 4 etapas y resultado pago** | Obligatorio (stepper, desglose total, consentimiento, `resultado`) | Obligatorio (continuidad paso a paso, `Continuar al pago`, resultado durable) | `320x568`, `390x844`, `768x1024`, `1440x900` | Acta manual `NVDA` + móvil |
| **J05 · Trayectoria (`/mis-retos`, `/trayectoria`)** | Obligatorio (`empty`, próximo reto, métricas explicables sin presión) | Obligatorio (navegación entre retos y lectura de cuenta atrás/estado) | `320x568`, `390x844`, `1440x900` | Acta manual `a11y` + `axe-core` JSON |
| **J06–J07 · Workspace Organizador (`/pro/**`)** | Obligatorio (editor por secciones, checklist publicación, tabla participantes, CSV) | Recomendado en consulta/revisión responsive `768x1024` y `390x844` (lista adaptada) | `390x844`, `768x1024`, `1200x800`, `1440x900` | Acta manual `NVDA` + tabla responsive |

---

## 6. Evidencias obligatorias de ejecución (`G4` y `G5`)

Para cada paquete con UI (`P2`–`P8`) y en la auditoría final `P7-001`, la evidencia archivada en `docs/evidence/<semana>/<task-id>/` debe contener, sin PII real y ligada al SHA candidato exacto:
- Resultados legibles por máquina (`Playwright` JSON/JUnit, informe `axe-core` JSON, informe `Lighthouse CI`).
- Capturas responsive en los viewports aplicables (cubriendo estados normal, `empty`, `error`, `disabled`, `permission denied` y foco visible `3 px`).
- Checklist manual WCAG 2.2 AA firmado indicando versiones exactas de navegador, `NVDA` y lector móvil (`TalkBack`/`VoiceOver`), resultado de zoom `200 %`, reflow `320 px` y `prefers-reduced-motion`.