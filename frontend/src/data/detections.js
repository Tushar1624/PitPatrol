import { ISSUE_TYPES } from "@/utils/domain-meta"

/**
 * MOCK — detection records, series and alerts.
 * Replace with GET /api/detections, GET /api/detections/trend,
 * GET /api/detections/severity-distribution and GET /api/alerts.
 */

const ROADS = [
  "Independence Ave",
  "Ring Road North",
  "University Boulevard",
  "Harbor Link",
  "Cedar Street",
  "Industrial Bypass",
  "Market Square Road",
  "Airport Expressway",
  "Riverside Drive",
  "Old Town Tunnel Rd",
]

const SEVERITIES = ["critical", "high", "medium", "low"]
const STATUSES = ["open", "in_review", "resolved"]

/** Deterministic generator so renders are stable between reloads. */
function buildDetections(count) {
  const detections = []
  const baseDate = new Date("2026-08-24T09:00:00")
  for (let index = 0; index < count; index += 1) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - Math.floor(index * 0.9))
    date.setHours(6 + ((index * 5) % 12), (index * 17) % 60)
    detections.push({
      id: `det-${String(index + 101).padStart(3, "0")}`,
      detectedAt: date.toISOString().slice(0, 10),
      road: ROADS[index % ROADS.length],
      issueType: ISSUE_TYPES[index % ISSUE_TYPES.length],
      confidence: 99 - ((index * 7) % 30),
      severity: SEVERITIES[index % SEVERITIES.length],
      status: STATUSES[index % STATUSES.length],
      source: index % 4 === 0 ? "video" : "image",
    })
  }
  return detections
}

export const detections = buildDetections(26)

/** MOCK — detections per day for the trend chart. */
export const detectionTrend = [
  { date: "Aug 11", detections: 28, critical: 2 },
  { date: "Aug 12", detections: 34, critical: 1 },
  { date: "Aug 13", detections: 25, critical: 3 },
  { date: "Aug 14", detections: 41, critical: 2 },
  { date: "Aug 15", detections: 38, critical: 4 },
  { date: "Aug 16", detections: 22, critical: 0 },
  { date: "Aug 17", detections: 19, critical: 1 },
  { date: "Aug 18", detections: 33, critical: 2 },
  { date: "Aug 19", detections: 45, critical: 5 },
  { date: "Aug 20", detections: 52, critical: 3 },
  { date: "Aug 21", detections: 47, critical: 2 },
  { date: "Aug 22", detections: 36, critical: 1 },
  { date: "Aug 23", detections: 40, critical: 3 },
  { date: "Aug 24", detections: 31, critical: 2 },
]

/** MOCK — severity share of all detections. */
export const severityDistribution = [
  { name: "Critical", value: 17, colorKey: "chart-3" },
  { name: "High", value: 46, colorKey: "chart-2" },
  { name: "Medium", value: 88, colorKey: "chart-1" },
  { name: "Low", value: 61, colorKey: "chart-4" },
]

/** MOCK — detections grouped by issue type (used on Reports). */
export const issueTypeDistribution = [
  { type: "Pothole", count: 412 },
  { type: "Crack", count: 358 },
  { type: "Lane marking wear", count: 247 },
  { type: "Surface deformation", count: 158 },
  { type: "Debris", count: 89 },
]

/** MOCK — active critical road alerts. */
export const criticalAlerts = [
  {
    id: "alr-01",
    road: "Harbor Link",
    message: "Deep pothole cluster near the freight lane, km 4.1.",
    severity: "critical",
    raisedAt: "2026-08-24",
  },
  {
    id: "alr-02",
    road: "Old Town Tunnel Rd",
    message: "Surface deformation expanding inside the tunnel segment.",
    severity: "critical",
    raisedAt: "2026-08-23",
  },
  {
    id: "alr-03",
    road: "Industrial Bypass",
    message: "Sensor node offline — inspection overdue by 27 days.",
    severity: "high",
    raisedAt: "2026-08-22",
  },
]

/**
 * MOCK — RF-DETR inference result for the DetectionViewer.
 * Shape mirrors the planned POST /api/detections response.
 *
 * bbox values are NORMALIZED (0–1) relative to the source image:
 *   x, y        top-left corner
 *   width,height box size
 * The overlay multiplies them by 100 into an SVG viewBox of 0 0 100 100,
 * so boxes stay aligned at any rendered image size.
 * className uses raw model-style names on purpose to exercise the
 * configurable class resolver in utils/detection-classes.js.
 */
export const detectionResult = {
  id: "res-mock-001",
  modelName: "RF-DETR (mock)",
  imageUrl: "road-sample", // resolved to the bundled sample asset by DetectionViewer
  capturedAt: "2026-08-24T09:42:00Z",
  road: "Harbor Link",
  detections: [
    { id: "det-001", className: "pothole_large", confidence: 0.94, severity: "critical", bbox: { x: 0.1, y: 0.54, width: 0.17, height: 0.16 } },
    { id: "det-002", className: "Crack", confidence: 0.87, severity: "medium", bbox: { x: 0.45, y: 0.29, width: 0.18, height: 0.11 } },
    { id: "det-003", className: "surface_damage_zone", confidence: 0.81, severity: "high", bbox: { x: 0.575, y: 0.59, width: 0.21, height: 0.17 } },
    { id: "det-004", className: "road_obstruction", confidence: 0.91, severity: "high", bbox: { x: 0.76, y: 0.375, width: 0.145, height: 0.185 } },
  ],
}

/**
 * MOCK — result shape for VIDEO uploads.
 * The viewer plays the uploaded file itself; these boxes describe the
 * sampled frame the mock model "analysed". Same planned endpoint as above.
 */
export const detectionResultVideo = {
  id: "res-mock-002",
  modelName: "RF-DETR (mock · video)",
  mediaKind: "video",
  imageUrl: "uploaded-media", // resolved to the local object URL of the upload
  capturedAt: "2026-08-24T10:15:00Z",
  road: "Ring Road North",
  detections: [
    { id: "det-v01", className: "pothole", confidence: 0.9, severity: "high", bbox: { x: 0.12, y: 0.52, width: 0.16, height: 0.15 } },
    { id: "det-v02", className: "linear_crack", confidence: 0.83, severity: "medium", bbox: { x: 0.44, y: 0.31, width: 0.19, height: 0.1 } },
    { id: "det-v03", className: "debris", confidence: 0.78, severity: "low", bbox: { x: 0.7, y: 0.6, width: 0.14, height: 0.13 } },
  ],
}
