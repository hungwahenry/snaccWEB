import { getQueryClient } from "@/lib/query/client"
import { GHOST_WINDOW_KEY } from "./hooks/use-ghost-window"
import type { GhostWindow } from "@/features/ghost/types"

export function onGhostWindow(window: GhostWindow): void {
  getQueryClient().setQueryData(GHOST_WINDOW_KEY, window)
}
