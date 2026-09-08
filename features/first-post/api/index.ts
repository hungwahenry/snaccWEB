import { api } from "@/lib/api/client"
import type { OnboardingPrompt } from "../types"

export const getOnboardingPrompts = () =>
  api.get<OnboardingPrompt[]>("/onboarding/prompts")
