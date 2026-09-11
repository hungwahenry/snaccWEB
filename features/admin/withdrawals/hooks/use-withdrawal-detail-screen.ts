"use client"

import { useWithdrawal, useWithdrawalActions } from "./use-withdrawals"

export function useWithdrawalDetailScreen(id: string) {
  return { query: useWithdrawal(id), actions: useWithdrawalActions(id) }
}
