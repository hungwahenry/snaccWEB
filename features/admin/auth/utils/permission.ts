import { humanize } from "@/features/admin/shell/utils/format"
import { can, type AdminPermissions } from "@/lib/permissions"

export function denialReason(
  permissions: AdminPermissions | undefined,
  permission: string
): string | null {
  if (can(permissions, permission)) return null

  const [resource, action = ""] = permission.split(".")
  return `Your role doesn't include “${humanize(action)} · ${humanize(resource)}”. Ask an owner if you need it.`
}
