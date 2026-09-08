"use client"

import type { MouseEvent } from "react"
import { useLongPress } from "./use-long-press"

export function useHoldAction(onHold: (() => void) | undefined) {
  const longPress = useLongPress(onHold) as {
    onContextMenu?: (event: MouseEvent) => void
  }
  if (!onHold) return {}

  return {
    ...longPress,
    onContextMenu(event: MouseEvent) {
      longPress.onContextMenu?.(event)
      if (event.button === 2) {
        event.preventDefault()
        onHold()
      }
    },
  }
}
