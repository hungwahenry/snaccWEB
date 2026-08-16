"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  createChallenge,
  deleteChallenge,
  listChallenges,
  updateChallenge,
} from "./api"
import type { ListChallengesParams, UpdateChallengeInput } from "./types"

export function useChallenges(params: ListChallengesParams) {
  return useQuery({
    queryKey: ["admin", "challenges", params],
    queryFn: () => listChallenges(params),
    placeholderData: keepPreviousData,
  })
}

export function useChallengeMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "challenges"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    create: useMutation({
      mutationFn: createChallenge,
      onSuccess: onSuccess("Challenge created."),
      onError,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: UpdateChallengeInput }) =>
        updateChallenge(id, input),
      onSuccess: onSuccess("Challenge updated."),
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => deleteChallenge(id),
      onSuccess: onSuccess("Challenge deleted."),
      onError,
    }),
  }
}
