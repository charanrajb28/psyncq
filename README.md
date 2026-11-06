# PSyncQ

PSyncQ is a frontend-first multi-cloud file manager. Phase 1 establishes the Flutter application shell, responsive dashboard, authentication/onboarding surfaces, backend boundary, and PostgreSQL migration foundation.

## Current milestone

Phase 0 governance is complete and Phase 1 foundation is in progress. Google OAuth, real file operations, refresh-token handling, and provider integrations are intentionally represented by interfaces and mock data until the secure backend work in Phase 2 is implemented.

## Repository layout

```text
apps/flutter_app/   Flutter application
backend/            TypeScript/Vercel function foundation
database/migrations/ PostgreSQL schema migrations
docs/               Architecture and setup notes
```

## Local setup

1. Install Flutter 3.24+ and enable the targets you need.
2. From `apps/flutter_app`, run `flutter pub get`.
3. Run `flutter analyze` and `flutter test`.
4. Copy `.env.example` to `.env` for future backend configuration. No secrets belong in the Flutter app.

### Flutter frontend

```powershell
cd apps/flutter_app
flutter pub get
flutter run -d chrome
```

Android and Windows runners are included. Use `flutter devices` to see available targets.

### Backend

```powershell
cd backend
npm install
npm run typecheck
```

The health function is available as `/api/health` when deployed through Vercel. OAuth, database access, and credential encryption remain Phase 2 work; no secrets should be added to this repository.

### Verification

From the repository root, run `powershell -ExecutionPolicy Bypass -File .\scripts\verify.ps1`. Phase 0 conventions are documented in `docs/governance/phase-0.md`, `docs/api/api-v1-conventions.md`, `docs/security/security-baseline.md`, and `docs/development/environments.md`.

## Product guardrails

- Refresh tokens never reach Flutter.
- Large file contents will move directly between the device and the provider.
- SQLite is a cache and operation database, never the authoritative ledger.
- The ledger is tamper-evident and recoverable, not advertised as absolutely immutable.
- Google Drive is the first provider; other providers come later.
