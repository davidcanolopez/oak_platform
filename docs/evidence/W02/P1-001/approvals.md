# Aprobaciones P1-001

| Rol | Agente | Estado | SHA evaluado | Notas |
| --- | --- | --- | --- | --- |
| Owner funcional | `analista-funcional` (`PFA`) | Entregado (`PEER_REVIEW`) | `VER_GIT_REV_PARSE_HEAD` (rama `feat/p1-001-v1-scope`) | Especificación funcional `docs/product/V1_SCOPE_AND_EXCLUSIONS.md` redactada y trazada a `D0 = APPROVED`, `44/44` AC y `9/9` NFR |
| Materialización CLI/PR | `documentacion-handoff` | Entregado (`PEER_REVIEW`) | `VER_GIT_REV_PARSE_HEAD` (rama `feat/p1-001-v1-scope`) | Materialización en `allowed_paths`, verificación `9/9` checks locales base, controles documentales y apertura de PR hacia `master` (sin fusionar) |
| Peer Reviewer | `orquestador-oak` | PENDIENTE | - | Revisión independiente solicitada (`orquestador-oak` != `analista-funcional` y `documentacion-handoff`) |
| Release Guardian | `release-guardian` | PENDIENTE | - | Auditoría independiente requerida sobre checkout limpio y PR en verde antes de emitir `ACEPTADA` y autorizar merge |
