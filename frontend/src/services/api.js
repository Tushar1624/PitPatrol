import axios from "axios"
import { supabase } from "@/lib/supabase"

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"

/**
 * Normalized API error model.
 * Every backend error is mapped to a safe, user-facing category.
 */
export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN_ERROR", cause } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
    this.cause = cause
  }
}

const ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to the server.",
  TIMEOUT: "The request took too long. Please try again.",
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check the submitted information.",
  RATE_LIMITED: "Too many requests. Please try again shortly.",
  SERVER_ERROR: "The server encountered an error. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
}

function categorizeError(status) {
  switch (status) {
    case 0: return "NETWORK_ERROR"
    case 401: return "UNAUTHORIZED"
    case 403: return "FORBIDDEN"
    case 404: return "NOT_FOUND"
    case 409: return "VALIDATION_ERROR"
    case 422: return "VALIDATION_ERROR"
    case 429: return "RATE_LIMITED"
    default:
      if (status >= 500) return "SERVER_ERROR"
      return "UNKNOWN_ERROR"
  }
}

/**
 * Axios instance with:
 * - configurable base URL
 * - automatic Bearer token attachment from Supabase session
 * - reasonable timeout
 * - centralized error normalization
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
})

// Attach Supabase access token to every request.
apiClient.interceptors.request.use(async (config) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  } catch {
    // Session retrieval failed — request proceeds without auth header.
    // Backend will respond 401 if auth is required.
  }
  return config
})

// Normalize errors into ApiError.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    let status = 0
    let code = "UNKNOWN_ERROR"
    let message = "An unexpected error occurred."

    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      status = 0
      code = "TIMEOUT"
      message = ERROR_MESSAGES.TIMEOUT
    } else if (error.response) {
      status = error.response.status
      code = categorizeError(status)
      message =
        error.response.data?.message ||
        error.response.data?.detail ||
        ERROR_MESSAGES[code]

      // Session-expired handling: notify the auth layer so it clears
      // signed-in state and the ProtectedRoute redirects to /login.
      // Never retry automatically; no infinite loops.
      if (status === 401) {
        window.dispatchEvent(new CustomEvent("smartroad:session-expired"))
      }
    } else if (error.request) {
      status = 0
      code = "NETWORK_ERROR"
      message = ERROR_MESSAGES.NETWORK_ERROR
    }

    console.error(`[API] ${code} (${status}):`, message)

    return Promise.reject(
      new ApiError(message, { status, code, cause: error })
    )
  }
)

export { apiClient, ERROR_MESSAGES, categorizeError }
export default apiClient
