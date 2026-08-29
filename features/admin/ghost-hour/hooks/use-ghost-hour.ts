"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { closeGhostHour, getGhostWindow, openGhostHour } from "../api"

export function useGhostWindow() {
  return useQuery({
    queryKey: ["admin", "ghost-window"],
    queryFn: getGhostWindow,
    refetchInterval: 15_000,
  })
}

export function useGhostMutations() {
  const queryClient = useQueryClient()

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "ghost-window"] })
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    open: useMutation({
      mutationFn: (minutes?: number) => openGhostHour(minutes),
      onSuccess: (state) => {
        invalidate()
        toast.success(
          `Ghost Hour opened — pushed to ${state.pushed ?? 0} device(s).`
        )
      },
      onError,
    }),
    close: useMutation({
      mutationFn: () => closeGhostHour(),
      onSuccess: () => {
        invalidate()
        toast.success("Ghost Hour closed.")
      },
      onError,
    }),
  }
}
