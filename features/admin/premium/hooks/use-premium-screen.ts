"use client"

import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import {
  useBenefits,
  usePremiumActions,
  usePremiumStats,
  useSubscribers,
} from "./use-premium"

const FILTERS = { q: parseAsString.withDefault("") }

export function usePremiumScreen() {
  const list = useListParams(FILTERS)
  const subscribers = useSubscribers({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
  })

  return {
    list,
    subscribers,
    stats: usePremiumStats(),
    benefits: useBenefits(),
    actions: usePremiumActions(),
  }
}
