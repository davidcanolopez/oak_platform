# Evidencia P0-009 — Dataset Sintético Versionado y Cuentas Demo sin PII Real

- **Task ID:** `P0-009`
- **Owner:** `backend-datos`
- **Peer Reviewers:** `arquitecto-seguridad`, `qa-e2e`
- **Release Guardian:** `release-guardian`
- **Rama:** `feat/p0-009-synthetic-dataset`
- **Base SHA:** `fc8ff5107bcbd2b8735d55588120525f3fbdcd2f`
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD` (commit candidato en `feat/p0-009-synthetic-dataset` reportado en el handoff)
- **Fecha UTC:** `2026-11-19T07:22:00Z`

## 1. Resultado observable y criterios cubiertos

1. **Artefactos entregados dentro de `allowed_paths`:**
   - [`data/fixtures/oak-seed.v1.json`](../../../../data/fixtures/oak-seed.v1.json): dataset determinista con UUIDs fijos (`2` organizaciones madrileñas, `5` membresías cubriendo `ACTIVE`/`INVITED`/`REVOKED`, `8` cuentas demo bajo `@oak-demo.invalid`, `12` eventos `trail`/`running` en municipios de la Comunidad de Madrid cubriendo `DRAFT`/`PUBLISHED`/`CLOSED`/`CANCELLED`/`COMPLETED`, `14` modalidades con `remainingSpots=0` agotado, `remainingSpots=1` última plaza y capacidad normal, `16` `priceTiers` en céntimos enteros `EUR` incluyendo modalidad gratuita `0 EUR` y multi-tier, `2` favoritos, `9` inscripciones y `7` pagos `stripe_test` en todos sus estados).
   - [`data/fixtures/schema.ts`](../../../../data/fixtures/schema.ts): esquema Zod estricto (`syntheticDatasetSchema`), `validateSyntheticDataset(raw)`, `assertNoBannedMockData(raw)` y `buildValidationReport(dataset)` cumpliendo `eslint.config.mjs` (`security` + `@microsoft/sdl`) y TypeScript `strict`.
   - [`tests/unit/fixtures.test.ts`](../../../../tests/unit/fixtures.test.ts): `8` suites de prueba positivas y negativas en Vitest (determinismo, importes decimales/negativos/no-EUR, timestamps sin `Z` UTC o zona horaria distinta de `Europe/Madrid`, correos fuera de `.invalid`, datos prohibidos del deck con y sin tildes, IDs/slugs duplicados, conteos `!= 12` o `!= 2`, disciplina fuera de `trail`/`running`, municipio fuera de Madrid y ausencia de casos límite `0` plazas / `1` última plaza / `0 EUR` gratuito / `INVITED` / `athlete-new` vacío / pago `SUCCEEDED`).
   - [`docs/data/SYNTHETIC_DATASET.md`](../../../../docs/data/SYNTHETIC_DATASET.md): catálogo completo de organizaciones, eventos, matriz de estados límite, tabla de cuentas demo sintéticas sin credenciales y contrato de idempotencia para `P2-003`.
   - [`docs/evidence/W01/P0-009/validation-report.json`](validation-report.json): informe determinista generado desde `validateSyntheticDataset` sobre `oak-seed.v1.json` y formateado con Prettier.
2. **Trazabilidad de criterios:**
   - `AC-01`: **PASS (pendiente de revisión independiente)** — `oak-seed.v1.json` pasa `validateSyntheticDataset` verificando exactamente `2` organizaciones, `12` eventos `trail`/`running` en la Comunidad de Madrid, `5` estados de evento, `0`/`1`/normal plazas, `EUR` céntimos enteros (incl. `0 EUR`), UTC `Z` + `Europe/Madrid` y cuentas demo `@oak-demo.invalid` ([`validation-report.json`](validation-report.json)).
   - `AC-02`: **PASS (pendiente de revisión independiente)** — Los **9 checks activos G0** ejecutados tras la última edición (`install --frozen-lockfile`, `format:check`, `lint`, `typecheck`, `test:unit`, `test:coverage`, `build`, `security:sca`, `security:secrets`) terminan con `exit 0`, `0` warnings (`eslint_files=18 errors=0 warnings=0`), `20/20` tests en `PASS`, `100 %` cobertura en `src/` (`37/37` líneas, `23/23` ramas, `38/38` sentencias, `9/9` funciones), `0` hallazgos en `secret-scan` y `0` términos del deck ([`commands.txt`](commands.txt)).
   - `AC-03`: **PASS (pendiente de revisión independiente)** — `tests/unit/fixtures.test.ts` demuestra el rechazo determinista de mutaciones con precio decimal/negativo/no-EUR, fecha sin `Z` UTC, email fuera de `.invalid`, `David Cano`/`Trail del Robledal`/`10K Madrid Río`/`oak.run`/`Explorer`/`Pathfinder`, ID/slug duplicado, conteo incorrecto, disciplina ciclismo, municipio fuera de Madrid y ausencia de casos límite.

## 2. Seguridad, privacidad y accesibilidad

- `0` secretos, `0` contraseñas, `0` tokens reales y `0` PII real confirmados en código, JSON, tests, documentación y evidencias (`corepack pnpm run security:secrets` -> `PASS`, `findings=0`).
- El `100 %` de los correos del dataset usa el dominio reservado RFC 2606 `@oak-demo.invalid` y la lista negativa prohíbe explícitamente constantes de los decks (`BRAND_UX_CONTRACT.md §1.4`).
- Pruebas negativas de aislamiento cubiertas a nivel de fixture: cuentas separadas para Org 1 vs Org 2 (incluyendo `DRAFT` en ambas organizaciones), membresía `INVITED` (`userId: null`), `REVOKED` y `ORG_VIEWER`, más `athlete-nuevo-sin-retos` con `0` inscripciones/favoritos.
- Accesibilidad: `NO_APLICA` en `P0-009` (artefactos JSON, esquema Zod y pruebas unitarias sin interfaz UI).

## 3. Rendimiento, migración y rollback

- Build de producción `next build` limpio (`exit 0`, Turbopack `16.4.6`).
- Migraciones SQL y carga en PostgreSQL real: `NO_APLICA` en Fase 0 (contrato de idempotencia transaccional y guardas de entorno documentados en [`SYNTHETIC_DATASET.md`](../../../../docs/data/SYNTHETIC_DATASET.md) §6 para `P2-003`).
- **Rollback:** Descartar la rama `feat/p0-009-synthetic-dataset` antes del merge a `master` o revertir mediante `git revert <sha>` si ya estuviera integrada.

## 4. Riesgos residuales y desviaciones

- **Sin desviaciones de alcance (`allowed_paths`):** Retirado únicamente el archivo *untracked* ajeno `docs/agentic/packets/P0-005.md` del worktree de rama.
- **Riesgos y limitaciones residuales:**
  1. La ejecución idempotente sobre PostgreSQL real (`<SEED_IDEMPOTENCY_CHECK>`) permanece fail-closed (`exit 2`) hasta `P2-002`/`P2-003`; en `P0-009` la idempotencia se verifica por UUIDs/slugs deterministas fijos y doble validación pura.
  2. `gitleaks` y `docker` no están preinstalados en el host Windows local (`P0-001`); `<SECRET_SCAN>` ejecuta `secretlint@14.0.1` + reglas deterministas OAK en local y `gitleaks` se suma en CI Linux (`P0-005`).
  3. Persisten `4` avisos `moderate` en dependencias transitivas de dev-tools (`esbuild`/`lhci`/`storybook`), con `0` `High` y `0` `Critical` (`security:sca` -> `PASS`).
  4. Pendiente revisión independiente de `arquitecto-seguridad` y `qa-e2e` (`PEER_REVIEW`) y verificación de `release-guardian` (`G0`/`G1`/`G2` base).

