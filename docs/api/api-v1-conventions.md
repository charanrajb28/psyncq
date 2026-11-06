# API v1 conventions

All backend endpoints are versioned under `/api/v1`. The health endpoint is the only unversioned operational endpoint.

## Request conventions

- JSON request bodies use `Content-Type: application/json`.
- IDs are opaque strings to clients; clients must not infer database structure from them.
- Timestamps are ISO 8601 UTC strings.
- Pagination uses `page_size` and `page_token`.
- Mutating requests should accept an `Idempotency-Key` when the operation can be retried.
- The backend returns a `X-Request-Id` value for correlation.

## Success envelope

Single-resource responses use:

```json
{
  "data": {},
  "request_id": "req_01..."
}
```

Collections use:

```json
{
  "data": [],
  "next_page_token": null,
  "request_id": "req_01..."
}
```

## Error envelope

```json
{
  "error": {
    "code": "ACCOUNT_NOT_FOUND",
    "message": "The connected account could not be found.",
    "retryable": false,
    "details": {}
  },
  "request_id": "req_01..."
}
```

Messages must be safe to show to users. Stack traces, SQL errors, token values, and provider secrets belong only in protected server logs.

## Status codes

| Code | Meaning |
| --- | --- |
| 200 | Successful read or update |
| 201 | Resource created |
| 202 | Accepted for asynchronous work |
| 204 | Successful deletion with no body |
| 400 | Invalid request |
| 401 | Missing or expired authentication |
| 403 | Authenticated but not authorized |
| 404 | Resource not found or not visible to caller |
| 409 | Conflict or idempotency mismatch |
| 422 | Valid shape but rejected business rule |
| 429 | Rate limit exceeded |
| 500 | Unexpected server failure |
| 503 | Temporary dependency/provider failure |

