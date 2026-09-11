"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { MINUTE_MS } from "@/lib/duration"
import { listAuditActions, listAuditLogs } from "../api"
import type { AuditListQuery } from "../types"
import { actionOptions } from "../utils/audit"
import { adminAuditKeys } from "../utils/keys"

export function useAuditLogs(query: AuditListQuery) {
  return useQuery({
    queryKey: adminAuditKeys.list(query),
    queryFn: () => listAuditLogs(query),
    placeholderData: keepPreviousData,
  })
}

/** Every action the trail holds, as choices for the filter. */
export function useAuditActions() {
  const query = useQuery({
    queryKey: adminAuditKeys.actions(),
    queryFn: listAuditActions,
    staleTime: 5 * MINUTE_MS,
  })
  const actions = query.data

  return useMemo(
    () => ({ options: actionOptions(actions ?? []), loading: query.isPending }),
    [actions, query.isPending]
  )
}
