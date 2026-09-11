"use client"

import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { auditQuery } from "../utils/audit"
import { useAuditActions, useAuditLogs } from "./use-audit"

const FILTERS = {
  q: parseAsString.withDefault(""),
  action: parseAsString,
}

export function useAuditScreen() {
  const list = useListParams(FILTERS)
  const query = useAuditLogs(
    auditQuery({
      page: list.query.page,
      perPage: PAGE_SIZE,
      q: list.query.q,
      action: list.query.action,
    })
  )

  return { list, query, actions: useAuditActions() }
}
