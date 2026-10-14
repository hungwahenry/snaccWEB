"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { listUniversities } from "@/features/universities/api"
import { useUniversities } from "@/features/universities/hooks/use-universities"
import { MINUTE_MS } from "@/lib/duration"
import { campusSearchOptions } from "../utils/university"
import { adminUniversityKeys } from "../utils/keys"

export function useCampusSearch(
  value: string | null,
  anyLabel?: string,
  within?: readonly string[] | null
) {
  const [term, setTerm] = useState("")
  const results = useUniversities(term, null, true)
  const picked = useQuery({
    queryKey: adminUniversityKeys.one(value ?? ""),
    queryFn: () => listUniversities({ id: value ?? undefined, perPage: 1 }),
    enabled: Boolean(value),
    staleTime: 5 * MINUTE_MS,
  })

  const options = useMemo(() => {
    const found = [
      ...(picked.data?.items ?? []),
      ...(results.data?.items ?? []),
    ].filter((campus) => !within || within.includes(campus.id))
    return campusSearchOptions(found, anyLabel)
  }, [picked.data, results.data, anyLabel, within])

  return { options, search: setTerm }
}

export function useCampusName(id: string | null): string | undefined {
  const picked = useQuery({
    queryKey: adminUniversityKeys.one(id ?? ""),
    queryFn: () => listUniversities({ id: id ?? undefined, perPage: 1 }),
    enabled: Boolean(id),
    staleTime: 5 * MINUTE_MS,
  })
  return picked.data?.items[0]?.name
}
