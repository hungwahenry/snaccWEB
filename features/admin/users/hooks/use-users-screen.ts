"use client"

import { parseAsString, parseAsStringLiteral } from "nuqs"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import {
  booleanFilter,
  PAGE_SIZE,
} from "@/features/admin/shell/utils/list-params"
import { ACCOUNT_KINDS, ACCOUNT_STATES } from "../utils/users"
import { useUsers } from "./use-users"

const FILTERS = {
  q: parseAsString.withDefault(""),
  kind: parseAsStringLiteral(ACCOUNT_KINDS),
  state: parseAsStringLiteral(ACCOUNT_STATES),
  campus: parseAsString,
}

export function useUsersScreen() {
  const list = useListParams(FILTERS)
  const query = useUsers({
    page: list.query.page,
    perPage: PAGE_SIZE,
    q: list.query.q || undefined,
    staff: booleanFilter(list.query.kind, "staff"),
    suspended: booleanFilter(list.query.state, "suspended"),
    universityId: list.query.campus ?? undefined,
  })

  return { list, query }
}
