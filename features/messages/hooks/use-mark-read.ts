"use client"

import { useEffect } from "react"
import { markConversationRead } from "../api"
import { markConversationSeen, unreadChanged } from "../cache"

/** Marks the thread read whenever it grows while open, and clears its badge at once. */
export function useMarkRead(conversationId: string, messageCount: number) {
  useEffect(() => {
    if (!conversationId) return

    markConversationSeen(conversationId)
    void markConversationRead(conversationId)
      .then(unreadChanged)
      .catch(() => undefined)
  }, [conversationId, messageCount])
}
