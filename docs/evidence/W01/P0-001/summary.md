# Evidencia P0-001 — Inventario de Artefactos y Línea Base Git

- **Task ID:** `P0-001`
- **Owner:** `orquestador-oak` (`SUP`)
- **Reviewer designado:** `documentacion-handoff`
- **Guardian:** `release-guardian`
- **Fecha UTC:** `2026-11-18T21:11:00Z`

## 1. Confirmación escrita de estado de aplicación

Se confirma por verificación directa del workspace que **no existe aplicación OAK previa a P0-001**:
- No existen `package.json`, lockfile (`pnpm-lock.yaml`, `package-lock.json`), `src/`, `app/`, código Next.js/React/TypeScript, tests automatizados, esquema SQL, migraciones, seeds, `CODEOWNERS`, ADRs ni pipeline CI/CD.
- Los directorios bajo `sites/oak-brand-deck/dist/` (`18` slides) y `sites/oak-web-design-deck/dist/` (`19` slides declaradas en `#total`, `23` etiquetas `<section`) son decks de presentación estáticos de referencia visual y permanecen intactos.
- `site-artifacts/` existe pero está vacío (`0` archivos).

## 2. Resumen de acciones ejecutadas en P0-001

1. Inventariado de los `56` archivos iniciales previos a `P0-001` y estado de herramientas locales en `docs/evidence/W01/P0-001/inventory.json` (sin PII ni emails personales).
2. Registro de hashes SHA-256 previos para los `19` archivos inmutables bajo `sites/oak-brand-deck/dist/**`, `sites/oak-brand-deck/.openai/hosting.json` y `sites/oak-web-design-deck/dist/**`.
3. Verificación (`0` objetos, `0` refs, `0` remotos) y retirada controlada del esqueleto `.git` anidado sin commits en `sites/oak-brand-deck/.git`.
4. Verificación posterior de los `19` hashes SHA-256 en `docs/evidence/W01/P0-001/sha256-sites.txt` con `19/19 MATCH`.
5. Creación de `.gitignore` inicial excluyendo `~$*`, `.env*` (salvo `.env.example`), artefactos de build/test en raíz y temporales, evitando ignorar `sites/**/dist/`.
6. Creación del commit baseline inicial en `master` y comprobación de `git ls-files --stage` (`0` gitlinks `160000`, `0` archivos `~$*` rastreados) más prueba de `git worktree` temporal limpio para habilitar Ola 1.

## 3. Riesgos residuales y limitaciones declaradas

- `G0` permanece en `FAIL` hasta completar `P0-002..P0-009` + `P0-011` y emitir `P0-010` (`release-guardian`).
- No existe remoto GitHub ni `gh`/`pnpm`/`docker`/`gitleaks` instalados localmente en el entorno inicial; `P0-003`..`P0-005` resolverán el tooling reproducible por ADR y escalarán el remoto si persiste ausente.
- `D0` permanece en `PENDING USER VALIDATION`.
