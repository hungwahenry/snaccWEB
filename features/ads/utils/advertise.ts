import { formatNaira, formatNumber } from "@/lib/format"
import type { AdsInfo } from "../types"
import { priceLine } from "./estimate"

export interface AdvertiseFact {
  label: string
  value: string
}

export interface AdvertiseStep {
  title: string
  line: string
}

export const ADVERTISE_STEPS: AdvertiseStep[] = [
  {
    title: "Post it on Snacc",
    line: "Promote something you've already posted, then choose Promote from its menu on the web.",
  },
  {
    title: "Choose who sees it",
    line: "Pick campuses, states, school type, gender, class year, students or graduates, the phone they use and the hashtags they're into.",
  },
  {
    title: "Set a budget and dates",
    line: "Pay from your Snacc wallet. You only pay for views, and anything left unspent comes back.",
  },
  {
    title: "Snacc checks it",
    line: "Every promotion is reviewed, usually within a few hours. If it isn't approved, the whole budget comes back.",
  },
]

export const VIEW_RULE =
  "A view counts when at least half of your snacc is on someone's screen for a full second. Each person counts once a day."

export function advertiseFacts(info: AdsInfo): AdvertiseFact[] {
  return [
    { label: "Price", value: priceLine(info.price_per_thousand_kobo) },
    { label: "Smallest budget", value: formatNaira(info.min_budget_kobo) },
    {
      label: "Longest run",
      value: `${info.max_days} ${info.max_days === 1 ? "day" : "days"}`,
    },
    {
      label: "Campuses",
      value: `${formatNumber(info.campuses)} across Nigeria`,
    },
  ]
}
