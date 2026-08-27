import { normalizeIssueType } from "@/utils/issueTypes"

/**
 * Normalize a backend road response into the frontend domain model.
 * Components consume this stable shape — backend field names can change
 * without touching React components.
 */
export function normalizeRoad(raw) {
  if (!raw || typeof raw !== "object") return null

  const lat = Number(raw.lat ?? raw.latitude ?? raw.latITUDE)
  const lng = Number(raw.lng ?? raw.longitude ?? raw.lngITUDE)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null

  return {
    id: String(raw.id ?? raw._id ?? ""),
    name: String(raw.name ?? raw.road_name ?? "Unknown road"),
    code: String(raw.code ?? raw.road_code ?? ""),
    lengthKm: Number(raw.lengthKm ?? raw.length_km ?? raw.length ?? 0),
    status: coerceStatus(raw.status),
    inspectionStatus: coerceInspectionStatus(raw.inspectionStatus ?? raw.inspection_status),
    issueCount: Math.max(0, Math.floor(Number(raw.issueCount ?? raw.issue_count ?? raw.detection_count ?? 0))),
    severity: coerceSeverity(raw.severity),
    lat,
    lng,
    issueTypes: normalizeIssueTypeArray(raw.issueTypes ?? raw.issue_types ?? []),
    lastInspection: raw.lastInspection ?? raw.last_inspection ?? null,
  }
}

/**
 * Normalize an array of backend road objects.
 * Silently skips malformed records.
 */
export function normalizeRoads(items) {
  if (!Array.isArray(items)) return []
  return items.map(normalizeRoad).filter(Boolean)
}

function coerceSeverity(value) {
  const allowed = ["critical", "high", "medium", "low"]
  const v = String(value ?? "").toLowerCase()
  return allowed.includes(v) ? v : "low"
}

function coerceStatus(value) {
  const allowed = ["good", "fair", "poor", "critical"]
  const v = String(value ?? "").toLowerCase()
  return allowed.includes(v) ? v : "fair"
}

function coerceInspectionStatus(value) {
  const allowed = ["inspected", "pending", "overdue", "scheduled"]
  const v = String(value ?? "").toLowerCase()
  return allowed.includes(v) ? v : "pending"
}

function normalizeIssueTypeArray(items) {
  if (!Array.isArray(items)) return []
  return [...new Set(items.map(normalizeIssueType).filter((t) => t !== "other"))]
}
