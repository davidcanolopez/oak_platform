# ADR-003: Autenticación, RBAC, aislamiento multi-tenant e inventario de integraciones externas

- **Estado:** Propuesto (en revisión independiente por `devops-release` y `backend-datos` para `G0`)
- **Fecha:** 2026-11-18
- **Autores:** `arquitecto-seguridad` (`ARCH`)
- **Paquete:** `P0-003`
- **Fuentes normativas:** `AGENTS.md`, `MASTER_EXECUTION_PLAN.md` (§4, §5, §6.2, §6.3, §7.5, §7.6), `QUALITY_GATES.md` (§6 G3/G5), `BRAND_UX_CONTRACT.md` (§9, §10.4)

## 1. Contexto

OAK es una plataforma bilateral (deportistas y organizadores) que gestiona datos personales (PII), consentimientos RGPD, inscripciones con cupo limitado, pagos mediante proveedor externo e información privada de múltiples organizaciones en una base de datos PostgreSQL compartida. Es imprescindible fijar un modelo de seguridad de defensa en profundidad antes de construir el esquema (`P2-002`) y los contratos (`P1-009`).

## 2. Decisión

### 2.1 Autenticación y ciclo de sesión

1. **Proveedor y transporte de sesión:** Se utiliza **Supabase Auth** integrado exclusivamente en servidor mediante `@supabase/ssr` (`0.12.7`) y cookies **`HttpOnly`**, **`Secure`** (en HTTPS), **`SameSite=Lax`**.
   - **Prohibición:** Queda prohibido almacenar tokens JWT de acceso o refresco en `localStorage`, `sessionStorage` o cookies legibles por JavaScript cliente.
2. **Flujos cubiertos en V1:**
   - Registro y verificación de correo de deportistas (`/registro`), inicio de sesión (`/entrar`), cierre de sesión con revocación en servidor, y recuperación de acceso (`/recuperar-acceso`) con **respuestas neutras no enumeradoras** (mismo mensaje y código HTTP tanto si el correo existe como si no).
   - **Organizadores por invitación cerrada:** No existe autoalta abierta de organizadores (`MASTER_EXECUTION_PLAN.md §4`). Un miembro se incorpora mediante token aleatorio criptográfico de un solo uso (almacenado únicamente como hash SHA-256 en BD), con caducidad de 72 horas y transición `INVITED -> ACTIVE`.
3. **Re-autenticación reciente y MFA:**
   - Exportación de datos personales y solicitud de borrado de cuenta (`AC-J03-05`) exigen verificación de autenticación reciente (`auth_time <= 15 minutos`).
   - MFA obligatorio para cuentas `ADMIN` y soportado/recomendado para `ORG_OWNER`/`ORG_MANAGER` antes de habilitar operación en producción (`D3`).
4. **Rate limiting en bordes de autenticación y abuso:** Límite por IP e identificador en `/entrar`, `/recuperar-acceso`, `/registro`, búsqueda pública abusiva, creación de checkout y webhooks (respuesta `429` controlada sin filtrar estado de cuenta).

### 2.2 RBAC, Autorización Server-Side `Deny-by-Default` y Aislamiento Multi-Tenant

El control de acceso sigue un modelo de **doble barrera obligatoria**:

1. **Barrera primaria — Capa de Aplicación (`deny-by-default`):**
   - Ningún caso de uso en `src/modules/*/application/` se ejecuta sin recibir un `ActorContext` validado en servidor en esa petición (derivado de cookie SSR verificada o firma criptográfica de webhook).
   - **Roles de plataforma (`platform_role`):** `ANONYMOUS` (solo catálogo publicado), `ATHLETE` (por defecto), `ADMIN` (soporte mínimo auditable con motivo obligatorio; prohibida la impersonación silenciosa y prohibida la alteración manual de pagos o cupos en BD, `AC-J08-03`/`AC-J08-04`).
   - **Roles de organización (`org_role` sobre `OrganizationMembership` con `status = 'ACTIVE'`):**
     - `ORG_OWNER`: gestión total de su organización, miembros, eventos, participantes, exportaciones y comunicaciones.
     - `ORG_MANAGER`: creación/edición/publicación de eventos de su organización, consulta de participantes, export CSV y comunicaciones.
     - `ORG_VIEWER`: lectura de eventos y participantes/analítica de su organización; sin permiso de publicación, edición destructiva ni envío de comunicaciones.
   - Si no existe regla explícita que autorice `(actor, acción, recurso, organization_id)`, el caso de uso deniega con `403 FORBIDDEN` (o `404 NOT_FOUND` cuando revelar existencia de drafts ajenos suponga enumeración).
2. **Prohibición estricta `UI -> tablas` y confinamiento del pool `pg`:**
   - Queda **absolutamente prohibido** que páginas (`src/app/**`), componentes (`src/components/**`) o casos de uso importen `@supabase/supabase-js` para consultar tablas directamente (`supabase.from(...)`) ni instancien `new Pool()` de `pg`. Todo acceso a datos pasa por repositorios en `infrastructure` usando el puerto SQL único confinado en `src/shared/infrastructure/db/` (`pool.ts`, `rls-context.ts`, `admin-client.ts`).
3. **Barrera secundaria — Row Level Security (RLS) preservada sobre pool `pg` y defensa en profundidad:**
   - Todas las tablas de negocio en PostgreSQL habilitan `ENABLE ROW LEVEL SECURITY` y `FORCE ROW LEVEL SECURITY`.
   - **Preservación de RLS con `pg` (`<DATABASE_URL>`):** El pool runtime `pg` se conecta mediante `<DATABASE_URL>` con un rol aplicativo **no superusuario y sin privilegio `BYPASSRLS`** (p. ej. `oak_app_runtime`). Cada operación iniciada por un actor usuario o anónimo ejecuta obligatoriamente dentro de una transacción `withRlsContext(actor, fn)` que fija el rol de sesión solo para esa transacción (`SET LOCAL ROLE anon` o `SET LOCAL ROLE authenticated`) y `SELECT set_config('request.jwt.claims', json_build_object('sub', $1, 'role', $2)::text, true)` antes de lanzar consultas, limpiándose automáticamente al cerrar/devolver la conexión al pool.
   - **Políticas RLS por fila y separación de columnas privadas/PII:**
     - **Catálogo e historial:** Tanto `anon` como `authenticated` pueden leer filas de `events`, `event_modalities`, `price_tiers` y `event_media` cuando `events.status = 'PUBLISHED'` (descubrimiento e inscripción pública de cualquier organización). Adicionalmente, un usuario `authenticated` puede leer la fila de `events` (y sus modalidades/tiers) cuando tenga una `Registration` propia (`athlete_id = auth.uid()`) aunque el evento haya pasado a `CLOSED`, `COMPLETED` o `CANCELLED` (`/mis-retos` y `/trayectoria`), y los miembros `ACTIVE` de la organización propietaria pueden leer todos los eventos (incluidos `DRAFT`) de su `organization_id`.
     - **Regla anti-filtración por columna (limitación nativa de RLS):** PostgreSQL RLS filtra **filas completas**, no columnas individuales. Por tanto, **ninguna columna privada o PII del organizador** (correo privado interno, teléfono personal, notas internas, configuración comercial sensible) se almacena en la tabla pública `events` legible por `anon`/`authenticated`: dichos datos se aíslan en tabla privada separada (`event_private_ops` / `organization_private_contacts` con RLS estricto exclusivo para miembros `ACTIVE` de esa `organization_id`) o se restringe la exposición pública mediante vista / `GRANT SELECT (col1, ...)` sin columnas privadas.
     - **Datos personales del deportista y multi-tenancy:** Un usuario `authenticated` solo lee/escribe su `AthleteProfile`, `ConsentRecord`, `Favourite` y `Registration` (`athlete_id = auth.uid()`), o los registros de participantes/pagos de organizaciones donde tenga membresía `ACTIVE`.
   - **Confinamiento del acceso privilegiado (`BYPASSRLS` / `service_role`):** El acceso administrativo que omite RLS (`<SUPABASE_SERVICE_ROLE_KEY>` o `withSystemBypassTx` confinado en `src/shared/infrastructure/db/admin-client.ts`) está bloqueado por regla ESLint `no-restricted-imports` en UI y rutas generales; solo puede invocarse desde webhooks Stripe con firma verificada (`payments`), workers de expiración/outbox (`registration`/`communications`) y operaciones `ADMIN` auditadas en `AuditLog`.
4. **Pruebas negativas obligatorias (`G3` / `G5`):**
   - Acceso anónimo a `/mis-retos`, `/trayectoria`, `/perfil` y `/pro/**` rechazado.
   - Atleta A intentando leer/modificar borrador, inscripción o perfil de Atleta B rechazado.
   - Miembro `ACTIVE` de Org 1 intentando leer, editar, publicar o exportar participantes de Org 2 rechazado.
   - Miembro `INVITED` o `REVOKED` rechazado incluso dentro de su propia organización.
   - `ORG_VIEWER` intentando publicar evento o enviar briefing rechazado.

### 2.3 Inventario Contractual de Integraciones Externas

| Proveedor | Propósito V1 | Entornos y modo | Secretos requeridos (fuera de Git) | Contrato, validación e idempotencia | Tolerancia a fallos y dobles de prueba |
|---|---|---|---|---|---|
| **Supabase / PostgreSQL** (`@supabase/supabase-js@2.119.1`, `@supabase/ssr@0.12.7`, `pg@8.23.1`) | PostgreSQL 17 (pool `pg` con RLS contextual), Auth por cookies SSR, Storage de media | `preview`/`staging`/`prod` (proyectos aislados); `local` (PGlite/Docker/dev) | `<DATABASE_URL>` (rol sin `BYPASSRLS`), `<MIGRATION_DATABASE_URL>` (conexión directa para CLI de migración/seed, fuera del runtime web), `<NEXT_PUBLIC_SUPABASE_URL>`, `<NEXT_PUBLIC_SUPABASE_ANON_KEY>`, `<SUPABASE_SERVICE_ROLE_KEY>` | Migraciones SQL versionadas; pool `pg` confinado en `src/shared/infrastructure/db/` aplicando `withRlsContext`; Storage restringido a MIME `image/webp`, `image/avif`, `image/jpeg`, `image/png` (prohibido SVG subido por usuario) y tamaño máximo `5 MB` | Timeout DB `<= 5s`; `G2` con repositorios en memoria; `G3` con Postgres/Supabase efímero |
| **Stripe** (`stripe@23.1.0`, `@stripe/stripe-js@10.3.0`) | Checkout hospedado y webhooks de confirmación/reembolso | **Modo `test` obligatorio en V1**; `sk_live_` bloqueado en arranque mientras `OAK_ENABLE_LIVE_PAYMENTS !== "true"` | `<STRIPE_SECRET_KEY>`, `<NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY>`, `<STRIPE_WEBHOOK_SECRET>` | Precio calculado 100% en servidor en céntimos enteros (`EUR`). Creación de Checkout Session con `Idempotency-Key` determinista (`reg:<id>:attempt:<n>`). Webhook `/api/webhooks/stripe` verifica firma `stripe-signature` con raw body y registra `PaymentWebhookEvent.provider_event_id UNIQUE` | Sin datos PAN/CVV en OAK (PCI SAQ A). Reintento seguro ante timeout `5s`. Duplicados y eventos *out-of-order* devuelven `200` idempotente sin duplicar registro ni correo. `G2/G3` con MSW + payload firmado sintético |
| **Resend** (`resend@6.39.0`) | Email transaccional: confirmación única de inscripción y briefing de organizador | `local`/`preview`/`staging`: sandbox/sink; `prod`: solo tras `D3` y dominio SPF/DKIM/DMARC | `<RESEND_API_KEY>`, `<OAK_EMAIL_FROM>` | **Outbox transaccional:** `CommunicationLog` se inserta en estado `PENDING` (`idempotency_key UNIQUE`: `confirm:<registration_id>` o `briefing:<batch_id>:<recipient_id>`) **dentro de la misma transacción SQL** que confirma la inscripción/envío, y se despacha tras el `COMMIT`. Contenido sin PII excesiva ni tokens de sesión | Timeout `5s`. Si el proceso cae entre el `COMMIT` y Resend o Resend falla, la inscripción **permanece `CONFIRMED`** y el registro `PENDING`/`FAILED` en `CommunicationLog` es reintentado idempotente por worker sin duplicar envíos. `G2/G3` con MSW / `MemoryEmailSink` |
| **Sentry** (`@sentry/nextjs@11.14.0`) | Captura de errores no controlados y trazas API con `correlationId` | `local`: desactivado por defecto; `preview`/`staging`/`prod`: habilitado sin PII | `<SENTRY_DSN>`, `<SENTRY_AUTH_TOKEN>` (solo build CI upload sourcemaps) | Hooks obligatorios `beforeSend` y `beforeSendTransaction` que eliminan cabeceras (`authorization`, `cookie`, `stripe-signature`), body, emails, nombres, documentos y tokens | Sampling controlado (`tracesSampleRate: 0.1` en prod, `1.0` en staging). Degradación no bloqueante si Sentry es inaccesible. `G6` verifica evento sintético sin PII |

### 2.4 Prohibiciones Transversales No Negociables

1. **Cero dinero real y cero liquidaciones en V1:** Prohibidos `sk_live_`, `pk_live_`, Stripe Connect, payouts a organizadores y facturación fiscal automatizada en V1 sin decisión `D3` explícita y separada.
2. **Moneda en enteros menores:** Todos los importes (`PriceTier`, `Registration`, `Payment`) se almacenan como `INTEGER >= 0` en céntimos de euro (`currency = 'EUR'`). Prohibido `FLOAT`, `DOUBLE`, `REAL` o aritmética decimal en punto flotante JS para precios.
3. **Tiempo en UTC con zona horaria explícita:** Toda marca temporal persistida usa `TIMESTAMPTZ` en UTC; cada `Event` declara su `timezone` IANA explícita (por defecto `'Europe/Madrid'`) y la conversión ocurre únicamente en los bordes de presentación/exportación.
4. **Cero PII en código, fixtures, logs, capturas o trazas:** Cualquier dato de prueba usa dominios reservados RFC 2606 (`@oak.invalid`, `@demo.oak.invalid`) y nombres sintéticos no reales.
5. **Protección CSV Export (`AC-J07-03`):** Todo campo exportado que comience por `=`, `+`, `-`, `@`, `\t` o `\r` se neutraliza anteponiendo comilla simple `'`, evitando ejecución de fórmulas en hojas de cálculo; cada exportación genera entrada en `AuditLog`.
6. **Sin lógica crítica solo en cliente:** Ni cálculos de precio, ni verificación de cupos, ni validación de publicación de eventos ni controles de permisos confían en parámetros enviados por el navegador.

## 3. Alternativas Evaluadas y Descartadas

| Aspecto | Decisión elegida | Alternativas evaluadas | Motivo de descarte |
|---|---|---|---|
| Autorización | Server-side `deny-by-default` + RLS como segunda barrera | (A) Solo RLS desde cliente browser con `@supabase/supabase-js`; (B) Solo checks en API sin RLS | (A) expone el esquema directamente y complica lógica transaccional de precios/cupos/auditoría; (B) pierde defensa en profundidad ante bugs o futuras rutas. |
| Pagos V1 | Stripe Hosted Checkout (modo test) + webhooks firmados | (A) Stripe Elements / PaymentIntents embebidos desde día 1; (B) Redsys directo | Hosted Checkout reduce superficie PCI-DSS, simplifica 3DS/SCA y acelera V1 manteniendo tokenización e idempotencia exactas. |
| Acceso de organizadores | Invitación cerrada con token de un uso | Autoalta pública de cualquier usuario como organizador | Exige KYC/verificación de identidad y prevención de fraude fuera de V1 (`MASTER_EXECUTION_PLAN.md §4`). |

## 4. Consecuencias e Invalidación

- **Consecuencias:** `P1-009` (contratos API/eventos), `P2-002..P2-006` (esquema, auth, orgs, RLS) y `P4-003..P4-010` (precios, cupo, Stripe, webhook, Resend) heredan fronteras y guardrails inequívocos.
- **Invalidación:** Este ADR queda invalidado si se habilita acceso directo UI->tablas, se almacena sesión en `localStorage`, se omiten políticas RLS o verificación de firma webhook, se introducen pagos reales sin `D3` o se detecta PII real en logs/fixtures/Sentry.

