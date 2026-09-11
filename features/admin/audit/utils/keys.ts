import type { AuditListQuery } from "../types"

export const adminAuditKeys = {
  all: () => ["admin", "audit"] as const,
  list: (query: AuditListQuery) => ["admin", "audit", "list", query] as const,
  actions: () => ["admin", "audit", "actions"] as const,
}
