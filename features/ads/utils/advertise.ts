import { formatNaira } from "@/lib/format"
import type { AdsInfo } from "../types"
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

function rateLine({ min, max }: AdsInfo["price_per_thousand_kobo"]): string {
  return min === max
    ? `${formatNaira(min)} per 1,000 views`
    : `${formatNaira(min)}–${formatNaira(max)} per 1,000 views, depending on the campus`
}

export function advertisePricing(info: AdsInfo): AdvertisePricing {
  return {
    start: formatNaira(info.min_budget_kobo),
    views: viewsRange(info.min_budget_kobo, info.price_per_thousand_kobo),
    rate: rateLine(info.price_per_thousand_kobo),
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
      a: `You choose the budget, starting from ${formatNaira(info.min_budget_kobo)}. It costs ${rateLine(info.price_per_thousand_kobo)}, and whatever isn't spent goes back to your wallet.`,
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
