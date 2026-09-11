import { Badge } from "@/components/ui/badge"
import type { AdminGrant } from "@/features/admin/roles/types"
import { grantVariant } from "@/features/admin/roles/utils/roles"
import { grantText } from "../utils/access"

export function HeldRoles({ grants }: { grants: AdminGrant[] }) {
  if (grants.length === 0) {
    return <p className="text-sm text-muted-foreground">No roles held.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {grants.map((grant) => (
        <Badge key={grant.id} variant={grantVariant(grant)}>
          {grantText(grant)}
        </Badge>
      ))}
    </div>
  )
}
