"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listUniversities } from "@/features/universities/api"

export function useUniversities(search = "") {
  const term = search.trim()
  return useQuery({
    queryKey: ["universities", { search: term }],
    queryFn: () => listUniversities({ search: term || undefined, perPage: 50 }),
    placeholderData: keepPreviousData,
  })
}
