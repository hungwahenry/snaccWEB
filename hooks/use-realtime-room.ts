"use client"

import { useRealtime } from "@/providers/realtime-provider"
import { useEffect } from "react"

export function useRealtimeRoom(room: string | null | undefined): void {
  const { subscribe, unsubscribe } = useRealtime()

  useEffect(() => {
    if (!room) return
    subscribe(room)
    return () => unsubscribe(room)
  }, [room, subscribe, unsubscribe])
}
