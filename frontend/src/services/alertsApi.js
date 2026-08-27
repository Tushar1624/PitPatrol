import apiClient from "@/services/api"

/**
 * Alerts API — domain-level service functions.
 */
export const alertsApi = {
  async list({ signal, ...params } = {}) {
    const { data } = await apiClient.get("/alerts", { params, signal })
    return {
      items: data?.items ?? data ?? [],
      total: data?.total ?? (data?.items ?? data ?? []).length,
    }
  },
}
