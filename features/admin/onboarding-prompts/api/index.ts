import { api } from "@/lib/api/client"
import type {
  AdminPrompt,
  CreatePromptInput,
  UpdatePromptInput,
} from "../types"

export function listPrompts() {
  return api.get<AdminPrompt[]>("/admin/onboarding-prompts")
}

export function createPrompt(input: CreatePromptInput) {
  return api.post<AdminPrompt>("/admin/onboarding-prompts", input)
}

export function updatePrompt(id: string, input: UpdatePromptInput) {
  return api.patch<AdminPrompt>(`/admin/onboarding-prompts/${id}`, input)
}

export function deletePrompt(id: string) {
  return api.del<null>(`/admin/onboarding-prompts/${id}`)
}
