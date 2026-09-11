"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRealtimeEvent } from "./use-realtime-event"

/** How long someone still reads as typing after their last ping. */
const LINGER_MS = 4000
/** The least time between our own pings. */
const THROTTLE_MS = 2500

interface TypingPresence {
  event: string
  /** Who a ping is from, or null when it belongs to another thread. */
  typist: (payload: unknown) => { id: string; name: string } | null
  ping: () => void
}

/** Who is typing in a thread right now, and a throttled way to say that you are. */
export function useTypingPresence({ event, typist, ping }: TypingPresence) {
  const [names, setNames] = useState<ReadonlyMap<string, string>>(new Map())
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const lastPing = useRef(0)
  const latest = useRef({ typist, ping })

  useEffect(() => {
    latest.current = { typist, ping }
  })

  useEffect(() => {
    const pending = timers.current
    return () => {
      for (const timer of pending.values()) clearTimeout(timer)
      pending.clear()
    }
  }, [])

  useRealtimeEvent(event, (payload) => {
    const who = latest.current.typist(payload)
    if (!who) return

    setNames((current) => new Map(current).set(who.id, who.name))
    clearTimeout(timers.current.get(who.id))
    timers.current.set(
      who.id,
      setTimeout(() => {
        timers.current.delete(who.id)
        setNames((current) => {
          const next = new Map(current)
          next.delete(who.id)
          return next
        })
      }, LINGER_MS)
    )
  })

  const clear = useCallback(() => {
    for (const timer of timers.current.values()) clearTimeout(timer)
    timers.current.clear()
    setNames(new Map())
  }, [])

  const signal = useCallback(() => {
    const now = Date.now()
    if (now - lastPing.current < THROTTLE_MS) return
    lastPing.current = now
    latest.current.ping()
  }, [])

  return { names: [...names.values()], clear, signal }
}
