"use client"

import { useRealtime } from "@/providers/realtime-provider"
import { useCallback, useEffect, useRef, useState } from "react"

/// How long a name stays up after their last keystroke. Long enough to survive the gap between
/// words, short enough that someone who wandered off stops "typing".
const LINGER_MS = 4000
/// One packet per this window while someone keeps typing, rather than one per keystroke.
const THROTTLE_MS = 2000

interface TypingPayload {
  room_id: string
  user_id: string
  username: string | null
}

export function useChatTyping(roomId: string) {
  const realtime = useRealtime()
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const lastSent = useRef(0)

  useEffect(() => {
    const pending = timers.current
    const off = realtime.on("chat.typing", (payload) => {
      const typing = payload as TypingPayload
      if (typing.room_id !== roomId || !typing.user_id) return

      setNames((current) => new Map(current).set(typing.user_id, typing.username ?? "Someone"))

      clearTimeout(pending.get(typing.user_id))
      pending.set(
        typing.user_id,
        setTimeout(() => {
          pending.delete(typing.user_id)
          setNames((current) => {
            const next = new Map(current)
            next.delete(typing.user_id)
            return next
          })
        }, LINGER_MS)
      )
    })

    return () => {
      off()
      for (const timer of pending.values()) clearTimeout(timer)
      pending.clear()
    }
  }, [realtime, roomId])

  const signal = useCallback(() => {
    const now = Date.now()
    if (now - lastSent.current < THROTTLE_MS) return
    lastSent.current = now
    realtime.emit("chat.typing", { room_id: roomId })
  }, [realtime, roomId])

  return { label: typingLabel([...names.values()]), signal }
}

/// A room can have a lot of people typing at once, so past two it becomes a count.
export function typingLabel(names: string[]): string | null {
  if (names.length === 0) return null
  if (names.length === 1) return `${names[0]} is typing…`
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing…`

  return `${names[0]} and ${names.length - 1} others are typing…`
}
