"use client"

import { useMutation } from "@tanstack/react-query"
import { useCallback } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  deleteMessage,
  editMessage,
  reactToMessage,
  unreactToMessage,
} from "../api"
import { replaceMessage } from "../cache"
import type { Message } from "../types"
import { nextReaction } from "../utils/reactions"

export function useEditMessage(conversationId: string) {
  return useMutation({
    mutationFn: (input: { messageId: string; body: string }) =>
      editMessage(conversationId, input.messageId, input.body),
    onSuccess: (message) => replaceMessage(conversationId, message),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useDeleteMessage(conversationId: string) {
  return useMutation({
    mutationFn: (messageId: string) => deleteMessage(conversationId, messageId),
    onSuccess: (message) => replaceMessage(conversationId, message),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useReactToMessage(conversationId: string) {
  const react = useMutation({
    mutationFn: (input: { messageId: string; emoji: string | null }) =>
      input.emoji === null
        ? unreactToMessage(conversationId, input.messageId)
        : reactToMessage(conversationId, input.messageId, input.emoji),
    onSuccess: (message) => replaceMessage(conversationId, message),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
  const { mutate } = react

  const onReact = useCallback(
    (message: Message, emoji: string) =>
      mutate({ messageId: message.id, emoji: nextReaction(message, emoji) }),
    [mutate]
  )

  return { onReact, reacting: react.isPending }
}
