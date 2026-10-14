"use client"

import { useMutation } from "@tanstack/react-query"
import { completeProfile } from "@/features/onboarding/api"

export function useCompleteProfile() {
  return useMutation({
    mutationFn: completeProfile,
    meta: { silent: true },
  })
}
