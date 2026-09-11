export interface SuspensionReason {
  id: string
  slug: string
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
  Partial<CreateSuspensionReasonInput> & { retired?: boolean }

export interface SuspensionReasonDraft {
  slug: string
  label: string
  title: string
  description: string
  position: string
}

/** What a moderator picks when suspending someone. `days` is "0" for no end date. */
export interface SuspensionDraft {
  reasonId: string | null
  days: string
}

export interface SuspendInput {
  reasonId?: string
  note?: string
  until?: string
}
