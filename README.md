# OAK — Base técnica inicial

> **Aviso de estado pre-producto:** Este repositorio se encuentra en **Fase 0 (`G0`, paquete `P0-004`)**. Las decisiones de alcance (`D0`) y contrato de marca/UX (`D1`) siguen pendientes de validación por parte del usuario, por lo que no existen todavía funcionalidades de producto (`J01`–`J08`), esquema SQL ni UI definitiva.

## Requisitos de entorno

- **Node.js:** `24.16.0` LTS (ver `.nvmrc`)
- **Corepack / pnpm:** `corepack` `0.35.0` activando `pnpm@10.34.9` (fijado en `packageManager`)
- **Política de dependencias:** Todas las versiones en `package.json` son exactas (`X.Y.Z`, sin rangos flotantes) y `.npmrc` aplica `save-exact=true`, `engine-strict=true`, `strict-peer-dependencies=true` y `auto-install-peers=true`.
- **Política CRLF/LF:** `.gitattributes` normaliza texto a `LF` y mantiene `sites/** -text` inmutable frente a `core.autocrlf=true` en Windows.

## Instalación desde clon limpio

```bash
corepack pnpm install --frozen-lockfile
```

Copia `.env.example` a `.env.local` si necesitas arrancar comprobaciones locales con entorno configurado (nunca guardes secretos reales en el repositorio ni habilites claves Stripe `sk_live_`/`pk_live_`).

## Comandos canónicos activos en Fase 0 (`G0`)

| Token              | Script / Comando                          | Salida máquina                           |
| ------------------ | ----------------------------------------- | ---------------------------------------- |
| `<INSTALL_LOCKED>` | `corepack pnpm install --frozen-lockfile` | `pnpm-lock.yaml`                         |
| `<FORMAT_CHECK>`   | `corepack pnpm run format:check`          | `reports/static/prettier.log`            |
| `<LINT>`           | `corepack pnpm run lint`                  | `reports/static/eslint.json`             |
| `<TYPECHECK>`      | `corepack pnpm run typecheck`             | `reports/static/tsc.log`                 |
| `<UNIT_TEST>`      | `corepack pnpm run test:unit`             | `reports/unit/junit.xml`                 |
| `<COVERAGE>`       | `corepack pnpm run test:coverage`         | `reports/coverage/coverage-summary.json` |
| `<BUILD>`          | `corepack pnpm run build`                 | `reports/build/next-build.log`           |
| `<SCA>`            | `corepack pnpm run security:sca`          | `reports/security/sca-audit.json`        |
| `<SECRET_SCAN>`    | `corepack pnpm run security:secrets`      | `reports/security/secret-scan.json`      |

## Comandos fail-closed de fases siguientes (`exit 2`)

Los 21 tokens canónicos restantes definidos en `docs/adr/ADR-002-canonical-commands-and-environments.md` (`test:integration`, `test:contract`, `db:migrate:fresh`, `db:migrate:previous`, `db:seed:check`, `test:e2e:critical`, `test:e2e:full`, `test:e2e:flake`, `test:a11y`, `test:a11y:manual-check`, `security:sast`, `security:dast`, `security:sbom`, `test:perf`, `test:load`, `deploy:preview`, `deploy:staging`, `test:smoke`, `ops:observability-check`, `ops:backup-restore-drill`, `ops:rollback-drill`) devuelven `FAIL_CLOSED_NOT_IMPLEMENTED` con código de salida `2` hasta la implementación de su paquete correspondiente.
