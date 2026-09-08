"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ME_KEY } from "@/lib/query-keys"
import { completeProfile } from "@/features/onboarding/api"

export function useCompleteProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: completeProfile,
    onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
  })
}
