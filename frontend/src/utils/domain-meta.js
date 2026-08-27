/**
 * Domain vocabulary + presentation metadata shared by pages, badges and filters.
 * When the backend arrives, these enums should be validated against its API.
 */

export const SEVERITIES = ["critical", "high", "medium", "low"]

export const SEVERITY_META = {
  critical: { label: "Critical", badgeVariant: "destructive" },
  high: { label: "High", badgeVariant: "warning" },
  medium: { label: "Medium", badgeVariant: "secondary" },
  low: { label: "Low", badgeVariant: "outline" },
}

export const ROAD_STATUSES = ["operational", "attention", "critical", "offline"]

export const ROAD_STATUS_META = {
  operational: { label: "Operational", badgeVariant: "success" },
  attention: { label: "Needs attention", badgeVariant: "warning" },
  critical: { label: "Critical", badgeVariant: "destructive" },
  offline: { label: "Offline", badgeVariant: "secondary" },
}

export const INSPECTION_STATUSES = ["passed", "scheduled", "overdue"]

export const INSPECTION_META = {
  passed: { label: "Inspected", badgeVariant: "success" },
  scheduled: { label: "Scheduled", badgeVariant: "secondary" },
  overdue: { label: "Overdue", badgeVariant: "warning" },
}

export const DETECTION_STATUSES = ["open", "in_review", "resolved"]

export const DETECTION_STATUS_META = {
  open: { label: "Open", badgeVariant: "warning" },
  in_review: { label: "In review", badgeVariant: "secondary" },
  resolved: { label: "Resolved", badgeVariant: "success" },
}

export const ISSUE_TYPES = [
  "Pothole",
  "Crack",
  "Lane marking wear",
  "Debris",
  "Surface deformation",
]

/** Maps any domain status/severity string to a Badge variant + label. */
export function metaFor(value) {
  return (
    SEVERITY_META[value] ??
    ROAD_STATUS_META[value] ??
    INSPECTION_META[value] ??
    DETECTION_STATUS_META[value] ?? { label: value, badgeVariant: "outline" }
  )
}
