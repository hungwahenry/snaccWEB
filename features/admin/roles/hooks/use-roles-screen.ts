"use client"

import { useMemo } from "react"
import { groupPermissions } from "../utils/roles"
import { usePermissionCatalog, useRoleActions, useRoles } from "./use-roles"

export function useRolesScreen() {
  const query = useRoles()
  const catalog = usePermissionCatalog()
  const groups = useMemo(
    () => groupPermissions(catalog.data ?? []),
    [catalog.data]
  )

  return { query, groups, actions: useRoleActions() }
}
