"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { clearAdPrice, listAdPrices, setAdPrice } from "../api"
import type { PriceListQuery } from "../types"
import { adminAdKeys } from "../utils/keys"

export function useAdPrices(query: PriceListQuery) {
  return useQuery({
    queryKey: adminAdKeys.priceList(query),
    queryFn: () => listAdPrices(query),
    placeholderData: keepPreviousData,
  })
}

export function useAdPriceActions() {
  const invalidates = [adminAdKeys.prices()]

  const { run: save } = useAdminMutation({
    mutationFn: ({
      universityId,
      kobo,
    }: {
      universityId: string
      kobo: number
    }) => setAdPrice(universityId, kobo),
    success: "Price saved.",
    invalidates,
  })
  const { run: reset } = useAdminMutation({
    mutationFn: (universityId: string) => clearAdPrice(universityId),
    success: "Back on the default price.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (universityId: string, kobo: number) =>
        save({ universityId, kobo }),
      reset: (universityId: string) => reset(universityId),
    }),
    [save, reset]
  )
}
