# ADR-001: Stack técnico fijado, arquitectura de monolito modular y estrategia de DB efímera G3

- **Estado:** Propuesto (en revisión independiente por `devops-release` y `backend-datos` para `G0`)
- **Fecha:** 2026-11-18
- **Autores:** `arquitecto-seguridad` (`ARCH`)
- **Paquete:** `P0-003`
- **Fuentes normativas:** `AGENTS.md`, `MASTER_EXECUTION_PLAN.md` (§6, §7, §11), `QUALITY_GATES.md` (§3, §5, §6), `BRAND_UX_CONTRACT.md` (§4, §5, §8, §11, §12, §13), `docs/evidence/W01/P0-001/inventory.json`

## 1. Contexto

El inventario inicial verificado en `P0-001` (`docs/evidence/W01/P0-001/inventory.json`) confirma que no existe aplicación previa de OAK ni manifiestos de dependencias (`package.json`, lockfile, `src/`, migraciones ni CI). Asimismo, el inventario de herramientas locales en el host de desarrollo Windows verifica:

- **Presentes:** `node v24.16.0`, `corepack 0.35.0`, `npm 11.13.0`, `npx 11.13.0`, `python 3.13.3`, `git 2.49.0.windows.1`.
- **Ausentes globalmente:** `pnpm`, `docker`, `supabase`, `stripe`, `gitleaks`, `gh`.

Para desbloquear `P0-004` (inicialización reproducible de la aplicación) y `P0-009` (dataset y cuentas demo), es obligatorio fijar todas las tecnologías con **versiones exactas** (sin rangos flotantes como caret, tilde o etiqueta flotante), garantizar compatibilidad verificada con Node `24.16.0` LTS y `corepack 0.35.0`, definir la estructura de monolito modular único desplegable y resolver cómo se ejecutan los controles de `G0` y `G3` en ausencia local de `pnpm`, `docker`, `supabase` y `gitleaks` globales.

## 2. Decisión

### 2.1 Runtime, gestor de paquetes y política anti-rangos flotantes

1. **Runtime:** Se fija **Node.js `24.16.0` LTS** en local, CI (`.nvmrc` y `actions/setup-node`) y entorno servidor de ejecución.
2. **Gestor de paquetes:** Se fija **`pnpm` `10.34.9`** activado mediante **`corepack` `0.35.0`** (`packageManager` en `package.json` fijado con versión exacta y hash de integridad `sha512`).
   - **Motivo técnico verificado:** La inspección directa del binario de `corepack 0.35.0` muestra que soporta nativamente la serie `10.x` apuntando a `./bin/pnpm.cjs` (verificado en `pnpm@10.34.9`), mientras que `pnpm@12.21.0` cambió su binario a una ruta sin extensión (`bin.pnpm = "pnpm"`) incompatible con la resolución de `corepack 0.35.0`. Por ello se fija `10.34.9` y **no** `12.21.0`.
   - **Comando reproducible sin `pnpm` global:** En entornos donde `pnpm` no esté preinstalado en `PATH` (`inventory.json`: `pnpm.installed = false`), todos los scripts y documentación usan **`corepack pnpm ...`** (o `pnpm` tras ejecutar `corepack enable` en setup del entorno).
3. **Política de bloqueo estricto en `P0-004`:**
   - `.npmrc` incluirá `save-exact=true`, `engine-strict=true`, `strict-peer-dependencies=true` y `auto-install-peers=true` (necesario para resolver peers estándar como `playwright-core` requerido por `@axe-core/playwright@4.14.0` sin relajar versiones estrictas).
   - Todas las entradas de `dependencies` y `devDependencies` en `package.json` usarán versiones exactas `X.Y.Z` (prohibidos rangos flotantes con caret, tilde, asterisco, comparadores abiertos o etiqueta móvil).
   - El archivo `pnpm-lock.yaml` es obligatorio y las instalaciones en CI y Release Guardian usan exclusivamente `--frozen-lockfile`.

### 2.2 Catálogo de stack con versiones exactas fijadas

Todas las versiones siguientes han sido comprobadas contra el registro npm respecto a `engines` y `peerDependencies` para Node `24.16.0`:

| Categoría | Paquete / Herramienta | Versión exacta fijada | Rol en OAK V1 | Notas de compatibilidad verificada |
|---|---|---:|---|---|
| Runtime | `node` | `24.16.0` | Runtime JS servidor y toolchain | LTS instalada localmente (`P0-001`) |
| Gestor | `corepack` | `0.35.0` | Shim reproducible de `pnpm` | Incluida con Node `24.16.0` |
| Gestor | `pnpm` | `10.34.9` | Instalación determinista y ejecución de scripts | `engines.node >=18.12`, `bin/pnpm.cjs` compatible con `corepack 0.35.0` |
| Framework | `next` | `16.4.6` | Monolito modular App Router (RSC, SSR, Route Handlers, Server Actions) | `engines.node >=20.9.0`; peer compatible con React 19 y Playwright 1.65.1 |
| UI Runtime | `react` | `19.3.1` | Renderizado UI servidor/cliente | Compatible con `next@16.4.6` |
| UI Runtime | `react-dom` | `19.3.1` | DOM renderer React | Peer exacto de `react@19.3.1` |
| Lenguaje | `typescript` | `5.9.3` | Compilación estricta (`strict: true`, `noUncheckedIndexedAccess: true`) | Satisface `typescript-eslint@8.73.0` (`<6.1.0`) y `msw@3.0.7` (`>=5.9.x`) sin rupturas de TS 6/7 |
| Validación | `zod` | `4.6.7` | Validación de env vars, formularios, comandos, API y webhooks | Cero dependencias runtime externas |
| Estilos | `tailwindcss` | `4.3.5` | Utilidades CSS acotadas sobre tokens semánticos | Consumidor de CSS variables canónicas vía `@theme inline` |
| Estilos | `@tailwindcss/postcss` | `4.3.5` | Integración PostCSS para Tailwind v4 en Next.js | Par exacto de `tailwindcss@4.3.5` |
| Primitivas A11y | `radix-ui` | `1.8.1` | Primitivas headless accesibles (Dialog, Sheet, Select, Tabs, Checkbox, Radio, Tooltip) | Tree-shakeable; soporte React 19; sin estilos/tema ajeno a OAK |
| Iconografía | `lucide-react` | `1.75.0` | Iconos SVG vectoriales consistentes | Sustituye glifos Unicode prohibidos (`BRAND_UX_CONTRACT.md §11.1`); peer React 19 |
| Datos y Auth | `@supabase/supabase-js` | `2.119.1` | Cliente Auth, Storage y acceso DB encapsulado en infraestructura | `engines.node >=22.0.0` |
| Datos y Auth | `@supabase/ssr` | `0.12.7` | Sesión SSR por cookies `HttpOnly` en App Router | Peer `@supabase/supabase-js` serie 2.114+ |
| Datos SQL | `pg` | `8.23.1` | Pool PostgreSQL servidor confinado en `src/shared/infrastructure/db/` para RLS transaccional, migraciones SQL y `FOR UPDATE` | `engines.node >=16.0.0` |
| Pagos (Test) | `stripe` | `23.1.0` | SDK servidor Stripe Checkout modo test y verificación de webhooks | `engines.node >=20` |
| Pagos (Test) | `@stripe/stripe-js` | `10.3.0` | Redirección segura a Checkout hospedado sin tocar PAN/CVV | Tokenización compliant |
| Email (Sandbox) | `resend` | `6.39.0` | Correos transaccionales en sandbox (`communications`) | `engines.node >=20` |
| Observabilidad | `@sentry/nextjs` | `11.14.0` | Captura de errores y trazas con scrubbing obligatorio de PII | `engines.node >=23.2.0`; peer Next 16 |
| Unit / Integración | `vitest` | `5.1.1` | Runner unitario, componentes, contratos e integración | `engines.node` compatible con Node 24 |
| Unit / React | `@vitejs/plugin-react` | `6.3.0` | Transformación JSX/React para Vitest | Peer Vite 8 |
| Build Test | `vite` | `8.3.8` | Motor subyacente de Vitest y Storybook Vite | `engines.node >=22.12.0` |
| Cobertura | `@vitest/coverage-v8` | `5.1.1` | Cobertura de líneas y ramas (`>=85%` líneas, `>=80%` ramas) | Par exacto de `vitest@5.1.1` |
| DOM Test | `jsdom` | `31.0.1` | Entorno DOM para Testing Library | `engines.node` compatible con Node `24.16.0` |
| Testing UI | `@testing-library/react` | `16.3.3` | Pruebas de componentes orientadas a accesibilidad y rol | Peer React 19 y `@testing-library/dom` 10 |
| Testing UI | `@testing-library/dom` | `10.4.2` | Queries accesibles base | Peer explícito de RTL y `user-event` |
| Testing UI | `@testing-library/jest-dom` | `7.0.1` | Matchers DOM/ARIA (`toHaveAccessibleName`, etc.) | `engines.node >=22`; peer `vitest >=0.32` |
| Testing UI | `@testing-library/user-event` | `14.6.12` | Simulación realista de teclado y foco | Peer `@testing-library/dom` |
| Mocking HTTP | `msw` | `3.0.7` | Dobles deterministas de APIs externas (Stripe/Resend/contratos) | `engines.node >=22.12.0`; peer `typescript >=5.9.x` |
| E2E / Visual | `@playwright/test` | `1.65.1` | E2E P0/P1, 5 viewports responsive y regresión visual en 3 motores | `engines.node >=20`; satisface `next@16.4.6` |
| E2E / Motores | `playwright` | `1.65.1` | Binarios Chromium, Firefox y WebKit | Par exacto de `@playwright/test@1.65.1` |
| A11y Auto | `@axe-core/playwright` | `4.14.0` | Auditoría WCAG 2.2 AA automatizada en Playwright | `engines.node >=22.12.0` |
| A11y Motor | `axe-core` | `4.14.1` | Motor de reglas WCAG | Fijación explícita determinista |
| Lint | `eslint` | `9.39.5` | Linter estático con `--max-warnings=0` | `eslint-config-next@16.4.6` usa plugins (`react`/`import`/`jsx-a11y`) cuyo peer exige serie 9 (excluye `eslint@10.15.0`) |
| Lint Next | `eslint-config-next` | `16.4.6` | Reglas Next.js, Core Web Vitals, React Hooks y `jsx-a11y` | Par exacto de `next@16.4.6` |
| Lint TS | `typescript-eslint` | `8.73.0` | Reglas de tipado estricto y detección de inseguridades | Peer `eslint` serie 9, `typescript <6.1.0` |
| SAST Lint | `eslint-plugin-security` | `4.2.1` | Reglas estáticas de seguridad JS/TS para `<SAST>` | Compatible con flat config ESLint 9 |
| SAST SDL | `@microsoft/eslint-plugin-sdl` | `1.1.0` | Controles SDL (XSS, DOM sinks, eval, protocolos inseguros) para `<SAST>` | Peer `eslint` serie 9 |
| Formato | `prettier` | `3.10.1` | Formateo determinista (`<FORMAT_CHECK>`) | `engines.node >=14` |
| Formato CSS | `prettier-plugin-tailwindcss` | `0.8.1` | Ordenación determinista de clases Tailwind | `engines.node >=20.19` |
| Scripts TS | `tsx` | `4.23.15` | Ejecución reproducible de scripts de migración, seed y ops | `engines.node >=18.0.0` |
| Secret Scan | `secretlint` | `14.0.1` | Escáner determinista de secretos sin binario global externo (incluye internamente el preset recomendado desde v14; no añadir `@secretlint/secretlint-rule-preset-recommend` deprecado) | `engines.node >=22.0.0` |
| SBOM | `@cyclonedx/cdxgen` | `12.9.2` | Generación SBOM CycloneDX sobre `pnpm-lock.yaml` | `engines.node` compatible con Node 24, `pnpm >=10` |
| Perf / CWV | `@lhci/cli` | `0.16.1` | Lighthouse CI móvil (`>=90` perf, `>=95` a11y) y presupuestos | `engines.node >=22.19.0` |
| Carga | `autocannon` | `9.0.0` | Pruebas de carga y concurrencia HTTP en Node 24 (`<LOAD_TEST>`) | Paquete Node puro sin binario Go externo |
| DB Local G3 | `@electric-sql/pglite` | `0.5.16` | Postgres 17 WASM embebido vía puerto SQL interno en `src/shared/infrastructure/db/` (sin `pglite-socket`, evitando 7 extensiones peer innecesarias) | 0 dependencias ni peers; complemento dev local, no sustituye CI Postgres real |
| Supabase CLI | `supabase` | `3.2.0` | CLI invocada localmente vía `corepack pnpm exec supabase` cuando haya Docker | Evita dependencia de instalación global |
| UI Catalog | `storybook` | `10.6.7` | Catálogo aislado de componentes y sus estados (`BRAND_UX_CONTRACT.md §11`) | Peer `prettier` 3 y `@types/react` 19 |
| UI Catalog | `@storybook/nextjs-vite` | `10.6.7` | Integración Storybook con Next.js 16 y Vite 8 | Peer Next 16, Vite 8, React 19 |
| Tipos | `@types/node` | `24.19.2` | Definiciones de tipos alineadas a Node `24.16.0` LTS | Se fija serie `24.x` (no `26.x`) |
| Tipos | `@types/react` | `19.3.0` | Definiciones TypeScript para React 19.3 | Par de `react@19.3.1` |
| Tipos | `@types/react-dom` | `19.3.0` | Definiciones TypeScript para ReactDOM 19.3 | Par de `react-dom@19.3.1` |
| Tipos | `@types/pg` | `8.23.1` | Definiciones TypeScript para `pg@8.23.1` | Par exacto de `pg` |

### 2.3 Arquitectura de Monolito Modular Único Desplegable

- **Forma desplegable única:** Toda la plataforma OAK V1 (rutas públicas, flujos de deportista, panel `/pro` de organizador, API Route Handlers, webhooks Stripe y jobs internos protegidos) se compila y despliega como **una única aplicación Next.js App Router**.
- **Fronteras modulares internas:** Se estructuran exactamente los **10 módulos de dominio** definidos en `MASTER_EXECUTION_PLAN.md §7.2` dentro de `src/modules/<module>/`, separados por capas (`domain`, `application`, `infrastructure`) con comunicación inter-módulo exclusiva a través de contratos públicos (`index.ts`) y prohibición estricta de consultas SQL/Supabase directas desde la capa de Presentación (`src/app`, `src/components`). El detalle completo de capas, estados e invariantes figura en `docs/architecture/SYSTEM_ARCHITECTURE.md`.
- **Restricción V1 (`BR-01`):** Quedan prohibidos microservicios independientes, colas distribuidas (Kafka, RabbitMQ, SQS), Kubernetes o bases de datos separadas por módulo en V1.

### 2.4 Soporte del Stack para Accesibilidad, Design System y Responsive (`BRAND_UX_CONTRACT.md`)

- **CSS Variables como fuente canónica:** `src/styles/tokens.css` declara las variables semánticas (`--surface-canvas`, `--surface-raised`, `--text-primary`, `--action-primary-bg`, etc.) derivadas exclusivamente de la paleta aprobada en `BRAND_UX_CONTRACT.md §4`. Tailwind v4 mapea `@theme inline` a estas variables; las reglas ESLint/revisión bloquean hexadecimales dispersos y parejas prohibidas (`Orange/Sand`, `Sky/Sand`, `Cream/Orange`, `Lime/Sand`).
- **Primitivas accesibles headless:** `radix-ui@1.8.1` aporta gestión nativa de foco, trampas de foco reversibles (`Escape`, retorno de foco al disparador), roles ARIA y navegación por teclado para modales, `bottom sheets` móviles (`320–767 px`), selectores y pestañas, sin imponer estilos ajenos a OAK.
- **Tipografías y motion:** `Sora` e `Inter` se servirán mediante ficheros WOFF2 locales vía `next/font/local` una vez aprobadas las licencias en `D1-04` (nunca peticiones externas en runtime a Google Fonts). Los tokens de motion (`160ms`, `240ms`, `480ms`, `1200ms`) respetarán `@media (prefers-reduced-motion: reduce)` tanto en CSS como en helpers JS (`window.matchMedia`).
- **Pruebas automáticas y viewports:** Playwright ejecutará `@axe-core/playwright` y recorridos en Chromium, Firefox y WebKit cubriendo los 5 viewports normativos (`320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900`).

### 2.5 Estrategia Reproducible de PostgreSQL / Supabase Efímero para `G3` sin Docker Global

Dado que el host local inventariado en `P0-001` no dispone de `docker` ni `supabase` CLI globales, `G3` adopta una **arquitectura de ejecución estratificada y fail-closed**:

1. **Entorno Canónico de Certificación `G3` (CI en GitHub Actions `ubuntu-latest` y hosts locales con Docker habilitado):**
   - Cada job de `G3` levanta una instancia efímera y aislada por ejecución usando `supabase start` (`supabase@3.2.0` vía `corepack pnpm exec supabase` o acción `supabase/setup-cli` fijada en CI) o contenedor `postgres:17-alpine` + esquema de roles/funciones Supabase (`auth.uid()`, `auth.role()`, roles `anon`, `authenticated`, `service_role`) cuando el test solo requiera SQL/RLS.
   - Sobre esta instancia efímera recién creada (nunca reutilizada entre runs) se ejecutan obligatoriamente: `<DB_MIGRATE_FRESH>`, `<DB_MIGRATE_FROM_PREVIOUS>`, `<SEED_IDEMPOTENCY_CHECK>`, `<INTEGRATION_TEST>` (incluyendo RLS negativo y concurrencia real multi-conexión TCP sobre última plaza con `SELECT ... FOR UPDATE`) y `<CONTRACT_TEST>`.
2. **Pre-validación Rápida Local sin Docker (`G3_DB_MODE=pglite-dev`):**
   - Para que los desarrolladores puedan validar localmente en Windows sin Docker las migraciones SQL, triggers, constraints, idempotencia de seed y sintaxis de políticas RLS antes de abrir PR, el puerto SQL en `src/shared/infrastructure/db/` soporta `@electric-sql/pglite@0.5.16` directo (`pglite.query`/`pglite.transaction`) ejecutando PostgreSQL 17 en WASM completamente efímero en memoria o carpeta temporal, sin requerir `@electric-sql/pglite-socket`.
   - **Límite explícito y regla anti-engaño:** Un run en modo `pglite-dev` imprime una etiqueta clara `DEV_PRECHECK_ONLY (NO_CERTIFIES_G3)` y **no certifica `G3 PASS`**, ya que no reproduce latencia ni contención TCP multi-proceso ni GoTrue/PostgREST HTTP completos.
3. **Alternativa Local Conectada Aislada (`G3_DB_MODE=ephemeral-pg-url`):**
   - En ausencia local de Docker, puede ejecutarse la suite completa contra una base o branch PostgreSQL/Supabase **desechable dedicada exclusivamente a tests** (`G3_TEST_DATABASE_URL`), sujeta a un guardia fail-closed que aborta (`exit != 0`) si la URL apunta a `staging` o `producción` o si no incluye un esquema o identificador de aislamiento efímero.
4. **Comportamiento Fail-Closed de `<INTEGRATION_TEST>` y comandos DB en `G3`:**
   - Si no hay instancia Postgres real accesible (`docker`/Supabase local ni `G3_TEST_DATABASE_URL` válida) y no se ha pasado explícitamente el flag de precheck local de desarrollo, los comandos `G3` **devuelven código de salida distinto de cero** indicando la ausencia de motor PostgreSQL efímero certificable. El Release Guardian solo acepta evidencia `G3 PASS` emitida contra PostgreSQL 17 / Supabase efímero real (en CI o entorno Docker verificado).

## 3. Alternativas Evaluadas y Descartadas

| Decisión | Opción elegida | Alternativas evaluadas | Motivo de descarte |
|---|---|---|---|
| Arquitectura | Monolito modular Next.js App Router | (A) Backend NestJS/Fastify separado + SPA Vite; (B) Microservicios por módulo | Aumentan latencia de red, duplican validación/tipos, complican despliegue, observabilidad y transacciones atómicas en 8 semanas (`BR-01`). |
| Gestor de paquetes | `pnpm@10.34.9` vía `corepack 0.35.0` | (A) `pnpm@12.21.0`; (B) `npm@11.13.0`; (C) `yarn` | `pnpm@12.21.0` usa bin sin extensión incompatible con `corepack 0.35.0`; `npm` tiene lockfile menos estricto en scripts y hoisting laxo por defecto. |
| Acceso a BD y Migraciones | SQL versionado nativo + cliente `pg` + repositorios tipados + Zod | (A) Prisma ORM; (B) Drizzle ORM; (C) Queries Supabase directas desde UI | Prisma abstrae mal RLS, `FORCE ROW LEVEL SECURITY`, `SELECT ... FOR UPDATE` y migraciones nativas Supabase; llamadas UI->tablas rompen fronteras de seguridad y dominio. |
| UI y Estilos | Tailwind v4 + CSS variables canónicas + `radix-ui` | (A) MUI / Chakra / Ant Design; (B) CSS puro manual sin utilidades | Librerías con tema propio introducen tokens y pesos ajenos a OAK; CSS puro ralentiza desarrollo manteniendo riesgos de inconsistencia responsive. |
| TypeScript & ESLint | `typescript@5.9.3` + `eslint@9.39.5` | (A) `typescript@7.0.2`; (B) `eslint@10.15.0` | `eslint-config-next@16.4.6` tiene plugins peer-dependientes de ESLint serie 9 y `typescript-eslint@8.73.0` acota `typescript <6.1.0`. Usar `7.0.2`/`10.15.0` rompe instalación estricta. |
| Carga G5 | `autocannon@9.0.0` (Node) + wrapper TS | (A) Solo `k6` binario Go; (B) JMeter | `k6` en npm es solo un paquete dummy (`0.0.0`) y exige binario Go externo ausente en local; `autocannon` corre nativo sobre Node 24.16.0 en local y CI. |

## 4. Consecuencias, Reversibilidad e Invalidación

### 4.1 Consecuencias positivas y costes asumidos
- **Cero ambigüedad en `P0-004`:** Todas las versiones son exactas y verificadas entre sí (peer dependencies resueltas antes de crear `package.json`).
- **Portabilidad Windows/Linux:** `corepack pnpm`, `secretlint`, `autocannon`, `tsx` y `pglite` evitan dependencias de binarios nativos ausentes en el entorno Windows inicial, mientras CI Linux ejecuta la certificación completa con Docker/Postgres real.
- **Coste asumido:** Mantener migraciones SQL manuales requiere disciplina estricta en revisión (`backend-datos`) y tests de integración tempranos en Fase 2; queda compensado por el control total sobre invariantes transaccionales y RLS.

### 4.2 Criterios de reversibilidad
- **Stack UI / Styling:** Desacoplado detrás de `src/styles/tokens.css` y componentes en `src/components/ui/`; reversible por componente sin afectar dominio.
- **Monolito modular hacia servicios extraídos (post-V1):** La prohibición de imports internos cross-module permite extraer cualquier módulo (p. ej. `payments` o `communications`) tras V1 convirtiendo su `index.ts` en adaptador HTTP/cola sin reescribir `domain` ni `application`.
- **Migración SQL:** Controlada mediante `expand/migrate/contract` (ADR-004).

### 4.3 Condiciones que invalidan este ADR
1. Actualización de versión mayor o menor de Node, `pnpm`, `next`, `react`, `typescript`, `tailwindcss`, `pg`, `stripe` o `@supabase/*` respecto a la tabla §2.2 (reabre `G0`/`G1–G6` según `QUALITY_GATES.md §8`).
2. Introducción de cualquier microservicio, base de datos adicional o cola externa en V1 sin nuevo ADR y decisión aprobada.
3. Uso de acceso directo UI->tablas, omisión del lockfile o inclusión de rangos flotantes en `package.json`.

