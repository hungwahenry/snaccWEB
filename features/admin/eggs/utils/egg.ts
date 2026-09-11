import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { parseJsonObject, prettyJson } from "@/features/admin/shell/utils/json"
import type {
  AdminEgg,
  CreateEggInput,
  EggDraft,
  EggRarity,
  EggTrigger,
  UpdateEggInput,
} from "../types"

export const EGG_LIMITS = {
  slug: 40,
  name: 60,
  description: 200,
  hint: 120,
  color: 7,
} as const

const SLUG_PATTERN = /^[a-z0-9-]{3,40}$/
const COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/
const DEFAULT_COLOR = "#5b6ec2"

export const TRIGGER_INVALID =
  "That is not a JSON object. Fix it, or clear it so only the server can hand this egg out."

export const RARITY_LABELS: Record<EggRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
}

export const RARITY_OPTIONS: Option<EggRarity>[] = (
  ["common", "uncommon", "rare", "epic", "legendary"] as const
).map((rarity) => ({ value: rarity, label: RARITY_LABELS[rarity] }))

const EGG_STATUS = {
  live: { label: "Live", variant: "secondary" },
  off: { label: "Off", variant: "outline" },
} as const satisfies Record<string, StatusMeta>

export function eggStatus(egg: Pick<AdminEgg, "enabled">): StatusMeta {
  return egg.enabled ? EGG_STATUS.live : EGG_STATUS.off
}

/** A saved trigger as the text box shows it: blank when the egg has none. */
export function triggerText(trigger: unknown): string {
  return trigger === null || trigger === undefined ? "" : prettyJson(trigger)
}

/** Blank text means no trigger (only the server can hand the egg out); anything else must be a JSON object. */
export function parseTrigger(
  text: string
): { ok: true; value: EggTrigger | null } | { ok: false } {
  if (text.trim() === "") return { ok: true, value: null }

  return parseJsonObject(text)
}

function requireTrigger(text: string): EggTrigger | null {
  const parsed = parseTrigger(text)
  if (!parsed.ok) throw new Error(TRIGGER_INVALID)

  return parsed.value
}

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase()
}

function fits(text: string, min: number, max: number): boolean {
  const length = text.trim().length

  return length >= min && length <= max
}

export function draftFrom(egg?: AdminEgg): EggDraft {
  return {
    slug: egg?.slug ?? "",
    name: egg?.name ?? "",
    description: egg?.description ?? "",
    hint: egg?.hint ?? "",
    rarity: egg?.rarity ?? "common",
    color: egg?.color ?? DEFAULT_COLOR,
    enabled: egg?.enabled ?? true,
    trigger: triggerText(egg?.trigger),
  }
}

export function isDraftReady(draft: EggDraft, editing: boolean): boolean {
  return (
    fits(draft.name, 1, EGG_LIMITS.name) &&
    fits(draft.description, 1, EGG_LIMITS.description) &&
    fits(draft.hint, 0, EGG_LIMITS.hint) &&
    COLOR_PATTERN.test(draft.color.trim()) &&
    parseTrigger(draft.trigger).ok &&
    (editing || SLUG_PATTERN.test(normalizeSlug(draft.slug)))
  )
}

export function toCreateInput(draft: EggDraft): CreateEggInput {
  return {
    slug: normalizeSlug(draft.slug),
    name: draft.name.trim(),
    description: draft.description.trim(),
    hint: draft.hint.trim() || undefined,
    rarity: draft.rarity,
    color: draft.color.trim(),
    trigger: requireTrigger(draft.trigger) ?? undefined,
  }
}

export function toUpdateInput(draft: EggDraft): UpdateEggInput {
  return {
    name: draft.name.trim(),
    description: draft.description.trim(),
    hint: draft.hint.trim(),
    color: draft.color.trim(),
    enabled: draft.enabled,
    trigger: requireTrigger(draft.trigger),
  }
}
