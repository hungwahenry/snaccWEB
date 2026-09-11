export type ReasonTarget = "snacc" | "user"

export interface AdminReportReason {
  id: string
  slug: string
  label: string
  hint: string | null
  applies_to: ReasonTarget
  requires_detail: boolean
  position: number
  retired_at: string | null
  created_at: string
}

export interface CreateReasonInput {
  slug: string
  label: string
  hint?: string
  appliesTo?: ReasonTarget
  requiresDetail?: boolean
  position: number
}

export interface UpdateReasonInput {
  label?: string
  hint?: string
  appliesTo?: ReasonTarget
  requiresDetail?: boolean
  position?: number
}

export interface ReasonDraft {
  slug: string
  label: string
  hint: string
  appliesTo: ReasonTarget
  requiresDetail: boolean
  position: string
}
