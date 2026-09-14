import type { WebhookListQuery } from "../types"

export const adminWebhookKeys = {
  all: () => ["admin", "webhooks"] as const,
  list: (query: WebhookListQuery) =>
    ["admin", "webhooks", "list", query] as const,
  stats: () => ["admin", "webhooks", "stats"] as const,
  detail: (id: string | null) => ["admin", "webhooks", "detail", id] as const,
}
