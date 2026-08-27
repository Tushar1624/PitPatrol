import apiClient from "@/services/api"
import { normalizeDetections, normalizeDetection } from "@/utils/normalizeDetection"

/**
 * Detection API — domain-level service functions.
 */
export const detectionsApi = {
  async list({ signal, ...params } = {}) {
    const { data } = await apiClient.get("/detections", { params, signal })
    return {
      items: normalizeDetections(data?.items ?? data ?? []),
      total: data?.total ?? (data?.items ?? data ?? []).length,
      page: data?.page ?? 1,
      pageSize: data?.page_size ?? data?.items?.length ?? 20,
    }
  },

  async getById(id, { signal } = {}) {
    const { data } = await apiClient.get(`/detections/${id}`, { signal })
    return normalizeDetection(data)
  },

  async analyze(file, { signal, onUploadProgress } = {}) {
    const formData = new FormData()
    formData.append("file", file)
    const { data } = await apiClient.post("/detections/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
      signal,
      onUploadProgress,
    })
    return {
      ...data,
      detections: normalizeDetections(data?.detections ?? []),
    }
  },
}
