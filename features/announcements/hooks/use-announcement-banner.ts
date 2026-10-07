"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getAnnouncementBanner } from "../api"
import type { AnnouncementBanner } from "../types"
import { announcementKeys } from "../utils/keys"
import { useAnnouncementEvent } from "./use-announcement-event"
import { openAnnouncement } from "./use-announcement-sheet"

export function useAnnouncementBanner() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: announcementKeys.banner(),
    queryFn: getAnnouncementBanner,
  })
  const { mutate: record } = useAnnouncementEvent()
  const banner = query.data ?? null

  return {
    banner,
    onOpen: () => {
      if (banner) openAnnouncement(banner.id)
    },
    onDismiss: () => {
      if (!banner) return
      queryClient.setQueryData<AnnouncementBanner | null>(
        announcementKeys.banner(),
        null
      )
      record({ id: banner.id, kind: "dismissed" })
    },
  }
}
