"use client"

import { useEffect } from "react"
import { markConversationRead } from "../api"
import { markConversationSeen, unreadChanged } from "../cache"

export function useMarkRead(conversationId: string, messageCount: number) {
  useEffect(() => {
    if (!conversationId) return

    const read = () => {
      if (document.visibilityState !== "visible") return
      markConversationSeen(conversationId)
      void markConversationRead(conversationId)
        .then(unreadChanged)
        .catch(() => undefined)
    }

    read()
    document.addEventListener("visibilitychange", read)
    return () => document.removeEventListener("visibilitychange", read)
  }, [conversationId, messageCount])
}
