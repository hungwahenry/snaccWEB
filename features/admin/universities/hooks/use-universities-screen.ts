"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import type { ListUniversitiesParams } from "../types"
import { useUniversities } from "./use-universities"

export function useUniversitiesScreen() {
  const { params, patch } = useListState<ListUniversitiesParams>({
    page: 1,
    perPage: 20,
  })
  return { params, patch, query: useUniversities(params) }
}
