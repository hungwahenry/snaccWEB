import { api } from "@/lib/api/client"
import type { Paginated } from "@/lib/api/types"
import type {
  WebhookEvent,
  WebhookEventDetail,
  WebhookListQuery,
  WebhookStats,
} from "../types"

export function listWebhooks(query: WebhookListQuery) {
  return api.get<Paginated<WebhookEvent>>("/admin/webhooks", query)
}

export function getWebhookStats() {
  return api.get<WebhookStats>("/admin/webhooks/stats")
}

export function getWebhook(id: string) {
  return api.get<WebhookEventDetail>(`/admin/webhooks/${id}`)
}
