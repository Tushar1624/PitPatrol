import { describe, expect, it } from "vitest"
import { normalizeConfidence, normalizeDetection } from "./normalizeDetection"

describe("normalizeConfidence", () => {
  it("converts 0–1 scale to percentage (0–100)", () => {
    expect(normalizeConfidence(0.91)).toBe(91)
    expect(normalizeConfidence(0.57)).toBe(57)
  })

  it("keeps 0–100 scale values unchanged", () => {
    expect(normalizeConfidence(91)).toBe(91)
    expect(normalizeConfidence(45)).toBe(45)
  })

  it("never double-scales", () => {
    expect(normalizeConfidence(91)).toBe(91)
    expect(normalizeConfidence(0.91)).toBe(91)
    expect(normalizeConfidence(91)).not.toBe(9100)
  })

  it("handles boundary values", () => {
    expect(normalizeConfidence(1)).toBe(100)
    expect(normalizeConfidence(0)).toBe(0)
    expect(normalizeConfidence(100)).toBe(100)
  })

  it("returns null for invalid values", () => {
    expect(normalizeConfidence(null)).toBeNull()
    expect(normalizeConfidence(undefined)).toBeNull()
    expect(normalizeConfidence("abc")).toBeNull()
    expect(normalizeConfidence(NaN)).toBeNull()
  })
})

describe("normalizeDetection", () => {
  it("normalizes a backend detection into the domain model", () => {
    const raw = {
      id: "abc-1",
      class_name: "pothole_large",
      confidence: 0.94,
      severity: "critical",
      road_name: "Harbor Link",
      detected_at: "2026-08-24T09:42:00Z",
      bbox: { left: 0.1, top: 0.54, width: 0.17, height: 0.16 },
    }
    const detection = normalizeDetection(raw)
    expect(detection.id).toBe("abc-1")
    expect(detection.issueType).toBe("pothole")
    expect(detection.confidence).toBe(94)
    expect(detection.severity).toBe("critical")
    expect(detection.road).toBe("Harbor Link")
    expect(detection.bbox).toEqual({ x: 0.1, y: 0.54, width: 0.17, height: 0.16 })
  })

  it("clamps bounding boxes to the 0–1 range", () => {
    const raw = {
      id: "x",
      className: "crack",
      confidence: 0.8,
      bbox: { x: 2, y: -1, width: 3, height: 4 },
    }
    const detection = normalizeDetection(raw)
    expect(detection.bbox.x).toBe(1)
    expect(detection.bbox.y).toBe(0)
    expect(detection.bbox.width).toBe(1)
    expect(detection.bbox.height).toBe(1)
  })

  it("handles missing bounding box without crashing", () => {
    const raw = { id: "y", className: "pothole", confidence: 0.5 }
    const detection = normalizeDetection(raw)
    expect(detection.bbox).toEqual({ x: 0, y: 0, width: 0, height: 0 })
  })

  it("coerces unknown severity to a safe default", () => {
    const raw = { id: "z", className: "pothole", confidence: 0.5, severity: "angry" }
    expect(normalizeDetection(raw).severity).toBe("medium")
  })

  it("returns null for empty input", () => {
    expect(normalizeDetection(null)).toBeNull()
    expect(normalizeDetection(undefined)).toBeNull()
  })
})