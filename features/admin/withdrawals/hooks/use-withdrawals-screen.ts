"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import type { ListWithdrawalsParams } from "../types"
import { useWithdrawals } from "./use-withdrawals"

export function useWithdrawalsScreen() {
  const { params, patch } = useListState<ListWithdrawalsParams>({
    page: 1,
    perPage: 20,
  })
  return { params, patch, query: useWithdrawals(params) }
}
