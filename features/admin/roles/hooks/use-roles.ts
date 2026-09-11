"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import { MINUTE_MS } from "@/lib/duration"
import {
  createRole,
  deleteRole,
  listPermissions,
  listRoles,
  setRolePermissions,
  updateRole,
} from "../api"
import type { RoleDraft } from "../types"
import { adminRoleKeys } from "../utils/keys"
import { toCreateInput, toUpdateInput } from "../utils/roles"

export function useRoles() {
  return useQuery({ queryKey: adminRoleKeys.list(), queryFn: listRoles })
}

/** Every permission there is. It only changes on a deploy, so it is kept a while. */
export function usePermissionCatalog() {
  return useQuery({
    queryKey: adminRoleKeys.catalog(),
    queryFn: listPermissions,
    staleTime: 5 * MINUTE_MS,
  })
}

export function useRoleActions() {
  const invalidates = [adminRoleKeys.all()]

  const { run: save } = useAdminMutation({
    mutationFn: ({ draft, id }: { draft: RoleDraft; id?: string }) =>
      id
        ? updateRole(id, toUpdateInput(draft))
        : createRole(toCreateInput(draft)),
    success: (_role, { id }) => (id ? "Role saved." : "Role created."),
    invalidates,
  })
  const { run: setPermissions } = useAdminMutation({
    mutationFn: ({ id, keys }: { id: string; keys: string[] }) =>
      setRolePermissions(id, keys),
    success: "Permissions saved.",
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteRole(id),
    success: "Role deleted.",
    invalidates,
  })

  return useMemo(
    () => ({
      save: (draft: RoleDraft, id?: string) => save({ draft, id }),
      setPermissions: (id: string, keys: string[]) =>
        setPermissions({ id, keys }),
      remove,
    }),
    [save, setPermissions, remove]
  )
}
