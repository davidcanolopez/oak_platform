# Catálogo del Dataset Sintético y Cuentas Demo — OAK (`P0-009`)

- **Versión del dataset:** `oak-seed.v1` (`schemaVersion: "1.0.0"`)
- **Archivos fuente:** [`data/fixtures/oak-seed.v1.json`](../../data/fixtures/oak-seed.v1.json), [`data/fixtures/schema.ts`](../../data/fixtures/schema.ts)
- **Pruebas unitarias:** [`tests/unit/fixtures.test.ts`](../../tests/unit/fixtures.test.ts)
- **Normativa aplicable:** `AGENTS.md`, `docs/security/DATA_CLASSIFICATION_RETENTION.md`, `docs/brand/BRAND_UX_CONTRACT.md` (§1.4), `docs/adr/ADR-003-auth-tenancy-and-integrations.md`, `docs/adr/ADR-004-migrations-recovery-and-budgets.md` (§2.2)

---

## 1. Principios de Seguridad y Diseño Sintético

1. **Cero PII real:** Todos los nombres llevan marcador `(Demo)`, no se incluyen teléfonos, DNI/NIE/pasaportes (`documentNumber: null`) ni datos clínicos, y el `100 %` de los correos usa el dominio reservado RFC 2606 **`@oak-demo.invalid`**.
2. **Cero constantes prohibidas de los decks:** Se valida automáticamente con `assertNoBannedMockData()` la ausencia total de `David Cano`, `Trail del Robledal`, `Pedales de Guadarrama`, `10K Madrid Rio`/`Río`, `Sierra Norte Trail`, `oak.run`, `Explorer` y `Pathfinder`.
3. **Dinero en minor units enteras (`EUR`):** Todos los precios, gastos de gestión e importes de pago son enteros `>= 0` en céntimos de euro (`amountCents`, `managementFeeCents`, `totalCents`).
4. **Tiempo en UTC + zona horaria explícita:** Todas las marcas temporales terminan en `Z` (ISO 8601 UTC) y todos los eventos declaran `timezone: "Europe/Madrid"`.
5. **Bloqueo en producción:** El dataset declara `safetyGuard.forbiddenInProduction = true` y `safetyGuard.requiresAllowDemoSeed = true`; su carga en PostgreSQL (`P2-003`) debe abortar si `APP_ENV === "production"` o `OAK_ALLOW_DEMO_SEED !== "true"`.

---

## 2. Organizaciones y Membresías

| ID fijo             | Slug                          | Nombre visible                     | Municipio           | Estado   | Cobertura de membresías                                                      |
| ------------------- | ----------------------------- | ---------------------------------- | ------------------- | -------- | ---------------------------------------------------------------------------- |
| `10000000-...-0001` | `club-senderos-del-lozoya`    | Club Deportivo Senderos del Lozoya | Buitrago del Lozoya | `ACTIVE` | `ORG_OWNER` (`ACTIVE`), `ORG_MANAGER` (`INVITED`), `ORG_MANAGER` (`REVOKED`) |
| `10000000-...-0002` | `club-popular-manzanares-sur` | Club Popular Manzanares Sur        | Getafe              | `ACTIVE` | `ORG_OWNER` (`ACTIVE`), `ORG_VIEWER` (`ACTIVE`)                              |

---

## 3. Catálogo de los 12 Eventos en la Comunidad de Madrid

| #   | Slug                                      | Título                              | Org   | Disciplina | Municipio (Madrid)         | Estado      | Inicio (UTC)           | Casos límite y precios (`EUR` céntimos)                                                         |
| --- | ----------------------------------------- | ----------------------------------- | ----- | ---------- | -------------------------- | ----------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| 1   | `trail-puentes-viejas-lozoya`             | Trail Puentes Viejas                | Org 1 | `trail`    | Buitrago del Lozoya        | `PUBLISHED` | `2027-04-18T07:30:00Z` | 2 modalidades, capacidad normal (`116` y `75` libres), **multi-tier** (`2800` / `3400` + `200`) |
| 2   | `subida-la-najarra-miraflores`            | Subida a La Najarra                 | Org 1 | `trail`    | Miraflores de la Sierra    | `PUBLISHED` | `2027-05-09T07:00:00Z` | **`remainingSpots = 1` (última plaza)** para contención `NT-04`; `3100 + 200`                   |
| 3   | `circular-monte-abantos-escorial`         | Circular Monte Abantos              | Org 1 | `trail`    | San Lorenzo de El Escorial | `PUBLISHED` | `2027-05-23T07:00:00Z` | **`remainingSpots = 0` (agotado)**; `2900 + 200`                                                |
| 4   | `kilometro-vertical-barranca-navacerrada` | Kilómetro Vertical de la Barranca   | Org 1 | `trail`    | Navacerrada                | `DRAFT`     | `2027-09-12T08:00:00Z` | Borrador privado Org 1 (`NT-01` aislamiento cross-tenant); `2600 + 150`                         |
| 5   | `senda-carcavas-patones`                  | Senda de las Cárcavas               | Org 1 | `trail`    | Patones                    | `CANCELLED` | `2027-03-28T08:00:00Z` | Evento cancelado con inscripción `REFUNDED`; `2500 + 150`                                       |
| 6   | `trail-pedriza-sur-manzanares`            | Trail La Pedriza Sur                | Org 1 | `trail`    | Manzanares el Real         | `COMPLETED` | `2026-09-20T07:30:00Z` | Evento completado en historial de atleta; `2700 + 150`                                          |
| 7   | `media-parque-alhondiga-getafe`           | Media Parque Alhóndiga              | Org 2 | `running`  | Getafe                     | `PUBLISHED` | `2027-04-11T07:30:00Z` | 2 modalidades (`158` y `132` libres), **multi-tier** (`1400` / `1800` + `100`)                  |
| 8   | `encuentro-atletico-henares-alcala`       | Encuentro Atlético del Henares      | Org 2 | `running`  | Alcalá de Henares          | `PUBLISHED` | `2027-05-16T08:00:00Z` | **Modalidad gratuita explícita `0 EUR`** (`amountCents = 0`, `fee = 0`)                         |
| 9   | `nocturna-polvoranca-leganes`             | Nocturna de Polvoranca 6K           | Org 2 | `running`  | Leganés                    | `PUBLISHED` | `2027-06-19T19:30:00Z` | Nivel `INICIACION`, `155` plazas libres; `1500 + 100`                                           |
| 10  | `carrera-jardines-tajo-aranjuez`          | Carrera Jardines del Tajo           | Org 2 | `running`  | Aranjuez                   | `DRAFT`     | `2027-06-06T07:30:00Z` | Borrador privado Org 2 (`NT-01` simétrico); `1900 + 100`                                        |
| 11  | `10k-parque-central-tres-cantos`          | 10K Parque Central Tres Cantos      | Org 2 | `running`  | Tres Cantos                | `CLOSED`    | `2027-03-14T08:30:00Z` | Inscripciones cerradas antes de la prueba; `1700 + 100`                                         |
| 12  | `carrera-camino-santiago-colmenar`        | Carrera Camino de Santiago Colmenar | Org 2 | `running`  | Colmenar Viejo             | `COMPLETED` | `2026-10-18T08:00:00Z` | Evento completado en historial de atleta; `2000 + 150`                                          |

---

## 4. Matriz de Cobertura de Estados Límite

| Dominio                          | Estados cubiertos en `oak-seed.v1.json`                                                                | Verificación automática    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------- |
| `Event.status`                   | `DRAFT` (2), `PUBLISHED` (6), `CLOSED` (1), `CANCELLED` (1), `COMPLETED` (2)                           | `validateSyntheticDataset` |
| `OrganizationMembership.status`  | `ACTIVE` (3), `INVITED` (1 con `userId: null`), `REVOKED` (1)                                          | `validateSyntheticDataset` |
| Capacidad `PUBLISHED`            | `remainingSpots = 0` (agotado), `remainingSpots = 1` (última plaza), `>= 10` (capacidad normal)        | `validateSyntheticDataset` |
| Precios (`EUR` céntimos)         | Gratuito explícito (`0`), multi-tier (`Anticipada`/`General`/`Ordinaria`), tarifa única                | `validateSyntheticDataset` |
| `Registration.status`            | `DRAFT` (1), `PENDING_PAYMENT` (2), `CONFIRMED` (4, incl. 1 gratuita), `CANCELLED` (1), `REFUNDED` (1) | `validateSyntheticDataset` |
| `Payment.status` (`stripe_test`) | `CREATED` (1), `REQUIRES_ACTION` (1), `SUCCEEDED` (3), `FAILED` (1), `REFUNDED` (1)                    | `validateSyntheticDataset` |

---

## 5. Cuentas Demo Sintéticas (Sin Credenciales Reales)

> **Política de credenciales:** Este archivo y `oak-seed.v1.json` **no contienen** contraseñas, `passwordHash`, JWTs ni tokens reales (`credentialPolicy: "NO_PASSWORD_IN_REPO_EPHEMERAL_DEV_ONLY"`). En `P2-003` (entornos `local`/`staging` con `OAK_ALLOW_DEMO_SEED=true`), el runner de seed creará los usuarios en Supabase Auth local/efímero mediante variables efímeras fuera de Git o magic links locales de desarrollo.

| `accountKey`              | Rol plataforma / org              | Estado membresía | Email sintético (`@oak-demo.invalid`) | Propósito de prueba / UAT                                                                               |
| ------------------------- | --------------------------------- | ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `athlete-con-historial`   | `ATHLETE`                         | No aplica        | `atleta.historial@oak-demo.invalid`   | Trayectoria con 2 completados, próximo reto, borrador, pendiente, cancelado, reembolsado y 2 favoritos  |
| `athlete-nuevo-sin-retos` | `ATHLETE`                         | No aplica        | `atleta.nuevo@oak-demo.invalid`       | Estado vacío (`0` inscripciones, `0` favoritos) para validar `AC-J05-04` y flujo de primera inscripción |
| `organizer-org1-active`   | `ATHLETE` + `ORG_OWNER` (Org 1)   | `ACTIVE`         | `org1.gestor@oak-demo.invalid`        | Gestión completa Org 1 y prueba negativa cross-tenant frente a Org 2 (`NT-01`)                          |
| `organizer-org2-active`   | `ATHLETE` + `ORG_OWNER` (Org 2)   | `ACTIVE`         | `org2.gestor@oak-demo.invalid`        | Gestión completa Org 2 y prueba negativa cross-tenant frente a Org 1 (`NT-01`)                          |
| `organizer-org1-invited`  | `ATHLETE` + `ORG_MANAGER` (Org 1) | `INVITED`        | `org1.invitado@oak-demo.invalid`      | Usuario pendiente de aceptar invitación cerrada (sin acceso a `/pro` mientras siga `INVITED`, `NT-03`)  |
| `organizer-org1-revoked`  | `ATHLETE` + `ORG_MANAGER` (Org 1) | `REVOKED`        | `org1.revocado@oak-demo.invalid`      | Ex-miembro con acceso revocado en Org 1 (`NT-03`)                                                       |
| `organizer-org2-viewer`   | `ATHLETE` + `ORG_VIEWER` (Org 2)  | `ACTIVE`         | `org2.lector@oak-demo.invalid`        | Solo lectura en Org 2; denegación al publicar o enviar briefing (`NT-03`)                               |
| `admin-soporte`           | `ADMIN` (`mfaRequired: true`)     | No aplica        | `admin.soporte@oak-demo.invalid`      | Soporte puntual auditado por `registrationCode`/`id` (`AC-J08-01..04`, `NT-15`)                         |

---

## 6. Contrato de Idempotencia para `P2-003` (`<SEED_IDEMPOTENCY_CHECK>`)

Para cumplir `ADR-004` §2.2 y `QUALITY_GATES.md` §6 `G3`:

1. **Precondición de entorno (fail-closed):** El script de seed en `P2-003` debe leer `parseEnv()` (`src/shared/env.ts`) y abortar con `exit != 0` si `APP_ENV === "production"` o `OAK_ALLOW_DEMO_SEED !== "true"`.
2. **Validación previa obligatoria:** Antes de abrir transacción SQL, debe invocar `validateSyntheticDataset(oakSeed)` desde `data/fixtures/schema.ts`.
3. **Orden topológico transaccional:** Ejecutar dentro de una única transacción PostgreSQL:
   `organizations` -> `users / demoAccounts` -> `organization_memberships` -> `events` -> `event_modalities` -> `price_tiers` -> `favourites` -> `registrations` + `registration_participants` -> `payments`.
4. **Claves naturales / UUID deterministas y `UPSERT`:**
   - Todas las tablas mutables usan `INSERT ... ON CONFLICT (id) DO UPDATE SET ...` preservando exactamente los UUIDs fijos de `oak-seed.v1.json`.
   - `favourites` usa `ON CONFLICT (user_id, event_id) DO NOTHING`.
   - `payments` usa `ON CONFLICT (id) DO UPDATE` manteniendo `idempotency_key` única (`reg:<registration_id>:attempt:1`).
5. **Criterio de verificación doble ejecución (`<SEED_IDEMPOTENCY_CHECK>`):** Ejecutar el runner dos veces consecutivas sobre la misma base migrada y confirmar exactamente los mismos conteos (`2` organizaciones, `5` membresías, `12` eventos, `14` modalidades, `16` price tiers, `2` favoritos, `9` inscripciones, `7` pagos) y suma exacta de importes (`totalCents`) sin duplicados.
