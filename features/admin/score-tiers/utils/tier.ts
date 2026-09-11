import type { Option } from "@/features/admin/shell/types"
import { humanize } from "@/features/admin/shell/utils/format"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import { NAMED_ICON_NAMES } from "@/lib/icons/named-icon"
import { formatNumber } from "@/lib/format"
import type { AdminTier, TierDraft, TierInput } from "../types"

export const TIER_LIMITS = {
  key: 30,
  label: 40,
  icon: 16,
  color: 24,
  position: 1000,
} as const

const MAX_SCORE = 2_147_483_647

export const MIN_SCORE_INVALID = "The score must be a whole number, 0 or more."
export const POSITION_INVALID = `Position must be a whole number from 0 to ${TIER_LIMITS.position}.`

export const ICON_OPTIONS: Option[] = NAMED_ICON_NAMES.map((name) => ({
  value: name,
  label: humanize(name),
}))

export function parseMinScore(raw: string): number | null {
  return parseWholeNumber(raw, { min: 0, max: MAX_SCORE })
}

export function parsePosition(raw: string): number | null {
  return parseWholeNumber(raw, { min: 0, max: TIER_LIMITS.position })
}

function iconName(icon: string): string {
  return icon.trim().toLowerCase()
}

/** Blank (no icon) or one of the icons the apps can draw. */
export function isKnownIcon(icon: string): boolean {
  const name = iconName(icon)

  return name === "" || NAMED_ICON_NAMES.includes(name)
}

export function draftFrom(tier?: AdminTier): TierDraft {
  return {
    key: tier?.key ?? "",
    minScore: String(tier?.min_score ?? 0),
    position: String(tier?.position ?? 0),
    label: tier?.label ?? "",
    icon: tier?.icon ?? "",
    color: tier?.color ?? "",
  }
}

export function isDraftReady(draft: TierDraft): boolean {
  const key = draft.key.trim()

  return (
    key !== "" &&
    key.length <= TIER_LIMITS.key &&
    draft.label.trim().length <= TIER_LIMITS.label &&
    draft.color.trim().length <= TIER_LIMITS.color &&
    isKnownIcon(draft.icon) &&
    parseMinScore(draft.minScore) !== null &&
    parsePosition(draft.position) !== null
  )
}

export function toInput(draft: TierDraft): TierInput {
  const minScore = parseMinScore(draft.minScore)
  if (minScore === null) throw new Error(MIN_SCORE_INVALID)
  const position = parsePosition(draft.position)
  if (position === null) throw new Error(POSITION_INVALID)

  return {
    key: draft.key.trim(),
    minScore,
    position,
    label: draft.label.trim(),
    icon: iconName(draft.icon),
    color: draft.color.trim(),
  }
}

/** The ladder from the bottom rung up. */
export function sortTiers(tiers: AdminTier[]): AdminTier[] {
  return [...tiers].sort(
    (a, b) => a.min_score - b.min_score || a.position - b.position
  )
}

export function thresholdLabel(minScore: number): string {
  return minScore === 0 ? "Floor" : `${formatNumber(minScore)} points`
}

/** Whether some tier starts at 0. Without one, anyone below the lowest rung has no tier. */
export function hasFloor(tiers: AdminTier[]): boolean {
  return tiers.some((tier) => tier.min_score === 0)
}
