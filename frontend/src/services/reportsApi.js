import apiClient from "@/services/api"

/**
 * Reports API — domain-level service functions.
 */
export const reportsApi = {
  async list({ signal, ...params } = {}) {
    const { data } = await apiClient.get("/reports", { params, signal })
    return {
      items: data?.items ?? data ?? [],
      total: data?.total ?? (data?.items ?? data ?? []).length,
    }
  },

  async export(id, { signal } = {}) {
    const { data } = await apiClient.get(`/reports/${id}/export`, {
      signal,
      responseType: "blob",
    })
    return data
  },
}
