import { formatNaira } from "@/lib/format"
import type { LimitRail, PayMode, SendTarget, WalletLimits } from "../types"

export type AmountProblem =
  "below_min" | "above_max" | "insufficient" | "over_limit"

export interface AmountRules {
  mode: PayMode
  amountKobo: number
  minKobo: number
  maxKobo: number
  feeKobo: number
  balance: number
  /** What the day's limit still allows on this rail, when known. */
  leftToday: number | null
}

export interface AmountCheck {
  ready: boolean
  problem: AmountProblem | null
  fee: number
  total: number
  shortfall: number
  /** Only a send spends the balance, so only a send has one after. */
  balanceAfter: number | null
}

function problemOf(
  rules: AmountRules,
  shortfall: number
): AmountProblem | null {
  if (rules.amountKobo <= 0) return null
  if (rules.amountKobo < rules.minKobo) return "below_min"
  if (rules.amountKobo > rules.maxKobo) return "above_max"
  if (shortfall > 0) return "insufficient"
  if (rules.leftToday !== null && rules.amountKobo > rules.leftToday)
    return "over_limit"
  return null
}

export function checkAmount(rules: AmountRules): AmountCheck {
  const spends = rules.mode === "send"
  const fee = spends ? rules.feeKobo : 0
  const total = rules.amountKobo + fee
  const shortfall = spends ? Math.max(0, total - rules.balance) : 0
  const problem = problemOf(rules, shortfall)

  return {
    ready: rules.amountKobo > 0 && problem === null,
    problem,
    fee,
    total,
    shortfall,
    balanceAfter: spends ? rules.balance - total : null,
  }
}

/** Which daily limit a move counts against. Asking moves nothing, so it has none. */
export function limitRail(mode: PayMode, toBank: boolean): LimitRail | null {
  if (mode === "topup") return "deposit"
  if (mode === "request") return null
  return toBank ? "bank_send" : "send"
}

export function leftToday(
  limits: WalletLimits | undefined,
  rail: LimitRail | null
): number | null {
  if (!limits || !rail) return null
  return Math.max(0, limits[rail].limit - limits[rail].used)
}

export function sendsToBank(
  mode: PayMode,
  bankMode: boolean,
  target: SendTarget | null
): boolean {
  return mode === "send" && (bankMode || target?.kind === "bank")
}

const STARTS_AT: Record<PayMode, string> = {
  send: "Sends start at",
  request: "Requests start at",
  topup: "Top-ups start at",
}

/** The line under the amount: what is wrong with it, or else what is worth knowing. */
export function amountHint(rules: AmountRules, check: AmountCheck): string {
  switch (check.problem) {
    case "below_min":
      return `${STARTS_AT[rules.mode]} ${formatNaira(rules.minKobo)}.`
    case "above_max":
      return `Top-ups go up to ${formatNaira(rules.maxKobo)}.`
    case "insufficient":
      return check.fee > 0
        ? `With the ${formatNaira(check.fee)} bank fee, that is more than your wallet holds.`
        : "That is more than your wallet holds."
    case "over_limit":
      return rules.leftToday
        ? `That is over your daily limit. ${formatNaira(rules.leftToday)} left today.`
        : "You have hit your daily limit. It frees up over the next 24 hours."
    default:
      if (rules.mode === "topup") {
        return `From ${formatNaira(rules.minKobo)} to ${formatNaira(rules.maxKobo)}.`
      }
      if (rules.mode === "request") return "Nothing moves until they pay."
      return `You have ${formatNaira(rules.balance)}.`
  }
}

/** A top-up big enough to cover a shortfall, and never below the smallest top-up allowed. */
export function topUpFor(shortfall: number, minTopUpKobo: number): number {
  return Math.max(shortfall, minTopUpKobo)
}

export type AmountFix =
  | { kind: "topup"; label: string; amountKobo: number }
  | { kind: "limits"; label: string }

/** The one-tap way out of a problem, when there is one. */
export function amountFix(
  check: AmountCheck,
  minTopUpKobo: number
): AmountFix | null {
  if (check.problem === "insufficient") {
    const amountKobo = topUpFor(check.shortfall, minTopUpKobo)
    return {
      kind: "topup",
      label: `Add ${formatNaira(amountKobo)} to cover it`,
      amountKobo,
    }
  }
  if (check.problem === "over_limit")
    return { kind: "limits", label: "See your limits" }
  return null
}

/** What paying a request would leave short, or null when the balance covers it. */
export function requestShortfall(
  amount: number,
  balance: number
): number | null {
  return amount > balance ? amount - balance : null
}
