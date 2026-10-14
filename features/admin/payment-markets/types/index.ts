import type { DepositMethod, PayoutMethod } from "@/features/wallet/types"

export interface AdminPaymentMarket {
  country_code: string
  country: string
  currency: string
  provider_key: string
  provider: string
  deposit_methods: DepositMethod[]
  payout_methods: PayoutMethod[]
  account_number_length: number
  id_name: string | null
  id_length: number | null
  provider_settings: Record<string, unknown>
  updated_at: string
}

export interface PaymentProviderOption {
  key: string
  name: string
}

export interface MarketDraft {
  country: string | null
  provider: string | null
  deposits: DepositMethod[]
  payouts: PayoutMethod[]
  accountNumberLength: string
  idName: string
  idLength: string
  settings: string
}

export interface UpsertMarketInput {
  providerKey: string
  depositMethods: DepositMethod[]
  payoutMethods: PayoutMethod[]
  accountNumberLength: number
  idName: string | null
  idLength: number | null
  providerSettings: Record<string, unknown>
}
