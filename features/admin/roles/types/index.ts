export interface AdminPermission {
  key: string
  resource: string
  action: string
  description: string
  per_campus: boolean
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
  campus: { id: string; name: string; acronym: string } | null
  created_at: string
}

export interface GrantInput {
  roleId: string
  campusId?: string
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

export interface RoleDraft {
  slug: string
  name: string
  description: string
}

export interface PermissionGroup {
  resource: string
  permissions: AdminPermission[]
}
