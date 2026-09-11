import type { Option } from "@/features/admin/shell/types"
import type {
  CategoryUsage,
  ModerationRule,
  ModerationSurface,
  RuleDraft,
  RuleInput,
} from "../types"

export const RULE_NOTE_LIMIT = 500

const DEFAULT_THRESHOLD = 0.85

export function draftFrom(
  rule?: ModerationRule,
  surface?: ModerationSurface | null
): RuleDraft {
  return {
    surface: rule?.surface ?? surface ?? "snacc",
    category: rule?.category ?? "",
    threshold: String(rule?.threshold ?? DEFAULT_THRESHOLD),
    action: rule?.action ?? "flag",
    note: rule?.note ?? "",
  }
}

/** A score someone typed, or null when it is blank, not a number, or outside 0 to 1. */
export function parseThreshold(raw: string): number | null {
  const text = raw.trim()
  if (text === "") return null

  const value = Number(text)

  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : null
}

export function isDraftReady(draft: RuleDraft): boolean {
  return (
    draft.category.trim() !== "" && parseThreshold(draft.threshold) !== null
  )
}

export function toRuleInput(draft: RuleDraft): RuleInput {
  return {
    surface: draft.surface,
    category: draft.category.trim(),
    threshold: parseThreshold(draft.threshold) ?? 0,
    action: draft.action,
    note: draft.note.trim() || undefined,
  }
}

/** Every rule, or only the ones on one surface. */
export function rulesOn(
  rules: ModerationRule[],
  surface: ModerationSurface | null
): ModerationRule[] {
  return surface === null
    ? rules
    : rules.filter((rule) => rule.surface === surface)
}

export function categoryOptions(categories: CategoryUsage[]): Option[] {
  return categories.map((entry) => ({
    value: entry.category,
    label: entry.label,
  }))
}
