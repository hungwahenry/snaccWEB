export interface SuspensionReason {
  id: string
  slug: string
  /** What a moderator picks it by — the title is written to the suspended user. */
  label: string
  title: string
  description: string
  position: number
  retired: boolean
  created_at: string
}

export interface CreateSuspensionReasonInput {
  slug: string
  label: string
  title: string
  description: string
  position?: number
}

export type UpdateSuspensionReasonInput =
  Partial<CreateSuspensionReasonInput> & {
    retired?: boolean
  }
