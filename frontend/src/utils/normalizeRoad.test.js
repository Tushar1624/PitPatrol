import { describe, expect, it } from "vitest"
import { normalizeRoad, normalizeRoads } from "./normalizeRoad"

describe("normalizeRoad", () => {
  it("normalizes a backend road into the domain model", () => {
    const raw = {
      id: "r-1",
      road_name: "Harbor Link",
      road_code: "HR-04",
      length_km: 12.5,
      status: "critical",
      inspection_status: "pending",
      issue_count: "7",
      severity: "critical",
      latitude: 40.74,
      longitude: -73.98,
      issue_types: ["pothole", "Pothole", "crack"],
      last_inspection: "2026-08-20",
    }
    const road = normalizeRoad(raw)
    expect(road.id).toBe("r-1")
    expect(road.name).toBe("Harbor Link")
    expect(road.code).toBe("HR-04")
    expect(road.lengthKm).toBe(12.5)
    expect(road.issueCount).toBe(7)
    expect(road.lat).toBe(40.74)
    expect(road.lng).toBe(-73.98)
    expect(road.issueTypes).toEqual(["pothole", "crack"])
  })

  it("deduplicates and canonicalizes issue types", () => {
    const raw = {
      id: "r-2",
      name: "X",
      lat: 1,
      lng: 2,
      issue_types: ["Pothole", "pothole", "surface deformation", "nonsense"],
    }
    expect(normalizeRoad(raw).issueTypes).toEqual(["pothole", "surface_damage"])
  })

  it("returns null for invalid coordinates", () => {
    expect(normalizeRoad({ id: "x", name: "y", lat: "abc", lng: 2 })).toBeNull()
    expect(normalizeRoad({ id: "x", name: "y", lat: NaN, lng: 2 })).toBeNull()
  })

  it("returns null for empty input", () => {
    expect(normalizeRoad(null)).toBeNull()
    expect(normalizeRoad(undefined)).toBeNull()
  })

  it("sanitizes severity/status to known enums", () => {
    const road = normalizeRoad({ id: "x", name: "y", lat: 1, lng: 2, status: "weird", severity: "EXTREME" })
    expect(road.status).toBe("fair")
    expect(road.severity).toBe("low")
  })
})

describe("normalizeRoads", () => {
  it("skips malformed records", () => {
    const items = [
      { id: "ok", name: "OK", lat: 1, lng: 1 },
      { id: "bad", name: "Bad", lat: "nope", lng: 1 },
      null,
      undefined,
    ]
    const result = normalizeRoads(items)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("ok")
  })

  it("returns an empty array for non-array input", () => {
    expect(normalizeRoads(null)).toEqual([])
    expect(normalizeRoads("x")).toEqual([])
  })
})