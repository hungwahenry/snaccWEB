"use client"

import { useQuery } from "@tanstack/react-query"
import { getWebhook, listWebhooks, webhookStats } from "../api"
import type { WebhookFilters } from "../types"

const KEY = ["admin", "webhooks"]

export function useWebhooks(filters: WebhookFilters) {
  return useQuery({
    queryKey: [...KEY, "list", filters],
    queryFn: () => listWebhooks(filters),
  })
}

export function useWebhookStats() {
  return useQuery({ queryKey: [...KEY, "stats"], queryFn: webhookStats })
}

export function useWebhook(id: string | null) {
  return useQuery({
    queryKey: [...KEY, "one", id],
    queryFn: () => getWebhook(id as string),
    enabled: !!id,
  })
}
