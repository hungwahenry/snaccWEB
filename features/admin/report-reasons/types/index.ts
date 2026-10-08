import type { ReportTargetType } from "@/features/admin/reports/types"

export type ReasonScope = ReportTargetType | "any"

export interface AdminReportReason {
  id: string
  slug: string
  label: string
  hint: string | null
  applies_to: ReportTargetType | null
  requires_detail: boolean
  position: number
  retired_at: string | null
  created_at: string
}

export interface CreateReasonInput {
  slug: string
  label: string
  hint?: string
  appliesTo?: ReportTargetType | null
  requiresDetail?: boolean
  position: number
}

export interface UpdateReasonInput {
  label?: string
  hint?: string
  appliesTo?: ReportTargetType | null
  requiresDetail?: boolean
  position?: number
}

export interface ReasonDraft {
  slug: string
  label: string
  hint: string
  appliesTo: ReasonScope
  requiresDetail: boolean
  position: string
}
