import { describe, expect, it } from "vitest"
import { coerceSeverity, coerceCount } from "./RoadMarker"

describe("coerceSeverity", () => {
  it("passes known enum values through", () => {
    expect(coerceSeverity("critical")).toBe("critical")
    expect(coerceSeverity("high")).toBe("high")
    expect(coerceSeverity("medium")).toBe("medium")
    expect(coerceSeverity("low")).toBe("low")
  })

  it("is case-insensitive", () => {
    expect(coerceSeverity("CRITICAL")).toBe("critical")
  })

  it("falls back to medium for anything else", () => {
    expect(coerceSeverity(null)).toBe("medium")
    expect(coerceSeverity('<img src=x onerror=alert(1)>')).toBe("medium")
    expect(coerceSeverity(123)).toBe("medium")
  })
})

describe("coerceCount", () => {
  it("returns safe non-negative integers", () => {
    expect(coerceCount(7)).toBe(7)
    expect(coerceCount("7")).toBe(7)
    expect(coerceCount("7.9")).toBe(7)
    expect(coerceCount(0)).toBe(0)
  })

  it("clamps negative and invalid values to zero", () => {
    expect(coerceCount(-3)).toBe(0)
    expect(coerceCount("abc")).toBe(0)
    expect(coerceCount(null)).toBe(0)
    expect(coerceCount("<script>alert(1)</script>")).toBe(0)
  })
})