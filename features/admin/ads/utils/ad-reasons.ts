import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  AdReason,
  AdReasonDraft,
  CreateAdReasonInput,
  UpdateAdReasonInput,
} from "../types"

export const AD_REASON_LIMITS = {
  slug: 50,
  label: 60,
  description: 500,
  position: 1000,
} as const

export function draftFrom(reason?: AdReason): AdReasonDraft {
  return {
    slug: reason?.slug ?? "",
    label: reason?.label ?? "",
    description: reason?.description ?? "",
    prohibited: reason?.prohibited ?? false,
    position: String(reason?.position ?? 0),
  }
}

function position(draft: AdReasonDraft): number | null {
  return parseWholeNumber(draft.position, {
    min: 0,
    max: AD_REASON_LIMITS.position,
  })
}

export function isDraftReady(draft: AdReasonDraft): boolean {
  return (
    draft.slug.trim() !== "" &&
    draft.label.trim() !== "" &&
    draft.description.trim() !== "" &&
    position(draft) !== null
  )
}

export function toCreateInput(draft: AdReasonDraft): CreateAdReasonInput {
  return {
    slug: draft.slug.trim(),
    label: draft.label.trim(),
    description: draft.description.trim(),
    prohibited: draft.prohibited,
    position: position(draft) ?? 0,
  }
}

export function toUpdateInput(draft: AdReasonDraft): UpdateAdReasonInput {
  return toCreateInput(draft)
}

export function sortReasons(reasons: AdReason[]): AdReason[] {
  return [...reasons].sort(
    (a, b) =>
      Number(a.retired) - Number(b.retired) ||
      a.position - b.position ||
      a.label.localeCompare(b.label)
  )
}

export function pickableReasons(reasons: AdReason[]): AdReason[] {
  return reasons
    .filter((reason) => !reason.retired)
    .sort((a, b) => a.position - b.position)
}
