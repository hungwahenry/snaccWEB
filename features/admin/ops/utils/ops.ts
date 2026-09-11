import type { StatusMeta } from "@/features/admin/shell/types"
import { humanize, plural, uptime } from "@/features/admin/shell/utils/format"
import { formatNumber } from "@/lib/format"
import type {
  DriftRow,
  HealthStatus,
  OpsDrift,
  OpsHealth,
  OpsReconcile,
  OpsRepairResult,
  OpsTask,
  QueueDriver,
} from "../types"

export const HEALTH_STATUS: Record<HealthStatus, StatusMeta> = {
  ok: { label: "Healthy", variant: "secondary" },
  degraded: { label: "Degraded", variant: "destructive" },
}

const QUEUE_DRIVERS: Record<QueueDriver, string> = {
  redis: "Redis",
  inline: "Inline, no Redis",
}

export interface HealthFact {
  label: string
  value: string
}

/** Health split into what the server talks to and how the process itself is doing. */
export function healthFacts(health: OpsHealth): {
  services: HealthFact[]
  process: HealthFact[]
} {
  return {
    services: [
      {
        label: "Database",
        value: health.database.ok
          ? `Reachable · ${formatNumber(health.database.latency_ms)} ms`
          : "Unreachable",
      },
      { label: "Background jobs", value: QUEUE_DRIVERS[health.queue_driver] },
      { label: "Up for", value: uptime(health.uptime_seconds) },
    ],
    process: [
      {
        label: "Memory (RSS)",
        value: `${formatNumber(health.memory.rss_mb)} MB`,
      },
      {
        label: "Heap used",
        value: `${formatNumber(health.memory.heap_used_mb)} MB`,
      },
      { label: "Node", value: health.node_version },
    ],
  }
}

/** Why a queue shows no counts: it has none to show, or they could not be read. */
export function missingCountsNote(driver: QueueDriver | undefined): string {
  return driver === "inline"
    ? "Runs inline, so there is nothing queued"
    : "Couldn't read this queue"
}

export function retryMessage(retried: number): string {
  return retried === 0
    ? "No failed jobs were left to retry."
    : `Retried ${plural(retried, "failed job")}.`
}

const DRIFT_LABELS: Record<string, string> = {
  "profiles.snaccs_count": "Snaccs per user",
  "profiles.followers_count": "Followers",
  "profiles.following_count": "Following",
  "profiles.total_views_received": "Views received",
  "profiles.unread_notifications_count": "Unread notifications",
  "snaccs.reactions_count": "Reactions per snacc",
  "snaccs.resnaccs_count": "Resnaccs per snacc",
  "snaccs.views_count": "Views per snacc",
  "snaccs.comments_count": "Comments per snacc",
  "snaccs.quotes_count": "Quotes per snacc",
  "snaccs.bookmarks_count": "Bookmarks per snacc",
  "snaccs.shares_count": "Shares per snacc",
  "snaccs.author_taps_count": "Author taps per snacc",
  "snaccs.hides_count": "Hides per snacc",
  "snaccs.reports_count": "Reports per snacc",
  "snaccs.opens_count": "Opens per snacc",
  "snaccs.dwell_ms_total": "Dwell time per snacc",
  "scores.score": "Snacc Score vs ledger",
  "scores.tier": "Tier vs ladder",
  "wallets.accounts": "Wallet balances vs ledger",
  "earnings.profiles": "Earnings balances vs ledger",
  "premium.profiles": "Premium status vs subscription",
}

/** Earnings and premium are kept by database triggers; "Repair now" never touches them. */
const REPAIRED: Record<keyof OpsDrift, boolean> = {
  profiles: true,
  snaccs: true,
  scores: true,
  wallets: true,
  earnings: false,
  premium: false,
}

/** Every number that disagrees with its source, one row each. */
export function driftRows(drift: OpsDrift): DriftRow[] {
  return (Object.keys(drift) as (keyof OpsDrift)[]).flatMap((group) =>
    Object.entries(drift[group] as unknown as Record<string, number>)
      .filter(([, off]) => off > 0)
      .map(([name, off]) => {
        const key = `${group}.${name}`

        return {
          key,
          label: DRIFT_LABELS[key] ?? `${humanize(group)}: ${humanize(name)}`,
          off,
          repairable: REPAIRED[group] ?? false,
        }
      })
  )
}

export const REPAIR_TASKS: readonly OpsTask[] = [
  "repair-counters",
  "repair-scores",
  "repair-wallets",
]

export function repairMessage(results: OpsRepairResult[]): string {
  const rows = results
    .flatMap((result) => Object.values(result))
    .reduce((sum, count) => sum + count, 0)

  return rows === 0
    ? "Nothing needed repairing."
    : `Rewrote ${plural(rows, "row")}. Anything that drifted will drift again until the cause is fixed.`
}

function sentence(parts: string[]): string {
  const text =
    parts.length > 1
      ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`
      : parts[0]

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`
}

export function reconcileMessage({
  withdrawals,
  deposits,
}: OpsReconcile): string {
  const waiting =
    withdrawals.waiting > 0
      ? `${plural(withdrawals.waiting, "withdrawal")} still waiting on Paystack.`
      : null
  const moved = [
    withdrawals.settled > 0 &&
      `paid out ${plural(withdrawals.settled, "withdrawal")}`,
    withdrawals.failed > 0 &&
      `refunded ${plural(withdrawals.failed, "failed withdrawal")}`,
    deposits.credited > 0 && `credited ${plural(deposits.credited, "top-up")}`,
  ].filter((part): part is string => Boolean(part))

  if (moved.length === 0) {
    return waiting
      ? `Nothing settled yet. ${waiting}`
      : "Nothing to settle. Paystack agrees with us."
  }

  return waiting ? `${sentence(moved)} ${waiting}` : sentence(moved)
}
