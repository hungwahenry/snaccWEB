"use client"

import { useMemo } from "react"
import { usePermissionCatalog } from "@/features/admin/roles/hooks/use-roles"
import { useUserRoles } from "@/features/admin/roles/hooks/use-user-roles"
import { groupKeys } from "@/features/admin/roles/utils/roles"
import { useMe } from "@/features/auth/hooks/use-me"
import { visibleKeys } from "../utils/access"

export function useProfileScreen() {
  const me = useMe()
  const grants = useUserRoles(me.data?.id)
  const catalog = usePermissionCatalog()
  const permissions = me.data?.permissions

  const groups = useMemo(
    () =>
      permissions
        ? groupKeys(visibleKeys(permissions, catalog.data ?? []))
        : [],
    [permissions, catalog.data]
  )

  return { me, grants: grants.data ?? [], groups }
}
