# Security baseline

## Secrets

Secrets are supplied through Vercel environment variables or local untracked `.env` files. They are never placed in Dart assets, source control, logs, API responses, or crash reports.

## Authentication and authorization

- Every protected endpoint authenticates the caller before loading resources.
- Every resource query includes the authenticated user ID.
- Account IDs from the client are never trusted without an ownership check.
- OAuth state is single-use, short-lived, and bound to the initiating session.
- Refresh tokens remain encrypted in the backend credential store.

## Data handling

- PostgreSQL contains metadata and encrypted credentials only.
- File contents move directly between the device and the cloud provider.
- Logs must redact authorization headers, cookies, tokens, email addresses where unnecessary, and file contents.
- Public sharing is an explicit user action and must use the provider-generated URL.

## Release checklist

- Run dependency audit and review findings.
- Confirm production secrets are separate from staging and development.
- Confirm database backups and restore procedure.
- Confirm OAuth redirect URIs are exact and environment-specific.
- Confirm no refresh token appears in Flutter network state or compiled assets.

