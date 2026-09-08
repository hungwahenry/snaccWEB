"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import type { ListUsersParams } from "../types"
import { useUsers } from "./use-users"

export function useUsersScreen() {
  const { params, patch } = useListState<ListUsersParams>({
    page: 1,
    perPage: 20,
  })
  return { params, patch, query: useUsers(params) }
}
