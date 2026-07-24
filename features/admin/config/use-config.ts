"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { listConfig, updateConfig } from "./index"

const KEY = ["admin", "config"]

export function useConfig() {
  return useQuery({ queryKey: KEY, queryFn: listConfig })
}

export function useUpdateConfig() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: { key: string; body: { value?: unknown; isPublic?: boolean } }) =>
      updateConfig(input.key, input.body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY })
      toast.success("Config updated.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
