"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  grantPremium,
  listBenefits,
  listSubscribers,
  premiumStats,
  revokePremium,
  updateBenefit,
} from "../api"
import type { SubscriberFilters, UpdateBenefitInput } from "../types"

const KEY = ["admin", "premium"]

export function useSubscribers(filters: SubscriberFilters) {
  return useQuery({
    queryKey: [...KEY, "subscribers", filters],
    queryFn: () => listSubscribers(filters),
  })
}

export function usePremiumStats() {
  return useQuery({ queryKey: [...KEY, "stats"], queryFn: premiumStats })
}

export function useBenefits() {
  return useQuery({ queryKey: [...KEY, "benefits"], queryFn: listBenefits })
}

export function usePremiumMutations() {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: KEY })
  const onError = (error: unknown) => toast.error(getErrorMessage(error))

  return {
    grant: useMutation({
      mutationFn: ({
        userId,
        days,
        reason,
      }: {
        userId: string
        days: number
        reason: string
      }) => grantPremium(userId, days, reason),
      onSuccess: () => {
        toast.success("Premium granted.")
        void refresh()
      },
      onError,
    }),
    revoke: useMutation({
      mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
        revokePremium(userId, reason),
      onSuccess: () => {
        toast.success("Premium ended.")
        void refresh()
      },
      onError,
    }),
    updateBenefit: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateBenefitInput }) =>
        updateBenefit(id, input),
      onSuccess: refresh,
      onError,
    }),
  }
}
