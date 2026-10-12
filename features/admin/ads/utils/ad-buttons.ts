import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  AdButton,
  AdButtonDraft,
  CreateAdButtonInput,
  UpdateAdButtonInput,
} from "../types"

export const AD_BUTTON_LIMITS = {
  slug: 50,
  label: 30,
  position: 1000,
} as const

export function buttonDraftFrom(button?: AdButton): AdButtonDraft {
  return {
    slug: button?.slug ?? "",
    label: button?.label ?? "",
    position: String(button?.position ?? 0),
  }
}

function position(draft: AdButtonDraft): number | null {
  return parseWholeNumber(draft.position, {
    min: 0,
    max: AD_BUTTON_LIMITS.position,
  })
}

export function isButtonDraftReady(draft: AdButtonDraft): boolean {
  return (
    draft.slug.trim() !== "" &&
    draft.label.trim() !== "" &&
    position(draft) !== null
  )
}

export function toCreateButtonInput(draft: AdButtonDraft): CreateAdButtonInput {
  return {
    slug: draft.slug.trim(),
    label: draft.label.trim(),
    position: position(draft) ?? 0,
  }
}

export function toUpdateButtonInput(draft: AdButtonDraft): UpdateAdButtonInput {
  return toCreateButtonInput(draft)
}

export function sortButtons(buttons: AdButton[]): AdButton[] {
  return [...buttons].sort(
    (a, b) =>
      Number(a.retired) - Number(b.retired) ||
      a.position - b.position ||
      a.label.localeCompare(b.label)
  )
}
