import type { ModerationAction } from "../types"

export const ACTION_VARIANT: Record<
  ModerationAction,
  "outline" | "secondary" | "default" | "destructive"
> = {
  allow: "outline",
  flag: "secondary",
  hold: "default",
  block: "destructive",
}
