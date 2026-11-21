# Evidencia P1-004 — Unificar arquitectura de información, rutas canónicas y nomenclatura `es-ES` V1

- **Task ID:** `P1-004`
- **Owner:** `ux-brand` (`BRUX`)
- **Peer Reviewer:** `qa-e2e`
- **Release Guardian:** `release-guardian`
- **Rama y base:** `feat/p1-004-ia-nomenclature` desde `master @ db0bfd9499cb32817e1b7a19fb2a76859a520f38` (sincronizada con `origin/master @ cdebd34cc0674f26e8d868437003862b88fb07dd`)
- **Candidate SHA:** `VER_GIT_REV_PARSE_HEAD (informado en handoff)`
- **Pull Request:** `PR #9 abierto en feat/p1-004-ia-nomenclature hacia master (Run ID y estado CLEAN informados en handoff; sin fusionar)`

## 1. Resultado observable y criterios cubiertos (`AC-01`..`AC-04`)

- **`AC-01` (Sitemap completo, rutas por rol y matrices responsive `320`/`768`/`1200`/`1440`):** `PASS` — `docs/brand/INFORMATION_ARCHITECTURE_AND_ROUTES.md` (§3–§4) define el sitemap unificado V1 y el contrato completo por ruta (`<title>`, `<h1>`, autorización `ANONYMOUS`/`ATHLETE`/`ORG_OWNER`/`ORG_MANAGER`/`ORG_VIEWER`/`INVITED`/`REVOKED`/`ADMIN` con MFA, redirecciones `302`/`403`/`404`, parámetros URL sin PII y breadcrumbs) cubriendo portal público (`/`, `/explorar`, `/retos/:eventSlug`), acceso/invitación (`/entrar`, `/registro`, `/recuperar-acceso`, `/pro/invitacion`), inscripción en 4 etapas + resultado (`/inscripciones/:eventId/{modalidad,datos,revision,pago,resultado}`), área deportista (`/mis-retos`, `/mis-retos/favoritos`, `/trayectoria`, `/perfil`), espacio `/pro` (7 rutas) y consola mínima acotada `/soporte` (`AC-J08`), junto con matrices responsive hasta `320 px` (`0` scroll horizontal, targets `>= 48x48 px`) y reglas `WCAG 2.2 AA`.
- **`AC-02` (Reconciliación frente a `BRAND_UX_CONTRACT.md` §9, exclusiones `D0` y glosario único `es-ES`):** `PASS` — `docs/brand/INFORMATION_ARCHITECTURE_AND_ROUTES.md` (§2 y §5) retira explícitamente el conmutador mapa/lista de `/explorar`, el dorsal digital/wallet/check-in, los wearables, la red social, el cronometraje y la gamificación avanzada; acota `/pro/eventos/:eventId/participantes` sin recogida de DNI/NIE/pasaporte ni documentos clínicos (`D1-09`); integra **Favoritos (`AC-J02-04`)** mediante acción contextual + `returnTo` interno seguro e idempotencia + vista dedicada propuesta `/mis-retos/favoritos` sin desplazar `Trayectoria`; y unifica el glosario `es-ES` y el copy transaccional específico prohibiendo etiquetas genéricas, iconos Unicode y encabezados mixtos activos.
- **`AC-03` (Frontera `D0` cerrado vs `PENDING_D1_APPROVAL` para `P1-012`):** `PASS` — Todas las propuestas abiertas sujetas a validación del usuario en `P1-012` (`D1-06` promesa/firma en inglés vs español, `D1-07` ruta de Favoritos `/mis-retos/favoritos` / ruta `/soporte` / conmutador `/pro`, `D1-08` Checkout externo vs embebido en 4 etapas, `D1-09` exclusión de documentos sensibles/salud, `D1-10` campos operativos detallados y `D1-11` librería SVG) quedan marcadas explícitamente como `PENDING_D1_APPROVAL`, sin auto-aprobar Gate `D1` ni alterar `D0`.
- **`AC-04` (Calidad, alcance, seguridad y CI PR):** `PASS` — Diff frente a `origin/master` acotado exclusivamente a los `5` `allowed_paths` con EOL `LF` y UTF-8 sin BOM, Prettier markdown (`--ignore-path .gitignore`) en `exit 0`, `9/9` checks locales base tras sync con `origin/master` en `exit 0` (`19` archivos lint con `0` warnings, `5` suites / `32/32` unit tests con `0` skips), corrección del UUID sintético de `trail-puentes-viejas-lozoya` (`40000000-0000-4000-8000-000000000001`) señalada en `PEER_REVIEW`, `19/19 MATCH` SHA-256 sobre `sites/**`, y `3/3` checks de GitHub Actions en `PASS` sobre PR `#9` (sin fusionar).

## 2. Seguridad, privacidad y accesibilidad

- `0` secretos y `0` PII real en todos los artefactos (`<SECRET_SCAN>` `PASS` con `secretlintFindingsCount=0` y `oakFindingsCount=0`; únicamente ejemplos sintéticos de `oak-seed.v1` y dominio RFC 2606 `@oak-demo.invalid`).
- `0` ocurrencias de los `8` términos ilustrativos prohibidos de los decks (`V1_SCOPE_AND_EXCLUSIONS.md` §5.3 / `assertNoBannedMockData()`).
- Política _fail-closed_ de validación de `returnTo` contra _open redirect_ (§3.5) preservando filtros deterministas de `/explorar` e intención idempotente de Favoritos, y prohibición explícita de PII en URLs o query strings.
- Requisitos estructurales `WCAG 2.2 AA` documentados para todos los dominios: enlace `Saltar al contenido`, landmarks únicos con `aria-label`, `h1` único, `aria-current`, operabilidad por teclado con `Escape` y retorno de foco, `48x48 px`, `320 px` sin scroll horizontal y zoom `200 %`.

## 3. Rollback y limitaciones

- **Impacto en BD / migraciones / código productivo:** Ninguno (entregable documental Fase 1).
- **Rollback verificado:** Cerrar el PR sin fusionar y eliminar la rama `feat/p1-004-ia-nomenclature` (o `git revert` vía PR si ya hubiera sido integrado), sin efectos colaterales sobre código, esquemas ni `sites/**`.

## 4. Riesgos residuales y desviaciones

- Ninguna desviación respecto al paquete `P1-004`.
- **Riesgos residuales:** (1) Ratificación de los ítems marcados como `PENDING_D1_APPROVAL` (`D1-06`..`D1-11`) por el usuario en `P1-012` antes de iniciar implementación productiva de UI en Fase 2+; (2) En host Windows local, `gitleaks` no está en `PATH` (`NOT_INSTALLED_IN_LOCAL_PATH`), mitigado mediante la ejecución obligatoria de `Gitleaks v8.30.1` en el workflow CI `SCA & Secret Scan (Gitleaks)` sobre el PR.
