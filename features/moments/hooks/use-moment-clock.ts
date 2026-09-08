"use client"

import { useCallback, useEffect, useRef } from "react"

export interface MomentClock {
  duration: number
  running: boolean
  restartKey: string | null
  snapshot: () => { from: number; remaining: number }
}

export function useMomentClock({
  duration,
  running,
  restartKey,
  onDone,
}: {
  duration: number
  running: boolean
  restartKey: string | null
  onDone: () => void
}): MomentClock {
  const elapsed = useRef(0)
  const startedAt = useRef<number | null>(null)
  const done = useRef(onDone)

  useEffect(() => {
    done.current = onDone
  }, [onDone])

  useEffect(() => {
    elapsed.current = 0
    startedAt.current = null
  }, [restartKey])

  useEffect(() => {
    if (restartKey === null) return

    if (!running) {
      if (startedAt.current !== null) {
        elapsed.current += Date.now() - startedAt.current
        startedAt.current = null
      }
      return
    }

    const remaining = Math.max(duration - elapsed.current, 0)
    startedAt.current = Date.now()
    const timer = window.setTimeout(() => done.current(), remaining)
    return () => window.clearTimeout(timer)
  }, [running, restartKey, duration])

  const snapshot = useCallback(() => {
    const spent =
      elapsed.current +
      (startedAt.current !== null ? Date.now() - startedAt.current : 0)
    const capped = Math.min(spent, duration)
    return {
      from: duration > 0 ? capped / duration : 0,
      remaining: duration - capped,
    }
  }, [duration])

  return { duration, running, restartKey, snapshot }
}
