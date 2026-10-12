"use client"

import { useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { University } from "../types"
import { useUniversities } from "./use-universities"

export function useCampusChoice(onClear?: () => void) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<University | null>(null)
  const debounced = useDebouncedValue(search, 300)
  const universities = useUniversities(debounced)

  return {
    search,
    onSearch: setSearch,
    searching: universities.isFetching,
    results: search.trim() ? (universities.data?.items ?? []) : [],
    selected,
    onSelect: (university: University | null) => {
      setSelected(university)
      setSearch("")
      if (!university) onClear?.()
    },
  }
}

export type CampusChoice = ReturnType<typeof useCampusChoice>
