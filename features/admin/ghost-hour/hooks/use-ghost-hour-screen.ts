"use client"

import { useGhostHourActions, useGhostWindow } from "./use-ghost-hour"
import { useWindowCountdown } from "./use-window-countdown"

export function useGhostHourScreen() {
  const query = useGhostWindow()

  return {
    query,
    remaining: useWindowCountdown(query.data),
    actions: useGhostHourActions(),
  }
}
