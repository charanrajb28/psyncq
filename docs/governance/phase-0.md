# Phase 0 governance

Phase 0 defines the boundaries that every later phase must follow.

## Ownership boundaries

Flutter owns presentation, local cache/index state, transfer orchestration, and direct provider file transfer. Vercel owns identity, OAuth transactions, credential encryption, short-lived access-token issuance, and metadata APIs. PostgreSQL stores metadata only; it never stores user file contents.

## Environments

There are three logical environments:

| Environment | Purpose | Data policy |
| --- | --- | --- |
| development | Local implementation and tests | Disposable local/test data |
| staging | Integration and release candidate validation | Synthetic or explicitly approved test accounts |
| production | Real users | Backups, audit logs, least privilege |

Each environment has separate OAuth credentials, database credentials, KMS key versions, and Vercel configuration. Never point development Flutter builds at production by accident.

## Phase gates

A phase is complete only when its acceptance criteria, tests, documentation, and deployment notes are complete. A phase must not silently implement features assigned to a later phase.

## Non-negotiable guardrails

- Refresh tokens and KMS material never reach Flutter.
- Large file contents do not pass through Vercel.
- Sources are not deleted before migration verification and commit.
- SQLite is a cache and operation database, never the authoritative ledger.
- Client-reported ledger history is distinct from backend-verified checkpoints.
- Google Drive is the first provider; additional providers wait until the core workflow is reliable.

