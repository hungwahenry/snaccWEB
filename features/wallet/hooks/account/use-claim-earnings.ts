"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { formatNaira } from "@/lib/format"
import { claimEarnings } from "../../api"
import { walletChanged } from "./use-wallet-cache"

export function useClaimEarnings() {
  return useMutation({
    mutationFn: claimEarnings,
    onSuccess: (result) => {
      walletChanged(result)
      toast.success(`${formatNaira(result.claimed)} moved to your wallet.`)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
