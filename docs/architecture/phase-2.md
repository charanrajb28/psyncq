# Phase 2 — Authentication and secure backend

Phase 2 establishes the security boundary before Google Drive is connected.

## Implemented

- PostgreSQL migration for password hashes, sessions, and OAuth transaction state.
- Node `scrypt` password hashing with random salts and constant-time verification.
- Opaque 256-bit session tokens stored only as SHA-256 hashes in PostgreSQL.
- HttpOnly, SameSite session cookie with production Secure flag.
- Registration, login, current-user, refresh, and logout endpoints.
- User-safe response envelopes and request IDs.
- Production configuration validation helpers.

## Endpoints

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

## Deployment requirements

Run migration `002_authentication.sql` against the target PostgreSQL database before enabling these endpoints. Set `DATABASE_URL`, `APP_ENV`, and production secret values in Vercel. Do not use a development database from a production deployment.

Google OAuth transaction records are prepared here; Google authorization and encrypted refresh-token storage are implemented in Phase 3.
