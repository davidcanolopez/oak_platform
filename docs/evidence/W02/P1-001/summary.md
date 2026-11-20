# Resumen de entrega P1-001 — Alcance definitivo V1, exclusiones y supuestos cerrados (`D0`)

- **Task ID:** `P1-001`
- **Owner funcional:** `analista-funcional` (especificación redactada)
- **Materialización y verificación técnica:** `documentacion-handoff`
- **Peer Reviewer asignado:** `orquestador-oak`
- **Guardian asignado:** `release-guardian`
- **Rama y base:** `feat/p1-001-v1-scope` desde `master @ 7082984e639f62653f1b46af53d1399b3d04ced0`
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD (informado en handoff)`
- **Pull Request:** `PR en feat/p1-001-v1-scope hacia master (URL y Run ID verificados en handoff tras gh pr checks)` (sin fusionar)

## 1. Alcance entregado y criterios cubiertos (`AC-01`..`AC-04`)

- **AC-01 (`D0 = APPROVED` + `44/44` AC):** `docs/product/V1_SCOPE_AND_EXCLUSIONS.md` traza al `100 %` la decisión `D0` (`2026-11-20`): Comunidad de Madrid, `trail` y `running`, Deportista + Organizador por invitación cerrada + Admin/Soporte `AC-J08`, web responsive `320 px..1440+ px` en `es-ES`, Stripe Checkout solo modo `test`, recomendaciones deterministas sin IA, **Favoritos (`AC-J02-04`) incluido en V1**, y matriz completa con los `44/44` IDs `AC-J01-01..AC-J08-04` (`33` P0 + `11` P1) más `NFR-01..NFR-09`.
- **AC-02 (`Out-of-Scope V1` + honestidad visual):** Catálogo explícito de `15` exclusiones (apps nativas, wearables, red social/mensajería, IA/ML, marketplace, cronometraje/GPX en vivo, mapa interactivo avanzado, dorsal digital/wallet, cupones/referidos/precios dinámicos, multiidioma/multimoneda, Stripe live/payouts/facturación, gamificación avanzada, waitlist/cesión, soporte completo y documentos sensibles/salud hasta `D1-09`), obligación de retirar controles simulados y lista explícita de prohibición de los `8` términos ilustrativos de decks (`BRAND_UX_CONTRACT.md` §1.4) con `0` usos como alcance activo.
- **AC-03 (Métricas, límites operativos y frontera `D0` vs `D1`):** Métricas cuantitativas de producto (`>= 5` deportistas / `>= 2` organizadores en `P6-007`, `>= 85 %` completitud), calidad (`G2`–`G6`), rendimiento `ADR-004` (`LCP <= 2,5 s`, `INP <= 200 ms`, `CLS <= 0,1`, `p95 <= 500 ms`), `WCAG 2.2 AA` y seguridad/`0` PII; límites operativos (`EUR` céntimos enteros, UTC + `Europe/Madrid`, TTL `15 min`/`7 días`, acceso cerrado organizadores, `D1-09` sin documentos de identidad sensibles); cierre de las `14` preguntas del apartado 4 para `P1-002..P1-008` y separación exacta entre `D0` (cerrado) y `D1-01..D1-14` (`PENDING USER VALIDATION` en `P1-012`).
- **AC-04 (Calidad base, CI PR y no contaminación):** Validado dentro de `allowed_paths`, con Prettier limpio sobre `docs/product/V1_SCOPE_AND_EXCLUSIONS.md`, `9/9` checks locales base en `exit 0`, `3/3` checks CI en verde sobre el PR hacia `master`, `19/19 MATCH` sobre `sites/**`, `44/44` IDs AC verificados y `0` PII/secretos.

## 2. Verificación técnica y controles ejecutados

- **Checks locales base (`9/9`):** `corepack pnpm install --frozen-lockfile`, `format:check`, `lint`, `typecheck`, `test:unit`, `test:coverage`, `build`, `security:sca`, `security:secrets` (`exit 0`, `0` warnings; ver `commands.txt`).
- **Controles documentales:** verificación automatizada de `44/44` IDs `AC-J01..AC-J08` y `9/9` `NFR`, `0` ocurrencias de términos mock de decks como alcance activo, `0` PII/correos fuera de `.invalid` y `19/19 MATCH` sobre `sites/**`.
- **CI GitHub Actions PR:** `Static Quality & Unit Tests`, `Production Build` y `SCA & Secret Scan (Gitleaks)` en `PASS` (`3/3`).

## 3. Riesgos residuales, rollback y siguiente estado

- **Riesgos residuales:** `RS-01` (regresión visual hacia mapa/dorsal/términos deck en `P1-004..P1-007`), `RS-02` (ítems `D1-08..D1-10` pendientes hasta `P1-012`), `RS-03` (guardias Stripe `live`/seed en `env.ts`), `RS-04` (contener `Favoritos` a marca privada idempotente).
- **Rollback:** Cerrar el PR sin fusionar y eliminar la rama `feat/p1-001-v1-scope` (o `git revert` vía PR si ya hubiera sido integrado), sin impacto en código, migraciones ni `sites/**`.
- **Estado solicitado:** `PEER_REVIEW` hacia `orquestador-oak`, previo a auditoría final de `release-guardian`.
