"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { withEditedBody } from "@/features/messages/utils/editing"
import { nextReaction } from "@/features/messages/utils/reactions"
import { showError } from "@/lib/feedback"
import {
  deleteChatMessage,
  editChatMessage,
  reactToChatMessage,
  unreactToChatMessage,
} from "../api"
import { findChatMessage, patchChatMessage, upsertChatMessage } from "../cache"
import type { ChatMessage } from "../types"
import { withdrawn, withMyChatReaction } from "../utils/rooms"

export function useEditChatMessage(roomId: string) {
  return useMutation({
    mutationFn: (input: { messageId: string; body: string }) =>
      editChatMessage(input.messageId, input.body),
    onMutate: ({ messageId, body }) => {
      const before = findChatMessage(roomId, messageId)
      patchChatMessage(roomId, messageId, (message) =>
        withEditedBody(message, body)
      )
      return { before }
    },
    onSuccess: (message) => upsertChatMessage(roomId, message),
    onError: (error, { messageId }, context) => {
      const before = context?.before
      if (before) patchChatMessage(roomId, messageId, () => before)
      showError(error)
    },
  })
}

/** Your own message out of the room; what stays is the gap, the way everyone else sees it. */
export function useWithdrawChatMessage(roomId: string) {
  return useMutation({
    mutationFn: deleteChatMessage,
    onMutate: (messageId) => {
      const before = findChatMessage(roomId, messageId)
      patchChatMessage(roomId, messageId, withdrawn)
      return { before }
    },
    onError: (error, messageId, context) => {
      const before = context?.before
      if (before) patchChatMessage(roomId, messageId, () => before)
      showError(error)
    },
  })
}

export function useReactToChatMessage(roomId: string) {
  const { mutate } = useMutation({
    mutationFn: (input: { messageId: string; emoji: string | null }) =>
      input.emoji === null
        ? unreactToChatMessage(input.messageId)
        : reactToChatMessage(input.messageId, input.emoji),
    onMutate: ({ messageId, emoji }) => {
      const before = findChatMessage(roomId, messageId)
      patchChatMessage(roomId, messageId, (message) =>
        withMyChatReaction(message, emoji)
      )
      return { before }
    },
    onSuccess: (message) => upsertChatMessage(roomId, message),
    onError: (error, { messageId }, context) => {
      const before = context?.before
      if (before) patchChatMessage(roomId, messageId, () => before)
      showError(error)
    },
  })

  return useCallback(
    (message: ChatMessage, emoji: string) =>
      mutate({ messageId: message.id, emoji: nextReaction(message, emoji) }),
    [mutate]
  )
}
