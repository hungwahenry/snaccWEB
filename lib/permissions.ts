export interface AdminPermissions {
  all: boolean
  keys: string[]
  limited_to: Record<string, string[]>
}

export function hasAdminAccess(
  permissions: AdminPermissions | undefined
): boolean {
  return !!permissions && (permissions.all || permissions.keys.length > 0)
}

export function can(
  permissions: AdminPermissions | undefined,
  key: string
): boolean {
  return !!permissions && (permissions.all || permissions.keys.includes(key))
}

export function campusesFor(
  permissions: AdminPermissions | undefined,
  key: string
): string[] | null {
  if (!can(permissions, key)) return []
  if (permissions?.all) return null

  return permissions?.limited_to[key] ?? null
}
