import { normalizeIssueType } from "@/utils/issueTypes"

/**
 * Normalize a backend detection response into the frontend domain model.
 * Ensures stable shape regardless of backend field naming.
 */
export function normalizeDetection(raw) {
  if (!raw || typeof raw !== "object") return null

  const confidence = normalizeConfidence(raw.confidence)

  return {
    id: String(raw.id ?? raw._id ?? ""),
    className: String(raw.className ?? raw.class_name ?? raw.label ?? raw.type ?? "unknown"),
    issueType: normalizeIssueType(raw.className ?? raw.class_name ?? raw.label ?? raw.type),
    confidence,
    severity: coerceSeverity(raw.severity),
    status: coerceStatus(raw.status),
    road: String(raw.road ?? raw.road_name ?? ""),
    detectedAt: raw.detectedAt ?? raw.detected_at ?? raw.date ?? raw.created_at ?? "",
    bbox: normalizeBbox(raw.bbox ?? raw.bounding_box),
  }
}

/**
 * Normalize an array of detections.
 */
export function normalizeDetections(items) {
  if (!Array.isArray(items)) return []
  return items.map(normalizeDetection).filter(Boolean)
}

/**
 * Normalize confidence to a 0–100 percentage number.
 * Handles both 0.91 (0–1) and 91 (0–100) inputs.
 * Returns null for invalid values.
 */
export function normalizeConfidence(value) {
  if (value == null) return null
  const num = Number(value)
  if (!Number.isFinite(num)) return null
  // 0–1 scale (including the 0 and 1 boundaries → 0% and 100%)
  if (num >= 0 && num <= 1) return Math.round(num * 100)
  // 0–100 scale
  if (num > 1 && num <= 100) return Math.round(num)
  return Math.round(num)
}

/**
 * Normalize bounding box to { x, y, width, height } in 0–1 range.
 * Values outside 0–1 are clamped (safe fallback — never crashes).
 */
function normalizeBbox(raw) {
  if (!raw || typeof raw !== "object") return { x: 0, y: 0, width: 0, height: 0 }

  const x = Number(raw.x ?? raw.left ?? 0)
  const y = Number(raw.y ?? raw.top ?? 0)
  const width = Number(raw.width ?? raw.w ?? 0)
  const height = Number(raw.height ?? raw.h ?? 0)

  return {
    x: clamp(x),
    y: clamp(y),
    width: clamp(width),
    height: clamp(height),
  }
}

function clamp(value) {
  const num = Number(value)
  if (!Number.isFinite(num)) return 0
  return Math.max(0, Math.min(1, num))
}

function coerceSeverity(value) {
  const allowed = ["critical", "high", "medium", "low"]
  const v = String(value ?? "").toLowerCase()
  return allowed.includes(v) ? v : "medium"
}

function coerceStatus(value) {
  const allowed = ["pending", "reviewed", "dismissed", "confirmed", "new"]
  const v = String(value ?? "").toLowerCase()
  return allowed.includes(v) ? v : "new"
}
