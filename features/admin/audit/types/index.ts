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

export interface ListAuditParams {
  page?: number
  perPage?: number
  action?: string
  targetType?: string
  targetId?: string
  adminId?: string
}
