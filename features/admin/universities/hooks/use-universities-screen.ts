"use client"

import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useUniversities, useUniversityActions } from "./use-universities"

const FILTERS = { q: parseAsString.withDefault("") }

export function useUniversitiesScreen() {
  const list = useListParams(FILTERS)
  const query = useUniversities({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
  })

  return { list, query, actions: useUniversityActions() }
}
