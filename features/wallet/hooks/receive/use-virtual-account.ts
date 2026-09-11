"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { showSuccess } from "@/lib/feedback"
import { activateVirtualAccount, getVirtualAccount } from "../../api"
import { virtualAccountChanged } from "../../cache"
import { walletKeys } from "../../utils/keys"

export function useVirtualAccount(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: walletKeys.virtualAccount(),
    queryFn: getVirtualAccount,
    enabled: options.enabled,
  })
}

export function useActivateVirtualAccount() {
  return useMutation({
    mutationFn: activateVirtualAccount,
    onSuccess: (account) => {
      virtualAccountChanged(account)
      showSuccess("Opening your account number…")
    },
  })
}
