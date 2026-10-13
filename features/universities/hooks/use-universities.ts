"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { listUniversities } from "@/features/universities/api"

export function useUniversities(
  search = "",
  country: string | null = null,
  verifiedOnly = false
) {
  const term = search.trim()
  return useQuery({
    queryKey: ["universities", { search: term, country, verifiedOnly }],
    queryFn: () =>
      listUniversities({
        search: term || undefined,
        country: country ?? undefined,
        verified: verifiedOnly || undefined,
        perPage: 50,
      }),
    placeholderData: keepPreviousData,
  })
}
