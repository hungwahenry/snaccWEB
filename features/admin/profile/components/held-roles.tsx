import { Badge } from "@/components/ui/badge"
import type { AdminGrant } from "@/features/admin/roles/types"
import { grantLabel, grantVariant } from "@/features/admin/roles/utils/roles"

export function HeldRoles({ grants }: { grants: AdminGrant[] }) {
  if (grants.length === 0) {
    return <p className="text-sm text-muted-foreground">No roles held.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {grants.map((grant) => (
        <Badge key={grant.id} variant={grantVariant(grant)}>
          {grantLabel(grant)}
        </Badge>
      ))}
    </div>
  )
}
