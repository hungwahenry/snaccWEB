import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AdminReport, ListReportsParams, ResolveReportInput } from "./types"

export function listReports(params: ListReportsParams) {
  return api.get<Paginated<AdminReport>>("/admin/reports", params as QueryParams)
}

export function resolveReport(input: ResolveReportInput) {
  return api.post<unknown>("/admin/reports/resolve", input)
}
