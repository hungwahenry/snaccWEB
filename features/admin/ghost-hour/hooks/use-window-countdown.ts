"use client"

import { useEffect, useState } from "react"
import type { GhostWindowState } from "../types"
import { remainingMs } from "../utils/ghost-hour"

const TICK_MS = 1_000

/** Milliseconds left in an open window, ticking every second and restarting on each fresh read. */
export function useWindowCountdown(
  state: GhostWindowState | undefined
): number | null {
  const endsAt = state?.active ? state.ends_at : null
  const serverTime = state?.server_time ?? null

  const [base, setBase] = useState(serverTime)
  const [elapsed, setElapsed] = useState(0)

  if (base !== serverTime) {
    setBase(serverTime)
    setElapsed(0)
  }

  useEffect(() => {
    if (!endsAt) return
    const id = setInterval(
      () => setElapsed((value) => value + TICK_MS),
      TICK_MS
    )
    return () => clearInterval(id)
  }, [endsAt, base])

  return remainingMs(state, elapsed)
}
