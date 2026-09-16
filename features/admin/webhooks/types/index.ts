export type WebhookProvider = "revenuecat" | "paystack" | "cloudflare_stream"
export type WebhookStatus = "received" | "applied" | "ignored" | "failed"

export interface WebhookEvent {
  id: string
  provider: WebhookProvider
  event_id: string
  type: string
  status: WebhookStatus
  note: string | null
  user: {
    id: string
    username: string | null
    display_name: string | null
  } | null
  created_at: string
  settled_at: string | null
}

export interface WebhookEventDetail extends WebhookEvent {
  payload: unknown
}

export interface WebhookStats {
  by_provider: { provider: string; status: string; count: number }[]
  failed: number
}

export type WebhookListQuery = {
  page: number
  perPage: number
  provider?: WebhookProvider
  status?: WebhookStatus
  type?: string
  q?: string
}
