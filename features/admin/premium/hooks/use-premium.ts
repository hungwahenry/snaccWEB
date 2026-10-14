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
import { adminUserKeys } from "@/features/admin/users/utils/keys"
import type {
  GrantPremiumInput,
  SubscriberListQuery,
  UpdateBenefitInput,
} from "../types"
import { adminPremiumKeys } from "../utils/keys"
import { benefitMessage, DEFAULT_GRANT, REVOKE_REASON } from "../utils/premium"

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

export function usePremiumGrants() {
  const invalidates = [adminPremiumKeys.all(), adminUserKeys.all()]

  const { run: grant } = useAdminMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: string
      input: GrantPremiumInput
    }) => grantPremium(userId, input.days, input.reason),
    success: "Premium granted.",
    invalidates,
  })
  const { run: revoke } = useAdminMutation({
    mutationFn: (userId: string) => revokePremium(userId, REVOKE_REASON),
    success: "Premium ended.",
    invalidates,
  })

  return useMemo(
    () => ({
      grant: (userId: string, input: GrantPremiumInput = DEFAULT_GRANT) =>
        grant({ userId, input }),
      revoke,
    }),
    [grant, revoke]
  )
}

export function usePremiumActions() {
  const { grant, revoke } = usePremiumGrants()
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
