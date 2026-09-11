"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { showError } from "@/lib/feedback"
import {
  deleteMessage,
  editMessage,
  reactToMessage,
  unreactToMessage,
} from "../api"
import { findMessage, patchMessage, replaceMessage } from "../cache"
import type { Message } from "../types"
import { nextReaction, withMyReaction } from "../utils/reactions"

export function useEditMessage(conversationId: string) {
  return useMutation({
    mutationFn: (input: { messageId: string; body: string }) =>
      editMessage(conversationId, input.messageId, input.body),
    onSuccess: (message) => replaceMessage(conversationId, message),
  })
}

export function useDeleteMessage(conversationId: string) {
  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(conversationId, messageId),
    onSuccess: (message) => replaceMessage(conversationId, message),
  })
}

export function useReactToMessage(conversationId: string) {
  const { mutate } = useMutation({
    mutationFn: (input: { messageId: string; emoji: string | null }) =>
      input.emoji === null
        ? unreactToMessage(conversationId, input.messageId)
        : reactToMessage(conversationId, input.messageId, input.emoji),
    onMutate: ({ messageId, emoji }) => {
      const before = findMessage(conversationId, messageId)
      patchMessage(conversationId, messageId, (message) =>
        withMyReaction(message, emoji)
      )
      return { before }
    },
    onSuccess: (message) => replaceMessage(conversationId, message),
    onError: (error, { messageId }, context) => {
      const before = context?.before
      if (before) patchMessage(conversationId, messageId, () => before)
      showError(error)
    },
  })

  return useCallback(
    (message: Message, emoji: string) =>
      mutate({ messageId: message.id, emoji: nextReaction(message, emoji) }),
    [mutate]
  )
}
