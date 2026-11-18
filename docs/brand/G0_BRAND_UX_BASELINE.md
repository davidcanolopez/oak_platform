# Baseline G0 de Identidad de Marca y Criterios UX Accesibles — OAK

## Control documental y estado de Gate D1

| Campo | Valor |
| --- | --- |
| Paquete origen | `P0-011` (Req. #14 de `docs/agentic/QUALITY_GATES.md` §6 `G0`) |
| Base SHA | `bd3cf59b9f228dffa9c8be66eb4e624723e995b9` |
| Contrato de referencia | `docs/brand/BRAND_UX_CONTRACT.md` (`v0.1`, `Draft - requires Gate D1 approval`, `2026-11-11`) |
| Regla de UI | `.agents/rules/oak-brand-ui.md` |
| Estado de Gate D1 | **`PENDING USER VALIDATION`** (`docs/agentic/DECISION_LOG.md`) |
| Naturaleza del documento | Línea base normativa de Fase 0 (`G0`) para prevenir contaminación en `P0-004` y fases iniciales; **NO aprueba ni congela** `D1-01..D1-14` |

> **Declaración explícita sobre Gate D1:** La decisión `D1` (*Brand and UX contract*) permanece **`PENDING USER VALIDATION`**. Ningún punto de esta línea base sustituye la aprobación explícita del usuario en Fase 1 (`P1-012` / `D1`) ni habilita el desarrollo de componentes o pantallas definitivas de producción antes de cerrar los **14 blockers abiertos `D1-01..D1-14`**.

---

## 1. Jerarquía normativa y restricciones sobre los decks de referencia

### 1.1 Precedencia de fuentes (`AGENTS.md` y `BRAND_UX_CONTRACT.md` §1.1)

Ante cualquier discrepancia entre documentos, los agentes deben aplicar primero el orden de autoridad de `AGENTS.md`:

1. Decisión explícita del usuario registrada en `docs/agentic/DECISION_LOG.md`.
2. `docs/agentic/MASTER_EXECUTION_PLAN.md` (alcance, dependencias e hitos).
3. `docs/agentic/QUALITY_GATES.md` (requisitos de prueba, calidad y release).
4. `docs/brand/BRAND_UX_CONTRACT.md` (reglas de UI, contenido, diseño responsive y accesibilidad).
5. Los dos decks estáticos bajo `sites/` como evidencia visual.
6. La memoria del TFM (`Memoria_TFM_David_Cano_v.1.docx`) y la hoja de seguimiento como contexto.

Dentro del dominio específico de marca y experiencia de usuario (`BRAND_UX_CONTRACT.md` §1.1):

1. `docs/brand/BRAND_UX_CONTRACT.md` (tras su aprobación en Gate `D1`).
2. Decisiones de arquitectura (ADR), requisitos de producto y decisiones de accesibilidad aprobados con posterioridad al contrato.
3. Deck de identidad de marca (`sites/oak-brand-deck/dist/index.html`, `18` slides) para propósito, personalidad, voz e intención visual.
4. Deck de experiencia web (`sites/oak-web-design-deck/dist/index.html`, `19` slides declaradas en `#total` / `23` elementos `<section>` en el HTML) para intención UX, arquitectura de información y dirección ilustrativa de pantallas.
5. `Memoria_TFM_David_Cano_v.1.docx` para contexto de negocio, hipótesis y estrategia de validación.
6. Detalles concretos de implementación HTML, CSS y JavaScript presentes en cualquiera de los dos decks (autoridad mínima; no normativos).

Nota sobre `figuras/*` (`BRAND_UX_CONTRACT.md` §1.2): aportan exclusivamente conceptos metodológicos y de posicionamiento académico; su lenguaje visual (navy, teal, blue y purple) **no forma parte de la identidad de producto OAK**.

### 1.2 Prohibición absoluta de copiar CSS o JS de `sites/**`

Queda **prohibido** copiar o adaptar al scaffold (`P0-004`) o al código de producción hojas de estilo, scripts o marcas HTML de `sites/oak-brand-deck/dist/{index.html,styles.css,script.js}` (`18` slides) o `sites/oak-web-design-deck/dist/{index.html,styles.css,script.js}` (`19` slides declaradas en `#total`), por las siguientes incompatibilidades verificadas:

- Implementan navegación por diapositivas (`scroll-snap-type: y mandatory`, control de teclado de presentación) y mockups no funcionales (`preventDefault()` en JS).
- Contienen tamaños escalados ilegibles en producción (`4px`, `5px`, `6px`, `7px`, `8px`, `9px`, `10px`, `11px` observados en `sites/oak-web-design-deck/dist/styles.css`).
- Usan breakpoints exclusivos de presentación (`900px` y `560px` en el brand deck; `1000px`, `760px` y `650px` en el web deck).
- Emplean nomenclatura inconsistente de variables (`--mist` vs `--sand`, `--forest-deep` vs `--deep`, `--muted: #7d8d84` vs `#6d776f`, `--ink: #203c31`) y colores hardcodeados fuera de contrato.
- Simulan variantes del logotipo mediante filtros CSS (`brightness(0) ... invert(...)` y `grayscale(1) brightness(.2)`).
- Cargan fuentes externamente desde `fonts.googleapis.com`, dependencia no autorizada para producción.
- El directorio `sites/**` es **inmutable** como referencia visual estática.

### 1.3 Inventario y restricción de los 6 assets de referencia (`BRAND_UX_CONTRACT.md` §1.3, §6 y §7)

Ambos decks contienen copias idénticas de exactamente **6 assets** bajo `dist/assets/`. Todos tienen carácter **`reference-only`** y su uso en producción está **bloqueado** hasta cerrar `D1-03` y `D1-12`:

| Asset | Tipo / Dimensiones verificadas | Peso verificado | Rol de referencia | Restricción obligatoria hasta Gate `D1` |
| --- | --- | ---: | --- | --- |
| `oak-logo.png` | PNG `2172 x 724 px` | `953,997` bytes | Logotipo completo (único master raster existente) | Solo prototipos/revisión interna. Prohibido recrear variantes inversa o monocroma con filtros CSS o distorsionar proporción; faltan masters vectoriales y registro de licencia (`D1-03`). |
| `oak-mark.svg` | SVG | `536` bytes | Símbolo O (curvas topográficas + anillos + segmento naranja) | Referencia hasta aprobar kit vectorial definitivo, clear space, tamaño mínimo, favicon y registro de titularidad (`D1-03`). |
| `topography.svg` | SVG | `1,036` bytes | Motivo gráfico topográfico de soporte | Debe permanecer secundario al contenido; no puede reducir legibilidad ni hacer decorativo un mapa funcional (`§6.2`). |
| `oak-runner.png` | PNG `1672 x 941 px` | `2,521,210` bytes | Fotografía editorial de corredor | **Prohibido en producción:** PNG pesado `1672x941` sin pipeline responsive (`WebP`/`AVIF`) ni registro de procedencia/derechos/model release (`D1-12`). |
| `oak-cyclist.png` | PNG `1672 x 941 px` | `3,077,806` bytes | Fotografía editorial de ciclista | **Prohibido en producción:** PNG pesado `1672x941` sin pipeline responsive (`WebP`/`AVIF`) ni registro de procedencia/derechos/model release (`D1-12`). |
| `oak-community.png` | PNG `1672 x 941 px` | `2,650,696` bytes | Fotografía editorial de comunidad | **Prohibido en producción:** PNG pesado `1672x941` sin pipeline responsive (`WebP`/`AVIF`) ni registro de procedencia/derechos/model release (`D1-12`). |

Reglas adicionales de medios y lenguaje gráfico (§6–§7):
- Las tres fotografías `1672x941` suman `8,249,712` bytes (`~7.87 MiB` / `8.25 MB` en formato PNG sin variantes responsive optimizadas): su uso directo compromete los presupuestos de rendimiento web (`LCP <= 2,5 s`) y está prohibido en `public/` o rutas de producción.
- La biblioteca futura debe representar diversidad real de edad, cuerpo, capacidad, disciplina, ubicación y nivel (respaldando *"help each person"*).
- Conservar tratamiento natural del color, evitar filtros de color de marca, usar overlays únicamente para garantizar contraste de texto, elegir recortes con espacio intencional para copy, no repetir la misma imagen hero entre páginas y asignar `alt` descriptivo si es informativa o `alt=""` si es puramente decorativa.

---

## 2. Tokens base, tipografía, movimiento y contraste cromático

> Los tokens listados constituyen la base canónica del contrato; su paquete legible por máquina y su aprobación final pertenecen a `D1-02`, `D1-04` y `D1-05`. En código de aplicación está prohibido dispersar valores hexadecimales literales.

### 2.1 Tokens primitivos de color (`BRAND_UX_CONTRACT.md` §4.2)

| Token | Valor | Rol previsto |
| --- | --- | --- |
| `oak.color.forest.950` | `#08291F` | Superficies inversas profundas y secciones inmersivas |
| `oak.color.forest.700` | `#12372A` | Color principal de marca, navegación y texto fuerte |
| `oak.color.ground.900` | `#17211B` | Texto primario sobre superficies claras y brillantes |
| `oak.color.lime.400` | `#B7F34A` | Progreso, descubrimiento y acción positiva de avance |
| `oak.color.orange.500` | `#FF6B35` | Acción principal y acento de siguiente reto |
| `oak.color.sky.400` | `#28B7E9` | Acento informativo o de descubrimiento |
| `oak.color.sand.300` | `#E3D4BB` | Lienzo por defecto (`canvas`) |
| `oak.color.cream.100` | `#EADCC5` | Superficie elevada clara y texto inverso |
| `oak.color.muted.700` | `#4D6258` | Texto secundario sobre superficies claras aprobadas |
| `oak.color.line` | `rgba(18, 55, 42, 0.18)` | Divisores y bordes en superficies claras |

Reglas obligatorias:
- **Prohibido** introducir blanco puro (`#FFFFFF`) o negro puro (`#000000`) como superficies o texto de marca OAK (solo admisibles dentro de contenido de terceros, widgets de pago, mapas o medios externos fuera del control de OAK).
- Los porcentajes cromáticos del deck de marca son orientativos de composición editorial; prevalecen siempre contraste funcional y jerarquía.

### 2.2 Tokens semánticos base (`BRAND_UX_CONTRACT.md` §4.3)

| Token semántico | Mapeo primitivo | Uso obligatorio |
| --- | --- | --- |
| `surface.canvas` | `sand.300` | Fondo de página por defecto |
| `surface.raised` | `cream.100` | Tarjetas, láminas y superficies de formulario |
| `surface.brand` | `forest.700` | Navegación de marca o secciones fuertes |
| `surface.inverse` | `forest.950` | Secciones inmersivas y contenido inverso |
| `text.primary` | `ground.900` | Contenido principal sobre superficies claras/brillantes |
| `text.secondary` | `muted.700` | Contenido de apoyo donde se mantenga el contraste aprobado |
| `text.brand` | `forest.700` | Encabezados de marca sobre superficies claras |
| `text.inverse` | `cream.100` | Contenido sobre superficies `forest` |
| `action.primary.background` | `orange.500` | Llamadas a la acción primarias |
| `action.primary.foreground` | `ground.900` | Texto e iconos sobre acciones primarias |
| `action.secondary.foreground` | `forest.700` | Acción secundaria sobre superficie clara |
| `progress.background` | `lime.400` | Progreso, completado y avance |
| `progress.foreground` | `forest.700` | Texto o icono sobre superficies de progreso |
| `info.background` | `sky.400` | Énfasis informativo únicamente |
| `info.foreground` | `ground.900` | Texto o icono sobre énfasis informativo |
| `focus.on-light` | `forest.700` | Anillo de foco sobre `sand`, `cream`, `lime`, `orange` o `sky` |
| `focus.on-dark` | `lime.400` | Anillo de foco sobre superficies `forest` |

**Bloqueo de estados semánticos no aprobados (§4.3 y §11.5):** Los tokens de `success`, `warning`, `danger`, `disabled` y visualización de datos son un blocker abierto (`D1-05`). Hasta su aprobación, **está prohibido** inventar verdes, amarillos o rojos o usar `lime` y `orange` como colores universales de estado. Los estados de error y éxito deben comunicar siempre mediante texto e icono además de cualquier color.

### 2.3 Pares de contraste aprobados (`BRAND_UX_CONTRACT.md` §4.4)

Todo texto funcional de interfaz debe cumplir al menos **`4.5:1`** (incluso cuando WCAG permita ratios menores en texto grande):

| Primer plano (Foreground) | Fondo (Background) | Ratio | Regla |
| --- | --- | ---: | --- |
| Ground `#17211B` | Sand `#E3D4BB` | `11.34:1` | Permitido |
| Forest `#12372A` | Sand `#E3D4BB` | `8.97:1` | Permitido |
| Muted `#4D6258` | Sand `#E3D4BB` | `4.50:1` | Permitido con precaución; usar Ground para texto denso o pequeño |
| Cream `#EADCC5` | Forest `#12372A` | `9.68:1` | Permitido |
| Cream `#EADCC5` | Deep Forest `#08291F` | `11.54:1` | Permitido |
| Forest `#12372A` | Lime `#B7F34A` | `9.92:1` | Permitido |
| Ground `#17211B` | Lime `#B7F34A` | `12.55:1` | Permitido |
| Forest `#12372A` | Orange `#FF6B35` | `4.61:1` | Permitido para texto normal; se prefiere Ground |
| Ground `#17211B` | Orange `#FF6B35` | `5.83:1` | Permitido y preferido |
| Ground `#17211B` | Sky `#28B7E9` | `7.12:1` | Permitido |
| Forest `#12372A` | Sky `#28B7E9` | `5.63:1` | Permitido |
| Lime `#B7F34A` | Deep Forest `#08291F` | `11.83:1` | Permitido |
| Orange `#FF6B35` | Deep Forest `#08291F` | `5.50:1` | Permitido |
| Sky `#28B7E9` | Deep Forest `#08291F` | `6.71:1` | Permitido |

### 2.4 Los 4 pares cromáticos PROHIBIDOS (`BRAND_UX_CONTRACT.md` §4.5)

Queda **terminantemente prohibido** usar cualquiera de los **4 pares** siguientes para texto o iconos significativos:

| # | Par prohibido | Primer plano | Fondo | Ratio | Regla |
| ---: | --- | --- | --- | ---: | --- |
| 1 | **Orange/Sand** | Orange `#FF6B35` | Sand `#E3D4BB` | `1.94:1` | Prohibido para texto e iconos significativos |
| 2 | **Sky/Sand** | Sky `#28B7E9` | Sand `#E3D4BB` | `1.59:1` | Prohibido para texto e iconos significativos |
| 3 | **Cream/Orange** | Cream `#EADCC5` | Orange `#FF6B35` | `2.10:1` | Prohibido para texto e iconos significativos |
| 4 | **Lime/Sand-Cream** | Lime `#B7F34A` | Sand `#E3D4BB` o Cream `#EADCC5` | Insuficiente | Prohibido para texto e iconos significativos |

- `Orange`, `Sky` y `Lime` solo pueden aparecer sobre superficies claras como acentos decorativos no textuales cuando la información siga disponible sin depender del color.
- Cualquier par nuevo introducido en el sistema debe verificarse automáticamente y revisarse en Gate `D1` o un gate de sistema de diseño posterior.

### 2.5 Tipografía y tokens provisionales de movimiento (`BRAND_UX_CONTRACT.md` §5 y §8)

- **Familias:** `Sora` (títulos de página, encabezados de sección, mensajes de campaña y métricas relevantes) e `Inter` (navegación, cuerpo, formularios, tablas, etiquetas y datos operativos).
- **Escala tipográfica mínima (§5.2):**
  - `type.display`: `Sora`, `clamp(48px, 5vw, 72px)`, `line-height: 0.98`, `weight: 700` (solo hero marketing/producto principal).
  - `type.heading.xl`: `Sora`, `clamp(40px, 4vw, 48px)`, `line-height: 1.05`, `weight: 700`.
  - `type.heading.lg`: `Sora`, `32px`, `line-height: 1.10`, `weight: 600`.
  - `type.heading.md`: `Sora`, `24px`, `line-height: 1.20`, `weight: 600`.
  - `type.heading.sm`: `Sora`, `20px`, `line-height: 1.25`, `weight: 600`.
  - `type.body`: `Inter`, `16px`, `line-height: 1.50`, `weight: 400`.
  - `type.body.small`: `Inter`, `14px`, `line-height: 1.45`, `weight: 400` o `500`.
  - `type.label`: `Inter`, `12px`, `line-height: 1.25`, `weight: 600` o `700`.
- **Restricciones tipográficas:** prohibidos los tamaños `4-10 px` del deck y cualquier etiqueta `< 12 px`; usar únicamente pesos `400`, `500`, `600`, `700` u `800` (prohibido sintetizar `650`); prohibido depender de Google Fonts en producción (archivos `WOFF2` locales y licencias pendientes de `D1-04`); texto largo, valores de formulario y errores siempre en *sentence case*.
- **Movimiento provisional (§8, pendiente `D1`):** `motion.fast` (`160 ms`), `motion.standard` (`240 ms`), `motion.reveal` (`480 ms`), `motion.route.max` (`1200 ms`), `motion.ease.out` (`cubic-bezier(.16, 1, .3, 1)`). No puede bloquear interacción mientras se ejecuta y debe desactivarse bajo `prefers-reduced-motion: reduce`.

---

## 3. Política lingüística `es-ES`, voz OAK, navegación base y datos prohibidos

### 3.1 Política lingüística `es-ES` (`BRAND_UX_CONTRACT.md` §3.4)

- El idioma de la interfaz del MVP es **español de España (`es-ES`)** en navegación, formularios, mensajes del sistema, ayuda, errores y herramientas del organizador, con atributo HTML `lang` coherente (`es` / `es-ES`).
- **Excepciones permitidas para inglés únicamente en:**
  1. Promesa maestra aprobada (`Your next challenge starts here.`) y firma (`Overcome. Achieve. Keep going.`), cuya permanencia en inglés o sustitución por alternativa aprobada en español debe confirmarse en Gate `D1` (`D1-06`).
  2. Nombres de deportes consolidados en el uso común en España (p. ej., *trail*, *running*).
  3. Futura experiencia localizada gobernada por especificación formal de internacionalización.
- **Prohibido en producción:** anotaciones o encabezados bilingües de los decks como `Decision page`, `Conversion flow` o `Athlete home`.

### 3.2 Voz, personalidad y vocabulario OAK (`BRAND_UX_CONTRACT.md` §2.5 y §3.1–§3.5)

- **Personalidad:** resiliente sin glorificar el sufrimiento; aventurera sin imprudencia; realista antes que hiperbólica; humana antes que obsesionada mecánicamente con el rendimiento; ambiciosa sin elitismo; enérgica sin agresividad.
- **Voz clara, activa y alentadora:** conectar la acción actual con el siguiente paso útil; verbos concretos y lenguaje llano; reconocer el progreso sin exigir perfección; reducir incertidumbre en fechas, requisitos, precios y consecuencias; respetar distintos niveles; no presentar la participación como obligación moral.
- **Vocabulario preferido:** *reto*, *camino*, *constancia*, *descubrir*, *avanzar*, *historia*, *siguiente paso*, *trayectoria*, *preparación*, *comunidad* (en copy transaccional y de seguridad, la claridad prima sobre el vocabulario de marca).
- **Tono prohibido (§3.3):** expresiones equivalentes a *"sin límites"* / *"sin limites"*, *"solo para los mejores"*, *"vence a todos"*, *"no hay excusas"*; mensajes de culpa por inactividad o abandono; urgencia o escasez sin respaldo real; promesas de rendimiento garantizado; equiparar el valor personal con ranking, velocidad o llegada a meta.
- **Copy transaccional (§3.5):** indicar qué hace la acción, importe o compromiso antes de confirmar, si el progreso se guarda, qué ocurre después y cómo corregir o salir con seguridad. Botones con acción específica (`Continuar al pago`, `Guardar reto`, `Publicar evento`), prohibiendo `Aceptar`, `Enviar` o controles solo-flecha cuando la acción no sea obvia.

### 3.3 Navegación e iconografía provisionales (`BRAND_UX_CONTRACT.md` §9–§11.1)

- **Navegación deportista canónica (sujeta a `D1-07`):** `Inicio` (`/`), `Explorar` (`/explorar`), `Mis retos` (`/mis-retos`), `Trayectoria` (`/trayectoria`) + acceso a `/perfil` desde control de cuenta/avatar (resolviendo las etiquetas inconsistentes `Mi trayectoria`/`Trayectoria`/`Mis retos`/`Perfil` de los decks).
- **Navegación organizador canónica:** `Resumen` (`/pro`), `Eventos` (`/pro/eventos`), `Participantes`, `Comunicaciones`, `Analitica`.
- **Flujo de inscripción en 4 etapas explícitas:** `Modalidad` -> `Datos` -> `Revision` -> `Pago` + resultado durable (sustituye la promesa desktop de 3 pasos del deck; pendiente de confirmación `D1-08`).
- **Alcance diferido y honestidad de interfaz:** el mapa interactivo y el dorsal digital quedan diferidos del MVP recomendado (`§15.2`); está prohibido incluir botones decorativos sin funcionalidad real.
- **Iconografía (§11.1):** prohibido usar glifos Unicode (`⌂`, `⌕`, `◉`, `⚙`, `♡` y flechas Unicode) como sistema de iconos de producción; requiere librería SVG consistente en `D1-11`.

### 3.4 Datos ilustrativos prohibidos del deck (`BRAND_UX_CONTRACT.md` §1.4)

Deben tratarse estrictamente como datos ficticios de presentación y **tienen prohibida su entrada como constantes de producción, precios contractuales, definiciones analíticas o datos personales de prueba** (incluyendo fixtures de `P0-009` o `src/**`):

- Persona y perfil ilustrativo: **`David Cano`** y sus detalles de perfil.
- Eventos ilustrativos: **`Trail del Robledal`**, **`Pedales de Guadarrama`**, **`10K Madrid Rio`**, **`Sierra Norte Trail`**.
- Cifras ilustrativas del deck: fechas, distancias, desniveles, tiempos, precios, aforos, inscripciones e ingresos mostrados en las pantallas de ejemplo.
- Niveles y gamificación ilustrativa: **`Explorer`**, **`Pathfinder`** (cualquier nivel, insignia, sello o título queda fuera del MVP hasta `D1`).
- Nombres de organizadores y métricas de dashboard ilustrativos.
- Dominios y URLs de ejemplo: **`oak.run`** y derivados.

---

## 4. Criterios UX accesibles mínimos (`BRAND_UX_CONTRACT.md` §11–§14 y `QUALITY_GATES.md` §6)

### 4.1 Objetivo normativo y umbral de calidad (`WCAG 2.2 AA`)

- **Estándar obligatorio:** conformidad completa **`WCAG 2.2 AA`** desde el primer componente.
- **Regla de verificación:** pasar un escáner automático (`axe` o equivalente con `0` hallazgos `serious` o `critical` en rutas clave) es **necesario pero insuficiente**; es obligatoria la verificación manual de todos los flujos críticos (`QUALITY_GATES.md` §6 `G5`).

### 4.2 Modos responsive y los 5 viewports de referencia (`BRAND_UX_CONTRACT.md` §12)

- **Breakpoints canónicos (§12.1):**
  - `Mobile`: `320-767 px` (`4` columnas)
  - `Tablet`: `768-1199 px` (`8` columnas)
  - `Desktop`: `1200 px` y superior (`12` columnas; `1440 px` es el lienzo principal de diseño, no el breakpoint).
- **Suite mínima obligatoria de 5 viewports (§12.3):**
  1. `320x568` (`320 x 568`)
  2. `390x844` (`390 x 844`)
  3. `768x1024` (`768 x 1024`)
  4. `1200x800` (`1200 x 800`)
  5. `1440x900` (`1440 x 900`)
- **Adaptación responsive (§12.2):** adaptar jerarquía (nunca escalar hacia abajo layouts de escritorio); filtros visibles en desktop y diálogo/bottom sheet en móvil; CTA sticky en móvil solo si no tapa contenido, errores o UI del sistema; tablas convertidas en representación accesible en pantalla estrecha sin scroll 2D para tareas primarias; guardar/reanudar pasos al cambiar de viewport.

### 4.3 Requisitos físicos, de teclado, zoom, reflow y movimiento (`BRAND_UX_CONTRACT.md` §11.2, §12.2, §13)

| Criterio | Umbral mínimo obligatorio | Regla de verificación |
| --- | --- | --- |
| **Foco visible** | Anillo de al menos **`3 px`** (`focus.on-light` `#12372A` o `focus.on-dark` `#B7F34A`), separación `>= 2 px` cuando proceda, contraste `>= 3:1` frente a adyacentes | Recorrido completo con teclado; el foco nunca puede quedar oculto tras cabeceras o barras sticky ni atrapado en diálogos/bottom sheets. |
| **Objetivos táctiles** | Mínimo **`48x48 px`** (`48 x 48 CSS px`) en todo objetivo de puntero | Separación suficiente entre objetivos adyacentes para evitar activaciones accidentales. |
| **Zoom del navegador** | **`200 %`** | Todo el contenido y la operativa crítica siguen utilizables sin recorte ni solapamiento al 200 % de zoom. |
| **Reflow estrecho** | **`320 px`** (`320 CSS px`) | Reflow completo sin desplazamiento horizontal de página (`horizontal page scrolling`). |
| **`prefers-reduced-motion`** | Activo en **CSS y JavaScript** | `@media (prefers-reduced-motion: reduce)` en CSS y comprobación explícita en JS (`matchMedia`) deshabilitan trazado de rutas, pulsaciones, parallax, smooth scrolling y transformaciones no esenciales; los cambios esenciales de estado permanecen inmediatos y comprensibles. |
| **Semántica estructural** | HTML nativo y landmarks (`header`, `nav`, `main`, `footer`) | `<title>` descriptivo, único `<h1>`, jerarquía lógica de encabezados, *skip link* si hay navegación repetida, `lang="es"` coherente, prohibidas imágenes de texto salvo logotipos aprobados. |
| **Lectores de pantalla y formularios** | **`NVDA`** + lector móvil (**`TalkBack`** / **`VoiceOver`**) | Todo control solo-icono tiene nombre accesible; regiones `aria-live` proporcionadas; formatos legibles para precio, fecha, distancia y desnivel; revisión manual obligatoria en `NVDA` (escritorio) + al menos un lector móvil (`TalkBack` o `VoiceOver`) en flujos móviles críticos. |

### 4.4 Estados obligatorios de componentes, formularios y contenido (`BRAND_UX_CONTRACT.md` §11.2–§11.4)

1. **Estados interactivos universales (§11.2):** todo componente interactivo debe definir y probar `Default`, `Hover` (sin mover layout), `Focus visible` (`3 px`), `Active/pressed`, `Selected/current` (visual y programático), `Disabled` (no interactivo, programáticamente deshabilitado y no comunicado solo por opacidad), `Loading` (conserva dimensiones, bloquea doble activación y expone estado a tecnología de asistencia), `Error` (explica problema y acción de recuperación; nunca solo color) y `Success` (confirma resultado y siguiente acción; nunca solo color).
2. **Estados de formulario (§11.3):** etiquetas visibles persistentes (prohibido usar `placeholder` como sustituto de etiqueta); definir `empty`, `filled`, `focus`, `optional` o `required`, `invalid` previo al envío cuando sea seguro, `invalid` tras envío, `disabled`, `read-only` y `loading`/verificación pendiente; errores adyacentes enlazados con `aria-describedby`, resumidos al inicio de envío fallido y anunciados sin mover foco de forma inesperada.
3. **Estados de contenido (§11.4):** toda página o región respaldada por datos debe definir `initial loading`, `delayed loading`, `empty result`, `filtered empty result`, `partial data`, `stale data` cuando importe la frescura, `recoverable error`, `non-recoverable/permission error` y `offline/retry` cuando proceda; los skeletons deben respetar la jerarquía final, detenerse con `reduced-motion` y no ocultar errores indefinidamente.

### 4.5 Reglas preparatorias de regresión visual (`BRAND_UX_CONTRACT.md` §14, ejecución post-D1)

Las capturas baseline definitivas de producción se establecerán únicamente tras aprobar `D1` (`D1-14`), garantizando determinismo (seed sin PII, fechas/zonas congeladas, fuentes e imágenes cargadas, animaciones/caret desactivados, 5 viewports de referencia, cobertura de estados críticos y revisión humana obligatoria sobre cualquier diff de layout, tipografía, color, logo o jerarquía).

---

## 5. Checklist de no contaminación para el scaffold `P0-004` y fases iniciales

Antes de aceptar el scaffold inicial (`P0-004`) o cualquier PR previa a `D1`, el implementador y los revisores deben verificar los siguientes controles binarios:

- [ ] **Cero copia de CSS/JS de `sites/**`:** ni `sites/oak-brand-deck/dist/**` ni `sites/oak-web-design-deck/dist/**` tienen CSS, JS, HTML o variables (`--mist`, `--forest-deep`, `--deep`, `4-10 px`, `scroll-snap-type`) copiadas en `src/`, `app/` o `public/`.
- [ ] **Inmutabilidad de `sites/**`:** los hashes SHA-256 de los 19 archivos inventariados en `P0-001` permanecen intactos.
- [ ] **Cero assets pesados `1672x941` o `oak-logo.png` en producción:** ninguno de los 6 assets de referencia se sirve como activo final de producción sin cierre de `D1-03` y `D1-12` (pipeline `WebP`/`AVIF` + registro de derechos).
- [ ] **Cero dependencia externa de Google Fonts:** el scaffold no enlaza `fonts.googleapis.com`; la entrega local `WOFF2` y licencias quedan pendientes de `D1-04`.
- [ ] **Cero pares cromáticos prohibidos ni colores inventados:** prohibido `Orange/Sand`, `Sky/Sand`, `Cream/Orange` y `Lime/Sand-Cream` en texto/iconos; prohibido `#FFFFFF`/`#000000` como colores de marca OAK y prohibido inventar paletas `success`/`warning`/`danger`/`disabled` hasta `D1-05`.
- [ ] **Cero iconos Unicode ni tipografía ilegible:** prohibido `⌂`, `⌕`, `◉`, `⚙`, `♡` o tamaños `< 12 px` y peso `650`.
- [ ] **Idioma `es-ES` y cero datos ilustrativos de los decks:** `lang="es"` en el documento base; cero apariciones de `Decision page`, `Conversion flow`, `Athlete home`, `David Cano`, `Trail del Robledal`, `Pedales de Guadarrama`, `10K Madrid Rio`, `Sierra Norte Trail`, `oak.run`, `Explorer` o `Pathfinder` en código, copy o seeds (`P0-009`).
- [ ] **Cimientos accesibles `WCAG 2.2 AA` desde el inicio:** landmarks semánticos, skip link, anillo de foco `>= 3 px`, objetivos `>= 48x48 px`, soporte de zoom `200 %` y reflow `320 px`, y respeto a `prefers-reduced-motion` tanto en CSS como en JS.
- [ ] **Sin adelantamiento de decisiones `D1`:** `P0-004` no introduce paquete definitivo de tokens (`P1-005`), librería final de componentes (`P1-006`) ni rutas definitivas aprobadas sin validación del usuario en `D1`.

---

## 6. Lista íntegra de blockers abiertos de Gate D1 (`D1-01..D1-14`)

Conforme a `docs/brand/BRAND_UX_CONTRACT.md` §15.1 y `docs/agentic/DECISION_LOG.md`, **Gate `D1` permanece `PENDING USER VALIDATION`**. Las historias de UI de producción **no pueden progresar** más allá de prototipos no mergeables mientras permanezca abierto cualquiera de los **14 blockers** siguientes:

| ID | Decisión o entregable pendiente | Evidencia de aceptación exigida en Fase 1 (`D1`) | Estado en `G0` |
| --- | --- | --- | --- |
| `D1-01` | Aprobar `BRAND_UX_CONTRACT.md` y nombrar propietarios | Aprobación registrada y etiqueta de versión | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-02` | Congelar tokens canónicos de color, tipografía, espaciado, radio, elevación, breakpoints y movimiento | Paquete de tokens legible por máquina y documentación | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-03` | Aprobar masters vectoriales de logotipo y reglas de uso | Masters SVG, exportaciones, ficha de área de respeto/tamaño mínimo y ejemplos de mal uso | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-04` | Confirmar licencias de tipografías y estrategia de entrega | Registro de licencia, archivos `WOFF2`, fallback y estrategia de carga | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-05` | Aprobar colores semánticos de éxito, advertencia, peligro, deshabilitado y gráficos | Matriz semántica verificada por contraste | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-06` | Congelar política lingüística MVP y copy maestro aprobado | Decisión de contenido y glosario | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-07` | Aprobar navegación primaria, vocabulario de rutas y acceso de cuenta | Mapa de arquitectura de información y listado de rutas | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-08` | Resolver estados de inscripción, pago, reembolso, cancelación, facturación y fallo | Flujo extremo a extremo con criterios de aceptación | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-09` | Definir autenticación, perfil, privacidad, consentimiento, edad y requisitos de documentos sensibles | Aprobación de producto, legal y seguridad | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-10` | Definir deportes, geografía, campos de evento y alcance de organizador para el MVP | Alcance MVP firmado | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-11` | Aprobar inventario de componentes y todos los estados universales | Especificación de componentes y prototipo accesible | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-12` | Aprobar procedencia de fotografía y pipeline de assets responsive | Registro de derechos y conjunto de assets optimizados | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-13` | Aprobar plan de pruebas de accesibilidad | Checklist WCAG, matriz de tecnologías de asistencia (`NVDA` + lector móvil) y propietario responsable | ABIERTO (`PENDING USER VALIDATION`) |
| `D1-14` | Establecer líneas base de regresión visual en producción | Capturas revisadas en los 5 viewports de referencia | ABIERTO (`PENDING USER VALIDATION`) |

### 6.1 Decisiones diferibles y entregables pendientes (§15.2–§15.3)

- **Conceptos que solo pueden diferirse mediante decisión explícita de alcance (`§15.2`):** personalización / `Para ti`, mapa interactivo real (diferido en el MVP recomendado), dorsal digital (diferido en el MVP recomendado), favoritos/guardados, niveles/pasaporte/insignias/compartición, planes de preparación, lista de espera y cesión de dorsal, roles de equipo organizador, canales/plantillas de comunicación, definiciones analíticas e integraciones con plataformas externas. Cualquier elemento diferido debe eliminarse de la interfaz MVP en lugar de quedar simulado.
- **Entregables de sistema de diseño aún ausentes en el repositorio (`§15.3`):** tokens legibles por máquina, librería de componentes en control de versiones, kit vectorial de logotipo, librería de iconos SVG, fuentes locales y licencias, derivados responsive de imágenes y log de procedencia, prototipo interactivo de alta fidelidad, inventario de pantallas y estados, glosario de contenido y librería de mensajes de error, anotaciones de accesibilidad, y fixtures/baselines de regresión visual.
