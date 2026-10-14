import {
  addMoney,
  formatMoney,
  money,
  subtractMoney,
  type Money,
} from "@/lib/money"
import type { LimitRail, PayMode, SendTarget, WalletLimits } from "../types"

export type AmountProblem =
  "below_min" | "above_max" | "insufficient" | "over_limit"

export interface AmountRules {
  mode: PayMode
  amount: Money
  min: Money
  max: Money
  fee: Money
  balance: Money
  /** What the day's limit still allows on this rail, when known. */
  leftToday: Money | null
}

export interface AmountCheck {
  ready: boolean
  problem: AmountProblem | null
  fee: Money
  total: Money
  shortfall: Money
  /** Only a send spends the balance, so only a send has one after. */
  balanceAfter: Money | null
}

function problemOf(rules: AmountRules, shortfall: Money): AmountProblem | null {
  const { amount } = rules.amount
  if (amount <= 0) return null
  if (amount < rules.min.amount) return "below_min"
  if (amount > rules.max.amount) return "above_max"
  if (shortfall.amount > 0) return "insufficient"
  if (rules.leftToday !== null && amount > rules.leftToday.amount)
    return "over_limit"
  return null
}

export function checkAmount(rules: AmountRules): AmountCheck {
  const { currency } = rules.amount
  const spends = rules.mode === "send"
  const fee = spends ? rules.fee : money(0, currency)
  const total = addMoney(rules.amount, fee)
  const shortfall = money(
    spends ? Math.max(0, total.amount - rules.balance.amount) : 0,
    currency
  )
  const problem = problemOf(rules, shortfall)

  return {
    ready: rules.amount.amount > 0 && problem === null,
    problem,
    fee,
    total,
    shortfall,
    balanceAfter: spends ? subtractMoney(rules.balance, total) : null,
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
): Money | null {
  if (!limits || !rail) return null
  const { limit, used } = limits[rail]
  return money(Math.max(0, limit.amount - used.amount), limit.currency)
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
      return `${STARTS_AT[rules.mode]} ${formatMoney(rules.min)}.`
    case "above_max":
      return `Top-ups go up to ${formatMoney(rules.max)}.`
    case "insufficient":
      return check.fee.amount > 0
        ? `With the ${formatMoney(check.fee)} bank fee, that is more than your wallet holds.`
        : "That is more than your wallet holds."
    case "over_limit":
      return rules.leftToday && rules.leftToday.amount > 0
        ? `That is over your daily limit. ${formatMoney(rules.leftToday)} left today.`
        : "You have hit your daily limit. It frees up over the next 24 hours."
    default:
      if (rules.mode === "topup") {
        return `From ${formatMoney(rules.min)} to ${formatMoney(rules.max)}.`
      }
      if (rules.mode === "request") return "Nothing moves until they pay."
      return `You have ${formatMoney(rules.balance)}.`
  }
}

/** A top-up big enough to cover a shortfall, and never below the smallest top-up allowed. */
export function topUpFor(shortfall: Money, minTopUp: Money): Money {
  return shortfall.amount > minTopUp.amount ? shortfall : minTopUp
}

export type AmountFix =
  | { kind: "topup"; label: string; amount: Money }
  | { kind: "limits"; label: string }

/** The one-tap way out of a problem, when there is one. */
export function amountFix(
  check: AmountCheck,
  minTopUp: Money | null
): AmountFix | null {
  if (check.problem === "insufficient" && minTopUp) {
    const amount = topUpFor(check.shortfall, minTopUp)
    return {
      kind: "topup",
      label: `Add ${formatMoney(amount)} to cover it`,
      amount,
    }
  }
  if (check.problem === "over_limit")
    return { kind: "limits", label: "See your limits" }
  return null
}

/** What paying a request would leave short, or null when the balance covers it. */
export function requestShortfall(amount: Money, balance: Money): Money | null {
  return amount.amount > balance.amount ? subtractMoney(amount, balance) : null
}
