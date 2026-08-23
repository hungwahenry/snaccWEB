"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { listFlags, updateFlag, type FlagChanges } from "./index"

const KEY = ["admin", "flags"]

export function useFlags() {
  return useQuery({ queryKey: KEY, queryFn: listFlags })
}

function described(flag: { key: string; enabled: boolean; min_version: string | null; max_version: string | null }) {
  if (!flag.enabled) return `${flag.key} disabled.`
  if (flag.min_version && flag.max_version) {
    return `${flag.key} on for ${flag.min_version} to ${flag.max_version}.`
  }
  if (flag.min_version) return `${flag.key} on from ${flag.min_version} up.`
  if (flag.max_version) return `${flag.key} on up to ${flag.max_version}.`
  return `${flag.key} on for every build.`
}

export function useUpdateFlag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { key: string } & FlagChanges) => {
      const { key, ...changes } = input
      return updateFlag(key, changes)
    },
    onSuccess: (flag) => {
      queryClient.invalidateQueries({ queryKey: KEY })
      toast.success(described(flag))
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
