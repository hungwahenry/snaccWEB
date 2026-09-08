"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { ME_KEY } from "@/lib/query-keys"
import { updateWalletSettings } from "../../api"
import type { WalletSettings } from "../../types"

export function useWalletSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: WalletSettings) => updateWalletSettings(settings),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ME_KEY }),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
