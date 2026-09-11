import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  AdminReportReason,
  CreateReasonInput,
  ReasonDraft,
  ReasonTarget,
  UpdateReasonInput,
} from "../types"

export const REPORT_REASON_LIMITS = {
  slug: 50,
  label: 100,
  hint: 200,
  position: 1000,
} as const

export const TARGET_OPTIONS: Option<ReasonTarget>[] = [
  { value: "snacc", label: "Snacc" },
  { value: "user", label: "User" },
]

export function reasonStatus(reason: AdminReportReason): StatusMeta {
  return reason.retired_at
    ? { label: "retired", variant: "outline" }
    : { label: "active", variant: "secondary" }
}

export function draftFrom(reason?: AdminReportReason): ReasonDraft {
  return {
    slug: reason?.slug ?? "",
    label: reason?.label ?? "",
    hint: reason?.hint ?? "",
    appliesTo: reason?.applies_to ?? "snacc",
    requiresDetail: reason?.requires_detail ?? false,
    position: String(reason?.position ?? 0),
  }
}

function position(draft: ReasonDraft): number | null {
  return parseWholeNumber(draft.position, {
    min: 0,
    max: REPORT_REASON_LIMITS.position,
  })
}

export function isDraftReady(draft: ReasonDraft, editing: boolean): boolean {
  return (
    draft.label.trim() !== "" &&
    (editing || draft.slug.trim() !== "") &&
    position(draft) !== null
  )
}

export function toUpdateInput(draft: ReasonDraft): UpdateReasonInput {
  return {
    label: draft.label.trim(),
    hint: draft.hint.trim() || undefined,
    appliesTo: draft.appliesTo,
    requiresDetail: draft.requiresDetail,
    position: position(draft) ?? 0,
  }
}

export function toCreateInput(draft: ReasonDraft): CreateReasonInput {
  return {
    slug: draft.slug.trim(),
    label: draft.label.trim(),
    hint: draft.hint.trim() || undefined,
    appliesTo: draft.appliesTo,
    requiresDetail: draft.requiresDetail,
    position: position(draft) ?? 0,
  }
}
