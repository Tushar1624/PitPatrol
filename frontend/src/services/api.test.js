import { describe, expect, it } from "vitest"
import { categorizeError, ERROR_MESSAGES } from "./api"

describe("categorizeError", () => {
  it("maps HTTP status codes to error categories", () => {
    expect(categorizeError(0)).toBe("NETWORK_ERROR")
    expect(categorizeError(401)).toBe("UNAUTHORIZED")
    expect(categorizeError(403)).toBe("FORBIDDEN")
    expect(categorizeError(404)).toBe("NOT_FOUND")
    expect(categorizeError(422)).toBe("VALIDATION_ERROR")
    expect(categorizeError(429)).toBe("RATE_LIMITED")
    expect(categorizeError(500)).toBe("SERVER_ERROR")
    expect(categorizeError(503)).toBe("SERVER_ERROR")
    expect(categorizeError(409)).toBe("VALIDATION_ERROR")
    expect(categorizeError(418)).toBe("UNKNOWN_ERROR")
  })
})

describe("ERROR_MESSAGES", () => {
  it("does not leak raw internals to users", () => {
    // Messages are human-safe, no stack traces or technical detail.
    for (const message of Object.values(ERROR_MESSAGES)) {
      expect(message).toMatch(/^[A-Z]/)
      expect(message).not.toMatch(/at .*\.js|stack|traceback|node_modules/)
    }
  })

  it("provides a friendly message for expired sessions", () => {
    expect(ERROR_MESSAGES.UNAUTHORIZED).toContain("session has expired")
  })
})