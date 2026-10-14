"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  listCurrencies,
  listCurrencySettings,
  listEarnAmounts,
  setCurrencyEnabled,
  setCurrencySetting,
  setEarnAmount,
} from "../api"
import { enabledMessage, filterCurrencies } from "../utils/currencies"
import { adminCurrencyKeys } from "../utils/keys"

export function useAdminCurrencies(search: string) {
  return useQuery({
    queryKey: adminCurrencyKeys.list(),
    queryFn: listCurrencies,
    select: (currencies) => filterCurrencies(currencies, search),
  })
}

export function useAdminCurrency(code: string) {
  return useQuery({
    queryKey: adminCurrencyKeys.list(),
    queryFn: listCurrencies,
    select: (currencies) =>
      currencies.find((currency) => currency.code === code) ?? null,
  })
}

export function useCurrencySettings(code: string) {
  return useQuery({
    queryKey: adminCurrencyKeys.settings(code),
    queryFn: () => listCurrencySettings(code),
  })
}

export function useEarnAmounts(code: string) {
  return useQuery({
    queryKey: adminCurrencyKeys.earnings(code),
    queryFn: () => listEarnAmounts(code),
  })
}

export function useCurrencyActions() {
  const { run: setEnabled } = useAdminMutation({
    mutationFn: ({ code, enabled }: { code: string; enabled: boolean }) =>
      setCurrencyEnabled(code, enabled),
    success: enabledMessage,
    invalidates: [adminCurrencyKeys.all()],
  })

  return useMemo(
    () => ({
      setEnabled: (code: string, enabled: boolean) =>
        setEnabled({ code, enabled }),
    }),
    [setEnabled]
  )
}

export function useCurrencySettingActions(code: string) {
  const { run: save } = useAdminMutation({
    mutationFn: ({ key, amount }: { key: string; amount: number }) =>
      setCurrencySetting(code, key, amount),
    success: (_, { key }) => `${key} saved.`,
    invalidates: [adminCurrencyKeys.all()],
  })

  return useMemo(
    () => ({
      save: (key: string, amount: number) => save({ key, amount }),
    }),
    [save]
  )
}

export function useEarnAmountActions(code: string) {
  const { run: save } = useAdminMutation({
    mutationFn: ({ key, amount }: { key: string; amount: number | null }) =>
      setEarnAmount(code, key, amount),
    success: (_, { key }) => `What ${key} earns is saved.`,
    invalidates: [adminCurrencyKeys.earnings(code)],
  })

  return useMemo(
    () => ({
      save: (key: string, amount: number | null) => save({ key, amount }),
    }),
    [save]
  )
}
