import type { StatusMeta } from "@/features/admin/shell/types"
import { formatNumber, longDate } from "@/lib/format"
import type {
  AdminBenefit,
  AdminSubscriber,
  BenefitDraft,
  PremiumStats,
  UpdateBenefitInput,
} from "../types"

export const GRANT_DAYS = 30
export const GRANT_REASON = "Granted from the admin panel."
export const REVOKE_REASON = "Ended from the admin panel."

const STORES: Record<string, string> = {
  app_store: "App Store",
  play_store: "Play Store",
  promotional: "Granted",
}

export function storeLabel(store: string): string {
  return STORES[store] ?? store
}

const STANDING = {
  lifetime: { label: "Lifetime", variant: "secondary" },
  active: { label: "Active", variant: "secondary" },
  cancelling: { label: "Cancelling", variant: "secondary" },
  lapsed: { label: "Lapsed", variant: "outline" },
} as const satisfies Record<string, StatusMeta>

/** Lifetime is checked before renewal: a purchase outright never renews, yet never lapses. */
export function subscriberStanding(
  row: Pick<AdminSubscriber, "active" | "lifetime" | "will_renew">
): StatusMeta {
  if (!row.active) return STANDING.lapsed
  if (row.lifetime) return STANDING.lifetime

  return row.will_renew ? STANDING.active : STANDING.cancelling
}

export function untilLabel(expiresAt: string | null): string {
  return expiresAt ? longDate(expiresAt) : "Never"
}

export interface PremiumFact {
  label: string
  value: string
}

/** The figures split into how people stand and which store they pay through. */
export function premiumFacts(stats: PremiumStats): {
  standing: PremiumFact[]
  stores: PremiumFact[]
} {
  return {
    standing: [
      { label: "Active", value: formatNumber(stats.active) },
      { label: "Cancelling", value: formatNumber(stats.cancelling) },
      { label: "Lapsed", value: formatNumber(stats.lapsed) },
      { label: "Lifetime", value: formatNumber(stats.lifetime) },
    ],
    stores: stats.by_store.map((row) => ({
      label: storeLabel(row.store),
      value: formatNumber(row.count),
    })),
  }
}

export const BENEFIT_LIMITS = { label: 60, description: 200 } as const

export function benefitDraft(
  benefit: Pick<AdminBenefit, "label" | "description">
): BenefitDraft {
  return { label: benefit.label, description: benefit.description }
}

function fits(text: string, max: number): boolean {
  return text.length > 0 && text.length <= max
}

/** The wording to save, or null while either line is blank or too long. */
export function toBenefitInput(draft: BenefitDraft): UpdateBenefitInput | null {
  const label = draft.label.trim()
  const description = draft.description.trim()
  if (!fits(label, BENEFIT_LIMITS.label)) return null
  if (!fits(description, BENEFIT_LIMITS.description)) return null

  return { label, description }
}

export function benefitMessage(input: UpdateBenefitInput): string {
  if (input.enabled === undefined) return "Paywall line saved."

  return input.enabled ? "Shown on the paywall." : "Hidden from the paywall."
}
