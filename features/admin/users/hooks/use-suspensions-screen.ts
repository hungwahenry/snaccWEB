"use client"

import { parseAsString } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { PAGE_SIZE } from "@/features/admin/shell/utils/list-params"
import { useUsers } from "./use-users"

const FILTERS = { q: parseAsString.withDefault("") }

export function useSuspensionsScreen() {
  const list = useListParams(FILTERS)
  const query = useUsers({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    suspended: true,
  })

  return { list, query }
}
