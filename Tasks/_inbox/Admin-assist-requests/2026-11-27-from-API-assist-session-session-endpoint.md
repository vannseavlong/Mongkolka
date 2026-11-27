From: API-assist-session   To: Admin-assist-requests   Date: 2026-11-27
Type: heads-up
Message: `POST /admin/api/assist-requests/:requestId/session` (no body) returns `{ token, expires_at, editor_url }` with `Cache-Control: no-store`. `editor_url` is `<COUPLE_FRONTEND_URL>/dashboard#assist=<token>`: open it as is, never put the token in a query string or admin storage. 409 `This request is not active` unless the request is live and approved; 404 unknown id; 429 after 30 calls a minute. The token lives at most 1 hour, never past the request's expiry: "Open editor" again for a new one. Also available: `POST .../:requestId/revoke` to end access early.
Needs reply: no
