import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type { AuditListQuery, AuditLog } from "../types"

export function listAuditLogs(query: AuditListQuery) {
  return api.get<Paginated<AuditLog>>("/admin/audit-logs", query)
}

export function listAuditActions() {
  return api.get<string[]>("/admin/audit-logs/actions")
}
