/**
 * MOCK — generated reports.
 * Replace with GET /api/reports (exports will be POST /api/reports/:id/export).
 */
export const reports = [
  {
    id: "rep-01",
    title: "Weekly maintenance summary — Harbor corridor",
    period: "Aug 17 – Aug 24, 2026",
    generatedAt: "2026-08-24",
    type: "Weekly",
    totalIssues: 34,
    critical: 5,
    topIssue: "Pothole",
  },
  {
    id: "rep-02",
    title: "Monthly network health report",
    period: "Jul 25 – Aug 24, 2026",
    generatedAt: "2026-08-23",
    type: "Monthly",
    totalIssues: 128,
    critical: 17,
    topIssue: "Crack",
  },
  {
    id: "rep-03",
    title: "Ring Road North incident review",
    period: "Aug 10 – Aug 18, 2026",
    generatedAt: "2026-08-19",
    type: "Incident",
    totalIssues: 21,
    critical: 4,
    topIssue: "Surface deformation",
  },
  {
    id: "rep-04",
    title: "Weekly maintenance summary — Airport expressway",
    period: "Aug 10 – Aug 17, 2026",
    generatedAt: "2026-08-17",
    type: "Weekly",
    totalIssues: 29,
    critical: 2,
    topIssue: "Lane marking wear",
  },
  {
    id: "rep-05",
    title: "Quarterly budget planning extract",
    period: "May – Jul 2026",
    generatedAt: "2026-08-01",
    type: "Custom",
    totalIssues: 402,
    critical: 38,
    topIssue: "Pothole",
  },
]

/** MOCK — aggregate metrics shown above the report list. */
export const reportSummary = [
  { label: "Reports available", value: 42 },
  { label: "Avg. issues / report", value: 31 },
  { label: "Most common issue", value: "Pothole", isText: true },
  { label: "Critical share", value: "9.4%" },
]
