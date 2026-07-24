"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { listFlags, updateFlag } from "./index"

const KEY = ["admin", "flags"]

export function useFlags() {
  return useQuery({ queryKey: KEY, queryFn: listFlags })
}

export function useUpdateFlag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { key: string; enabled: boolean }) => updateFlag(input.key, input.enabled),
    onSuccess: (flag) => {
      queryClient.invalidateQueries({ queryKey: KEY })
      toast.success(`${flag.key} ${flag.enabled ? "enabled" : "disabled"}.`)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
