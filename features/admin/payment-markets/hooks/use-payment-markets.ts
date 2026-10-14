"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  listPaymentMarkets,
  listPaymentProviders,
  removePaymentMarket,
  savePaymentMarket,
} from "../api"
import type { UpsertMarketInput } from "../types"
import { adminPaymentMarketKeys } from "../utils/keys"

export function usePaymentMarkets() {
  return useQuery({
    queryKey: adminPaymentMarketKeys.list(),
    queryFn: listPaymentMarkets,
  })
}

export function usePaymentProviders() {
  return useQuery({
    queryKey: adminPaymentMarketKeys.providers(),
    queryFn: listPaymentProviders,
  })
}

export function usePaymentMarketActions() {
  const { run: save } = useAdminMutation({
    mutationFn: ({
      country,
      input,
    }: {
      country: string
      input: UpsertMarketInput
    }) => savePaymentMarket(country, input),
    success: (market) => `${market.country} saved.`,
    invalidates: [adminPaymentMarketKeys.all()],
  })

  const { run: remove } = useAdminMutation({
    mutationFn: (country: string) => removePaymentMarket(country),
    success: "Market removed. Bank payments stop there.",
    invalidates: [adminPaymentMarketKeys.all()],
  })

  return useMemo(
    () => ({
      save: (country: string, input: UpsertMarketInput) =>
        save({ country, input }),
      remove,
    }),
    [save, remove]
  )
}
