"use client"

import { useQuery } from "@tanstack/react-query"
import { getUniversity } from "../api"
import { campusKeys } from "../utils/keys"

export function useUniversity(slug: string) {
  return useQuery({
    queryKey: campusKeys.detail(slug),
    queryFn: () => getUniversity(slug),
  })
}
