"use client"

import { useQuery } from "@tanstack/react-query"
import { MINUTE_MS } from "@/lib/duration"
import { getAppConfig } from "@/features/config/api"
import type { AppConfig } from "@/features/config/types"

export const APP_CONFIG_KEY = ["app-config"]

const EMPTY: AppConfig = { values: {}, flags: {} }

export function useAppConfig() {
  return useQuery({
    queryKey: APP_CONFIG_KEY,
    queryFn: getAppConfig,
    staleTime: 5 * MINUTE_MS,
    placeholderData: EMPTY,
  })
}
