import type { LucideIcon } from "lucide-react"
import type { WalletOverview } from "@/features/wallet/types"

export interface EarningsMilestone {
  key: string
  current: number
  target: number
  met: boolean
}

export interface EarningsBalance {
  balance: number
  eligible: boolean
  milestones: EarningsMilestone[]
}

export interface EarningsClaim extends WalletOverview {
  claimed: number
}

export interface CampusFund {
  cap: number
  distributed: number
  you: number
  rank: number | null
  earners: number
}

export interface SnaccPreview {
  id: string
  body: string | null
}

export interface TopSnacc {
  snacc: SnaccPreview
  total: number
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
