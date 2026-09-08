"use client"

import { useEffect, useState } from "react"

/// The clock as React state, so anything derived from "now" re-renders on a schedule instead of
/// reading the clock mid-render.
export function useNow(intervalMs: number): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
