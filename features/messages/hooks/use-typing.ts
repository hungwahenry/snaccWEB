"use client"

import { useEffect } from "react"
import { useTypingPresence } from "@/hooks/use-typing-presence"
import { sendTyping } from "../api"

/** Whether the other person is typing; a new message from them ends it. */
export function useTyping(
  conversationId: string,
  newestId: string | undefined
) {
  const presence = useTypingPresence({
    event: "conversation.typing",
    typist: (payload) =>
      (payload as { conversation_id?: string }).conversation_id ===
      conversationId
        ? { id: conversationId, name: "" }
        : null,
    ping: () => void sendTyping(conversationId).catch(() => undefined),
  })

  const { clear } = presence
  useEffect(clear, [newestId, clear])

  return { typing: presence.names.length > 0, notifyTyping: presence.signal }
}
