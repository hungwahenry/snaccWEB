"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useCampuses } from "@/features/admin/universities/hooks/use-universities"
import { STATUS_FILTERS } from "../utils/announcement"
import { useAnnouncements } from "./use-announcements"

const FILTERS = {
  q: parseAsString.withDefault(""),
  status: parseAsStringLiteral(STATUS_FILTERS),
}

export function useAnnouncementsScreen() {
  const list = useListParams(FILTERS)
  const query = useAnnouncements({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    status: list.query.status ?? undefined,
  })

  return { list, query, campuses: useCampuses() }
}
