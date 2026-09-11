"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listWalletTransactions } from "../../api"
import type { HistoryFilter } from "../../types"
import { walletKeys } from "../../utils/keys"

export function useWalletTransactions(filter: HistoryFilter = {}) {
  return useInfiniteList(walletKeys.transactions(filter), (page) =>
    listWalletTransactions(page, filter)
  )
}
