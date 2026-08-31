export interface AdminSubscriber {
  id: string
  user: { id: string; username: string | null; display_name: string | null }
  store: "app_store" | "play_store" | "promotional"
  status: "active" | "grace" | "expired"
  product_id: string
  active: boolean
  lifetime: boolean
  expires_at: string | null
  will_renew: boolean
  started_at: string
}

export interface PremiumStats {
  active: number
  lapsed: number
  cancelling: number
  lifetime: number
  byStore: { store: string; count: number }[]
}

export interface AdminBenefit {
  id: string
  key: string
  label: string
  description: string
  icon: string
  position: number
  enabled: boolean
}

export interface UpdateBenefitInput {
  label?: string
  description?: string
  icon?: string
  position?: number
  enabled?: boolean
}

export interface SubscriberFilters {
  page?: number
  state?: "active" | "lapsed" | "lifetime"
  store?: AdminSubscriber["store"]
  q?: string
}
