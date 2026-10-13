import {
  EyeIcon,
  HeartIcon,
  MessageCircleIcon,
  MousePointerClickIcon,
  RepeatIcon,
  UserRoundIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"
import { DAY_MS } from "@/lib/duration"
import { compactCount } from "@/lib/format"
import { formatMoney, money } from "@/lib/money"
import type { Campaign, CampaignDay, CampaignEngagement } from "../types"

const BUTTON_TAPS = "Button taps"

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
    label: BUTTON_TAPS,
    value: (campaign) => compactCount(campaign.clicks_count),
  },
  {
    icon: WalletIcon,
    label: "Spent",
    value: (campaign) => formatMoney(campaign.spent),
  },
  {
    icon: UsersRoundIcon,
    label: "Audience size",
    value: (campaign) => compactCount(campaign.reach),
  },
]

export function resultStats(campaign: Pick<Campaign, "button">): ResultStat[] {
  return campaign.button
    ? RESULT_STATS
    : RESULT_STATS.filter((stat) => stat.label !== BUTTON_TAPS)
}

export interface EngagementStat {
  icon: LucideIcon
  label: string
  value: (engagement: CampaignEngagement) => string
}

export const ENGAGEMENT_STATS: EngagementStat[] = [
  {
    icon: HeartIcon,
    label: "Likes",
    value: (engagement) => compactCount(engagement.likes),
  },
  {
    icon: MessageCircleIcon,
    label: "Replies",
    value: (engagement) => compactCount(engagement.replies),
  },
  {
    icon: RepeatIcon,
    label: "Resnaccs",
    value: (engagement) => compactCount(engagement.resnaccs),
  },
  {
    icon: UserRoundIcon,
    label: "Profile visits",
    value: (engagement) => compactCount(engagement.profile_visits),
  },
  {
    icon: UserRoundPlusIcon,
    label: "New followers",
    value: (engagement) => compactCount(engagement.follows),
  },
]

export const RESULTS_CHART = "Views a day"

export const ENGAGEMENT_SECTION = {
  title: "What it led to",
  note: "From people who saw it as a promotion, after they saw it.",
}

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
      known.get(key) ?? {
        day: key,
        views: 0,
        clicks: 0,
        spent: money(0, first.spent.currency),
      }
    )
  }
  return filled
}
