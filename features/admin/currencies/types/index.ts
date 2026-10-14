import type { Money } from "@/lib/money"

export interface AdminCurrency {
  code: string
  name: string
  enabled: boolean
  open_in: string[]
  missing_settings: number
}

export interface EarnAmount {
  key: string
  label: string
  amount: Money | null
}

export interface CurrencySetting {
  key: string
  category: string
  description: string
  amount: Money | null
}
