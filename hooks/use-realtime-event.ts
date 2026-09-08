"use client"

import { useRealtime } from "@/providers/realtime-provider"
import { useEffect, useRef } from "react"

export function useRealtimeEvent(
  event: string,
  handler: (payload: unknown) => void
): void {
  const { on } = useRealtime()
  const saved = useRef(handler)

  useEffect(() => {
    saved.current = handler
  })

  useEffect(() => on(event, (payload) => saved.current(payload)), [event, on])
}
