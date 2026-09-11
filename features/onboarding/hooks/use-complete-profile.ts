"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { authKeys } from "@/features/auth/utils/keys"
import { completeProfile } from "@/features/onboarding/api"

export function useCompleteProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: completeProfile,
    onSuccess: (user) => queryClient.setQueryData(authKeys.me(), user),
  })
}
