"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import { useAllUniversities } from "@/features/admin/universities/hooks/use-universities"
import type { ListEarningsParams } from "../types"
import { useEarnings, useFundMutations, useFunds } from "./use-earnings"

export function useEarningsScreen() {
  const { params, patch } = useListState<ListEarningsParams>({
    page: 1,
    perPage: 20,
  })

  return {
    params,
    patch,
    earnings: useEarnings(params),
    funds: useFunds(),
    universities: useAllUniversities(),
    fundMutations: useFundMutations(),
  }
}
