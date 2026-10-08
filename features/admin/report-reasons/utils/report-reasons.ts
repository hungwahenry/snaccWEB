import type { ReportTargetType } from "@/features/admin/reports/types"
import { TARGET_OPTIONS } from "@/features/admin/reports/utils/status"
import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { parseWholeNumber } from "@/features/admin/shell/utils/number"
import type {
  AdminReportReason,
  CreateReasonInput,
  ReasonDraft,
  ReasonScope,
  UpdateReasonInput,
} from "../types"

export const REPORT_REASON_LIMITS = {
  slug: 50,
  label: 100,
  hint: 200,
  position: 1000,
} as const

export const SCOPE_OPTIONS: Option<ReasonScope>[] = [
  { value: "any", label: "Anything" },
  ...TARGET_OPTIONS,
]

function scopeOf(appliesTo: ReportTargetType | null): ReasonScope {
  return appliesTo ?? "any"
}

function appliesToOf(scope: ReasonScope): ReportTargetType | null {
  return scope === "any" ? null : scope
}

export function scopeLabel(appliesTo: ReportTargetType | null): string {
  const scope = scopeOf(appliesTo)

  return SCOPE_OPTIONS.find((option) => option.value === scope)?.label ?? scope
}

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
    appliesTo: scopeOf(reason?.applies_to ?? null),
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
    appliesTo: appliesToOf(draft.appliesTo),
    requiresDetail: draft.requiresDetail,
    position: position(draft) ?? 0,
  }
}

export function toCreateInput(draft: ReasonDraft): CreateReasonInput {
  return {
    slug: draft.slug.trim(),
    label: draft.label.trim(),
    hint: draft.hint.trim() || undefined,
    appliesTo: appliesToOf(draft.appliesTo),
    requiresDetail: draft.requiresDetail,
    position: position(draft) ?? 0,
  }
}
