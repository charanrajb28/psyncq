# Environment configuration

The repository contains `.env.example` templates only. Copy values into the appropriate local or Vercel environment; do not commit the resulting files.

## Backend variables

| Variable | Development | Staging/production |
| --- | --- | --- |
| `APP_ENV` | `development` | `staging` or `production` |
| `DATABASE_URL` | Local/test PostgreSQL | Aiven environment-specific URL |
| `SESSION_SECRET` | Local random value | Vercel secret |
| `GOOGLE_CLIENT_ID` | Development OAuth client | Environment-specific client |
| `GOOGLE_CLIENT_SECRET` | Local untracked value | Vercel secret |
| `GOOGLE_REDIRECT_URI` | Local callback | Exact deployed callback |
| `GCP_KMS_KEY_NAME` | Test key or emulator strategy | Production KMS key |

Flutter receives public configuration only. It must not receive `DATABASE_URL`, `SESSION_SECRET`, `GOOGLE_CLIENT_SECRET`, KMS identifiers that reveal sensitive infrastructure, or refresh tokens.

