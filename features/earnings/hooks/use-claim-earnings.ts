"use client"

import { useMutation } from "@tanstack/react-query"
import { walletChanged } from "@/features/wallet/cache"
import { showSuccess } from "@/lib/feedback"
import { formatNaira } from "@/lib/format"
import { claimEarnings } from "../api"
import { earningsChanged } from "../cache"

export function useClaimEarnings() {
  return useMutation({
    mutationFn: claimEarnings,
    onSuccess: (result) => {
      walletChanged(result)
      earningsChanged()
      showSuccess(`${formatNaira(result.claimed)} moved to your wallet.`)
    },
  })
}
