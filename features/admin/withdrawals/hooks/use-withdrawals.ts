"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  getWithdrawal,
  getWithdrawalSummary,
  listWithdrawals,
  retryWithdrawal,
} from "../api"
import type { WithdrawalListQuery } from "../types"
import { adminWithdrawalKeys } from "../utils/keys"

export function useWithdrawals(query: WithdrawalListQuery) {
  return useQuery({
    queryKey: adminWithdrawalKeys.list(query),
    queryFn: () => listWithdrawals(query),
    placeholderData: keepPreviousData,
  })
}

export function useWithdrawalSummary() {
  return useQuery({
    queryKey: adminWithdrawalKeys.summary(),
    queryFn: getWithdrawalSummary,
  })
}

export function useWithdrawal(id: string) {
  return useQuery({
    queryKey: adminWithdrawalKeys.detail(id),
    queryFn: () => getWithdrawal(id),
  })
}

export function useWithdrawalActions(id: string) {
  const { run: retry } = useAdminMutation({
    mutationFn: () => retryWithdrawal(id),
    success: "Sent to Paystack again.",
    invalidates: [adminWithdrawalKeys.all()],
  })

  return useMemo(() => ({ retry }), [retry])
}
