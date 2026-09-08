"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { listRecipients, removeRecipient } from "../../api"
import { RECIPIENTS_KEY } from "../../utils/keys"

export function useRecipients(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: RECIPIENTS_KEY,
    queryFn: listRecipients,
    enabled: options.enabled,
  })
}

export function useRemoveRecipient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: removeRecipient,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: RECIPIENTS_KEY }),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
