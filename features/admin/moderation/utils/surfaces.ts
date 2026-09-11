import type { Option, StatusMeta } from "@/features/admin/shell/types"
import type { ModerationMode, ModerationSurface } from "../types"

export const SURFACES: readonly ModerationSurface[] = [
  "snacc",
  "comment",
  "moment",
  "message",
  "anon_message",
  "profile",
]

export const SURFACE_LABELS: Record<ModerationSurface, string> = {
  snacc: "Snaccs",
  comment: "Replies",
  moment: "Moments",
  message: "Ghost messages",
  anon_message: "Anonymous messages",
  profile: "Profiles",
}

export const SURFACE_OPTIONS: Option<ModerationSurface>[] = SURFACES.map(
  (surface) => ({ value: surface, label: SURFACE_LABELS[surface] })
)

/** The rule dialog names a surface by its key, the way rules are stored. */
export const SURFACE_KEY_OPTIONS: Option<ModerationSurface>[] = SURFACES.map(
  (surface) => ({ value: surface, label: surface.replace("_", " ") })
)

export const MODE_OPTIONS: Option<ModerationMode>[] = [
  { value: "inline", label: "Before the write" },
  { value: "queued", label: "After the write" },
]

export function surfaceLabel(surface: ModerationSurface): string {
  return SURFACE_LABELS[surface] ?? surface
}

export function surfaceState(enabled: boolean): StatusMeta {
  return enabled
    ? { label: "on", variant: "default" }
    : { label: "off", variant: "outline" }
}
