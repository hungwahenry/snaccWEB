import type { ModerationSurface } from "./index"

export const SURFACE_LABELS: Record<ModerationSurface, string> = {
  snacc: "Snaccs",
  comment: "Replies",
  moment: "Moments",
  message: "Ghost messages",
  anon_message: "Anonymous messages",
  profile: "Profiles",
}
