import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  AdminReport,
  AdminReportDetail,
  ReportListQuery,
  ResolveReportInput,
} from "../types"

export function listReports(query: ReportListQuery) {
  return api.get<Paginated<AdminReport>>("/admin/reports", query)
}

export function getReport(id: string) {
  return api.get<AdminReportDetail>(`/admin/reports/${id}`)
}

export function resolveReport(input: ResolveReportInput) {
  return api.post<unknown>("/admin/reports/resolve", input)
}
