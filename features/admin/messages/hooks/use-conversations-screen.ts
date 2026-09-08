"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import type { ListConversationsParams } from "../types"
import { useConversations } from "./use-messages"

export function useConversationsScreen() {
  const { params, patch } = useListState<ListConversationsParams>({
    page: 1,
    perPage: 20,
  })
  return { params, patch, query: useConversations(params) }
}
