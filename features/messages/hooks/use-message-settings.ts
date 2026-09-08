"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { ME_KEY } from "@/lib/query-keys"
import { updateMessageSettings } from "../api"
import type { MessageSettings } from "../types"

export function useMessageSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: MessageSettings) => updateMessageSettings(settings),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ME_KEY }),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
