"use client"

import { useInfiniteList } from "@/hooks/use-infinite-list"
import { listWalletTransactions, type HistoryFilter } from "../../api"
import { WALLET_TRANSACTIONS_KEY } from "../../utils/keys"

export function useWalletTransactions(filter: HistoryFilter = {}) {
  return useInfiniteList([...WALLET_TRANSACTIONS_KEY, filter], (page) =>
    listWalletTransactions(page, filter)
  )
}
