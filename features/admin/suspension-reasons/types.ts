export interface SuspensionReason {
  id: string
  slug: string
  title: string
  description: string
  position: number
  retired: boolean
  created_at: string
}

export interface CreateSuspensionReasonInput {
  slug: string
  title: string
  description: string
  position?: number
}

export type UpdateSuspensionReasonInput = Partial<CreateSuspensionReasonInput> & {
  retired?: boolean
}
