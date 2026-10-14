import type { AdminGrant, AdminPermission } from "@/features/admin/roles/types"

export interface OwnAccess {
  all: boolean
  grants: AdminGrant[]
  permissions: AdminPermission[]
}
