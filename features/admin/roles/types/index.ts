export interface AdminPermission {
  key: string
  resource: string
  action: string
  description: string
}

export interface AdminRole {
  id: string
  slug: string
  name: string
  description: string | null
  allow_all: boolean
  is_system: boolean
  permission_keys: string[]
  created_at: string
}

export interface AdminGrant {
  id: string
  role: {
    id: string
    slug: string
    name: string
    allow_all: boolean
    is_system: boolean
  }
  scope_type: string | null
  scope_id: string | null
  created_at: string
}

export interface CreateRoleInput {
  slug: string
  name: string
  description?: string
}

export interface UpdateRoleInput {
  name?: string
  description?: string
}
