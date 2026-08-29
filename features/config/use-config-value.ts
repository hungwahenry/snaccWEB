"use client"

import { useQuery } from "@tanstack/react-query"
import { getPublicConfig } from "./index"

export function useConfigValue<T>(key: string, fallback: T): T {
  const { data } = useQuery({
    queryKey: ["config", "public"],
    queryFn: getPublicConfig,
    staleTime: 5 * 60 * 1000,
  })

  const value = data?.values[key]

  return value === undefined ? fallback : (value as T)
}
