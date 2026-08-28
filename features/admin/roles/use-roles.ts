"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createRole,
  deleteRole,
  listPermissions,
  listRoles,
  setRolePermissions,
  updateRole,
} from "./api"
import type { UpdateRoleInput } from "./types"
import { MINUTE_MS } from "@/lib/duration"

export function useRoles() {
  return useQuery({ queryKey: ["admin", "roles"], queryFn: listRoles })
}

export function usePermissions() {
  return useQuery({
    queryKey: ["admin", "permissions"],
    queryFn: listPermissions,
    staleTime: 5 * MINUTE_MS,
  })
}

export function useRoleMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createRole,
      onSuccess: onSuccess("Role created."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) =>
        updateRole(id, input),
      onSuccess: onSuccess("Role updated."),
      onError,
    }),
    setPermissions: useMutation({
      mutationFn: ({ id, keys }: { id: string; keys: string[] }) =>
        setRolePermissions(id, keys),
      onSuccess: onSuccess("Permissions updated."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteRole(id),
      onSuccess: onSuccess("Role deleted."),
      onError,
    }),
  }
}
