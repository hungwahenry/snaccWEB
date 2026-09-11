"use client"

import { useQuery } from "@tanstack/react-query"
import { getAppConfig } from "@/features/config/api"
import { MINUTE_MS } from "@/lib/duration"
import { configKeys } from "../utils/keys"

export function useAppConfig() {
  return useQuery({
    queryKey: configKeys.app(),
    queryFn: getAppConfig,
    staleTime: 5 * MINUTE_MS,
  })
}
