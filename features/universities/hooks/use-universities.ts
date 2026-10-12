"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listUniversities } from "@/features/universities/api"

export function useUniversities(search = "", country: string | null = null) {
  const term = search.trim()
  return useQuery({
    queryKey: ["universities", { search: term, country }],
    queryFn: () =>
      listUniversities({
        search: term || undefined,
        country: country ?? undefined,
        perPage: 50,
      }),
    placeholderData: keepPreviousData,
  })
}
