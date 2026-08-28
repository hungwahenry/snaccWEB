import { api } from "@/lib/api/client"

export interface OpsHealth {
  status: string
  database: { ok: boolean; latency_ms: number }
  queue_driver: string
  memory: { rss_mb: number; heap_used_mb: number }
  uptime_seconds: number
  node_version: string
  started_at: string
}

export interface OpsQueue {
  name: string
  counts: Record<string, number> | null
}

export interface OpsDrift {
  profiles: Record<string, number>
  snaccs: Record<string, number>
  /** Profiles whose score columns disagree with the score ledger. */
  scores: Record<string, number>
  /** Wallet balances that disagree with their entries. A trigger owns this, so always zero. */
  wallets: { accounts: number }
}

export function getHealth() {
  return api.get<OpsHealth>("/admin/ops/health")
}

export function getQueues() {
  return api.get<OpsQueue[]>("/admin/ops/queues")
}

export function getDrift() {
  return api.get<OpsDrift>("/admin/ops/drift")
}

export function runTask(task: string) {
  return api.post<Record<string, number>>(`/admin/ops/run/${task}`)
}

export function retryQueue(name: string) {
  return api.post<{ retried: number }>(`/admin/ops/queues/${name}/retry`)
}
