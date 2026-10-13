import type { Option } from "@/features/admin/shell/types"
import { countryOfWhere, DEFAULT_SET } from "@/features/admin/shell/utils/where"
import type {
  CategoryUsage,
  ModerationRule,
  ModerationSurface,
  RuleDraft,
  RuleInput,
  RuleLine,
} from "../types"

export const RULE_NOTE_LIMIT = 500

const DEFAULT_THRESHOLD = 0.85

export function draftFrom(
  rule?: ModerationRule,
  surface?: ModerationSurface | null,
  where?: string | null
): RuleDraft {
  return {
    where: rule ? (rule.country_code ?? DEFAULT_SET) : (where ?? DEFAULT_SET),
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

export function toRuleLine(draft: RuleDraft): RuleLine {
  return {
    surface: draft.surface,
    category: draft.category.trim(),
    threshold: parseThreshold(draft.threshold) ?? 0,
    action: draft.action,
    note: draft.note.trim() || undefined,
  }
}

export function toRuleInput(draft: RuleDraft): RuleInput {
  const countryCode = countryOfWhere(draft.where)
  return countryCode ? { ...toRuleLine(draft), countryCode } : toRuleLine(draft)
}

export function rulesOn(
  rules: ModerationRule[],
  surface: ModerationSurface | null,
  where: string | null
): ModerationRule[] {
  return rules.filter(
    (rule) =>
      (surface === null || rule.surface === surface) &&
      (where === null || (rule.country_code ?? DEFAULT_SET) === where)
  )
}

export function categoryOptions(categories: CategoryUsage[]): Option[] {
  return categories.map((entry) => ({
    value: entry.category,
    label: entry.label,
  }))
}
