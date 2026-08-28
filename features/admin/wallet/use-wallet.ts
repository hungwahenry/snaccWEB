"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  adjustWallet,
  freezeWallet,
  getWallet,
  getWalletSummary,
  listWalletAccounts,
  listWalletTransactions,
  type WalletQuery,
} from "./index"

const KEY = ["admin", "wallet"]

export function useWalletSummary() {
  return useQuery({ queryKey: [...KEY, "summary"], queryFn: getWalletSummary })
}

export function useWalletAccounts(params: WalletQuery) {
  return useQuery({
    queryKey: [...KEY, "accounts", params],
    queryFn: () => listWalletAccounts(params),
  })
}

export function useWallet(userId: string) {
  return useQuery({
    queryKey: [...KEY, "account", userId],
    queryFn: () => getWallet(userId),
  })
}

export function useWalletTransactions(params: WalletQuery) {
  return useQuery({
    queryKey: [...KEY, "transactions", params],
    queryFn: () => listWalletTransactions(params),
  })
}

export function useWalletMutations(userId: string) {
  const qc = useQueryClient()
  const onError = (error: unknown) => toast.error(getErrorMessage(error))
  const invalidate = () => qc.invalidateQueries({ queryKey: KEY })

  return {
    freeze: useMutation({
      mutationFn: ({ frozen, reason }: { frozen: boolean; reason?: string }) =>
        freezeWallet(userId, frozen, reason),
      onSuccess: (_data, variables) => {
        invalidate()
        toast.success(variables.frozen ? "Wallet frozen." : "Wallet unfrozen.")
      },
      onError,
    }),
    adjust: useMutation({
      mutationFn: ({ delta, reason }: { delta: number; reason: string }) =>
        adjustWallet(userId, delta, reason),
      onSuccess: () => {
        invalidate()
        toast.success("Posted to the ledger.")
      },
      onError,
    }),
  }
}
