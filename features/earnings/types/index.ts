export interface WalletMilestone {
  key: string
  current: number
  target: number
  met: boolean
}

export interface Wallet {
  balance: number
  eligible: boolean
  milestones: WalletMilestone[]
}

export interface CampusFund {
  cap: number
  distributed: number
  you: number
  rank: number | null
  earners: number
}

export interface TopSnacc {
  snacc: { id: string; body: string | null }
  total: number
  events: number
}
