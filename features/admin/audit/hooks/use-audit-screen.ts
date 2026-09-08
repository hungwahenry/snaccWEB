"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import type { ListAuditParams } from "../types"
import { useAuditLogs } from "./use-audit"

export function useAuditScreen() {
  const { params, patch } = useListState<ListAuditParams>({
    page: 1,
    perPage: 30,
  })
  return { params, patch, query: useAuditLogs(params) }
}
