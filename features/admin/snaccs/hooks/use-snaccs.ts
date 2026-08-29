"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  deleteSnacc,
  getSnacc,
  holdSnacc,
  listSnaccs,
  pinSnacc,
  releaseSnacc,
  unpinSnacc,
} from "../api"
import type { ListSnaccsParams } from "../types"

export function useSnaccs(params: ListSnaccsParams) {
  return useQuery({
    queryKey: ["admin", "snaccs", params],
    queryFn: () => listSnaccs(params),
    placeholderData: keepPreviousData,
  })
}

export function useSnacc(id: string) {
  return useQuery({
    queryKey: ["admin", "snaccs", "detail", id],
    queryFn: () => getSnacc(id),
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
      mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
        deleteSnacc(id, reason),
      onSuccess: onSuccess("Snacc removed for good."),
      onError,
    }),
    hold: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
        holdSnacc(id, reason),
      onSuccess: onSuccess("Snacc held."),
      onError,
    }),
    release: useMutation({
      mutationFn: (id: string) => releaseSnacc(id),
      onSuccess: onSuccess("Snacc released."),
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
