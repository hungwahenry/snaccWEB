"use client"

import { useState } from "react"
import { useUniversities } from "@/features/universities/hooks/use-universities"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { CampusPick } from "../types"

export function useCampusSearch(picked: CampusPick[], country: string) {
  const [search, setSearch] = useState("")
  const debounced = useDebouncedValue(search, 300)
  const universities = useUniversities(debounced, country || null)
  const found = search.trim() ? (universities.data?.items ?? []) : []

  return {
    search,
    onSearch: setSearch,
    searching: universities.isFetching,
    results: found.filter(
      (university) => !picked.some((campus) => campus.id === university.id)
    ),
    clear: () => setSearch(""),
  }
}
