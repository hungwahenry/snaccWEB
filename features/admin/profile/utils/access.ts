import type { AdminGrant, AdminPermission } from "@/features/admin/roles/types"
import { plural } from "@/features/admin/shell/utils/format"
import type { AdminPermissions } from "@/lib/permissions"

/** Full access shows the whole catalogue, including keys added later; otherwise exactly what was granted. */
export function visibleKeys(
  permissions: AdminPermissions,
  catalog: AdminPermission[]
): string[] {
  return permissions.all
    ? catalog.map((permission) => permission.key)
    : permissions.keys
}

export function permissionsSummary(permissions: AdminPermissions): string {
  return permissions.all
    ? "Full access. Every permission below, including any added later."
    : `${plural(permissions.keys.length, "permission")}, and only these.`
}

export function grantText(grant: AdminGrant): string {
  return grant.scope_type
    ? `${grant.role.name} · ${grant.scope_type}`
    : grant.role.name
}
