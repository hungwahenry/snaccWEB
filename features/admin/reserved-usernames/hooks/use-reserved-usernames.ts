"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { holdUsername, listReservedUsernames, releaseUsername } from "../api"

const KEY = ["admin", "reserved-usernames"]

export function useReservedUsernames() {
  return useQuery({ queryKey: KEY, queryFn: listReservedUsernames })
}

export function useHoldUsername() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: holdUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY })
      toast.success("Name held.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export function useReleaseUsername() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: releaseUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY })
      toast.success("Name released.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
