"use client"

import { useQuery } from "@tanstack/react-query"
import { getUniversity } from "../api"

export function useUniversity(slug: string) {
  return useQuery({
    queryKey: ["universities", slug.toLowerCase(), "detail"],
    queryFn: () => getUniversity(slug),
  })
}
