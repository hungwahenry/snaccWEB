import { formatMoney } from "@/lib/money"
import type { AdsInfo, PriceRange } from "../types"
import { viewsRange } from "./estimate"

export const HOW_IT_WORKS_ID = "how-it-works"

export interface AdvertisePricing {
  start: string
  views: string | null
  rate: string
}

export interface AdvertiseQuestion {
  q: string
  a: string
}

function rateLine({ min, max }: PriceRange): string {
  return min.amount === max.amount
    ? `${formatMoney(min)} per 1,000 views`
    : `${formatMoney(min)}–${formatMoney(max)} per 1,000 views, depending on the campus`
}

function startLine(info: AdsInfo): string {
  return info.prices
    .map((prices) => formatMoney(prices.min_budget))
    .join(" or ")
}

function ratesLine(info: AdsInfo): string {
  return info.prices
    .map((prices) => rateLine(prices.price_per_thousand))
    .join("; ")
}

export function isAdvertisable(info: AdsInfo | null): info is AdsInfo {
  return info !== null && info.prices.length > 0
}

export function advertisePricing(info: AdsInfo): AdvertisePricing {
  const [only, ...others] = info.prices
  return {
    start: startLine(info),
    views:
      only && others.length === 0
        ? viewsRange(only.min_budget, only.price_per_thousand)
        : null,
    rate: ratesLine(info),
  }
}

export function advertiseQuestions(info: AdsInfo): AdvertiseQuestion[] {
  const questions: AdvertiseQuestion[] = [
    {
      q: "What can I promote?",
      a: "Anything you've posted on Snacc: a flyer, a photo, a clip, a poll. You can add a button like Order now, Book now or Learn more that opens your link.",
    },
    {
      q: "How much does it cost?",
      a: `You choose the budget, starting from ${startLine(info)}. It costs ${ratesLine(info)}, and whatever isn't spent goes back to your wallet.`,
    },
    {
      q: "What counts as a view?",
      a: "Someone has at least half of your snacc on their screen for a full second. Each person counts once a day, so you're not paying for the same scroll twice.",
    },
    {
      q: "How quickly does it go live?",
      a: "Our team checks every promotion, usually within a few hours. If it isn't approved, the whole budget comes back to your wallet.",
    },
    {
      q: "Can I change it once it's running?",
      a: `Yes. Pause it, add to the budget or push back the end date whenever you like, up to ${info.max_days} days from the start. Stop it and the rest of the budget comes back.`,
    },
    {
      q: "How do I pay?",
      a: "From your Snacc wallet. Add money to it, then pay for your promotion in a tap.",
    },
    {
      q: "Where do I set it up?",
      a: "On the web at snacc.fyi. Open any of your snaccs, tap the menu, and choose Promote.",
    },
  ]

  if (info.prohibited.length > 0) {
    questions.splice(4, 0, {
      q: "Is there anything I can't promote?",
      a: `Yes. We don't take promotions for: ${info.prohibited.join(", ")}.`,
    })
  }

  return questions
}
