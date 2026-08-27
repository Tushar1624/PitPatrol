# SMARTROAD AI — Frontend / Backend API Contract

> **Status: PENDING BACKEND CONFIRMATION**
> All endpoints below are the **contract the frontend expects**. They are NOT yet
> wired into the pages — pages currently render local mock data (`src/data/`).
> Replace `VITE_API_BASE_URL` in `.env.local` with the real backend URL when
> available. Endpoint paths + response shapes must be confirmed by the backend
> owner before wiring (`src/services/*.js` are ready to be used directly).

## Conventions

- Base URL: `VITE_API_BASE_URL` (fallback `/api`). Axios client: `src/services/api.js`.
- Auth: `Authorization: Bearer <supabase-access-token>` is attached to every
  request via the request interceptor. The backend must accept Supabase JWTs
  (or proxy them) and return `401` when the token is missing/expired.
- On `401`, the frontend dispatches `smartroad:session-expired`, clears auth
  state and redirects to `/login?expired=1`. It never retries automatically.
- Errors: any `4xx/5xx` is normalized to an `ApiError` with a user-safe message.
- Timeouts: standard requests 30s, upload-style requests 120s (with progress).

## Endpoints

All under `VITE_API_BASE_URL`. Responses shown are the contract shapes the
frontend normalizers accept (frontend also tolerates snake_case / alternate
field names — see `src/utils/`).

### `POST /detections/analyze` — `detectionsApi.analyze(file)`
Multipart form-data, field name `file` (image or video). Normalizer:
`src/utils/normalizeDetection.js`.

```
201/200 → {
  "id": "det-1",
  "class_name": "pothole_large",   // or className / label / type
  "confidence": 0.94,              // 0..1 or 0..100
  "severity": "critical",          // critical | high | medium | low
  "road_name": "Harbor Link",      // or road
  "detected_at": "2026-08-24T09:42:00Z",
  "bbox": { "left": 0.10, "top": 0.54, "width": 0.17, "height": 0.16 }
}
```

### `GET /detections` — `detectionsApi.list({ signal, ...query })`
List/`search` of detections (same shape as analyze result).

### `GET /detections/:id` — `detectionsApi.getById(id)`

### `GET /roads` — `roadsApi.list({ signal, ...query })`
→ `src/utils/normalizeRoad.js` (`normalizeRoads`).

```
200 → [
  {
    "id": "r-1",
    "road_name": "Harbor Link",
    "road_code": "HR-04",
    "length_km": 12.5,
    "issue_count": 7,
    "severity": "critical",
    "status": "pending",
    "latitude": 40.74,
    "longitude": -73.98
  }
]
```

### `GET /roads/:id` — `roadsApi.getById(id)`

### `GET /dashboard/summary` — `dashboardApi.getSummary()`
```
200 → {
  "total_km": 12.5,
  "road_count": 6,
  "critical_count": 2,
  "detection_count": 148,
  "average_issue_km": 12
}
```

### `GET /history` — `historyApi.list({ signal, ...query })`
Chronological list of detection events.

### `GET /reports` — `reportsApi.list({ signal, ...query })`
→ `src/utils/normalizeReport.js`.

```
200 → [
  {
    "id": "rep-1",
    "road": "Harbor Link",
    "issue": "Pothole",
    "severity": "critical",
    "status": "resolved",         // open | in_progress | resolved
    "raised": "2026-08-24",
    "resolved": null
  }
]
```

### `GET /reports/:id/export` — `reportsApi.export(id)`
Download (e.g. CSV/PDF).

### `GET /alerts` — `alertsApi.list({ signal, ...query })`
Array of `{ id, road, type, severity, message, created_at }`.

### Planned (not yet in service layer)
- `GET /dashboard/trend` → `{ "labels": ["Mon"], "values": [10] }` → Recharts series.
- `GET /dashboard/distribution` → `{ "pothole": 4, "crack": 3, ... }` using keys
  from `src/utils/issueTypes.js`.

## Open Contract Questions (for backend owner)

1. Pagination (offset/limit) on `/detections`, `/history`, `/reports`?
2. Failure shapes: `{ "message": string }` vs `{ "detail": string }` vs field
   error arrays (both `message` and `detail` are currently accepted).
3. Rate-limit response: does 429 include `Retry-After`?
4. Upload: is video processed synchronously or queued (job id + polling)?
5. CSV/PDF export MIME type and filename on `/reports/:id/export`.

## Security Rules

- Do NOT put secrets in `VITE_*` env vars. Only the public Supabase publishable
  key (`VITE_SUPABASE_PUBLISHABLE_KEY`) may ship to the browser.
- Supabase `service_role` key / backend API keys must never appear in frontend
  code or env files.