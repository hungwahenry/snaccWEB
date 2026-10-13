import {
  BanknoteIcon,
  CalendarDaysIcon,
  CircleDashedIcon,
  EyeIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react"
import { compactCount } from "@/lib/format"
import { formatMoney, type Money } from "@/lib/money"
import type { EarningsMilestone, MilestoneLook, MoneyMilestone } from "../types"

const META: Record<string, { label: string; icon: LucideIcon }> = {
  balance: { label: "Minimum earnings", icon: BanknoteIcon },
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
  const look = { label: meta.label, icon: meta.icon }

  return isMoney(milestone)
    ? {
        ...look,
        progress: `${formatMoney(milestone.current)} / ${formatMoney(milestone.target)}`,
        percent: progressPercent(
          milestone.current.amount,
          milestone.target.amount
        ),
      }
    : {
        ...look,
        progress: `${compactCount(milestone.current)} / ${compactCount(milestone.target)}`,
        percent: progressPercent(milestone.current, milestone.target),
      }
}

function isMoney(milestone: EarningsMilestone): milestone is MoneyMilestone {
  return typeof milestone.current !== "number"
}

export function clearedCount(milestones: EarningsMilestone[]): number {
  return milestones.filter((milestone) => milestone.met).length
}

export function clearedLabel(milestones: EarningsMilestone[]): string {
  return `${clearedCount(milestones)} of ${milestones.length} cleared`
}

export function earningsLine(earnings: {
  balance: Money
  claimable: boolean
  milestones: EarningsMilestone[]
}): string {
  const amount = formatMoney(earnings.balance)
  if (earnings.claimable) return `${amount} ready to claim`
  return `${amount} earned — ${clearedCount(earnings.milestones)} of ${earnings.milestones.length} milestones`
}
