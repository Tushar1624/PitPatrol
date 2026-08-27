import apiClient from "@/services/api"

/**
 * Dashboard API — domain-level service functions.
 * Backend contract pending confirmation for most endpoints.
 */
export const dashboardApi = {
  async getSummary() {
    const { data } = await apiClient.get("/dashboard/summary")
    return data
  },
}
