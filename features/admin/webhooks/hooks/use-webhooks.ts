"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { getWebhook, getWebhookStats, listWebhooks } from "../api"
import type { WebhookListQuery } from "../types"
import { adminWebhookKeys } from "../utils/keys"

export function useWebhooks(query: WebhookListQuery) {
  return useQuery({
    queryKey: adminWebhookKeys.list(query),
    queryFn: () => listWebhooks(query),
    placeholderData: keepPreviousData,
  })
}

export function useWebhookStats() {
  return useQuery({
    queryKey: adminWebhookKeys.stats(),
    queryFn: getWebhookStats,
  })
}

export function useWebhook(id: string | null) {
  return useQuery({
    queryKey: adminWebhookKeys.detail(id),
    queryFn: () => getWebhook(id as string),
    enabled: id !== null,
  })
}
