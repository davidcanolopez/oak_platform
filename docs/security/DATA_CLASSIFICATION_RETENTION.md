# Clasificación de Datos, Prohibiciones de Registro y Retención/Anonimización (RGPD)

- **Versión:** `1.0` (`P0-006`)
- **Estado:** Entregado para revisión independiente (`auditor-no-funcional`) y verificación `G0` (`release-guardian`)
- **Owner:** `arquitecto-seguridad` (`SEC` / `ARCH`)
- **Fecha UTC:** `2026-11-18T21:45:00Z`
- **Fuentes normativas:** `AGENTS.md`, `MASTER_EXECUTION_PLAN.md` (§7.2–§7.6, §12–§13), `QUALITY_GATES.md` (§6 G0/G3/G5, §7), `.agents/rules/oak-security-data.md`, `docs/brand/BRAND_UX_CONTRACT.md` (§1.4, §10.4), `docs/agentic/DECISION_LOG.md`
- **Coherencia arquitectónica:** Alineado con las propuestas `ADR-003` y `ADR-004` (`P0-003`, pendientes de revisión independiente y cierre de su paquete)

---

## 1. Propósito y Alcance

Este documento fija el contrato vinculante de **clasificación por sensibilidad**, **cifrado**, **minimización**, **prohibición de exposición** (logs, trazas, `AuditLog`, fixtures, capturas y evidencias) y **retención/anonimización RGPD** para las **16 entidades mínimas** definidas en `MASTER_EXECUTION_PLAN.md §7.3`, así como para los registros operativos y copias de seguridad de OAK V1.

Cualquier esquema SQL (`P2-002`), seed sintético (`P0-009` / `P2-003`), contrato API (`P1-009`), política RLS (`P2-006`), exportación CSV (`P5-008`) o integración externa (`P4-005..P4-010`) que vulnere estas reglas queda bloqueado en `G1`/`G3`/`G5`.

---

## 2. Taxonomía de Sensibilidad

| Nivel | Etiqueta | Definición operativa en OAK V1 | Requisitos mínimos de manejo |
|---|---|---|---|
| **N1** | `Pública` | Información de catálogo publicado destinada a difusión abierta sin personas identificables ni datos operativos internos. | Lectura permitida a `ANONYMOUS`; TLS en tránsito; sin secretos ni PII. |
| **N2** | `Interna` | Metadatos técnicos del sistema, estados de proceso, correlaciones opacas (`UUID`), métricas agregadas sin identificación individual. | Acceso restringido a servicios internos y roles autenticados según caso de uso; no exponer detalles internos de infraestructura en errores públicos. |
| **N3** | `Confidencial` | Datos privados de negocio o pre-publicación pertenecientes a un organizador (`Organization`, eventos `DRAFT`, analítica comercial, listados internos no publicados). | Aislamiento estricto por `organization_id` (`deny-by-default` + `FORCE ROW LEVEL SECURITY`); prohibido acceso anónimo o cross-tenant. |
| **N4** | `PII` | Datos personales que identifican directa o indirectamente a una persona física (nombre, correo electrónico, fecha de nacimiento, documento identificativo si aplica tras `D1-09`, teléfono, contacto de emergencia). | Minimización estricta, cifrado en tránsito (TLS 1.2+/1.3) y en reposo (AES-256 gestionado), acceso RBAC/RLS estricto, **prohibido en logs/Sentry/`AuditLog`/fixtures/capturas**, anonimizable ante borrado RGPD. |
| **N5** | `Financiera/Pago` | Importes monetarios en céntimos enteros (`EUR`), referencias de sesión/intent de Stripe (`test` en V1) y estados de cobro/reembolso. | Almacenamiento obligatorio en `INTEGER >= 0` (céntimos) con `currency = 'EUR'`. **Prohibición absoluta** de capturar, transmitir por servidor propio o persistir PAN, CVV, caducidad de tarjeta o IBAN (PCI-DSS SAQ A vía Stripe Hosted Checkout). |
| **N6** | `Secreto` | Claves API (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN`), credenciales, cookies de sesión `HttpOnly`, tokens de invitación/recuperación en claro y firmas webhook. | **Cero secretos en Git, `.env.example`, bundle cliente (`NEXT_PUBLIC_*`), logs, `AuditLog` o evidencias.** Solo gestores de secretos por entorno; validación Zod fail-closed al arranque; tokens de un solo uso persistidos únicamente como hash criptográfico SHA-256. |

---

## 3. Reglas Transversales No Negociables

1. **Moneda e invariantes numéricas (`BR-02` / `AGENTS.md`):** Todos los importes (`PriceTier`, `Registration`, `Payment`) se almacenan como enteros en unidad mínima (`céntimos` de `EUR`, `INTEGER >= 0`) con columna `currency` explícita (`'EUR'`). Queda prohibido usar `FLOAT`, `DOUBLE`, `REAL` o aritmética decimal en punto flotante para cálculos monetarios.
2. **Tiempo en UTC con zona horaria de evento explícita (`AGENTS.md` / `G3`):** Toda marca temporal persistida usa `TIMESTAMPTZ` en **UTC**. `Event` declara una columna `timezone` IANA explícita (por defecto `'Europe/Madrid'`), convirtiendo a hora local únicamente en bordes de presentación y exportación.
3. **Cifrado en tránsito y en reposo (`§7.6` / `G5`):**
   - Tránsito: HTTPS obligatorio con TLS 1.2+/1.3 y cabecera HSTS en entornos desplegados (`preview`, `staging`, `producción`); cookies de sesión con `HttpOnly`, `Secure` (en HTTPS) y `SameSite=Lax`.
   - Reposo: Cifrado gestionado AES-256 en PostgreSQL/Supabase, Storage y backups cifrados; secretos cifrados en gestor de secretos de GitHub/Vercel.
   - Hash unidireccional: Tokens de invitación de organizadores (`OrganizationMembership`) y cualquier token temporal propio se almacenan exclusivamente como digest `SHA-256` + fecha de caducidad, nunca en texto plano.
4. **Bloqueos de producto/privacidad pendientes de Gate D1 (`BRAND_UX_CONTRACT.md §1.4 y §10.4`):**
   - Los datos ilustrativos de personas, eventos, métricas o dominios presentes en los decks de referencia (`BRAND_UX_CONTRACT.md §1.4`) **no pueden usarse** como constantes de producción, precios contractuales ni datos personales de prueba.
   - La recogida de **documentos de identidad**, **reglas de edad/menores** y cualquier **dato relacionado con salud** permanece **bloqueada hasta decisión `D1-09`** (`BRAND_UX_CONTRACT.md §10.4`). Si un evento futuro tras `D1-09` exige número de documento por reglamento federativo o seguro, se aplicará minimización extrema (solo cuando la modalidad lo marque obligatorio), enmascaramiento en UI/exportaciones cuando no sea imprescindible (`****<last4>`) y cero exposición en logs/trazas.
   - No se almacenan datos clínicos ni biométricos en `AthleteProfile` ni en `Journey` (`AC-J05-05`).
5. **Entorno de pruebas y cuentas sintéticas (`AGENTS.md` / `QUALITY_GATES.md §3`):** Cualquier fixture, seed (`P0-009`, `P2-003`), screenshot o prueba E2E utiliza exclusivamente identificadores sintéticos y dominios reservados RFC 2606 (`@oak.invalid`, `@demo.oak.invalid`, `@test.oak.invalid`, `@anon.oak.invalid`).

---

## 4. Matriz de Clasificación de las 16 Entidades Mínimas (`MASTER_EXECUTION_PLAN.md §7.3`)

### 4.1 Resumen Ejecutivo de Sensibilidad por Entidad

| # | Entidad (`§7.3`) | Módulo (`§7.2`) | Clasificación máxima | Contiene PII | Contiene datos financieros | Política tras borrado verificado de cuenta |
|---:|---|---|---|---|---|---|
| 1 | `User` | `identity` | `PII` / `Secreto` (credencial en Supabase Auth) | Sí (`email`) | No | Anonimización/eliminación de credencial e `email` (`BR-01`) |
| 2 | `AthleteProfile` | `athlete` | `PII` | Sí | No | Borrado/limpieza total de campos PII |
| 3 | `ConsentRecord` | `athlete` | `Interna` / `PII` (vínculo indirecto) | Indirecta (`user_id`, metadata mínima) | No | Conserva prueba de versión/fecha vinculada solo a `user_id` opaco anonimizado |
| 4 | `Organization` | `organization` | `Confidencial` (y contacto público publicado) | Solo contacto institucional si publicado | No | No pertenece a un atleta; retenida mientras existan eventos/auditoría |
| 5 | `OrganizationMembership` | `organization` | `Confidencial` / `Secreto` (hash invitación) | Indirecta (`user_id`, email invitación temporal) | No | Revocación y limpieza de `invited_email` tras expiración o borrado del usuario |
| 6 | `Event` | `catalog` / `organizer-ops` | `Confidencial` (`DRAFT`) / `Pública` (`PUBLISHED`) | No (contacto institucional de evento) | No | Entidad de organización; no afectada por borrado de cuenta de atleta |
| 7 | `EventModality` | `catalog` / `organizer-ops` | `Confidencial` (`DRAFT`) / `Pública` (`PUBLISHED`) | No | No (solo límites y cupos) | Entidad de organización |
| 8 | `PriceTier` | `catalog` / `organizer-ops` | `Confidencial` (`DRAFT`) / `Financiera/Pago` (`PUBLISHED`) | No | Sí (`amount_cents`, `currency`) | Entidad de organización |
| 9 | `EventMedia` | `catalog` / `organizer-ops` | `Confidencial` (`DRAFT`) / `Pública` (`PUBLISHED`) | No (EXIF eliminado) | No | Entidad de organización |
| 10 | `Favourite` | `catalog` | `Interna` (preferencia privada de usuario) | Indirecta (`user_id`) | No | Borrado físico (`DELETE`) al eliminar cuenta |
| 11 | `Registration` | `registration` | `Financiera/Pago` / `Interna` | Indirecta (`user_id`) | Sí (`total_cents`, `currency`) | `DRAFT` borrado físico; `CONFIRMED`/`CANCELLED`/`REFUNDED` conservada anonimizada (`BR-01`) |
| 12 | `RegistrationParticipant` | `registration` | `PII` | Sí (snapshot participante) | No | `DRAFT` borrado físico; confirmadas/pasadas **anonimizadas** (`BR-01`) |
| 13 | `Payment` | `payments` | `Financiera/Pago` | No (sin PAN/CVV ni nombre/email) | Sí (`amount_cents`, `provider_*_id`, `status`) | Conservada sin PII directa para integridad contable (`BR-01`) |
| 14 | `PaymentWebhookEvent` | `payments` | `Interna` / `Financiera/Pago` | No (payload minimizado/sanitizado) | Sí (ID evento proveedor) | Conservada con payload sanitizado sin PII (`90–180 días`) |
| 15 | `CommunicationLog` | `communications` | `PII` (referencia destinatario) / `Interna` | Sí (referencia/destino) | No | Destinatario anonimizado al borrar cuenta; nunca guarda cuerpo completo con PII |
| 16 | `AuditLog` | `audit-observability` | `Confidencial` / `Interna` | **Prohibida PII directa** | No | Conservada íntegra e inmutable; nunca contiene PII (`BR-01`) |

---

### 4.2 Detalle por Entidad y Tratamiento de Campos

#### 1. `User` (`identity`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Interna`): identificador técnico opaco (`auth.users.id`).
  - `email` (`PII`): correo de autenticación y notificaciones transaccionales. Prohibido en logs, Sentry, `AuditLog`, URLs y respuestas anónimas.
  - `password_hash` (`Secreto`): gestionado exclusivamente por Supabase Auth (`GoTrue`), nunca accesible ni legible por la aplicación Next.js.
  - `platform_role` (`Interna` / `Confidencial`): `ATHLETE` (defecto) o `ADMIN` (con MFA obligatorio).
  - `email_verified_at_utc`, `last_auth_at_utc`, `deleted_at_utc` (`Interna`, `TIMESTAMPTZ` UTC).
- **Reglas de acceso y cifrado:** Solo el propio usuario autenticado (`auth.uid() = id`) o procesos internos autenticados en servidor. Cifrado en reposo y TLS en tránsito. Nunca exponer en endpoints públicos ni enumerar en `/entrar`, `/registro` o `/recuperar-acceso`.

#### 2. `AthleteProfile` (`athlete`)
- **Campos críticos y nivel:**
  - `user_id` (`UUID`, `Interna`).
  - `full_name` (`PII`): nombre completo reutilizable en inscripciones previa revisión del deportista (`AC-J03-03`).
  - `birth_date` (`PII`): fecha de nacimiento para validación de elegibilidad/categoría (uso minimizado; pendiente de reglas de edad en `D1-09`).
  - `phone` (`PII`, opcional o requerido según evento): teléfono de contacto operativo.
  - `emergency_contact_name`, `emergency_contact_phone` (`PII`, opcional según evento): solo visible para el propio deportista y organizador `ACTIVE` del evento en que tenga inscripción confirmada.
  - `document_type`, `document_number_masked` / `document_number` (`PII` restringida — **bloqueado en MVP hasta `D1-09`**): si `D1-09` autoriza documento en eventos concretos, almacenar solo cuando sea legalmente exigible por el reglamento de la prueba, cifrado en reposo, oculto por defecto (`****<last4>`) y jamás impreso en logs o errores.
  - `preferred_disciplines`, `preferred_level` (`Interna`): preferencias deportivas no clínicas.
- **Prohibiciones:** Prohibido almacenar historiales médicos, lesiones, grupo sanguíneo o alergias en V1 sin decisión legal/producto `D1-09`. Prohibido en logs, Sentry, `AuditLog`, fixtures o capturas.

#### 3. `ConsentRecord` (`athlete`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Interna`), `user_id` (`UUID`, `Interna` / vínculo indirecto `PII`), `registration_id` (`UUID`, nullable, `Interna`).
  - `purpose` (`Interna`): p. ej. `ACCOUNT_PRIVACY_POLICY`, `EVENT_REGULATION_ACCEPTANCE`, `EVENT_COMMUNICATIONS`.
  - `consent_version` (`Interna`): identificador inmutable del texto legal vigente (`AC-J03-04`).
  - `granted` (`BOOLEAN`), `acted_at_utc` (`TIMESTAMPTZ` UTC), `actor_id` (`UUID`).
  - `evidence_context` (`Interna`): ruta/flujo (`registro`, `revision_inscripcion`), **sin IP en claro ni User-Agent completo identificativo** (si se registra contexto técnico anti-fraude, usar hash truncado con sal rotada o omitirlo).
- **Reglas:** Modelo append-only (no sobrescribir consentimientos previos; una revocación crea nuevo registro con marca temporal UTC).

#### 4. `Organization` (`organization`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Pública`/`Interna`), `slug`, `display_name`, `public_description` (`Pública` cuando tiene eventos `PUBLISHED`; `Confidencial` mientras solo tenga borradores).
  - `public_contact_email` / `public_contact_channel` (`Pública` / `Confidencial`): **debe ser un correo o canal institucional de organización** (`AC-J02-01`, `P3-003`), nunca el correo personal privado de un miembro sin consentimiento.
  - `status` (`Interna`).
- **Aislamiento:** La gestión y analítica de la organización son accesibles únicamente a sus miembros `OrganizationMembership.status = 'ACTIVE'`.

#### 5. `OrganizationMembership` (`organization`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Confidencial`), `organization_id` (`UUID`), `user_id` (`UUID`, nullable mientras `INVITED`).
  - `org_role` (`Confidencial`): `ORG_OWNER`, `ORG_MANAGER`, `ORG_VIEWER`.
  - `status` (`Confidencial`): `INVITED`, `ACTIVE`, `REVOKED` (`§7.4`).
  - `invited_email` (`PII` temporal): únicamente mientras `status = 'INVITED'`; se limpia/anula al activarse o expirar la invitación (`72 horas`).
  - `invitation_token_hash` (`Secreto`): digest `SHA-256` del token de un solo uso; el token en claro solo viaja en el enlace de invitación saliente y nunca se persiste ni loguea.
  - `invitation_expires_at_utc`, `accepted_at_utc`, `revoked_at_utc` (`TIMESTAMPTZ` UTC, `Interna`).
- **Reglas:** `INVITED` y `REVOKED` tienen cero acceso a datos de la organización. Prohibido exponer `invitation_token_hash` o `invited_email` en respuestas públicas o logs.

#### 6. `Event` (`catalog` / `organizer-ops`)
- **Campos críticos y nivel:**
  - `id` (`UUID`), `organization_id` (`UUID`), `slug`, `title`, `discipline`, `location_name`, `municipality`, `starts_at_utc` (`TIMESTAMPTZ` UTC), `timezone` (`'Europe/Madrid'`), `regulation_summary`, `cancellation_policy_summary`, `public_contact_info`.
  - `status` (`§7.4`, `Interna`/`Pública`): `DRAFT`, `PUBLISHED`, `CLOSED`, `CANCELLED`, `COMPLETED`.
- **Clasificación dual:**
  - Mientras `status = 'DRAFT'`: `Confidencial` (invisible para `ANONYMOUS`, `ATHLETE` y otras organizaciones).
  - Cuando `status IN ('PUBLISHED', 'CLOSED', 'CANCELLED', 'COMPLETED')` tras checklist server-side: `Pública` (solo campos de ficha pública; nunca expone listados de inscritos ni métricas financieras privadas).

#### 7. `EventModality` (`catalog` / `organizer-ops`)
- **Campos críticos y nivel:**
  - `id` (`UUID`), `event_id` (`UUID`), `name`, `distance_meters` (`INTEGER`), `elevation_gain_meters` (`INTEGER`), `level`, `time_limit_minutes`, `capacity_limit` (`INTEGER >= 1`), `reserved_count` (`INTEGER >= 0`).
- **Clasificación:** `Confidencial` en `Event.DRAFT`; `Pública` en eventos publicados (exponiendo disponibilidad agregada sin datos de participantes).
- **Invariante crítica:** `reserved_count <= capacity_limit` protegido transaccionalmente (`SELECT ... FOR UPDATE` + `CHECK`). Modificaciones sobre modalidades con inscripciones confirmadas quedan bloqueadas o restringidas a flujo auditado (`AC-J06-05`).

#### 8. `PriceTier` (`catalog` / `organizer-ops`)
- **Campos críticos y nivel:**
  - `id` (`UUID`), `event_modality_id` (`UUID`), `label`, `amount_cents` (`INTEGER >= 0`, `Financiera/Pago`), `management_fee_cents` (`INTEGER >= 0`, `Financiera/Pago`), `currency` (`'EUR'`), `valid_from_utc`, `valid_until_utc`, `max_quantity`.
- **Clasificación:** `Confidencial` en `DRAFT`; `Pública` + `Financiera/Pago` al publicarse.
- **Regla de integridad:** Es la única fuente autoritativa de precio; el cliente jamás envía el precio final.

#### 9. `EventMedia` (`catalog` / `organizer-ops`)
- **Campos críticos y nivel:**
  - `id` (`UUID`), `event_id` (`UUID`), `storage_path`, `mime_type`, `size_bytes`, `width_px`, `height_px`, `alt_text`, `rights_owner`, `provenance_note` (`BRAND_UX_CONTRACT.md §7`).
- **Clasificación:** `Confidencial` en `DRAFT`; `Pública` al publicarse el evento.
- **Controles:** Solo tipos MIME `image/webp`, `image/avif`, `image/jpeg`, `image/png`; tamaño máximo `5 MB`; **prohibido SVG subido por usuario** (vector XSS); eliminación obligatoria de metadatos EXIF (GPS/cámara/autor potencialmente PII) antes de servir o publicar.

#### 10. `Favourite` (`catalog`)
- **Campos críticos y nivel:**
  - `user_id` (`UUID`), `event_id` (`UUID`), `created_at_utc` (`TIMESTAMPTZ` UTC) con restricción `UNIQUE (user_id, event_id)`.
- **Clasificación:** `Interna` (preferencia privada del deportista).
- **Acceso:** Exclusivo del propio usuario autenticado (`auth.uid() = user_id`). No exponer preferencias individuales en listados públicos.

#### 11. `Registration` (`registration`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Interna`), `registration_code` (referencia duradera legible sin PII, `Interna`), `user_id` (`UUID`, vínculo `PII` indirecto), `event_id` (`UUID`), `event_modality_id` (`UUID`), `price_tier_id` (`UUID`).
  - `status` (`§7.4`, `Interna`): `DRAFT`, `PENDING_PAYMENT`, `CONFIRMED`, `CANCELLED`, `REFUNDED`.
  - `unit_amount_cents`, `fee_cents`, `total_cents` (`INTEGER >= 0`, `Financiera/Pago`), `currency` (`'EUR'`).
  - `draft_expires_at_utc`, `reserved_until_utc`, `confirmed_at_utc`, `created_at_utc`, `updated_at_utc` (`TIMESTAMPTZ` UTC).
- **Reglas:** Acceso exclusivo del deportista dueño (`user_id = auth.uid()`), miembros `ACTIVE` de la `Organization` propietaria del evento, o `ADMIN` por consulta puntual por `registration_id`/`registration_code` auditada (`AC-J08-01`).

#### 12. `RegistrationParticipant` (`registration`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Interna`), `registration_id` (`UUID`, `Interna`).
  - `full_name` (`PII`), `email` (`PII`), `birth_date` (`PII`), `phone` (`PII`), `emergency_contact` (`PII`), `document_type` / `document_number` (`PII` bloqueada hasta `D1-09`), `club_or_team` (`Interna` / potencial `PII` en export CSV — sujeta a neutralización anti-formula injection).
  - `anonymized_at_utc` (`TIMESTAMPTZ` UTC, `Interna`, nullable).
- **Reglas:** Snapshot independiente de `AthleteProfile` para garantizar trazabilidad de la inscripción, anonimizable por completo sin borrar `Registration` ni `Payment`. Acceso limitado al deportista dueño y a miembros `ACTIVE` del evento en `/pro/eventos/:id/participantes` (y en exportaciones CSV auditadas). Prohibido en logs, Sentry, `AuditLog`, fixtures reales o capturas.

#### 13. `Payment` (`payments`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Interna`), `registration_id` (`UUID`, `Interna`), `provider` (`'stripe_test'`, `Interna`), `mode` (`'test'`, `Interna`).
  - `status` (`§7.4`, `Financiera/Pago`): `CREATED`, `REQUIRES_ACTION`, `SUCCEEDED`, `FAILED`, `REFUNDED`.
  - `amount_cents` (`INTEGER >= 0`, `Financiera/Pago`), `currency` (`'EUR'`).
  - `idempotency_key` (`Interna`), `provider_checkout_session_id` (`Financiera/Pago`), `provider_payment_intent_id` (`Financiera/Pago`).
  - `succeeded_at_utc`, `refunded_at_utc`, `created_at_utc` (`TIMESTAMPTZ` UTC).
- **Prohibición estricta:** Nunca almacenar PAN, CVV, fechas de caducidad, titular de tarjeta ni correo de facturación de Stripe en esta tabla ni en logs.

#### 14. `PaymentWebhookEvent` (`payments`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Interna`), `provider` (`'stripe'`, `Interna`), `provider_event_id` (`TEXT UNIQUE`, `Interna` — clave de idempotencia), `event_type` (`Interna`), `processing_status` (`RECEIVED`, `PROCESSED`, `IGNORED_OUT_OF_ORDER`, `FAILED`).
  - `sanitized_summary` (`JSONB`, `Interna` / `Financiera/Pago`): únicamente IDs de sesión/intent, tipo de evento, importe en céntimos, moneda y `registration_id` de metadata.
  - `received_at_utc`, `processed_at_utc` (`TIMESTAMPTZ` UTC).
- **Prohibición estricta:** Prohibido guardar la cabecera `stripe-signature` (`Secreto`) o el payload bruto completo de Stripe (`customer_details`, `email`, `billing_details`, `address`, `phone`) dentro de la base de datos o logs.

#### 15. `CommunicationLog` (`communications`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Interna`), `idempotency_key` (`TEXT UNIQUE`: `confirm:<registration_id>` o `briefing:<batch_id>:<recipient_id>`, `Interna`).
  - `registration_id` (`UUID`, nullable), `event_id` (`UUID`), `recipient_user_id` (`UUID`, vínculo `PII` indirecto), `communication_type` (`REGISTRATION_CONFIRMATION`, `ORGANIZER_BRIEFING`).
  - `provider` (`'resend_sandbox'`, `Interna`), `provider_message_id` (`Interna`), `status` (`PENDING`, `SENT`, `FAILED`), `template_version`, `sent_at_utc`, `created_at_utc` (`TIMESTAMPTZ` UTC).
- **Minimización:** En lugar de duplicar direcciones de correo personal o guardar el cuerpo HTML/texto con datos del atleta en `CommunicationLog`, se referencia `recipient_user_id` + `template_version` + `subject_code`/resumen sin PII. Si existiera referencia temporal de envío en briefing, se anonimiza al cerrar cuenta o vencer retención.

#### 16. `AuditLog` (`audit-observability`)
- **Campos críticos y nivel:**
  - `id` (`UUID`, `Interna`), `created_at_utc` (`TIMESTAMPTZ` UTC), `correlation_id` (`UUID`, `Interna`).
  - `actor_id` (`UUID`, nullable para eventos de sistema/webhook), `actor_role` (`ANONYMOUS` | `ATHLETE` | `ORG_OWNER` | `ORG_MANAGER` | `ORG_VIEWER` | `ADMIN` | `SYSTEM_WEBHOOK`).
  - `organization_id` (`UUID`, nullable, `Confidencial`), `action` (`EVENT_PUBLISHED`, `PARTICIPANTS_EXPORTED_CSV`, `MEMBERSHIP_REVOKED`, `ADMIN_LOOKUP_BY_ID`, `GDPR_ACCOUNT_ANONYMIZED`, etc.), `resource_type`, `resource_id`, `reason` (obligatorio para acciones `ADMIN` `AC-J08-02` y cancelaciones/reembolsos).
  - `metadata_safe` (`JSONB` validado por allowlist, `Confidencial` / `Interna`).
- **Inmutabilidad y prohibición total de PII (`BR-01`):** Tabla estrictamente `INSERT`-only (revocados `UPDATE` y `DELETE` para el rol de aplicación). **Nunca** registra `email`, `full_name`, `birth_date`, `document_number`, `phone`, `address`, `emergency_contact`, tokens, contraseñas ni payloads de pago.

---

## 5. Prohibiciones Estrictas en Logs, Trazas, Fixtures, Capturas y `AuditLog`

Los siguientes elementos están **terminantemente prohibidos** en:
1. Logs estructurados JSON (`stdout` / log drains).
2. Eventos y transacciones de **Sentry** (filtrados obligatoriamente mediante `beforeSend` y `beforeSendTransaction`).
3. Registros de **`AuditLog`**.
4. Seeds, fixtures y datasets de prueba (`P0-009`, `P2-003`).
5. Capturas visuales, vídeos E2E, informes JUnit/HTML y artefactos de `docs/evidence/**`.

| Categoría prohibida | Campos / Patrones bloqueados |
|---|---|
| **PII directa** | Correos electrónicos reales (fuera de dominios reservados RFC 2606), nombres y apellidos reales, nombres ilustrativos de deck usados como datos personales (`BRAND_UX_CONTRACT.md §1.4`), `document_number` (DNI/NIE/pasaporte), `birth_date`, `phone`, `address`, `emergency_contact`. |
| **Credenciales y tokens** | Contraseñas, cabeceras `authorization`, `cookie`, `set-cookie`, `stripe-signature`, JWTs (`access_token`, `refresh_token`), enlaces con tokens de invitación/recuperación en claro, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `SENTRY_AUTH_TOKEN`. |
| **Datos financieros brutos** | Números de tarjeta (PAN), CVV/CVC, fechas de caducidad de tarjeta, datos bancarios/IBAN, cuerpos JSON completos de eventos Stripe (`customer_details`, `billing_details`). |
| **Cuerpos de comunicación** | Contenido HTML/texto de correos electrónicos con datos del destinatario o payloads raw de Resend. |

**Regla de logs estructurados (`stdout`):** Todo log de aplicación emite exclusivamente JSON con claves seguras permitidas: `timestamp_utc`, `level`, `correlation_id`, `module`, `action`, `actor_role`, `duration_ms`, `status_code`, `outcome`, más identificadores opacos (`event_id`, `registration_id`, `organization_id`) cuando aplique.

---

## 6. Política de Retención, Purga y Anonimización RGPD

### 6.1 Derechos de las Personas Interesadas (RGPD Arts. 15–21)

- **Acceso y Portabilidad (`AC-J03-05`):** El deportista autenticado puede exportar sus datos (`User`, `AthleteProfile`, `ConsentRecord`, `Favourite`, `Registration`, `RegistrationParticipant`, `Payment` resumen propio) en formato JSON estructurado desde `/perfil`. Exige sesión reciente (`auth_time <= 15 minutos`), rate limit estricto y registro en `AuditLog` (`GDPR_DATA_EXPORTED`).
- **Rectificación (`AC-J03-03`):** Edición autorizada en `/perfil` y revisión previa antes del pago en `/inscripciones/:eventId/revision`.
- **Supresión / Anonimización (`AC-J03-05` / `BR-01`):** Ejecutable desde `/perfil` tras confirmación explícita y sesión reciente (`auth_time <= 15 minutos`). Si existen inscripciones confirmadas para eventos futuros activos, la UI advierte explícitamente de las consecuencias operativas antes de confirmar.

### 6.2 Tabla Maestra de Retención y Anonimización por Entidad y Almacén

| Entidad / Almacén | Base jurídica principal (RGPD Art. 6) | Ventana de retención activa | Acción automática al vencer plazo | Acción ante solicitud verificada de borrado de cuenta (`AC-J03-05`) |
|---|---|---|---|---|
| `User` | Ejecución de contrato (6.1.b) | Mientras la cuenta esté activa | Revisión de inactividad prolongada post-V1 (`24 meses` con aviso previo) | Revocación total en Supabase Auth; reemplazo determinista de `email` por `deleted-<uuid>@anon.oak.invalid` (o `NULL`) y `deleted_at_utc = NOW()` |
| `AthleteProfile` | Ejecución de contrato (6.1.b) | Mientras la cuenta esté activa | Limpieza al cerrar cuenta | **Borrado / nulificación inmediata** de `full_name`, `birth_date`, `phone`, `emergency_contact_*`, `document_*` |
| `ConsentRecord` | Obligación legal / prueba de cumplimiento (6.1.c / Art. 7) | `5 años` desde última versión o revocación | Purga o desvinculación final tras prescripción legal | **Conservación del registro de consentimiento** (`purpose`, `consent_version`, `acted_at_utc`) ligado únicamente al `user_id` UUID anonimizado; cero PII asociada |
| `Organization` | Ejecución de contrato / interés legítimo (6.1.b / 6.1.f) | Mientras la organización opere o existan eventos/pagos asociados | Archivo lógico tras cierre de organización | No se borra por eliminación de un miembro individual; se bloquea dejar una organización activa sin `ORG_OWNER` |
| `OrganizationMembership` | Ejecución de contrato / seguridad (6.1.b / 6.1.f) | `INVITED`: `72 horas` token (`30 días` registro); `ACTIVE`/`REVOKED`: vida de la relación + auditoría | Expiración automática `INVITED -> REVOKED` a las `72h`; limpieza de `invited_email` a los `30 días` | Si `user_id` solicita borrado, pasa a `REVOKED` y limpia `invited_email` / `invitation_token_hash` |
| `Event`, `EventModality`, `PriceTier`, `EventMedia` | Ejecución de contrato (6.1.b) | Vida del evento + histórico de plataforma (`COMPLETED`/`CANCELLED`) | Archivo de `DRAFT` abandonados sin registros (`180 días` configurable) | Sin PII de atletas; no se eliminan al borrarse un deportista |
| `Favourite` | Ejecución de contrato / preferencia (6.1.b) | Mientras la cuenta esté activa | Purga al cerrar cuenta o cancelar evento antiguo | **Borrado físico (`DELETE`) inmediato** |
| `Registration` (`DRAFT` / expirada) | Ejecución de contrato (6.1.b) | `7 días` desde última edición (y reserva temporal `15 min` en `PENDING_PAYMENT`) | Expiración automática de reserva de cupo tras TTL y limpieza de borradores a los `30 días` | **Borrado físico (`DELETE`) inmediato** |
| `Registration` (`CONFIRMED` / `CANCELLED` / `REFUNDED`) | Ejecución de contrato + obligación contable (6.1.b / 6.1.c) | Plazo operativo + retención contable/fiscal aplicable en prod (`6 años` C. Comercio España cuando haya cobro real; purga bajo demanda en `staging`) | Anonimización de datos personales tras cierre de evento y ventana de reclamaciones | **Conservada sin PII directa (`BR-01`)** para mantener conteo de aforo, historial contable e invariantes de capacidad |
| `RegistrationParticipant` | Ejecución de contrato (6.1.b) | Hasta cierre del evento + ventana operativa/reclamaciones (`180 días` post-evento en V1) | Anonimización programada pasado el periodo operativo del evento | **Anonimización inmediata** de confirmadas/pasadas (`full_name = 'Participante Anonimizado'`, `email = NULL`, `birth_date = NULL`, `phone = NULL`, `emergency_contact = NULL`, `document_* = NULL`, `anonymized_at_utc = NOW()`); borrado físico si era `DRAFT` |
| `Payment` | Obligación legal/contable y prevención de fraude (6.1.c / 6.1.f) | Igual que `Registration` confirmada (test en V1: `180 días` en `staging`; contable legal en `producción` tras `D3`) | Archivado sin PII | **Conservada intacta sin PII (`BR-01`)**: solo `amount_cents`, `currency`, `status`, `provider_*_id` |
| `PaymentWebhookEvent` | Fiabilidad, idempotencia y prevención de fraude (6.1.f) | `180 días` | Purga de eventos antiguos ya conciliados | No contiene PII (payload sanitizado desde ingreso) |
| `CommunicationLog` | Ejecución de contrato / prueba de envío (6.1.b / 6.1.f) | `180 días` | Purga de metadatos expirados | Desvinculación/anonimización del destinatario (`recipient_user_id` apunta a usuario anonimizado; cero correo almacenado) |
| `AuditLog` | Seguridad, cumplimiento y trazabilidad (`AC-J08-02`, `BR-01`) | Mínimo `180 días` en V1 (hasta `3 años` para eventos críticos de seguridad/admin) | Rotación/archivo cifrado cumplido el plazo máximo | **Conservada íntegra (`BR-01`)**; nunca contiene PII directa |
| Logs JSON (`stdout`) | Operabilidad y seguridad (6.1.f) | `30 días` (`ADR-004`) | Rotación automática | Cero PII desde origen |
| Sentry (errores/trazas) | Fiabilidad de aplicación (6.1.f) | `30–90 días` según retención de proyecto | Expiración automática | Cero PII desde origen (`beforeSend` scrubber) |
| Backups PostgreSQL cifrados | Continuidad de negocio (`RPO <= 24h`) | `7–30 días` rotativos cifrados | Sobrescritura automática del ciclo rotativo | Limitación declarada: las copias históricas expiran al finalizar su ciclo; ante restauración (`<BACKUP_RESTORE_DRILL>` / incidente), se reaplica el registro de cuentas anonimizadas antes de reabrir tráfico |

