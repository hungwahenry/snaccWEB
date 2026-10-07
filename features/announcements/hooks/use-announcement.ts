"use client"

import { useQuery } from "@tanstack/react-query"
import { getAnnouncement } from "../api"
import { announcementKeys } from "../utils/keys"

export function useAnnouncement(id: string | null, enabled: boolean) {
  return useQuery({
    queryKey: announcementKeys.detail(id ?? ""),
    queryFn: () => getAnnouncement(id ?? ""),
    enabled: enabled && id !== null,
  })
}
