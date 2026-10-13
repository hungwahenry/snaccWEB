import { formatDate } from "@/lib/format"
import { formatMoney, minorDigits, money } from "@/lib/money"
import type { Premium, PremiumPlan, PremiumWalletPlan } from "../types"

export interface PlanTerms {
  title: string
  price: string
  per: string
  length: string
  perMonth: string | null
  summary: string
}

const NAMES: Record<PremiumPlan, { title: string; per: string }> = {
  monthly: { title: "Monthly", per: "month" },
  yearly: { title: "Yearly", per: "year" },
}

function monthOf(plan: PremiumWalletPlan) {
  const unit = 10 ** minorDigits(plan.price.currency)
  return money(
    Math.round(plan.price.amount / (12 * unit)) * unit,
    plan.price.currency
  )
}

export function walletPlanTerms(plan: PremiumWalletPlan): PlanTerms {
  const name = NAMES[plan.plan]

  return {
    title: name.title,
    price: formatMoney(plan.price),
    per: name.per,
    length: `${plan.days} days`,
    perMonth:
      plan.plan === "yearly" ? `${formatMoney(monthOf(plan))} a month` : null,
    summary: `Every Premium benefit for ${plan.days} days, paid once from your Snacc balance. Nothing renews.`,
  }
}

export function standingLine(
  premium: Pick<Premium, "active" | "lifetime" | "until" | "will_renew">
): string {
  if (!premium.active) {
    return "Snacc has no ads and no investors. Premium is what pays for it."
  }
  if (premium.lifetime) return "Yours for life. Nothing to renew."

  const until = formatDate(premium.until)
  return premium.will_renew
    ? `Renews ${until}.`
    : `Runs until ${until}, then stops.`
}
