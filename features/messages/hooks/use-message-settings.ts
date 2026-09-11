"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys } from "@/features/auth/utils/keys"
import { updateMessageSettings } from "../api"
import type { MessageSettings } from "../types"

export function useMessageSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: MessageSettings) => updateMessageSettings(settings),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: authKeys.me() }),
  })
}
