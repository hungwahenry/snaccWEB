export interface AuditLog {
  id: string
  admin_id: string
  admin_email: string
  admin_username: string | null
  action: string
  target_type: string
  target_id: string | null
  before: unknown
  after: unknown
  created_at: string
}

export type AuditListQuery = {
  page: number
  perPage: number
  q?: string
  action?: string
  targetType?: string
  targetId?: string
  adminId?: string
  from?: string
  to?: string
}
