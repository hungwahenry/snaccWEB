"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  adjustWallet,
  freezeWallet,
  getWallet,
  getWalletSummary,
  listWalletAccounts,
  unfreezeWallet,
} from "../api"
import type { AdjustWalletInput, WalletAccountListQuery } from "../types"
import { adminWalletKeys } from "../utils/keys"

export function useWalletSummary() {
  return useQuery({
    queryKey: adminWalletKeys.summary(),
    queryFn: getWalletSummary,
  })
}

export function useWalletAccounts(query: WalletAccountListQuery) {
  return useQuery({
    queryKey: adminWalletKeys.accounts(query),
    queryFn: () => listWalletAccounts(query),
    placeholderData: keepPreviousData,
  })
}

export function useWallet(userId: string) {
  return useQuery({
    queryKey: adminWalletKeys.detail(userId),
    queryFn: () => getWallet(userId),
  })
}

export function useWalletActions(userId: string) {
  const invalidates = [adminWalletKeys.all()]

  const { run: freeze } = useAdminMutation({
    mutationFn: () => freezeWallet(userId),
    success: "Wallet frozen.",
    invalidates,
  })
  const { run: unfreeze } = useAdminMutation({
    mutationFn: () => unfreezeWallet(userId),
    success: "Wallet unfrozen.",
    invalidates,
  })
  const { run: adjust } = useAdminMutation({
    mutationFn: (input: AdjustWalletInput) => adjustWallet(userId, input),
    success: "Posted to the ledger.",
    invalidates,
  })

  return useMemo(
    () => ({ freeze, unfreeze, adjust }),
    [freeze, unfreeze, adjust]
  )
}
