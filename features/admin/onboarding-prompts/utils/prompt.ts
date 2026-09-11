import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type { AdminPrompt, PromptDraft, PromptInput } from "../types"

export const PROMPT_LIMITS = {
  emoji: 16,
  label: 100,
  placeholder: 200,
  position: 1000,
} as const

export const POSITION_INVALID = `Position must be a whole number from 0 to ${PROMPT_LIMITS.position}.`

export function parsePosition(raw: string): number | null {
  return parseWholeNumber(raw, { min: 0, max: PROMPT_LIMITS.position })
}

function fits(text: string, max: number): boolean {
  const length = text.trim().length

  return length > 0 && length <= max
}

export function draftFrom(prompt?: AdminPrompt): PromptDraft {
  return {
    emoji: prompt?.emoji ?? "",
    label: prompt?.label ?? "",
    placeholder: prompt?.placeholder ?? "",
    position: String(prompt?.position ?? 0),
  }
}

export function isDraftReady(draft: PromptDraft): boolean {
  return (
    fits(draft.emoji, PROMPT_LIMITS.emoji) &&
    fits(draft.label, PROMPT_LIMITS.label) &&
    fits(draft.placeholder, PROMPT_LIMITS.placeholder) &&
    parsePosition(draft.position) !== null
  )
}

export function toInput(draft: PromptDraft): PromptInput {
  const position = parsePosition(draft.position)
  if (position === null) throw new Error(POSITION_INVALID)

  return {
    emoji: draft.emoji.trim(),
    label: draft.label.trim(),
    placeholder: draft.placeholder.trim(),
    position,
  }
}
