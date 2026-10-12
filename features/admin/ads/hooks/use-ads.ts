"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  approveAd,
  endAd,
  getAd,
  getAdStats,
  listAds,
  pauseAd,
  rejectAd,
  resumeAd,
} from "../api"
import type { AdListQuery, AdReviewActions, RejectAdInput } from "../types"
import { adminAdKeys } from "../utils/keys"

export function useAds(query: AdListQuery) {
  return useQuery({
    queryKey: adminAdKeys.list(query),
    queryFn: () => listAds(query),
    placeholderData: keepPreviousData,
  })
}

export function useAdStats() {
  return useQuery({
    queryKey: adminAdKeys.stats(),
    queryFn: getAdStats,
  })
}

export function useAd(id: string) {
  return useQuery({
    queryKey: adminAdKeys.detail(id),
    queryFn: () => getAd(id),
  })
}

export function useAdActions(id: string): AdReviewActions {
  const invalidates = [adminAdKeys.campaigns()]

  const { run: approve } = useAdminMutation({
    mutationFn: () => approveAd(id),
    success: "Approved.",
    invalidates,
  })
  const { run: reject } = useAdminMutation({
    mutationFn: (input: RejectAdInput) => rejectAd(id, input),
    success: "Turned down and refunded.",
    invalidates,
  })
  const { run: pause } = useAdminMutation({
    mutationFn: () => pauseAd(id),
    success: "Paused.",
    invalidates,
  })
  const { run: resume } = useAdminMutation({
    mutationFn: () => resumeAd(id),
    success: "Running again.",
    invalidates,
  })
  const { run: end } = useAdminMutation({
    mutationFn: () => endAd(id),
    success: "Ended and settled.",
    invalidates,
  })

  return useMemo(
    () => ({
      approve: () => approve(),
      reject,
      pause: () => pause(),
      resume: () => resume(),
      end: () => end(),
    }),
    [approve, reject, pause, resume, end]
  )
}
