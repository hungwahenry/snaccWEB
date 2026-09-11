"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getVisitorSummary, updateVisitorSettings } from "../api"
import { followKeys } from "@/features/follows/utils/keys"
import type { VisitorSummary } from "../types"
import { profileViewKeys } from "../utils/keys"
import { showError } from "@/lib/feedback"

const VISITOR_SUMMARY_KEY = profileViewKeys.summary()

export function useVisitorSummary(enabled = true) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: VISITOR_SUMMARY_KEY,
    queryFn: getVisitorSummary,
    enabled,
  })

  const update = useMutation({
    mutationFn: updateVisitorSettings,
    onMutate: (show) => {
      const previous =
        queryClient.getQueryData<VisitorSummary>(VISITOR_SUMMARY_KEY)
      queryClient.setQueryData<VisitorSummary>(
        VISITOR_SUMMARY_KEY,
        (summary) => (summary ? { ...summary, show_visitors: show } : summary)
      )
      return { previous }
    },
    onError: (error, _show, context) => {
      if (context?.previous)
        queryClient.setQueryData(VISITOR_SUMMARY_KEY, context.previous)
      showError(error)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: followKeys.visitors() })
      void queryClient.invalidateQueries({ queryKey: VISITOR_SUMMARY_KEY })
    },
  })

  return {
    summary: query.data,
    loading: query.isLoading,
    failed: query.isError,
    retry: () => void query.refetch(),
    showVisitors: query.data?.show_visitors ?? false,
    setShowVisitors: update.mutate,
    saving: update.isPending,
  }
}
