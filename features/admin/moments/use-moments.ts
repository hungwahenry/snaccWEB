"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { listMoments, releaseMoment, removeMoment } from "./index"

const KEY = ["admin", "moments"]

export function useMoments(params: Record<string, string | number | boolean>) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => listMoments(params),
  })
}

export function useMomentMutations() {
  const qc = useQueryClient()
  const onError = (error: unknown) => toast.error(getErrorMessage(error))
  const invalidate = () => qc.invalidateQueries({ queryKey: KEY })

  return {
    release: useMutation({
      mutationFn: (id: string) => releaseMoment(id),
      onSuccess: () => {
        invalidate()
        toast.success("Moment released.")
      },
      onError,
    }),
    remove: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
        removeMoment(id, reason),
      onSuccess: () => {
        invalidate()
        toast.success("Moment removed.")
      },
      onError,
    }),
  }
}
