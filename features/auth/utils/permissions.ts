import type { AdminPermissions } from "@/features/users/types"

export function can(
  permissions: AdminPermissions | undefined,
  key: string
): boolean {
  return !!permissions && (permissions.all || permissions.keys.includes(key))
}
