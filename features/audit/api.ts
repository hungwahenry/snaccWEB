import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AuditLog, ListAuditParams } from "./types"

export function listAuditLogs(params: ListAuditParams) {
  return api.get<Paginated<AuditLog>>("/admin/audit-logs", params as QueryParams)
}
