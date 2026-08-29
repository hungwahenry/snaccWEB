"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  deleteMessage,
  getConversation,
  listConversations,
  restoreMessage,
} from "../api"
import type { ListConversationsParams } from "../types"

export function useConversations(params: ListConversationsParams) {
  return useQuery({
    queryKey: ["admin", "conversations", params],
    queryFn: () => listConversations(params),
    placeholderData: keepPreviousData,
  })
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["admin", "conversation", id],
    queryFn: () => getConversation(id),
    enabled: !!id,
  })
}

export function useMessageModeration(conversationId: string) {
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: ["admin", "conversation", conversationId],
    })
    queryClient.invalidateQueries({ queryKey: ["admin", "reports"] })
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    remove: useMutation({
      mutationFn: (input: { id: string; reason?: string }) =>
        deleteMessage(input.id, input.reason),
      onSuccess: () => {
        invalidate()
        toast.success("Message removed.")
      },
      onError,
    }),
    restore: useMutation({
      mutationFn: (id: string) => restoreMessage(id),
      onSuccess: () => {
        invalidate()
        toast.success("Message restored.")
      },
      onError,
    }),
  }
}
