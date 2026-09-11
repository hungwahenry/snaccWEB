"use client"

import { parseAsString } from "nuqs"
import { useMemo } from "react"
import { useListParams } from "@/features/admin/shell/hooks/use-list-params"
import { filterHeld } from "../utils/reserved-usernames"
import {
  useReservedUsernameActions,
  useReservedUsernames,
} from "./use-reserved-usernames"

const FILTERS = { q: parseAsString.withDefault("") }

export function useReservedUsernamesScreen() {
  const list = useListParams(FILTERS)
  const query = useReservedUsernames()
  const search = list.query.q
  const shown = useMemo(
    () => filterHeld(query.data ?? [], search),
    [query.data, search]
  )

  return { list, query, shown, actions: useReservedUsernameActions() }
}
