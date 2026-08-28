"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  claimWithdrawal,
  getWithdrawal,
  getWithdrawalSummary,
  listWithdrawals,
  releaseWithdrawal,
  retryWithdrawal,
  settleWithdrawal,
} from "./api"
import type { ListWithdrawalsParams, SettleWithdrawalInput } from "./types"

export function useWithdrawals(params: ListWithdrawalsParams) {
  return useQuery({
    queryKey: ["admin", "withdrawals", params],
    queryFn: () => listWithdrawals(params),
    placeholderData: keepPreviousData,
  })
}

export function useWithdrawalSummary() {
  return useQuery({
    queryKey: ["admin", "withdrawals", "summary"],
    queryFn: getWithdrawalSummary,
  })
}

export function useWithdrawal(id: string) {
  return useQuery({
    queryKey: ["admin", "withdrawal", id],
    queryFn: () => getWithdrawal(id),
    enabled: !!id,
  })
}

export function useWithdrawalMutations(id: string) {
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] })
    queryClient.invalidateQueries({ queryKey: ["admin", "withdrawal", id] })
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    settle: useMutation({
      mutationFn: (input: SettleWithdrawalInput) => settleWithdrawal(id, input),
      onSuccess: () => {
        invalidate()
        toast.success("Withdrawal settled.")
      },
      onError,
    }),
    claim: useMutation({
      mutationFn: () => claimWithdrawal(id),
      onSuccess: () => {
        invalidate()
        toast.success("Claimed — it is yours to pay.")
      },
      onError,
    }),
    release: useMutation({
      mutationFn: () => releaseWithdrawal(id),
      onSuccess: () => {
        invalidate()
        toast.success("Released back to the queue.")
      },
      onError,
    }),
    retry: useMutation({
      mutationFn: () => retryWithdrawal(id),
      onSuccess: () => {
        invalidate()
        toast.success("Transfer retried.")
      },
      onError,
    }),
  }
}
