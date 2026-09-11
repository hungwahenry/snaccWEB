"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { grantRole, listUserRoles, revokeRole } from "../api"
import { adminAdminKeys } from "@/features/admin/admins/utils/keys"
import { adminRoleKeys } from "../utils/keys"

export function useUserRoles(userId: string | undefined) {
  return useQuery({
    queryKey: adminRoleKeys.grants(userId ?? ""),
    queryFn: () => listUserRoles(userId ?? ""),
    enabled: Boolean(userId),
  })
}

export function useRoleGrantActions(userId: string) {
  const invalidates = [adminRoleKeys.grants(userId), adminAdminKeys.all()]

  const { run: grant } = useAdminMutation({
    mutationFn: (roleId: string) => grantRole(userId, roleId),
    success: "Role granted.",
    invalidates,
  })
  const { run: revoke } = useAdminMutation({
    mutationFn: (roleId: string) => revokeRole(userId, roleId),
    success: "Role taken away.",
    invalidates,
  })

  return useMemo(() => ({ grant, revoke }), [grant, revoke])
}
