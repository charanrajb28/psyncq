# Phase 3 — Google OAuth and connected accounts

Phase 3 adds Google account connection without sending refresh tokens to Flutter.

## Implemented

- Google OAuth authorization URL with offline access and PKCE S256.
- Short-lived, single-use OAuth transaction records.
- AES-256-GCM encryption for OAuth token bundles using `TOKEN_ENCRYPTION_KEY`.
- Google profile lookup and connected-account upsert.
- Account listing and disconnect.
- Short-lived Google access-token issuance and backend refresh.

## Required configuration

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and an exact `GOOGLE_REDIRECT_URI` in Vercel. The redirect URI must match the Google Cloud OAuth client configuration exactly. Set a 32-byte base64 `TOKEN_ENCRYPTION_KEY` for development; production should replace this environment-key fallback with Cloud KMS wrapping before release.

The default scope is `drive.metadata.readonly` plus OpenID profile scopes. This supports account identity and metadata listing. File-write scopes must be evaluated and added deliberately in the next Drive-provider phase.

