"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import {
  listEngagement,
  resetEngagement,
  updateEngagement,
  type EngagementChanges,
} from "./index"

const KEY = ["admin", "engagement"]

export function useEngagement() {
  return useQuery({ queryKey: KEY, queryFn: listEngagement })
}

export function useUpdateEngagement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { key: string } & EngagementChanges) => {
      const { key, ...body } = input
      return updateEngagement(key, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY })
      toast.success("Weight updated.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useResetEngagement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (key: string) => resetEngagement(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY })
      toast.success("Put back to the shipped weight.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
