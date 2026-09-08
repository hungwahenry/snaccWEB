"use client"

import { useEffect, useRef, useState } from "react"
import { useRealtimeEvent } from "@/hooks/use-realtime-event"
import { sendTyping } from "../api"

const TYPING_TTL = 4000
const TYPING_THROTTLE = 2500

export function useTyping(
  conversationId: string,
  resetKey: string | undefined
) {
  const [typing, setTyping] = useState(false)
  const lastPing = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => clearTimeout(timer.current ?? undefined), [])

  // A new message from them means they stopped typing, whatever the timer says.
  const [shownKey, setShownKey] = useState(resetKey)
  if (resetKey !== shownKey) {
    setShownKey(resetKey)
    setTyping(false)
  }

  useRealtimeEvent("conversation.typing", (payload) => {
    if (
      (payload as { conversation_id?: string }).conversation_id !==
      conversationId
    )
      return
    setTyping(true)
    clearTimeout(timer.current ?? undefined)
    timer.current = setTimeout(() => setTyping(false), TYPING_TTL)
  })

  function notifyTyping() {
    const now = Date.now()
    if (now - lastPing.current > TYPING_THROTTLE) {
      lastPing.current = now
      void sendTyping(conversationId).catch(() => undefined)
    }
  }

  return { typing, notifyTyping }
}
