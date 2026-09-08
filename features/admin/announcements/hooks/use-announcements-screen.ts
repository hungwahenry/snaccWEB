"use client"

import { useListState } from "@/features/admin/shell/hooks/use-list-state"
import type { ListAnnouncementsParams } from "../types"
import { useAnnouncements } from "./use-announcements"

export function useAnnouncementsScreen() {
  const { params, patch } = useListState<ListAnnouncementsParams>({
    page: 1,
    perPage: 20,
  })
  return { params, patch, query: useAnnouncements(params) }
}
