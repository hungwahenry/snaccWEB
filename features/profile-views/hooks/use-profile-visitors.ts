"use client"

import { useFollowableList } from "@/features/follows/hooks/use-followable-list"
import { listProfileViews } from "../api"

export const VISITORS_KEY = ["profile-views"]

export function useProfileVisitors(enabled: boolean) {
  return useFollowableList(VISITORS_KEY, listProfileViews, { enabled })
}
