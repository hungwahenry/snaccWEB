export interface AdminBadge {
  id: string
  key: string
  label: string
  icon: string
  color: string
  description: string | null
  position: number
  is_active: boolean
  holders_count: number | null
  created_at: string
}

export interface BadgeHolder {
  user: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string
    email: string
    university: { id: string; name: string; acronym: string } | null
  }
  note: string | null
  granted_at: string
}

export interface CreateBadgeInput {
  key: string
  label: string
  icon?: string
  color?: string
  description?: string
  position?: number
  isActive?: boolean
}

export type UpdateBadgeInput = Partial<CreateBadgeInput>

export interface GrantBadgeInput {
  userId: string
  note?: string
}
