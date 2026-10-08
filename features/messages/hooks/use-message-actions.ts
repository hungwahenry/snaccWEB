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
import { deletedBySender, withEditedBody } from "../utils/editing"
import { nextReaction, withMyReaction } from "../utils/reactions"

function useLocalChange<Input extends { messageId: string }>(
  conversationId: string,
  send: (input: Input) => Promise<Message>,
  change: (message: Message, input: Input) => Message
) {
  return useMutation({
    mutationFn: send,
    onMutate: (input) => {
      const before = findMessage(conversationId, input.messageId)
      patchMessage(conversationId, input.messageId, (message) =>
        change(message, input)
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
}

export function useEditMessage(conversationId: string) {
  return useLocalChange(
    conversationId,
    (input: { messageId: string; body: string }) =>
      editMessage(conversationId, input.messageId, input.body),
    (message, { body }) => withEditedBody(message, body)
  )
}

export function useDeleteMessage(conversationId: string) {
  return useLocalChange(
    conversationId,
    ({ messageId }: { messageId: string }) =>
      deleteMessage(conversationId, messageId),
    deletedBySender
  )
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
