/**
 * Normalize a backend report response into the frontend domain model.
 */
export function normalizeReport(raw) {
  if (!raw || typeof raw !== "object") return null

  return {
    id: String(raw.id ?? raw._id ?? ""),
    title: String(raw.title ?? raw.name ?? "Untitled report"),
    type: String(raw.type ?? raw.report_type ?? "Custom"),
    period: String(raw.period ?? raw.date_range ?? ""),
    totalIssues: Math.max(0, Number(raw.totalIssues ?? raw.total_issues ?? 0)),
    critical: Math.max(0, Number(raw.critical ?? raw.critical_issues ?? 0)),
    topIssue: String(raw.topIssue ?? raw.top_issue ?? "None"),
  }
}

export function normalizeReports(items) {
  if (!Array.isArray(items)) return []
  return items.map(normalizeReport).filter(Boolean)
}
