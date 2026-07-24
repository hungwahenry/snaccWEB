"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { adjustFund, listEarnings, listFunds, provisionFund } from "./api"
import type { ListEarningsParams } from "./types"

export function useEarnings(params: ListEarningsParams) {
  return useQuery({
    queryKey: ["admin", "earnings", params],
    queryFn: () => listEarnings(params),
    placeholderData: keepPreviousData,
  })
}

export function useFunds() {
  return useQuery({ queryKey: ["admin", "funds"], queryFn: listFunds })
}

export function useFundMutations() {
  const queryClient = useQueryClient()

  function onSuccess(message: string) {
    return () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "funds"] })
      toast.success(message)
    }
  }
  function onError(error: unknown) {
    toast.error(getErrorMessage(error))
  }

  return {
    provision: useMutation({
      mutationFn: provisionFund,
      onSuccess: onSuccess("Fund provisioned."),
      onError,
    }),
    adjust: useMutation({
      mutationFn: ({ universityId, cap }: { universityId: string; cap: number }) =>
        adjustFund(universityId, cap),
      onSuccess: onSuccess("Cap adjusted."),
      onError,
    }),
  }
}
