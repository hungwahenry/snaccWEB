import type { GhostWindow } from "@/features/ghost/types"

export function isGhostActive(
  window: GhostWindow | undefined,
  now: number = Date.now()
): boolean {
  if (!window?.starts_at || !window.ends_at) return false
  return now >= Date.parse(window.starts_at) && now < Date.parse(window.ends_at)
}
