import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  CreateSuspensionReasonInput,
  SuspensionReason,
  SuspensionReasonDraft,
  UpdateSuspensionReasonInput,
} from "../types"

export const SUSPENSION_REASON_LIMITS = {
  slug: 50,
  label: 60,
  title: 100,
  description: 500,
  position: 1000,
} as const

export const DEFAULT_TITLE = "Your account is suspended"

export function draftFrom(reason?: SuspensionReason): SuspensionReasonDraft {
  return {
    slug: reason?.slug ?? "",
    label: reason?.label ?? "",
    title: reason?.title ?? DEFAULT_TITLE,
    description: reason?.description ?? "",
    position: String(reason?.position ?? 0),
  }
}

function position(draft: SuspensionReasonDraft): number | null {
  return parseWholeNumber(draft.position, {
    min: 0,
    max: SUSPENSION_REASON_LIMITS.position,
  })
}

export function isDraftReady(draft: SuspensionReasonDraft): boolean {
  return (
    draft.slug.trim() !== "" &&
    draft.label.trim() !== "" &&
    draft.title.trim() !== "" &&
    draft.description.trim() !== "" &&
    position(draft) !== null
  )
}

export function toCreateInput(
  draft: SuspensionReasonDraft
): CreateSuspensionReasonInput {
  return {
    slug: draft.slug.trim(),
    label: draft.label.trim(),
    title: draft.title.trim(),
    description: draft.description.trim(),
    position: position(draft) ?? 0,
  }
}

export function toUpdateInput(
  draft: SuspensionReasonDraft
): UpdateSuspensionReasonInput {
  return toCreateInput(draft)
}

/** By position, then name, with retired reasons after the ones in use. */
export function sortReasons(reasons: SuspensionReason[]): SuspensionReason[] {
  return [...reasons].sort(
    (a, b) =>
      Number(a.retired) - Number(b.retired) ||
      a.position - b.position ||
      a.label.localeCompare(b.label)
  )
}
