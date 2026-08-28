"use client"

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { MINUTE_MS } from "@/lib/duration"
import {
  createUniversity,
  deleteUniversity,
  listAllUniversities,
  listUniversities,
  updateUniversity,
} from "./api"
import type { ListUniversitiesParams, UpdateUniversityInput } from "./types"

export function useUniversities(params: ListUniversitiesParams) {
  return useQuery({
    queryKey: ["admin", "universities", params],
    queryFn: () => listUniversities(params),
    placeholderData: keepPreviousData,
  })
}

/** For campus pickers, which need the whole list rather than a page of it. */
export function useAllUniversities() {
  return useQuery({
    queryKey: ["admin", "universities", "all"],
    queryFn: listAllUniversities,
    staleTime: 5 * MINUTE_MS,
  })
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
      mutationFn: ({
        id,
        input,
      }: {
        id: string
        input: UpdateUniversityInput
      }) => updateUniversity(id, input),
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
