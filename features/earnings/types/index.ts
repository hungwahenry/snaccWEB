import type { LucideIcon } from "lucide-react"
import type { WalletOverview } from "@/features/wallet/types"
import type { Money } from "@/lib/money"

export interface MoneyMilestone {
  key: string
  current: Money
  target: Money
  met: boolean
}

export interface CountMilestone {
  key: string
  current: number
  target: number
  met: boolean
}

export type EarningsMilestone = MoneyMilestone | CountMilestone

export interface EarningsBalance {
  balance: Money
  eligible: boolean
  milestones: EarningsMilestone[]
}

export interface EarningsClaim extends WalletOverview {
  claimed: Money
}

export interface CampusFund {
  cap: Money
  distributed: Money
  you: Money
  rank: number | null
  earners: number
}

export interface SnaccPreview {
  id: string
  body: string | null
}

export interface TopSnacc {
  snacc: SnaccPreview
  total: Money
  events: number
}

export interface MilestoneLook {
  label: string
  icon: LucideIcon
  progress: string
  percent: number
}

export interface FundLook {
  standing: string
  shared: string
  cap: string
  percent: number
}
