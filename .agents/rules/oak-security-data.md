---
trigger: model_decision
description: "Use for authentication, authorization, database, PII, payments, webhooks, uploads, organizer tenancy or migrations."
---

# OAK security and data rule

Read `AGENTS.md`, the relevant ADRs and `docs/agentic/QUALITY_GATES.md` before implementation.

- Deny access by default and test athlete, organizer and cross-organization boundaries negatively.
- Minimize PII; never log it or place it in fixtures and screenshots.
- Use integer minor units for money, UTC storage, explicit event timezones and transactional capacity enforcement.
- Make payment and webhook handlers idempotent and auditable.
- Migrations need forward, backward-compatibility and rollback/restore evidence.
- Do not enable real payments or production mutations without user approval.

