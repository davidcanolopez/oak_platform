# Aprobaciones P0-004

| Rol | Agente | Estado | SHA evaluado | Notas |
|---|---|---|---|---|
| Owner | `devops-release` | Entregado (`PEER_REVIEW` v2) | Ver commit candidato en `feat/p0-004-app-bootstrap` | Resueltos `[BLK-01]` (`.trim()` y `rk_live_` en `env.ts` + tests negativos), `[OBS-01]` (cifras exactas `37/37` líneas, `23/23` ramas, `38/38` sentencias, `9/9` funciones) y `[OBS-02]` (`@electric-sql/pglite` restringido en dominio) sobre ronda 1 (`d84fedd1534c74cf43306d74727fb60f407bcf5d`) |
| Peer Reviewer 1 | `backend-datos` | PENDIENTE (re-revisión) | - | Ronda 1 `FAIL` sobre `d84fedd` por `[BLK-01]` y observaciones `[OBS-01]`/`[OBS-02]`; solicitada re-revisión independiente tras corrección |
| Peer Reviewer 2 | `frontend` | PENDIENTE (re-confirmación) | - | Ronda 1 `PASS` sobre `d84fedd`; solicitada confirmación tras fix en `env.ts`/`eslint.config.mjs` |
| Release Guardian | `release-guardian` | PENDIENTE | - | Verificación independiente sobre checkout limpio tras Peer Review |
