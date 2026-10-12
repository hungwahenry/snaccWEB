"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { STATUS_FILTERS, statusQuery, statusTabs } from "../utils/status"
import { useAds, useAdStats } from "./use-ads"

const FILTERS = {
  q: parseAsString.withDefault(""),
  status: parseAsStringLiteral(STATUS_FILTERS).withDefault("pending"),
}

export function useAdsScreen() {
  const list = useListParams(FILTERS)
  const stats = useAdStats()
  const query = useAds({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q.trim() || undefined,
    status: statusQuery(list.query.status),
  })

  return { list, query, stats, tabs: statusTabs(stats.data) }
}
