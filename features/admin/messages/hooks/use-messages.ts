"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { adminReportKeys } from "@/features/admin/reports/utils/keys"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  deleteMessage,
  getConversation,
  listConversations,
  restoreMessage,
} from "../api"
import type { ConversationListQuery } from "../types"
import { adminMessageKeys } from "../utils/keys"

export function useConversations(query: ConversationListQuery) {
  return useQuery({
    queryKey: adminMessageKeys.list(query),
    queryFn: () => listConversations(query),
    placeholderData: keepPreviousData,
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: adminMessageKeys.thread(id),
    queryFn: () => getConversation(id),
  })
}

export function useMessageActions(conversationId: string) {
  const invalidates = [
    adminMessageKeys.thread(conversationId),
    adminReportKeys.all(),
  ]

  const { run: remove } = useAdminMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      deleteMessage(id, reason),
    success: "Message removed.",
    invalidates,
  })
  const { run: restore } = useAdminMutation({
    mutationFn: (id: string) => restoreMessage(id),
    success: "Message restored.",
    invalidates,
  })

  return useMemo(
    () => ({
      remove: (id: string, reason?: string) => remove({ id, reason }),
      restore,
    }),
    [remove, restore]
  )
}
