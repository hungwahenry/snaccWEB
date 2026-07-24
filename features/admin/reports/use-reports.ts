"use client"

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api/errors"
import { listReports, resolveReport } from "./api"
import type { ListReportsParams } from "./types"

export function useReports(params: ListReportsParams) {
  return useQuery({
    queryKey: ["admin", "reports", params],
    queryFn: () => listReports(params),
    placeholderData: keepPreviousData,
  })
}

export function useResolveReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: resolveReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reports"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "snaccs"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success("Reports resolved.")
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
