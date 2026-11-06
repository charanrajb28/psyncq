# PSyncQ backend foundation

The backend will host Vercel Functions for identity, OAuth transactions, encrypted credential storage, and short-lived access-token issuance. Phase 1 keeps this boundary explicit without implementing OAuth or database access.

The backend must never return refresh tokens, encryption keys, or OAuth client secrets to Flutter.

Phase 2 adds PostgreSQL-backed authentication at `/api/v1/auth/*`. Configure `DATABASE_URL`, then run `npm run db:migrate` from this directory before using registration or login in a deployed environment. The runner uses a PostgreSQL advisory lock and records applied migrations in `schema_migrations`.
