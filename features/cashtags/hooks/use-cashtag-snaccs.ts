"use client"

import { snaccKeys } from "@/features/snaccs/utils/keys"
import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listCashtagSnaccs } from "../api"

export function useCashtagSnaccs(symbol: string) {
  const { items, ...list } = useInfiniteList(
    snaccKeys.cashtag(symbol),
    (page) => listCashtagSnaccs(symbol, page)
  )
  return { snaccs: items, ...list }
}
