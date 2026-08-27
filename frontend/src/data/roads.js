/**
 * MOCK — monitored road segments.
 * Replace with GET /api/roads.
 * lat/lng are placeholder coordinates around a fictional city centre;
 * swap them for real geocoded segments during backend integration.
 */
export const roads = [
  { id: "r-01", name: "Independence Ave", code: "IND-12", status: "operational", inspectionStatus: "passed", issueCount: 2, severity: "low", lastInspection: "2026-08-21", lengthKm: 4.2, lat: 40.735, lng: -74.002, issueTypes: ["Crack"] },
  { id: "r-02", name: "Ring Road North", code: "RRN-04", status: "attention", inspectionStatus: "scheduled", issueCount: 6, severity: "high", lastInspection: "2026-08-18", lengthKm: 9.8, lat: 40.752, lng: -73.978, issueTypes: ["Pothole", "Crack"] },
  { id: "r-03", name: "University Boulevard", code: "UNB-07", status: "operational", inspectionStatus: "passed", issueCount: 1, severity: "low", lastInspection: "2026-08-22", lengthKm: 3.1, lat: 40.767, lng: -73.962, issueTypes: ["Debris"] },
  { id: "r-04", name: "Harbor Link", code: "HBL-02", status: "critical", inspectionStatus: "overdue", issueCount: 11, severity: "critical", lastInspection: "2026-08-05", lengthKm: 6.5, lat: 40.718, lng: -74.018, issueTypes: ["Pothole", "Damaged surface"] },
  { id: "r-05", name: "Cedar Street", code: "CDS-19", status: "operational", inspectionStatus: "passed", issueCount: 0, severity: "low", lastInspection: "2026-08-23", lengthKm: 1.7, lat: 40.741, lng: -73.989, issueTypes: [] },
  { id: "r-06", name: "Industrial Bypass", code: "IBP-11", status: "offline", inspectionStatus: "overdue", issueCount: 8, severity: "high", lastInspection: "2026-07-28", lengthKm: 12.4, lat: 40.706, lng: -73.945, issueTypes: ["Crack", "Lane marking wear"] },
  { id: "r-07", name: "Market Square Road", code: "MSR-03", status: "attention", inspectionStatus: "scheduled", issueCount: 4, severity: "medium", lastInspection: "2026-08-15", lengthKm: 2.3, lat: 40.748, lng: -74.011, issueTypes: ["Pothole"] },
  { id: "r-08", name: "Airport Expressway", code: "APX-01", status: "operational", inspectionStatus: "passed", issueCount: 3, severity: "medium", lastInspection: "2026-08-20", lengthKm: 15.6, lat: 40.774, lng: -73.94, issueTypes: ["Surface deformation"] },
  { id: "r-09", name: "Riverside Drive", code: "RVD-08", status: "operational", inspectionStatus: "passed", issueCount: 1, severity: "low", lastInspection: "2026-08-24", lengthKm: 5.0, lat: 40.729, lng: -73.972, issueTypes: ["Crack"] },
  { id: "r-10", name: "Old Town Tunnel Rd", code: "OTT-05", status: "critical", inspectionStatus: "overdue", issueCount: 9, severity: "critical", lastInspection: "2026-07-30", lengthKm: 3.8, lat: 40.713, lng: -73.995, issueTypes: ["Damaged surface", "Pothole"] },
]

/** MOCK — per-segment health scores for the dashboard overview. */
export const roadHealthSegments = [
  { name: "Harbor Link", score: 41 },
  { name: "Old Town Tunnel Rd", score: 48 },
  { name: "Industrial Bypass", score: 55 },
  { name: "Ring Road North", score: 67 },
  { name: "Airport Expressway", score: 82 },
  { name: "Independence Ave", score: 91 },
]

export const overallRoadHealth = 74
