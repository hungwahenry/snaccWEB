"use client"

import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useConversations } from "./use-messages"

const FILTERS = {}

export function useConversationsScreen() {
  const list = useListParams(FILTERS)
  const query = useConversations({ page: list.query.page, perPage: PAGE_SIZE })

  return { list, query }
}
