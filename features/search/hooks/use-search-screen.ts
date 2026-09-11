"use client"

import { debounce, useQueryStates } from "nuqs"
import { useCallback } from "react"
import { useMe } from "@/features/auth/hooks/use-me"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { SearchTab } from "../types"
import { SEARCH_DEBOUNCE_MS, SEARCH_PARAMS } from "../utils/tabs"
import { searchTermFor } from "../utils/terms"
import {
  useSearchCampuses,
  useSearchHashtags,
  useSearchSnaccs,
  useSearchUsers,
} from "./use-search"

export function useSearchScreen() {
  const [params, setParams] = useQueryStates(SEARCH_PARAMS, {
    history: "replace",
  })
  const typed = params.q.trim()
  const settled = useDebouncedValue(typed, SEARCH_DEBOUNCE_MS)
  const tab = params.tab
  const meId = useMe().data?.id ?? null

  const people = useSearchUsers(
    searchTermFor("people", settled),
    tab === "people"
  )
  const snaccs = useSearchSnaccs(settled, tab === "snaccs")
  const tags = useSearchHashtags(searchTermFor("tags", settled), tab === "tags")
  const campuses = useSearchCampuses(settled, tab === "campuses")

  const setQuery = useCallback(
    (q: string) =>
      void setParams(
        { q: q || null },
        { limitUrlUpdates: debounce(SEARCH_DEBOUNCE_MS) }
      ),
    [setParams]
  )
  const setTab = useCallback(
    (next: SearchTab) => void setParams({ tab: next }),
    [setParams]
  )

  return {
    query: params.q,
    setQuery,
    idle: typed.length === 0,
    // The first letters are typed but not searched yet: show the skeleton, not "nothing found".
    settling: settled.length === 0,
    tab,
    setTab,
    meId,
    people,
    snaccs,
    tags,
    campuses,
  }
}
