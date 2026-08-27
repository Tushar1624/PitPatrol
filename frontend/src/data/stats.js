/**
 * MOCK — dashboard statistics.
 * Replace with GET /api/dashboard/summary without changing UI components:
 * the shape below mirrors the intended API response.
 */
export const dashboardStats = {
  totalRoads: 48,
  roadsInspected: 39,
  totalDetections: 1264,
  criticalIssues: 17,
  deltas: {
    roadsInspected: { value: "+4", direction: "up", positive: true },
    totalDetections: { value: "+12%", direction: "up", positive: false },
    criticalIssues: { value: "-3", direction: "down", positive: true },
  },
}
