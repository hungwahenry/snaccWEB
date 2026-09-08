"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import type { ListReportsParams } from "../types"
import { useReports } from "./use-reports"

export function useReportsScreen() {
  const { params, patch } = useListState<ListReportsParams>({
    page: 1,
    perPage: 20,
    status: "open",
  })
  return { params, patch, query: useReports(params) }
}
