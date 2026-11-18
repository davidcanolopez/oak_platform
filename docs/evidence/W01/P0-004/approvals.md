# Aprobaciones P0-004

| Rol | Agente | Estado | SHA evaluado | Notas |
|---|---|---|---|---|
| Owner | `devops-release` | Entregado (`PEER_REVIEW`) | Ver commit candidato en `feat/p0-004-app-bootstrap` | Entregados `.nvmrc`, `.npmrc`, `.gitattributes`, `.gitignore`, `.github/CODEOWNERS`, `.env.example`, `package.json`, `pnpm-lock.yaml`, scripts CI/seguridad, scaffold mínimo en `src/`, unit tests (`100%` cobertura), `9/9` comandos G0 en verde, `21/21` comandos fail-closed (`exit 2`), `19/19` SHA-256 `sites/**` |
| Peer Reviewer 1 | `backend-datos` | PENDIENTE | - | Revisión independiente solicitada (`env.ts`, scripts seguridad/CI, `package.json`/`pnpm-lock.yaml`, fronteras arquitectura) |
| Peer Reviewer 2 | `frontend` | PENDIENTE | - | Revisión independiente solicitada (`layout.tsx`, `page.tsx`, `globals.css`, `tokens.css`, no contaminación D1/`sites/**`) |
| Release Guardian | `release-guardian` | PENDIENTE | - | Verificación independiente sobre checkout limpio tras Peer Review |
