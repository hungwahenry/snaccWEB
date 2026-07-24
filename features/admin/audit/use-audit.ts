"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listAuditLogs } from "./api"
import type { ListAuditParams } from "./types"

export function useAuditLogs(params: ListAuditParams) {
  return useQuery({
    queryKey: ["admin", "audit-logs", params],
    queryFn: () => listAuditLogs(params),
    placeholderData: keepPreviousData,
  })
}
