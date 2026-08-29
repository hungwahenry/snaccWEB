"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { grantRole, listUserRoles, revokeRole } from "../api"

export function useUserRoles(userId: string) {
  return useQuery({
    queryKey: ["admin", "user-roles", userId],
    queryFn: () => listUserRoles(userId),
    enabled: !!userId,
  })
}

export function useGrantMutations(userId: string) {
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "user-roles", userId] })
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    grant: useMutation({
      mutationFn: (roleId: string) => grantRole(userId, roleId),
      onSuccess: () => {
        invalidate()
        toast.success("Role granted.")
      },
      onError,
    }),
    revoke: useMutation({
      mutationFn: (roleId: string) => revokeRole(userId, roleId),
      onSuccess: () => {
        invalidate()
        toast.success("Role revoked.")
      },
      onError,
    }),
  }
}
