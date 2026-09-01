"use client"

import { useQuery } from "@tanstack/react-query"
import { getPublicConfig } from "../api"

export function useConfigValue<T>(key: string, fallback: T): T {
  const { data } = useQuery({
    queryKey: ["config", "public"],
    queryFn: getPublicConfig,
    staleTime: 5 * 60 * 1000,
  })

  const value = data?.[key]

  return value === undefined ? fallback : (value as T)
}
