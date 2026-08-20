"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createBadge,
  deleteBadge,
  grantBadge,
  listBadges,
  listHolders,
  revokeBadge,
  updateBadge,
} from "./api"
import type { UpdateBadgeInput } from "./types"

export function useBadges() {
  return useQuery({ queryKey: ["admin", "badges"], queryFn: listBadges })
}

export function useBadgeHolders(id: string | null) {
  return useQuery({
    queryKey: ["admin", "badges", id, "holders"],
    queryFn: () => listHolders(id!),
    enabled: id != null,
  })
}

export function useBadgeMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "badges"] })
      toast.success(message)
    }
  }
  function onGranted(message: string) {
    return (_data: unknown, variables: { userId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "badges"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "user", variables.userId] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createBadge,
      onSuccess: onSuccess("Badge created."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateBadgeInput }) => updateBadge(id, input),
      onSuccess: onSuccess("Badge updated."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteBadge(id),
      onSuccess: onSuccess("Badge deleted."),
      onError,
    }),
    grant: useMutation({
      mutationFn: ({ id, userId, note }: { id: string; userId: string; note?: string }) =>
        grantBadge(id, { userId, note }),
      onSuccess: onGranted("Badge granted."),
      onError,
    }),
    revoke: useMutation({
      mutationFn: ({ id, userId }: { id: string; userId: string }) => revokeBadge(id, userId),
      onSuccess: onGranted("Badge revoked."),
      onError,
    }),
  }
}
