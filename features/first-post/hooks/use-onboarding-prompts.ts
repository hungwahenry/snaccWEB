"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getOnboardingPrompts } from "../api"
import { DEFAULT_PROMPTS } from "../types"

export function useOnboardingPrompts() {
  return useQuery({
    queryKey: ["onboarding", "prompts"],
    queryFn: getOnboardingPrompts,
    staleTime: 5 * MINUTE_MS,
    placeholderData: DEFAULT_PROMPTS,
  })
}
