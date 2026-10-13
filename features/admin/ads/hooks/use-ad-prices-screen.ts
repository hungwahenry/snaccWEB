"use client"

import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useAdPriceActions, useAdPrices } from "./use-ad-prices"

const FILTERS = { q: parseAsString.withDefault("") }

export function useAdPricesScreen() {
  const list = useListParams(FILTERS)
  const query = useAdPrices({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q.trim() || undefined,
  })

  return {
    list,
    query,
    actions: useAdPriceActions(),
  }
}
