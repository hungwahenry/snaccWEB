import { api } from "@/lib/api/client"
import type { AdminCurrency, CurrencySetting, EarnAmount } from "../types"

const base = (code: string) => `/admin/currencies/${encodeURIComponent(code)}`

export const listCurrencies = () =>
  api.get<AdminCurrency[]>("/admin/currencies")

export const setCurrencyEnabled = (code: string, enabled: boolean) =>
  api.patch<AdminCurrency>(base(code), { enabled })

export const listCurrencySettings = (code: string) =>
  api.get<CurrencySetting[]>(`${base(code)}/settings`)

export const setCurrencySetting = (code: string, key: string, amount: number) =>
  api.patch<CurrencySetting[]>(
    `${base(code)}/settings/${encodeURIComponent(key)}`,
    { amount }
  )

export const listEarnAmounts = (code: string) =>
  api.get<EarnAmount[]>(`${base(code)}/earnings`)

export const setEarnAmount = (
  code: string,
  key: string,
  amount: number | null
) =>
  api.patch<EarnAmount[]>(`${base(code)}/earnings/${encodeURIComponent(key)}`, {
    amount,
  })
