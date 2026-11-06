# Logging and error handling

Every backend request should have a request ID. Logs are structured JSON where possible and contain:

```json
{
  "timestamp": "2026-11-05T10:30:00.000Z",
  "level": "info",
  "service": "psyncq-api",
  "request_id": "req_01...",
  "route": "/api/v1/accounts",
  "event": "account.listed",
  "duration_ms": 42
}
```

Use `warn` for recoverable provider failures and `error` for unexpected failures. Never log access tokens, refresh tokens, cookies, encryption keys, authorization headers, file contents, or full database connection strings.

The client maps API error codes to user-facing messages and preserves the request ID for support diagnostics.

