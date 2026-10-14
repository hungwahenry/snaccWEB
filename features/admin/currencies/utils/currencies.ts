import { parseAmount } from "@/features/admin/shell/utils/money"
import type { Money } from "@/lib/money"
import type { AdminCurrency } from "../types"

export function filterCurrencies(
  currencies: AdminCurrency[],
  search: string
): AdminCurrency[] {
  const term = search.trim().toLowerCase()
  if (!term) return currencies
  return currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(term) ||
      currency.code.toLowerCase() === term
  )
}

export function settingsLine(currency: AdminCurrency): string {
  return currency.missing_settings === 0
    ? "All set"
    : `${currency.missing_settings} to set`
}

export function enabledMessage(currency: AdminCurrency): string {
  return currency.enabled
    ? `${currency.name} is on. People whose country uses it can hold and move money.`
    : `${currency.name} is off. Money features are hidden from people whose country uses it.`
}

export function toAmount(raw: string, currency: string): Money | null {
  return raw.trim() === "" ? null : parseAmount(raw, currency)
}
