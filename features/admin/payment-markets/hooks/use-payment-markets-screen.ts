"use client"

import { useMemo } from "react"
import { useCountryChoices } from "@/features/admin/countries/hooks/use-country-choices"
import {
  usePaymentMarketActions,
  usePaymentMarkets,
  usePaymentProviders,
} from "./use-payment-markets"

export function usePaymentMarketsScreen() {
  const providers = usePaymentProviders()
  const countries = useCountryChoices()

  const providerOptions = useMemo(
    () =>
      (providers.data ?? []).map((provider) => ({
        value: provider.key,
        label: provider.name,
      })),
    [providers.data]
  )

  return {
    query: usePaymentMarkets(),
    actions: usePaymentMarketActions(),
    choices: {
      countries: countries.options,
      providers: providerOptions,
      providerList: providers.data ?? [],
    },
  }
}

export type MarketChoices = ReturnType<
  typeof usePaymentMarketsScreen
>["choices"]
