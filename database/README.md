# Database migrations

Migrations are forward-only SQL files named with a zero-padded sequence and a short description:

```text
001_initial_schema.sql
002_add_sessions.sql
```

Each migration must be reviewed with its ownership constraints and indexes. Phase 2 adds the PostgreSQL client boundary and `002_authentication.sql` for password hashes, sessions, and OAuth transaction state. Production execution still requires a migration lock and deployment credentials.

The database stores user metadata, account metadata, encrypted OAuth credentials, migration metadata, and audit metadata. It must never store user file contents.
