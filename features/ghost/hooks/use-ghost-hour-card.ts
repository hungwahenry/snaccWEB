"use client"

import { useGhostWindow } from "./use-ghost-window"

function countdown(ms: number): string {
  const minutes = Math.max(1, Math.ceil(ms / 60_000))
  const hours = Math.floor(minutes / 60)
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`
}

export function useGhostHourCard() {
  const { active, startsAt, now } = useGhostWindow()
  const upcoming = !active && startsAt !== null && startsAt.getTime() > now

  return {
    visible: active || upcoming,
    active,
    subtitle: active
      ? "Open now. Everything you post is anonymous."
      : upcoming
        ? `Opens in ${countdown(startsAt!.getTime() - now)}.`
        : "",
  }
}
