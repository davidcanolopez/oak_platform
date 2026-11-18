# ADR-004: Migraciones, seed idempotente, recuperación (RPO/RTO) y presupuestos G0/G5

- **Estado:** Propuesto (en revisión independiente por `devops-release` y `backend-datos` para `G0`)
- **Fecha:** 2026-11-18
- **Autores:** `arquitecto-seguridad` (`ARCH`)
- **Paquete:** `P0-003`
- **Fuentes normativas:** `MASTER_EXECUTION_PLAN.md` (§7.5, §10, §11), `QUALITY_GATES.md` (§6 G3/G5/G6), `BRAND_UX_CONTRACT.md` (§12, §14)

## 1. Contexto

Los gates `G3`, `G5` y `G6` exigen demostrar reproducibilidad de base de datos (`fresh` y desde `N-1`), seed sintético idempotente, capacidad de recuperación ante desastres (`RPO <= 24h`, `RTO <= 4h`), presupuestos de rendimiento web (`LCP`, `INP`, `CLS`, Lighthouse, peso por ruta) y un perfil cuantitativo explícito de carga, concurrencia y SLO de API definido desde `G0`.

## 2. Decisión

### 2.1 Estrategia de Migraciones (`Expand / Migrate / Contract`), Compatibilidad y Rollback

1. **Formato y ejecución:**
   - Migraciones SQL forward-only numeradas cronológicamente en `supabase/migrations/YYYYMMDDHHMMSS_<descripcion>.sql`.
   - Registro de versión aplicada en tabla interna de migraciones dentro de la misma transacción (salvo sentencias `CREATE INDEX CONCURRENTLY` cuando aplique), con `SET lock_timeout = '5s'` y `SET statement_timeout = '30s'` por defecto para evitar bloqueos prolongados.
2. **Patrón obligatorio `Expand / Migrate / Contract`:**
   - **Expand (Release `N`):** añadir nuevas tablas, columnas `NULL` o con valor por defecto, índices nuevos o triggers compatibles sin romper lecturas/escrituras del código `N-1`.
   - **Migrate (Release `N`):** poblar o migrar datos en lotes deterministas idempotentes y habilitar escritura dual cuando exista cambio estructural.
   - **Contract (Release `N+1` o posterior):** eliminar columnas/restricciones legadas únicamente tras verificar cero uso en producción/staging y después de backup cifrado verificado.
3. **Prohibición de cambios destructivos en caliente:** Quedan prohibidos `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, `RENAME COLUMN` directo o cambios destructivos de `ENUM` dentro del mismo release que consume el cambio.
4. **Compatibilidad hacia atrás y rollback de aplicación (`N -> N-1`):**
   - Todo cambio de esquema en `N` debe permitir que la aplicación vuelva al artefacto `N-1` sin pérdida ni corrupción de inscripciones o pagos confirmados (`<ROLLBACK_DRILL>`).
   - Cada PR de migración (`P2-002+`) incluye procedimiento documentado y probado de reversión/forward-fix no destructivo, verificado mediante:
     - `<DB_MIGRATE_FRESH>`: base vacía -> última migración `N`.
     - `<DB_MIGRATE_FROM_PREVIOUS>`: snapshot `N-1` con datos sintéticos -> migración `N` + comprobación de integridad referencial y conteos.

### 2.2 Seed Sintético Determinista e Idempotente (`<SEED_IDEMPOTENCY_CHECK>`)

1. **Alcance del dataset (`P0-009` + `P2-003`):**
   - Al menos 2 organizaciones independientes (para probar aislamiento multi-tenant), 12 eventos en la Comunidad de Madrid (trail running y running popular), múltiples modalidades, tramos de precio (`PriceTier`) en céntimos enteros y estados límite (`DRAFT`, `PUBLISHED`, `CLOSED`, `CANCELLED`, `COMPLETED`, casi lleno, 1 plaza restante para pruebas de contención y agotado).
   - Cuentas demo de atleta, organizadores y administrador usando exclusivamente identificadores sintéticos y dominios RFC 2606 (`@demo.oak.invalid`, `@test.oak.invalid`), cero PII real.
2. **Determinismo e idempotencia:**
   - UUIDs deterministas fijos y operaciones `INSERT ... ON CONFLICT (id) DO UPDATE ...` (o `DO NOTHING` para logs inmutables) ejecutadas en orden topológico determinista dentro de transacción.
   - `<SEED_IDEMPOTENCY_CHECK>` ejecuta el seed dos veces consecutivas sobre la misma base migrada y afirma igualdad exacta de conteos por tabla, importes totales y cero registros duplicados.
3. **Protección por entorno:** El runner aborta con `exit != 0` si `APP_ENV === "production"` o `OAK_ALLOW_DEMO_SEED !== "true"`.

### 2.3 Backup, Restore (`RPO <= 24h`, `RTO <= 4h`) y Política de Retención

1. **Objetivos de recuperación MVP V1:**
   - **`RPO <= 24 horas`:** backups diarios automáticos cifrados en reposo gestionados por Supabase/PostgreSQL más snapshot lógico cifrado previo a cada ventana de migración en `staging`/`producción`.
   - **`RTO <= 4 horas` (`240 minutos`):** desglose operativo máximo para `<BACKUP_RESTORE_DRILL>`:
     - Detección, triaje y decisión de restauración: `<= 30 min`.
     - Provisión/restauración del snapshot PostgreSQL cifrado: `<= 90 min`.
     - Reconciliación SQL de conteos críticos (`registrations`, `payments`, cupos): `<= 30 min`.
     - Redespliegue del artefacto certificado (`SHA` y digest verificados) y validación de variables: `<= 30 min`.
     - Ejecución de `<SMOKE_TEST>` y comprobación de observabilidad: `<= 30 min`.
     - Margen de contingencia operativa: `30 min`.
2. **Ensayo obligatorio (`P7-009` / `G6`):** Restauración real en entorno aislado demostrando `RPO`/`RTO` medidos y reconciliación contable a cero diferencias.
3. **Retención y anonimización RGPD:**
   - Al completar una solicitud de borrado de cuenta verificada, los datos personales identificativos (`User`/`AthleteProfile`) se anonimizan preservando la integridad contable y de auditoría exigida (`Registration`, `Payment`, `AuditLog` sin PII directa).
   - Logs estructurados JSON: retención de `30 días` (cero PII); `AuditLog`: retención mínima de `180 días` en V1.

### 2.4 Presupuestos Cuantitativos para `G0` y `G5`

#### A. Presupuesto de Bundle JS Inicial y Transferencia por Ruta (`<PERFORMANCE>`)

Medido sobre el build de producción (`next build`) y Lighthouse CI móvil (perfil Moto G4 / Slow 4G):

| Grupo de rutas | JS inicial First-Load máx. (gzip) | Transferencia inicial total máx. (HTML+CSS+JS+Fuentes+Img visible) | CSS máx. (gzip) | Fuentes WOFF2 máx. | Regla de regresión `G5` |
|---|---:|---:|---:|---:|---|
| Públicas (`/`, `/explorar`, `/retos/:eventSlug`, auth) | `<= 160 KB` | `<= 900 KB` (`<= 750 KB` en `/explorar`, `<= 850 KB` en detalle) | `<= 45 KB` | `<= 120 KB` | `0` presupuestos superados; ninguna regresión `> 10%` sin excepción aprobada |
| Flujos atleta autenticados (`/inscripciones/**`, `/mis-retos`, `/trayectoria`, `/perfil`) | `<= 190 KB` | `<= 600 KB` | `<= 45 KB` | `<= 120 KB` | Carga diferida (`dynamic import`) para módulos no críticos en primera pintura |
| Workspace organizador (`/pro/**`) | `<= 220 KB` | `<= 800 KB` | `<= 45 KB` | `<= 120 KB` | Tablas grandes paginadas (`<= 50 filas/página`) y analítica con lazy-loading |

- **Imágenes:** Toda fotografía en producción usa formatos AVIF/WebP responsive con dimensiones explícitas (`width`/`height`) para evitar CLS; imagen hero `<= 350 KB`, thumbnails de tarjeta `<= 40 KB` cada uno. Las imágenes PNG actuales de los decks (`~2.5–3 MB`) quedan prohibidas en producción (`BRAND_UX_CONTRACT.md §7`).

#### B. Core Web Vitals y Lighthouse CI (`<PERFORMANCE>` / `<A11Y_AUTOMATED>`)

| Métrica | Umbral obligatorio `G5` | Percentil / Condición |
|---|---|---|
| **LCP** (Largest Contentful Paint) | `<= 2.5 s` (`2500 ms`) | `p75` en móvil representativo |
| **INP** (Interaction to Next Paint) | `<= 200 ms` | `p75` en móvil representativo |
| **CLS** (Cumulative Layout Shift) | `<= 0.1` | `p75` en móvil y desktop |
| **TTFB** (Time to First Byte) | `<= 800 ms` | `p75` rutas públicas SSR/catalog |
| **Lighthouse CI Performance** | `>= 90` | Perfil móvil sobre rutas clave |
| **Lighthouse CI Accessibility** | `>= 95` (y `0` fallos `serious`/`critical` en `@axe-core/playwright`) | Perfil móvil y desktop |

#### C. Perfil de Carga, Concurrencia Objetivo y SLO de API (`<LOAD_TEST>`)

Validado en `G5` (`P7-003`) contra entorno staging con dataset sintético representativo (hasta `500` eventos y `10.000` inscripciones):

| Escenario | Perfil de carga y concurrencia | Latencia SLO | Error rate máx. (`5xx`) | Invariante obligatorio |
|---|---|---|---|---|
| **1. Carga sostenida normal** | `20 RPS` constantes durante `5 minutos` (`20` conexiones concurrentes; mix `60%` `/explorar` con filtros, `25%` `/retos/:slug`, `10%` `/api/health` + consultas auth, `5%` borradores/favoritos) | `p95 <= 500 ms`, `p99 <= 1200 ms` | `<= 0.5%` | `0` timeouts internos no controlados ni degradación entre tenants |
| **2. Pico de apertura (burst)** | `60 RPS` durante `60 segundos` (`50` usuarios concurrentes en lectura catálogo + inicio de inscripción) | `p95 <= 500 ms` en lecturas catálogo; `p95 <= 2000 ms` si interviene proveedor externo (timeout duro `<= 5000 ms`) | `<= 1.0%` | `0` corrupción de sesiones o borradores |
| **3. Contención de última plaza** | `25` peticiones paralelas simultáneas intentando reservar el último cupo disponible (`capacity_remaining = 1`) | `p95 <= 800 ms` (serialización transaccional `FOR UPDATE`) | `0%` de errores `5xx` | **Exactamente 1** reserva exitosa, `24` rechazos `409 CONFLICT` ordenados, **`0` sobreventa** |
| **4. Ráfaga de webhooks Stripe** | `20` entregas duplicadas y desordenadas para un mismo pago en `< 5 s` | `p95 <= 500 ms` | `0%` de `5xx` | **Exactamente 1** inscripción `CONFIRMED`, `1` `Payment SUCCEEDED`, `1` `CommunicationLog` |

### 2.5 Política de Observabilidad, Logs Estructurados y Alertas (`G6`)

1. **Formato de log JSON:** Cada petición API o acción de dominio relevante emite JSON estructurado a `stdout` con campos obligatorios: `timestamp_utc`, `level`, `correlation_id`, `module`, `action`, `actor_role`, `duration_ms`, `status_code`, `outcome`.
2. **Lista de bloqueo anti-PII en logs y trazas:** Queda prohibido registrar `email`, `full_name`, `document_number`, `phone`, `birth_date`, `address`, `cookie`, `authorization`, `stripe-signature`, tokens de invitación/recuperación o payloads raw de Stripe/Resend.
3. **Alertas obligatorias en `staging`/`producción` (`P7-008`):** cada alerta enlaza a un runbook operativo (`P7-011`):
   - Tasa de errores `5xx > 2%` durante `5 minutos`.
   - Latencia API interna `p95 > 500 ms` sostenida durante `10 minutos`.
   - Fallos de verificación de firma de webhook Stripe o acumulación de webhooks sin procesar.
   - Pico anómalo de `401`/`403`/`429` (posible ataque de fuerza bruta o fallo de auth).
   - Fallo del endpoint `/api/health` (conectividad PostgreSQL degradada).

## 3. Alternativas Evaluadas y Descartadas

| Decisión | Opción elegida | Alternativas evaluadas | Motivo de descarte |
|---|---|---|---|
| Migraciones | `expand/migrate/contract` forward-only | Migraciones destructivas directas (`DROP`/`RENAME` en el mismo release) | Rompen tráfico vivo durante despliegue y hacen imposible un rollback seguro `N -> N-1` sin restaurar snapshot completo. |
| Seed | Upsert determinista idempotente sintético | Dumps SQL estáticos opacos o creación manual en staging | Los dumps se rompen con migraciones nuevas y tienden a arrastrar PII; el script TS/SQL idempotente se valida en cada `G3`. |
| Presupuestos | Límites numéricos por tipo de ruta + perfil concreto de RPS/concurrencia | Criterios cualitativos ("rápido", "sin sobreventa") | Impiden automatizar `<PERFORMANCE>` y `<LOAD_TEST>` en `G5` con criterio binario `PASS`/`FAIL`. |

## 4. Consecuencias e Invalidación

- **Consecuencias:** `P0-009`, `P2-002`, `P2-003`, `P7-003`, `P7-009` y `P7-010` disponen de umbrales exactos verificables automáticamente.
- **Invalidación:** Este ADR queda invalidado si se introduce una migración no backward-compatible sin plan aprobado, si se supera cualquier presupuesto de bundle/CWV/SLO en `G5` sin aprobación de excepción por el usuario, si `RPO > 24h` o `RTO > 4h` fallan en el simulacro `G6`, o si aparece PII en logs/seed.

