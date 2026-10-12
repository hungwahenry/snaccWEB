"use client"

import { useState } from "react"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import type { University } from "../types"
import { useUniversities } from "./use-universities"

export function useCampusSheet(
  onPick: (university: University) => void,
  {
    country = null,
    exclude = [],
  }: { country?: string | null; exclude?: string[] } = {}
) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const debounced = useDebouncedValue(search, 300)
  const universities = useUniversities(debounced, country)
  const results = search.trim()
    ? (universities.data?.items ?? []).filter(
        (university) => !exclude.includes(university.id)
      )
    : []

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setSearch("")
  }

  const sheet = {
    open,
    onOpenChange,
    search,
    onSearch: setSearch,
    searching: universities.isFetching,
    results,
    onSelect: (university: University) => {
      onOpenChange(false)
      onPick(university)
    },
  }

  return {
    show: () => setOpen(true),
    sheet,
  }
}

export type CampusSheetState = ReturnType<typeof useCampusSheet>["sheet"]
