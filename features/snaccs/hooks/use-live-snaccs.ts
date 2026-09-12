"use client"

import { useCallback, useEffect, useRef } from "react"
import { useRealtime } from "@/providers/realtime-provider"
import { realtimeRooms } from "@/providers/realtime-rooms"
import { roomChanges } from "../utils/live-rooms"

/** Keeps the snaccs on screen listening for their counts, and lets go as they scroll away. */
export function useLiveSnaccs() {
  const { subscribe, unsubscribe } = useRealtime()
  const joined = useRef<ReadonlySet<string>>(new Set())

  useEffect(() => {
    const held = joined
    return () => {
      held.current.forEach(unsubscribe)
      held.current = new Set()
    }
  }, [unsubscribe])

  return useCallback(
    (ids: string[]) => {
      const wanted = new Set(ids.map(realtimeRooms.snacc))
      const { join, leave } = roomChanges(joined.current, wanted)
      leave.forEach(unsubscribe)
      join.forEach(subscribe)
      joined.current = wanted
    },
    [subscribe, unsubscribe]
  )
}
