import {
  EyeIcon,
  MousePointerClickIcon,
  UsersRoundIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"
import { DAY_MS } from "@/lib/duration"
import { compactCount, formatNaira } from "@/lib/format"
import type { Campaign, CampaignDay } from "../types"

export interface ResultStat {
  icon: LucideIcon
  label: string
  value: (campaign: Campaign) => string
}

export const RESULT_STATS: ResultStat[] = [
  {
    icon: EyeIcon,
    label: "Views",
    value: (campaign) => compactCount(campaign.views_count),
  },
  {
    icon: MousePointerClickIcon,
    label: "Button taps",
    value: (campaign) => compactCount(campaign.clicks_count),
  },
  {
    icon: WalletIcon,
    label: "Spent",
    value: (campaign) => formatNaira(campaign.spent_kobo),
  },
  {
    icon: UsersRoundIcon,
    label: "Audience size",
    value: (campaign) => compactCount(campaign.reach),
  },
]

export const RESULTS_CHART = "Views a day"

const dayTime = (day: string) => Date.parse(`${day}T00:00:00Z`)

const dayKey = (time: number) => new Date(time).toISOString().slice(0, 10)

export function everyDay(days: CampaignDay[]): CampaignDay[] {
  const first = days[0]
  const last = days.at(-1)
  if (!first || !last) return []

  const known = new Map(days.map((day) => [day.day, day]))
  const filled: CampaignDay[] = []
  for (
    let time = dayTime(first.day);
    time <= dayTime(last.day);
    time += DAY_MS
  ) {
    const key = dayKey(time)
    filled.push(
      known.get(key) ?? { day: key, views: 0, clicks: 0, spent_kobo: 0 }
    )
  }
  return filled
}
