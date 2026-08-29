"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { createTier, deleteTier, listTiers, updateTier } from "../api"
import type { UpdateTierInput } from "../types"

export function useTiers() {
  return useQuery({ queryKey: ["admin", "score-tiers"], queryFn: listTiers })
}

export function useTierMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "score-tiers"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createTier,
      onSuccess: onSuccess("Tier created."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateTierInput }) =>
        updateTier(id, input),
      onSuccess: onSuccess("Tier updated."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteTier(id),
      onSuccess: onSuccess("Tier deleted."),
      onError,
    }),
  }
}
