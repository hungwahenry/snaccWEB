import {
  BookOpenIcon,
  EyeIcon,
  FootprintsIcon,
  TimerIcon,
  UserRoundPlusIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"
import { compactCount, formatDuration, percent } from "@/lib/format"
import type { InsightsSummary } from "../types"

export interface InsightStat {
  icon: LucideIcon
  label: string
  value: (summary: InsightsSummary) => string
}

export const INSIGHT_STATS: InsightStat[] = [
  {
    icon: EyeIcon,
    label: "Views",
    value: (summary) => compactCount(summary.views),
  },
  {
    icon: BookOpenIcon,
    label: "Opened",
    value: (summary) => percent(summary.open_rate),
  },
  {
    icon: TimerIcon,
    label: "Average read",
    value: (summary) => formatDuration(summary.dwell_seconds),
  },
  {
    icon: ZapIcon,
    label: "Engaged",
    value: (summary) => percent(summary.engagement_rate),
  },
  {
    icon: UserRoundPlusIcon,
    label: "New followers",
    value: (summary) => compactCount(summary.followers_gained),
  },
  {
    icon: FootprintsIcon,
    label: "Profile visits",
    value: (summary) => compactCount(summary.profile_visits),
  },
]

export const INSIGHT_PANELS = {
  views: "Views a day",
  followers: "Followers a day",
  hours: "When people read you",
} as const

export const INSIGHTS_PITCH = {
  title: "See how your snaccs do",
  body: "Reach, how far people read, and who tapped through to you.",
} as const
