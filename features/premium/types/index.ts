export interface PremiumBenefit {
  key: string
  label: string
  description: string
  icon: string
}

export type PremiumPlan = "monthly" | "yearly"

export interface PremiumWalletPlan {
  plan: PremiumPlan
  days: number
  price_kobo: number
}

export interface Premium {
  active: boolean
  until: string | null
  lifetime: boolean
  will_renew: boolean
  store: string | null
  product_id: string | null
  benefits: PremiumBenefit[]
  /** Null when this client may not sell Premium this way, which is every app. */
  wallet_plans: PremiumWalletPlan[] | null
}

export interface PremiumPurchase {
  plan: PremiumPlan
  price_kobo: number
  until: string
  reference: string
}
