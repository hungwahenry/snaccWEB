import { api } from "@/lib/api/client"
import type { GhostWindow } from "@/features/ghost/types"

export function getGhostWindow(): Promise<GhostWindow> {
  return api.get<GhostWindow>("/ghost/window")
}
