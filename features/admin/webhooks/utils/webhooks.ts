import type { Option, StatusMeta } from "@/features/admin/shell/types"
import { formatDate, formatNumber } from "@/lib/format"
import type {
  WebhookEvent,
  WebhookProvider,
  WebhookStats,
  WebhookStatus,
} from "../types"

export const WEBHOOK_PROVIDERS = [
  "revenuecat",
  "paystack",
  "cloudflare_stream",
] as const satisfies readonly WebhookProvider[]

export const WEBHOOK_STATUSES = [
  "applied",
  "ignored",
  "failed",
  "received",
] as const satisfies readonly WebhookStatus[]

const PROVIDER_LABELS: Record<WebhookProvider, string> = {
  revenuecat: "RevenueCat",
  paystack: "Paystack",
  cloudflare_stream: "Cloudflare Stream",
}

export const WEBHOOK_STATUS: Record<WebhookStatus, StatusMeta> = {
  received: { label: "Unsettled", variant: "outline" },
  applied: { label: "Applied", variant: "secondary" },
  ignored: { label: "Ignored", variant: "outline" },
  failed: { label: "Failed", variant: "destructive" },
}

export function providerLabel(provider: string): string {
  return PROVIDER_LABELS[provider as WebhookProvider] ?? provider
}

export function statusLabel(status: string): string {
  return WEBHOOK_STATUS[status as WebhookStatus]?.label ?? status
}

export const PROVIDER_OPTIONS: Option<WebhookProvider>[] =
  WEBHOOK_PROVIDERS.map((provider) => ({
    value: provider,
    label: PROVIDER_LABELS[provider],
  }))

export const STATUS_OPTIONS: Option<WebhookStatus>[] = WEBHOOK_STATUSES.map(
  (status) => ({ value: status, label: WEBHOOK_STATUS[status].label })
)

export interface DeliveryFact {
  label: string
  value: string
}

/** Failures first, then a line per provider and outcome. */
export function deliveryFacts(stats: WebhookStats): DeliveryFact[] {
  return [
    { label: "Failed", value: formatNumber(stats.failed) },
    ...stats.by_provider.map((row) => ({
      label: `${providerLabel(row.provider)} · ${statusLabel(row.status)}`,
      value: formatNumber(row.count),
    })),
  ]
}

export function deliveryLine(
  event: Pick<WebhookEvent, "event_id" | "created_at">
): string {
  return `${event.event_id} · received ${formatDate(event.created_at)}`
}
