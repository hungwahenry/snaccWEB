"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import type { ListSnaccsParams } from "../types"
import { useSnaccs } from "./use-snaccs"

export function useSnaccsScreen() {
  const { params, patch } = useListState<ListSnaccsParams>({
    page: 1,
    perPage: 20,
  })
  return { params, patch, query: useSnaccs(params) }
}
