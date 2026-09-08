"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { checkUsername } from "@/features/onboarding/api"

export function useUsernameAvailability(username: string, enabled: boolean) {
  return useQuery({
    queryKey: ["onboarding", "check-username", username],
    queryFn: () => checkUsername(username),
    enabled,
    placeholderData: keepPreviousData,
  })
}
