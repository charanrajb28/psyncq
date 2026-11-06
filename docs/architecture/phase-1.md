# Phase 1 foundation

The Flutter client owns presentation and, in later phases, direct provider file transfer. The backend is the security and identity boundary. This separation keeps file contents out of the central service and makes provider adapters replaceable.

## Current state

- Responsive Flutter shell with sign-in/register preview and dashboard preview.
- Navigation placeholders for the major product areas.
- Mocked authentication only; no credentials are persisted.
- Vercel-compatible health function placeholder.
- Initial PostgreSQL schema for users, connected accounts, and encrypted OAuth credentials.

## Next phase

Implement sessions, OAuth state/PKCE transactions, AES-256-GCM credential encryption, KMS key wrapping, and ownership checks before connecting Google Drive.

