import { api } from "@/lib/api/client"
import type {
  AdminPaymentMarket,
  PaymentProviderOption,
  UpsertMarketInput,
} from "../types"

const market = (country: string) =>
  `/admin/payment-markets/${encodeURIComponent(country)}`

export const listPaymentMarkets = () =>
  api.get<AdminPaymentMarket[]>("/admin/payment-markets")

export const listPaymentProviders = () =>
  api.get<PaymentProviderOption[]>("/admin/payment-markets/providers")

export const savePaymentMarket = (country: string, input: UpsertMarketInput) =>
  api.put<AdminPaymentMarket>(market(country), input)

export const removePaymentMarket = (country: string) =>
  api.del<null>(market(country))
