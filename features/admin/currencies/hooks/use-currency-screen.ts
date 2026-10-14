"use client"

import {
  useAdminCurrency,
  useCurrencySettingActions,
  useCurrencySettings,
  useEarnAmountActions,
  useEarnAmounts,
} from "./use-currencies"

export function useCurrencyScreen(code: string) {
  return {
    currency: useAdminCurrency(code).data ?? null,
    settings: useCurrencySettings(code),
    settingActions: useCurrencySettingActions(code),
    earnings: useEarnAmounts(code),
    earningActions: useEarnAmountActions(code),
  }
}
