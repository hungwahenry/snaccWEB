import type { DraftField, DraftProblems, PromotionStep } from "../types"
import { FORM_SECTIONS } from "./campaigns"
import type { Money } from "@/lib/money"

export const PROMOTION_STEPS: PromotionStep[] = [
  "audience",
  "placement",
  "budget",
  "review",
]

export const STEP_TITLES: Record<PromotionStep, string> = {
  audience: FORM_SECTIONS.audience,
  placement: FORM_SECTIONS.placements,
  budget: "When and how much",
  review: "Review and pay",
}

const STEP_FIELDS: Record<PromotionStep, DraftField[]> = {
  audience: ["audience"],
  placement: ["placements", "button"],
  budget: ["schedule", "budget"],
  review: ["general"],
}

export function stepOf(field: DraftField): PromotionStep {
  return (
    PROMOTION_STEPS.find((step) => STEP_FIELDS[step].includes(field)) ??
    "review"
  )
}

export function firstProblem(problems: DraftProblems): string | null {
  for (const step of PROMOTION_STEPS) {
    for (const field of STEP_FIELDS[step]) {
      const problem = problems[field]
      if (problem) return problem
    }
  }
  return null
}

export function stepReady(
  step: PromotionStep,
  problems: DraftProblems,
  budget: Money
): boolean {
  if (STEP_FIELDS[step].some((field) => problems[field])) return false
  return step !== "budget" || budget.amount > 0
}

export function stepLabel(step: PromotionStep): string {
  const index = PROMOTION_STEPS.indexOf(step)
  return `Step ${index + 1} of ${PROMOTION_STEPS.length} · ${STEP_TITLES[step]}`
}

export function nextStep(step: PromotionStep): PromotionStep | null {
  return PROMOTION_STEPS[PROMOTION_STEPS.indexOf(step) + 1] ?? null
}

export function previousStep(step: PromotionStep): PromotionStep | null {
  return PROMOTION_STEPS[PROMOTION_STEPS.indexOf(step) - 1] ?? null
}
