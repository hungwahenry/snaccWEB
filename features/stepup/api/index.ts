import { api } from "@/lib/api/client"
import type { StepUpAction, StepUpChallenge } from "../types"

export const startStepUp = (action: StepUpAction, newEmail?: string) =>
  api.post<StepUpChallenge>("/step-up", { action, newEmail })

export const verifyStepUp = (id: string, label: string, code: string) =>
  api.post<StepUpChallenge>(`/step-up/${id}/verify`, { label, code })
