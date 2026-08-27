import apiClient from "@/services/api"
import { normalizeDetections } from "@/utils/normalizeDetection"

/**
 * History API — domain-level service functions.
 */
export const historyApi = {
  async list({ signal, ...params } = {}) {
    const { data } = await apiClient.get("/history", { params, signal })
    return {
      items: normalizeDetections(data?.items ?? data ?? []),
      total: data?.total ?? (data?.items ?? data ?? []).length,
      page: data?.page ?? 1,
      pageSize: data?.page_size ?? data?.items?.length ?? 20,
    }
  },
}
