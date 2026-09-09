"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getAppConfig } from "@/features/config/api"
export const APP_CONFIG_KEY = ["app-config"]

export function useAppConfig() {
  return useQuery({
    queryKey: APP_CONFIG_KEY,
    queryFn: getAppConfig,
    staleTime: 5 * MINUTE_MS,
  })
}
