"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { activateVirtualAccount, getVirtualAccount } from "../../api"
import { VIRTUAL_ACCOUNT_KEY } from "../../utils/keys"

export function useVirtualAccount(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: VIRTUAL_ACCOUNT_KEY,
    queryFn: getVirtualAccount,
    enabled: options.enabled,
  })
}

export function useActivateVirtualAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateVirtualAccount,
    onSuccess: (account) =>
      queryClient.setQueryData(VIRTUAL_ACCOUNT_KEY, account),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
