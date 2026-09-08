"use client"

import { useNow } from "@/hooks/use-now"
import { formatRemaining } from "../utils/countdown"
import { useGhostWindow } from "./use-ghost-window"

export function useGhostCountdown() {
  const { active, endsAt, skewMs } = useGhostWindow()
  const now = useNow(active ? 1_000 : 60_000)
  const endsAtMs = endsAt?.getTime() ?? null

  const msLeft = endsAtMs === null ? 0 : Math.max(0, endsAtMs - (now + skewMs))

  return {
    active: active && msLeft > 0,
    msLeft,
    label: active && msLeft > 0 ? formatRemaining(msLeft) : null,
  }
}
