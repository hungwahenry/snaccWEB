"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { deleteSnacc, listSnaccs, pinSnacc, restoreSnacc, unpinSnacc } from "./api"
import type { ListSnaccsParams } from "./types"

export function useSnaccs(params: ListSnaccsParams) {
  return useQuery({
    queryKey: ["admin", "snaccs", params],
    queryFn: () => listSnaccs(params),
    placeholderData: keepPreviousData,
  })
}

export function useSnaccMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "snaccs"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    remove: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason?: string }) => deleteSnacc(id, reason),
      onSuccess: onSuccess("Snacc removed."),
      onError,
    }),
    restore: useMutation({
      mutationFn: (id: string) => restoreSnacc(id),
      onSuccess: onSuccess("Snacc restored."),
      onError,
    }),
    pin: useMutation({
      mutationFn: (id: string) => pinSnacc(id),
      onSuccess: onSuccess("Snacc pinned."),
      onError,
    }),
    unpin: useMutation({
      mutationFn: (id: string) => unpinSnacc(id),
      onSuccess: onSuccess("Snacc unpinned."),
      onError,
    }),
  }
}
