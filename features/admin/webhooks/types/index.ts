export type WebhookProvider = "revenuecat" | "paystack"
export type WebhookStatus = "received" | "applied" | "ignored" | "failed"

export interface WebhookEvent {
  id: string
  provider: WebhookProvider
  event_id: string
  type: string
  status: WebhookStatus
  note: string | null
  user: { id: string; username: string | null; display_name: string | null } | null
  created_at: string
  settled_at: string | null
}

export interface WebhookEventDetail extends WebhookEvent {
  payload: unknown
}

export interface WebhookStats {
  byProvider: { provider: string; status: string; count: number }[]
  failed: number
}

export interface WebhookFilters {
  page?: number
  provider?: WebhookProvider
  status?: WebhookStatus
  type?: string
  q?: string
}
