export interface AdminPermissions {
  all: boolean
  keys: string[]
  campuses: string[]
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

export function canForCampus(
  permissions: AdminPermissions | undefined,
  key: string,
  campusId: string | null
): boolean {
  if (!can(permissions, key)) return false
  if (!permissions?.campuses.length) return true

  return campusId !== null && permissions.campuses.includes(campusId)
}
