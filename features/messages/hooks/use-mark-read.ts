"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { markConversationRead } from "../api"
import {
  CONVERSATIONS_KEY,
  conversationKey,
  UNREAD_MESSAGES_KEY,
} from "../utils/keys"

export function useMarkRead(conversationId: string, messageCount: number) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!conversationId) return
    void markConversationRead(conversationId)
      .then(() => {
        void queryClient.invalidateQueries({ queryKey: UNREAD_MESSAGES_KEY })
        void queryClient.invalidateQueries({ queryKey: CONVERSATIONS_KEY })
        void queryClient.invalidateQueries({
          queryKey: conversationKey(conversationId),
        })
      })
      .catch(() => undefined)
  }, [conversationId, messageCount, queryClient])
}
