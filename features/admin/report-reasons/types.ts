export interface AdminReportReason {
  id: string
  slug: string
  label: string
  hint: string | null
  applies_to: "snacc" | "user"
  requires_detail: boolean
  position: number
  retired_at: string | null
  created_at: string
}

export interface CreateReasonInput {
  slug: string
  label: string
  hint?: string
  appliesTo?: "snacc" | "user"
  requiresDetail?: boolean
  position: number
}

export interface UpdateReasonInput {
  label?: string
  hint?: string
  appliesTo?: "snacc" | "user"
  requiresDetail?: boolean
  position?: number
}
