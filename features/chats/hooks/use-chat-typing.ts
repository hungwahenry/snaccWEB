"use client"

import { useTypingPresence } from "@/hooks/use-typing-presence"
import { useRealtime } from "@/providers/realtime-provider"
import { typingLabel } from "../utils/rooms"

interface TypingPayload {
  room_id: string
  user_id: string
  username: string | null
}

export function useChatTyping(roomId: string) {
  const realtime = useRealtime()
  const presence = useTypingPresence({
    event: "chat.typing",
    typist: (payload) => {
      const typing = payload as TypingPayload
      if (typing.room_id !== roomId || !typing.user_id) return null
      return {
        id: typing.user_id,
        name: typing.username ? `@${typing.username}` : "Someone",
      }
    },
    ping: () => realtime.emit("chat.typing", { room_id: roomId }),
  })

  return { label: typingLabel(presence.names), signal: presence.signal }
}
