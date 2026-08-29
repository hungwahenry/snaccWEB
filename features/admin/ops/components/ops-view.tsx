"use client"

import { ConfirmAction } from "@/components/admin/confirm-action"
import { Fact, Facts, Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "@/lib/format"
import { DRIFT_LABELS } from "../utils/drift-labels"
import {
  useDrift,
  useHealth,
  useOpsMutations,
  useQueues,
} from "../hooks/use-ops"

function uptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return (
    [days && `${days}d`, hours && `${hours}h`, `${minutes}m`]
      .filter(Boolean)
      .join(" ") || "0m"
  )
}

function Loading() {
  return (
    <div className="flex justify-center py-6">
      <Spinner />
    </div>
  )
}

export function OpsView() {
  const health = useHealth()
  const queues = useQueues()
  const drift = useDrift()
  const mutations = useOpsMutations()

  const driftRows = drift.data
    ? [
        ...Object.entries(drift.data.profiles),
        ...Object.entries(drift.data.scores),
        ...Object.entries(drift.data.snaccs),
        ["wallet_balances", drift.data.wallets.accounts] as [string, number],
        ["earnings_balances", drift.data.earnings?.profiles ?? 0] as [
          string,
          number,
        ],
      ].filter(([, off]) => off > 0)
    : []

  return (
    <div className="flex flex-col gap-6">
      <Section
        title="System health"
        action={
          health.data ? (
            <Badge
              variant={
                health.data.status === "ok" ? "secondary" : "destructive"
              }
            >
              {health.data.status}
            </Badge>
          ) : null
        }
      >
        {health.isPending ? (
          <Loading />
        ) : health.data ? (
          <div className="grid gap-3 lg:grid-cols-2">
            <Facts>
              <Fact
                label="Database"
                value={
                  health.data.database.ok
                    ? `ok · ${health.data.database.latency_ms}ms`
                    : "unreachable"
                }
              />
              <Fact label="Queue driver" value={health.data.queue_driver} />
              <Fact label="Uptime" value={uptime(health.data.uptime_seconds)} />
            </Facts>
            <Facts>
              <Fact
                label="Memory (RSS)"
                value={`${formatNumber(health.data.memory.rss_mb)} MB`}
              />
              <Fact
                label="Heap used"
                value={`${formatNumber(health.data.memory.heap_used_mb)} MB`}
              />
              <Fact label="Node" value={health.data.node_version} />
            </Facts>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load health.
          </p>
        )}
      </Section>

      <Section title="Background jobs">
        {queues.isPending ? (
          <Loading />
        ) : queues.data ? (
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Queue</TableHead>
                  <TableHead className="text-right">Waiting</TableHead>
                  <TableHead className="text-right">Active</TableHead>
                  <TableHead className="text-right">Delayed</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {queues.data.map((queue) => (
                  <TableRow key={queue.name}>
                    <TableCell className="font-medium">{queue.name}</TableCell>
                    {queue.counts ? (
                      <>
                        <TableCell className="text-right tabular-nums">
                          {queue.counts.waiting}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {queue.counts.active}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {queue.counts.delayed}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {queue.counts.failed > 0 ? (
                            <span className="font-medium text-destructive">
                              {queue.counts.failed}
                            </span>
                          ) : (
                            0
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {queue.counts.failed > 0 ? (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={mutations.retry.isPending}
                              onClick={() => mutations.retry.mutate(queue.name)}
                            >
                              Retry
                            </Button>
                          ) : null}
                        </TableCell>
                      </>
                    ) : (
                      <TableCell
                        colSpan={5}
                        className="text-sm text-muted-foreground"
                      >
                        inline (no redis)
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
        ) : (
          <p className="text-sm text-muted-foreground">
            Couldn&apos;t load queues.
          </p>
        )}
      </Section>

      <Section
        title="Paystack settlement"
        action={
          <ConfirmAction
            label={
              mutations.reconcile.isPending ? "Reconciling…" : "Reconcile now"
            }
            confirmVariant="default"
            title="Ask Paystack about everything unsettled?"
            description="Withdrawals and top-ups still in flight are checked one by one, and any that have settled are applied. This moves money, so run it when you actually suspect a missed webhook."
            confirmLabel="Reconcile now"
            pending={mutations.reconcile.isPending}
            onConfirm={(close) =>
              mutations.reconcile.mutate(undefined, { onSuccess: close })
            }
          />
        }
      >
        <p className="text-sm text-pretty text-muted-foreground">
          Withdrawals and top-ups normally settle the moment Paystack calls our
          webhook. Every ten minutes this asks Paystack directly about anything
          still unsettled, so money lands even when the webhook never arrives.
          Press this to bring that pass forward.
        </p>
      </Section>

      <Section
        title="Drift"
        description="A nightly check (04:00 WAT) reads these and raises an alarm if any is non-zero. Nothing repairs them on a schedule — a counter that heals itself overnight hides the bug that moved it. Repair by hand once you know what did."
        action={
          <ConfirmAction
            label={mutations.repair.isPending ? "Repairing…" : "Repair now"}
            title="Rewrite these counters from source?"
            description="Every counter listed is recomputed and overwritten. Do this once you know what moved them — repairing first throws away the evidence."
            confirmLabel="Repair now"
            pending={mutations.repair.isPending}
            onConfirm={(close) =>
              mutations.repair.mutate(undefined, { onSuccess: close })
            }
          />
        }
      >
        {drift.isPending ? (
          <Loading />
        ) : driftRows.length === 0 ? (
          <p className="flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3 text-sm">
            <Badge variant="secondary">in sync</Badge>
            <span className="text-muted-foreground">
              Every counter, score and balance matches its source.
            </span>
          </p>
        ) : (
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Counter</TableHead>
                  <TableHead className="text-right">Rows off</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {driftRows.map(([key, off]) => (
                  <TableRow key={key}>
                    <TableCell>{DRIFT_LABELS[key] ?? key}</TableCell>
                    <TableCell className="text-right font-medium text-destructive tabular-nums">
                      {formatNumber(off)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
        )}
      </Section>
    </div>
  )
}
