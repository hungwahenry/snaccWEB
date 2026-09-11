"use client"

import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { useAnnouncementActions, useAnnouncements } from "./use-announcements"

const FILTERS = { q: parseAsString.withDefault("") }

export function useAnnouncementsScreen() {
  const list = useListParams(FILTERS)
  const query = useAnnouncements({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
  })

  return {
    list,
    query,
    campuses: useCampuses(),
    actions: useAnnouncementActions(),
  }
}
