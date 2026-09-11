"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { useAdminMutation } from "@/features/admin/shell/hooks/use-admin-mutation"
import {
  createAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
} from "../api"
import type { AnnouncementDraft, AnnouncementListQuery } from "../types"
import { toCreateInput } from "../utils/announcement"
import { adminAnnouncementKeys } from "../utils/keys"

export function useAnnouncements(query: AnnouncementListQuery) {
  return useQuery({
    queryKey: adminAnnouncementKeys.list(query),
    queryFn: () => listAnnouncements(query),
    placeholderData: keepPreviousData,
  })
}

export function useAnnouncementActions() {
  const invalidates = [adminAnnouncementKeys.all()]

  const { run: send } = useAdminMutation({
    mutationFn: (draft: AnnouncementDraft) =>
      createAnnouncement(toCreateInput(draft)),
    success: "Announcement sent.",
    invalidates,
  })
  const { run: remove } = useAdminMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    success: "Announcement deleted.",
    invalidates,
  })

  return useMemo(() => ({ send, remove }), [send, remove])
}
