import apiClient from "@/services/api"
import { normalizeRoads, normalizeRoad } from "@/utils/normalizeRoad"

/**
 * Roads API — domain-level service functions.
 */
export const roadsApi = {
  async list({ signal, ...params } = {}) {
    const { data } = await apiClient.get("/roads", { params, signal })
    return {
      items: normalizeRoads(data?.items ?? data ?? []),
      total: data?.total ?? (data?.items ?? data ?? []).length,
      page: data?.page ?? 1,
      pageSize: data?.page_size ?? data?.items?.length ?? 20,
    }
  },

  async getById(id, { signal } = {}) {
    const { data } = await apiClient.get(`/roads/${id}`, { signal })
    return normalizeRoad(data)
  },
}
