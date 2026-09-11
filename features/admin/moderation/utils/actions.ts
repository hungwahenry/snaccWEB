import type { Option, StatusMeta } from "@/features/admin/shell/types"
import type { ModerationAction } from "../types"

export const MODERATION_ACTIONS: readonly ModerationAction[] = [
  "allow",
  "flag",
  "hold",
  "block",
]

export const ACTION_STATUS: Record<ModerationAction, StatusMeta> = {
  allow: { label: "allow", variant: "outline" },
  flag: { label: "flag", variant: "secondary" },
  hold: { label: "hold", variant: "default" },
  block: { label: "block", variant: "destructive" },
}

const ACTION_LABELS: Record<ModerationAction, string> = {
  allow: "Allow",
  flag: "Flag",
  hold: "Hold",
  block: "Block",
}

export const ACTION_HINTS: Record<ModerationAction, string> = {
  allow: "An exemption: never escalate this category here.",
  flag: "Open a report. The content stays up.",
  hold: "Hide it and open a report.",
  block: "Refuse it outright, if the surface checks inline.",
}

export const ACTION_OPTIONS: Option<ModerationAction>[] =
  MODERATION_ACTIONS.map((action) => ({
    value: action,
    label: ACTION_LABELS[action],
  }))

const VERDICT_ORDER: readonly ModerationAction[] = [
  "flag",
  "hold",
  "block",
  "allow",
]

export const VERDICT_OPTIONS: Option<ModerationAction>[] = VERDICT_ORDER.map(
  (action) => ({ value: action, label: ACTION_LABELS[action] })
)
