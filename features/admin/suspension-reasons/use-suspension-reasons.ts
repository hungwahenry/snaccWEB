"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createSuspensionReason,
  listSuspensionReasons,
  updateSuspensionReason,
} from "./api"
import type { UpdateSuspensionReasonInput } from "./types"

export function useSuspensionReasons() {
  return useQuery({
    queryKey: ["admin", "suspension-reasons"],
    queryFn: listSuspensionReasons,
  })
}

export function useSuspensionReasonMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "suspension-reasons"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createSuspensionReason,
      onSuccess: onSuccess("Reason created."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateSuspensionReasonInput }) =>
        updateSuspensionReason(id, input),
      onSuccess: onSuccess("Reason updated."),
      onError,
    }),
  }
}
