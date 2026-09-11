"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useEngagementKinds } from "@/features/admin/engagement/hooks/use-engagement"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { adjustFund, listEarnings, listFunds, provisionFund } from "../api"
import type { EarningListQuery, FundInput } from "../types"
import { kindOptions } from "../utils/earnings"
import { adminEarningsKeys } from "../utils/keys"

export function useEarnings(query: EarningListQuery) {
  return useQuery({
    queryKey: adminEarningsKeys.list(query),
    queryFn: () => listEarnings(query),
    placeholderData: keepPreviousData,
  })
}

export function useFunds() {
  return useQuery({ queryKey: adminEarningsKeys.funds(), queryFn: listFunds })
}

/** Every engagement kind, as choices for the type filter. */
export function useEarningTypes() {
  const query = useEngagementKinds()
  const kinds = query.data

  return useMemo(
    () => ({ options: kindOptions(kinds ?? []), loading: query.isPending }),
    [kinds, query.isPending]
  )
}

export function useFundActions() {
  const invalidates = [adminEarningsKeys.funds()]

  const { run: provision } = useAdminMutation({
    mutationFn: (input: FundInput) => provisionFund(input),
    success: "Fund provisioned.",
    invalidates,
  })
  const { run: adjust } = useAdminMutation({
    mutationFn: ({ universityId, cap }: FundInput) =>
      adjustFund(universityId, cap),
    success: "Cap adjusted.",
    invalidates,
  })

  return useMemo(() => ({ provision, adjust }), [provision, adjust])
}
