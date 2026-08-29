import { api } from "@/lib/api/client"
import type { GhostWindowState } from "../types"

export function getGhostWindow() {
  return api.get<GhostWindowState>("/ghost/window")
}

export function openGhostHour(minutes?: number) {
  return api.post<GhostWindowState>(
    "/admin/ghost/open",
    minutes ? { minutes } : {}
  )
}

export function closeGhostHour() {
  return api.post<GhostWindowState>("/admin/ghost/close")
}
