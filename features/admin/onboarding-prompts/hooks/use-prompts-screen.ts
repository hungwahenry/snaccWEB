"use client"

import { usePromptActions, usePrompts } from "./use-onboarding-prompts"

export function usePromptsScreen() {
  return { query: usePrompts(), actions: usePromptActions() }
}
