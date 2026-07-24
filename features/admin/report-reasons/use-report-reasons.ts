"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createReason,
  listReasons,
  retireReason,
  unretireReason,
  updateReason,
} from "./api"
import type { UpdateReasonInput } from "./types"

export function useReasons() {
  return useQuery({ queryKey: ["admin", "report-reasons"], queryFn: listReasons })
}

export function useReasonMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "report-reasons"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createReason,
      onSuccess: onSuccess("Reason created."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateReasonInput }) =>
        updateReason(id, input),
      onSuccess: onSuccess("Reason updated."),
      onError,
    }),
    retire: useMutation({
      mutationFn: (id: string) => retireReason(id),
      onSuccess: onSuccess("Reason retired."),
      onError,
    }),
    unretire: useMutation({
      mutationFn: (id: string) => unretireReason(id),
      onSuccess: onSuccess("Reason restored."),
      onError,
    }),
  }
}
