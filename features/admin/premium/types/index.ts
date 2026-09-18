export type PremiumStore = "app_store" | "play_store" | "promotional"

export interface AdminSubscriber {
  id: string
  user: { id: string; username: string | null; display_name: string | null }
  store: PremiumStore
  status: "active" | "grace" | "expired"
  product_id: string
  active: boolean
  lifetime: boolean
  expires_at: string | null
  will_renew: boolean
  sandbox: boolean
  started_at: string
}

export interface PremiumStats {
  active: number
  lapsed: number
  cancelling: number
  lifetime: number
  sandbox: number
  by_store: { store: string; count: number }[]
}

export interface AdminBenefit {
  id: string
  key: string
  label: string
  description: string
  icon: string
  position: number
  enabled: boolean
  updated_at: string
}

export interface UpdateBenefitInput {
  label?: string
  description?: string
  icon?: string
  position?: number
  enabled?: boolean
}

export type SubscriberListQuery = {
  page: number
  perPage: number
  state?: "active" | "lapsed" | "lifetime"
  store?: PremiumStore
  q?: string
}

export interface BenefitDraft {
  label: string
  description: string
}
