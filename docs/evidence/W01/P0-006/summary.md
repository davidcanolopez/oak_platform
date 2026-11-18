# Evidencia P0-006 — Clasificación de Datos, Mapa de Flujos y Threat Model Inicial

- **Task ID:** `P0-006`
- **Owner:** `arquitecto-seguridad` (`SEC` / `ARCH`)
- **Reviewer designado:** `auditor-no-funcional`
- **Guardian:** `release-guardian`
- **Rama:** `feat/p0-006-security-threat-model`
- **Base SHA:** `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7`
- **Commit candidato:** `COMMIT_EN_FEAT_P0_006` (ver hash completo de `git rev-parse HEAD` reportado en el handoff de entrega)
- **Fecha UTC:** `2026-11-18T21:55:00Z`

## 1. Alcance entregado

Se han creado los artefactos de seguridad y privacidad exigidos para contribuir al cierre de `G0` y servir de contrato normativo para el diseño de esquema (`P2-002`), dataset sintético (`P0-009` / `P2-003`), QA (`P0-007` / `P1-010`) e integraciones (`P4-005..P4-010`):

1. [`docs/security/DATA_CLASSIFICATION_RETENTION.md`](../../../security/DATA_CLASSIFICATION_RETENTION.md):
   - Taxonomía de 6 niveles de sensibilidad (`Pública`, `Interna`, `Confidencial`, `PII`, `Financiera/Pago`, `Secreto`).
   - Reglas transversales no negociables: importes en enteros menores (`céntimos` de `EUR`), marcas temporales en UTC (`TIMESTAMPTZ`) con zona horaria explícita en `Event`, cifrado en tránsito y reposo, tokens de un solo uso hasheados en SHA-256, alcance PCI SAQ A y bloqueos `D1-09` (`BRAND_UX_CONTRACT.md §1.4 y §10.4`).
   - Clasificación detallada campo a campo de las **16/16 entidades mínimas** de `MASTER_EXECUTION_PLAN.md §7.3` (`User`, `AthleteProfile`, `ConsentRecord`, `Organization`, `OrganizationMembership`, `Event`, `EventModality`, `PriceTier`, `EventMedia`, `Favourite`, `Registration`, `RegistrationParticipant`, `Payment`, `PaymentWebhookEvent`, `CommunicationLog`, `AuditLog`).
   - Prohibición explícita de PII, credenciales, tokens y payloads financieros brutos en logs JSON `stdout`, Sentry (`beforeSend`), `AuditLog`, fixtures (`P0-009`) y capturas/evidencias.
   - Tabla completa de retención, purga y anonimización RGPD por entidad y almacén, preservando `Registration`/`Payment`/`AuditLog` sin PII directa tras borrado verificado de cuenta (`BR-01`, `AC-J03-05`).
2. [`docs/security/DATA_FLOW_MAP.md`](../../../security/DATA_FLOW_MAP.md):
   - Inventario de los `6` actores (`A1` Anónimo, `A2` Atleta, `A3` Organizador `ACTIVE`, `A4` Admin MFA, `A5` Proveedores Externos, `A6` SRE) y `8` almacenes/canales (`DS-01..DS-08`).
   - Diagrama Mermaid `flowchart LR` validado estructuralmente (subgrafos cerrados, nodos etiquetados con comillas y sin etiquetas HTML) conectando zonas no confiables, monolito modular Next.js, capa de datos Supabase (`Auth`, `PostgreSQL 17 + FORCE RLS`, `Storage`) y proveedores externos (`Stripe Checkout modo test`, `Resend sandbox`, `Sentry + Logs JSON`).
   - Matriz de las `6` fronteras de confianza (`TB-01..TB-06`) y `15` flujos por cruce (`DF-01..DF-15`) con sus controles obligatorios.
3. [`docs/security/THREAT_MODEL.md`](../../../security/THREAT_MODEL.md):
   - Inventario de `10` activos críticos (`AS-01..AS-10`).
   - Matriz STRIDE / OWASP Top 10 con `17` amenazas identificadas (`TM-01..TM-17`), severidad (`CRITICAL`/`HIGH`), controles preventivos/detectivos, `6` alertas operativas (`AL-01..AL-06`), owner y gate objetivo.
   - Catálogo trazable de **`17` pruebas negativas de seguridad obligatorias (`NT-01..NT-17`)** cubriendo IDOR cross-tenant, IDOR cross-athlete y escalada intra-tenant, sobreventa de última plaza por condición de carrera, replay/firma inválida/desorden en webhook Stripe, manipulación de precio en cliente, CSV formula injection, enumeración en auth/invitaciones/drafts, fuga de secretos y guardias `sk_live_`/seed prod, XSS/SVG Storage, CSRF/sesión en `localStorage`, rate-limit/capacity hoarding, fuga de PII en logs/Sentry/`AuditLog`, abuso `ADMIN`/impersonación silenciosa, bypass de máquina de estados y acceso directo `UI -> tablas`, desacoplamiento de fallo Resend y re-autenticación RGPD.

## 2. Trazabilidad de Criterios de Aceptación (`P0-006`)

| AC | Resultado | Evidencia verificada |
|---|---|---|
| `AC-01` | **PASS (candidato a revisión)** | `DATA_CLASSIFICATION_RETENTION.md` clasifica las `16/16` entidades mínimas de `§7.3`, prohíbe PII/documentos/tokens/payloads en logs/Sentry/`AuditLog`/fixtures/capturas y define tabla de retención y anonimización RGPD (`BR-01`, `BR-02`). |
| `AC-02` | **PASS (candidato a revisión)** | `DATA_FLOW_MAP.md` mapea todas las fronteras exigidas (anónimo, atleta, organizador, admin/soporte, webhook Stripe, correo sandbox Resend, Sentry y Storage) y `THREAT_MODEL.md` cubre `TM-01..TM-17` y `NT-01..NT-17` con mitigación, alerta, owner y test negativo obligatorio. |
| `AC-03` | **PASS (candidato a revisión)** | Escaneo reproducible Python sobre `docs/security/**`, `docs/evidence/W01/P0-006/**` y `docs/agentic/packets/P0-006.md` verifica `0` credenciales, `0` tokens reales y `0` PII/emails reales (`commands.txt`). |

## 3. Verificación reproducible ejecutada y Rollback

- **Verificación automatizada (`python -c ...`):** `16/16` entidades clasificadas, `100%` amenazas obligatorias cubiertas (`TM-01..TM-17` y `NT-01..NT-17`), diagrama Mermaid válido (`flowchart LR`, `4` subgrafos balanceados, `0` etiquetas HTML) y `0` hallazgos de PII/emails fuera de RFC 2606/secretos (`exit 0`, salida completa en [`commands.txt`](commands.txt)).
- **Limpieza de rama aislada:** Retirados de este workspace los archivos untracked de paquetes paralelos (`P0-002.md`, `P0-003.md`, `P0-007.md`), manteniendo intactos `docs/agentic/packets/P0-001.md` (rastreado en `87f92a1`), `docs/agentic/packets/P0-006.md` y únicamente archivos dentro de `allowed_paths`.
- **Rollback documentado:** Descartar la rama `feat/p0-006-security-threat-model` antes de integrar o revertir el commit en `master` mediante `git revert <sha>` reabriendo `P0-008` y `P0-009` si ya dependieran de estos contratos.

## 4. Riesgos residuales y limitaciones declaradas

- **Pre-código (`G0`):** Al no existir todavía `src/`, migraciones SQL ni pipeline CI (`P0-004`/`P0-005`/`P2-002+`), las pruebas negativas `NT-01..NT-17` quedan especificadas como requisitos obligatorios verificables en `G2`–`G6` y no ejecutadas contra runtime todavía.
- **Herramientas en host Windows (`P0-001`):** `gitleaks` y `docker` no están disponibles en el host local inicial; la ejecución en CI Linux (`P0-005`) habilitará `<SECRET_SCAN>` con `gitleaks` + `secretlint` y DB PostgreSQL efímera para `G3`.
- **Bloqueos pendientes de `D1`:** La recogida de documentos de identidad (`DNI`/`NIE`/`pasaporte`), reglas de edad/menores, salud (excluida en V1) y flujos de cancelación/reembolso/lista de espera permanecen bloqueados hasta validación en Gate `D1` (`BRAND_UX_CONTRACT.md §10.4` y `§15.1`).
- **Backups históricos cifrados:** Ante una restauración (`<BACKUP_RESTORE_DRILL>`), debe reaplicarse el registro de cuentas anonimizadas para mantener cumplimiento RGPD Art. 17.
- **Revisión independiente pendiente:** `auditor-no-funcional` (Peer Review) y `release-guardian` (G0) aún deben validar este paquete en checkout limpio.

