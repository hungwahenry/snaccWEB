"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  getPremiumStats,
  grantPremium,
  listBenefits,
  listSubscribers,
  revokePremium,
  updateBenefit,
} from "../api"
import type { SubscriberListQuery, UpdateBenefitInput } from "../types"
import { adminPremiumKeys } from "../utils/keys"
import {
  benefitMessage,
  GRANT_DAYS,
  GRANT_REASON,
  REVOKE_REASON,
} from "../utils/premium"

export function useSubscribers(query: SubscriberListQuery) {
  return useQuery({
    queryKey: adminPremiumKeys.subscribers(query),
    queryFn: () => listSubscribers(query),
    placeholderData: keepPreviousData,
  })
}

export function usePremiumStats() {
  return useQuery({
    queryKey: adminPremiumKeys.stats(),
    queryFn: getPremiumStats,
  })
}

export function useBenefits() {
  return useQuery({
    queryKey: adminPremiumKeys.benefits(),
    queryFn: listBenefits,
  })
}

export function usePremiumActions() {
  const { run: grant } = useAdminMutation({
    mutationFn: (userId: string) =>
      grantPremium(userId, GRANT_DAYS, GRANT_REASON),
    success: "Premium granted.",
    invalidates: [adminPremiumKeys.all()],
  })
  const { run: revoke } = useAdminMutation({
    mutationFn: (userId: string) => revokePremium(userId, REVOKE_REASON),
    success: "Premium ended.",
    invalidates: [adminPremiumKeys.all()],
  })
  const { run: saveBenefit } = useAdminMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBenefitInput }) =>
      updateBenefit(id, input),
    success: (_benefit, { input }) => benefitMessage(input),
    invalidates: [adminPremiumKeys.benefits()],
  })

  return useMemo(
    () => ({
      grant,
      revoke,
      saveBenefit: (id: string, input: UpdateBenefitInput) =>
        saveBenefit({ id, input }),
      setBenefitShown: (id: string, enabled: boolean) =>
        saveBenefit({ id, input: { enabled } }),
    }),
    [grant, revoke, saveBenefit]
  )
}
