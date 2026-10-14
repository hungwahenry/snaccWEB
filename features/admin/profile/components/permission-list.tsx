import { Badge } from "@/components/ui/badge"
import type { PermissionGroup } from "@/features/admin/roles/types"
import { humanize } from "@/features/admin/shell/utils/format"

export function PermissionList({ groups }: { groups: PermissionGroup[] }) {
  return (
    <div className="flex flex-col gap-3">
      {groups.map((group) => (
        <div
          key={group.resource}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <span className="shrink-0 text-sm font-medium sm:w-44">
            {humanize(group.resource)}
          </span>
          <div className="flex flex-wrap gap-2">
            {group.permissions.map((permission) => (
              <Badge key={permission.key} variant="outline">
                {humanize(permission.action)}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
