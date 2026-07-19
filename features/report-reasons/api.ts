import { api } from "@/lib/api/client"
import type { AdminReportReason, CreateReasonInput, UpdateReasonInput } from "./types"

export function listReasons() {
  return api.get<AdminReportReason[]>("/admin/report-reasons")
}

export function createReason(input: CreateReasonInput) {
  return api.post<AdminReportReason>("/admin/report-reasons", input)
}

export function updateReason(id: string, input: UpdateReasonInput) {
  return api.patch<AdminReportReason>(`/admin/report-reasons/${id}`, input)
}

export function retireReason(id: string) {
  return api.post<AdminReportReason>(`/admin/report-reasons/${id}/retire`)
}

export function unretireReason(id: string) {
  return api.post<AdminReportReason>(`/admin/report-reasons/${id}/unretire`)
}
