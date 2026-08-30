"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { listAppIcons, updateAppIcon } from "../api"
import type { UpdateAppIconInput } from "../types"

const KEY = ["admin", "app-icons"]

export function useAppIcons() {
  return useQuery({ queryKey: KEY, queryFn: listAppIcons })
}

export function useAppIconMutations() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAppIconInput }) =>
      updateAppIcon(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
