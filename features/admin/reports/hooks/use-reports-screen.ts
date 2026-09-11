"use client"

import { parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useSuspensionChoices } from "@/features/admin/suspension-reasons/hooks/use-suspension-reasons"
import { STATUS_FILTERS, statusQuery, TARGET_TYPES } from "../utils/status"
import { useReportActions, useReports } from "./use-reports"

const FILTERS = {
  status: parseAsStringLiteral(STATUS_FILTERS).withDefault("open"),
  target: parseAsStringLiteral(TARGET_TYPES),
}

export function useReportsScreen() {
  const list = useListParams(FILTERS)
  const query = useReports({
    page: list.query.page,
    perPage: PAGE_SIZE,
    status: statusQuery(list.query.status),
    targetType: list.query.target ?? undefined,
  })

  return {
    list,
    query,
    actions: useReportActions(),
    suspension: useSuspensionChoices(),
  }
}
