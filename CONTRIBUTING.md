# Contributing to PSyncQ

## Change workflow

1. Create a branch from `main` using `phase/<name>` or `fix/<name>`.
2. Keep a change focused on one milestone or bug.
3. Update the relevant documentation and tests in the same change.
4. Run the checks in `scripts/verify.ps1` before opening a pull request.
5. Use a milestone commit after a phase acceptance gate passes.

Do not commit `.env` files, credentials, OAuth tokens, generated build output, or provider file contents.

## Commit style

Use imperative, scoped messages:

```text
feat(auth): add session boundary
fix(files): preserve provider account identity
docs(phase-0): document API conventions
```

## Review requirements

- Security-sensitive changes need an explicit threat-model note.
- Database changes require a forward migration and rollback considerations.
- Provider changes require capability and error-path tests.
- User-visible changes require loading, empty, error, and offline states where applicable.

