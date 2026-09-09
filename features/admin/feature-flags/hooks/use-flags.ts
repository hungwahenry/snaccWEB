"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import type { AdminFeatureFlag, FlagChanges } from "../types"
import { listFlags, updateFlag } from "../api"

const KEY = ["admin", "flags"]

export function useFlags() {
  return useQuery({ queryKey: KEY, queryFn: listFlags })
}

function described(flag: AdminFeatureFlag) {
  if (!flag.enabled) return `${flag.key} disabled.`
  if (flag.overrides.length > 0) {
    const rules = flag.overrides.length === 1 ? "rule" : "rules"
    return `${flag.key} saved, with ${flag.overrides.length} platform ${rules}.`
  }
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
