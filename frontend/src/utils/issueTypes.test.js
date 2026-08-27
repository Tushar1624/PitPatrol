import { describe, expect, it } from "vitest"
import {
  normalizeIssueType,
  getIssueTypeLabel,
  ISSUE_TYPES,
} from "./issueTypes"

describe("normalizeIssueType", () => {
  it("maps backend snake_case values to canonical keys", () => {
    expect(normalizeIssueType("surface_damage")).toBe("surface_damage")
    expect(normalizeIssueType("longitudinal_crack")).toBe("crack")
    expect(normalizeIssueType("lane_marking_fading")).toBe("fading")
  })

  it("maps human-readable variants to the same canonical key", () => {
    expect(normalizeIssueType("Surface Damage")).toBe("surface_damage")
    expect(normalizeIssueType("surface deformation")).toBe("surface_damage")
    expect(normalizeIssueType("surface-damage")).toBe("surface_damage")
    expect(normalizeIssueType("Pothole")).toBe("pothole")
  })

  it("is case- and whitespace-insensitive", () => {
    expect(normalizeIssueType("  POTHOLE  ")).toBe("pothole")
    expect(normalizeIssueType("crack")).toBe("crack")
  })

  it("returns 'other' for unknown or missing values", () => {
    expect(normalizeIssueType("unknown_thing")).toBe("other")
    expect(normalizeIssueType("")).toBe("other")
    expect(normalizeIssueType(null)).toBe("other")
    expect(normalizeIssueType(undefined)).toBe("other")
    expect(normalizeIssueType(123)).toBe("other")
  })
})

describe("getIssueTypeLabel", () => {
  it("returns a readable label for known types", () => {
    expect(getIssueTypeLabel("pothole")).toBe("Pothole")
    expect(getIssueTypeLabel("surface_damage")).toBe("Surface damage")
  })

  it("falls back to the raw key for unknown types", () => {
    expect(getIssueTypeLabel("weird_key")).toBe("weird_key")
  })
})

describe("ISSUE_TYPES", () => {
  it("contains all canonical types", () => {
    expect(ISSUE_TYPES).toContain("pothole")
    expect(ISSUE_TYPES).toContain("crack")
    expect(ISSUE_TYPES.length).toBeGreaterThanOrEqual(5)
  })
})