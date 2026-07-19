"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createUniversity,
  deleteUniversity,
  listUniversities,
  updateUniversity,
} from "./api"
import type { UpdateUniversityInput } from "./types"

export function useUniversities() {
  return useQuery({ queryKey: ["admin", "universities"], queryFn: listUniversities })
}

export function useUniversityMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "universities"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createUniversity,
      onSuccess: onSuccess("University created."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateUniversityInput }) =>
        updateUniversity(id, input),
      onSuccess: onSuccess("University updated."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteUniversity(id),
      onSuccess: onSuccess("University deleted."),
      onError,
    }),
  }
}
