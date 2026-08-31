import { api, type QueryParams } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  WebhookEvent,
  WebhookEventDetail,
  WebhookFilters,
  WebhookStats,
} from "../types"

export function listWebhooks(params: WebhookFilters) {
  return api.get<Paginated<WebhookEvent>>(
    "/admin/webhooks",
    params as QueryParams
  )
}

export function webhookStats() {
  return api.get<WebhookStats>("/admin/webhooks/stats")
}

export function getWebhook(id: string) {
  return api.get<WebhookEventDetail>(`/admin/webhooks/${id}`)
}
