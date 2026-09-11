export interface AdminReservedUsername {
  name: string
  reason: string
  seeded: boolean
  created_at: string
}

export interface HoldUsernameInput {
  name: string
  reason: string
}
