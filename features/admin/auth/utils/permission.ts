import { can, type AdminPermissions } from "@/lib/permissions"

/** Why a control is off for this admin, or null when they may use it. */
export function denialReason(
  permissions: AdminPermissions | undefined,
  permission: string
): string | null {
  if (can(permissions, permission)) return null

  return `You need the "${permission}" permission.`
}
