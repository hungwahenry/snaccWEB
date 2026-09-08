"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { listMutes, unmute } from "../../api"
import { MUTES_KEY } from "../../utils/keys"

export function useMutes() {
  return useQuery({ queryKey: MUTES_KEY, queryFn: listMutes })
}

export function useUnmute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unmute,
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: MUTES_KEY }),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useMuted() {
  const mutes = useMutes()
  const unmuting = useUnmute()

  return {
    loading: mutes.isPending,
    failed: mutes.isError,
    retry: () => void mutes.refetch(),
    muted: mutes.data ?? [],
    busyId: unmuting.isPending ? (unmuting.variables ?? null) : null,
    unmute: (userId: string) => unmuting.mutate(userId),
  }
}
