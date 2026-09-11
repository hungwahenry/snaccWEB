import {
  BanknoteIcon,
  CalendarDaysIcon,
  CircleDashedIcon,
  EyeIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"
import { compactCount, formatNaira } from "@/lib/format"
import type { EarningsMilestone, MilestoneLook } from "../types"

const META: Record<
  string,
  { label: string; icon: LucideIcon; money?: boolean }
> = {
  balance: { label: "Minimum earnings", icon: BanknoteIcon, money: true },
  views: { label: "Total views", icon: EyeIcon },
  followers: { label: "Followers", icon: UsersRoundIcon },
  account_age_days: { label: "Days on Snacc", icon: CalendarDaysIcon },
}

export function progressPercent(part: number, whole: number): number {
  return whole > 0 ? Math.min(100, Math.round((part / whole) * 100)) : 0
}

export function milestoneLook(milestone: EarningsMilestone): MilestoneLook {
  const meta = META[milestone.key] ?? {
    label: milestone.key,
    icon: CircleDashedIcon,
  }
  const format = (value: number) =>
    meta.money ? formatNaira(value) : compactCount(value)

  return {
    label: meta.label,
    icon: meta.icon,
    progress: `${format(milestone.current)} / ${format(milestone.target)}`,
    percent: progressPercent(milestone.current, milestone.target),
  }
}

export function clearedCount(milestones: EarningsMilestone[]): number {
  return milestones.filter((milestone) => milestone.met).length
}

export function clearedLabel(milestones: EarningsMilestone[]): string {
  return `${clearedCount(milestones)} of ${milestones.length} cleared`
}

export function earningsLine(earnings: {
  balance: number
  claimable: boolean
  milestones: EarningsMilestone[]
}): string {
  const amount = formatNaira(earnings.balance)
  if (earnings.claimable) return `${amount} ready to claim`
  return `${amount} earned — ${clearedCount(earnings.milestones)} of ${earnings.milestones.length} milestones`
}
