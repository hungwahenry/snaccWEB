"use client"

import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useDrift, useHealth, useOpsMutations, useQueues } from "@/features/admin/ops/use-ops"

function uptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return [d && `${d}d`, h && `${h}h`, `${m}m`].filter(Boolean).join(" ") || "0m"
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

const DRIFT_LABELS: Record<string, string> = {
  snaccs_count: "Snaccs per user",
  followers_count: "Followers",
  following_count: "Following",
  total_views_received: "Views received",
  reactions_received: "Reactions received",
  resnaccs_received: "Resnaccs received",
  comments_received: "Comments received",
  reactions_count: "Reactions per snacc",
  resnaccs_count: "Resnaccs per snacc",
  views_count: "Views per snacc",
  comments_count: "Comments per snacc",
}

export default function OpsPage() {
  const health = useHealth()
  const queues = useQueues()
  const drift = useDrift()
  const mutations = useOpsMutations()

  const driftRows = drift.data
    ? [...Object.entries(drift.data.profiles), ...Object.entries(drift.data.snaccs)].filter(
        ([, off]) => off > 0,
      )
    : []

  return (
    <>
      <PageHeader
        title="Ops & maintenance"
        description="System health, background jobs, and data reconciliation."
      />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">System health</CardTitle>
            {health.data && (
              <Badge variant={health.data.status === "ok" ? "secondary" : "destructive"}>
                {health.data.status}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {health.isPending ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : health.data ? (
              <div className="grid gap-x-8 sm:grid-cols-2">
                <Row
                  label="Database"
                  value={
                    health.data.database.ok
                      ? `ok · ${health.data.database.latency_ms}ms`
                      : "unreachable"
                  }
                />
                <Row label="Queue driver" value={health.data.queue_driver} />
                <Row label="Memory (RSS)" value={`${formatNumber(health.data.memory.rss_mb)} MB`} />
                <Row label="Heap used" value={`${formatNumber(health.data.memory.heap_used_mb)} MB`} />
                <Row label="Uptime" value={uptime(health.data.uptime_seconds)} />
                <Row label="Node" value={health.data.node_version} />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Couldn&apos;t load health.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Background jobs</CardTitle>
          </CardHeader>
          <CardContent>
            {queues.isPending ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : queues.data ? (
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
                  {queues.data.map((q) => (
                    <TableRow key={q.name}>
                      <TableCell className="font-medium">{q.name}</TableCell>
                      {q.counts ? (
                        <>
                          <TableCell className="text-right tabular-nums">{q.counts.waiting}</TableCell>
                          <TableCell className="text-right tabular-nums">{q.counts.active}</TableCell>
                          <TableCell className="text-right tabular-nums">{q.counts.delayed}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {q.counts.failed > 0 ? (
                              <span className="text-destructive font-medium">{q.counts.failed}</span>
                            ) : (
                              0
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {q.counts.failed > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={mutations.retry.isPending}
                                onClick={() => mutations.retry.mutate(q.name)}
                              >
                                Retry
                              </Button>
                            )}
                          </TableCell>
                        </>
                      ) : (
                        <TableCell colSpan={5} className="text-muted-foreground text-sm">
                          inline (no redis)
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground text-sm">Couldn&apos;t load queues.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Counter reconciliation</CardTitle>
            <Button
              size="sm"
              disabled={mutations.reconcile.isPending}
              onClick={() => mutations.reconcile.mutate()}
            >
              {mutations.reconcile.isPending ? "Reconciling…" : "Run reconcile"}
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Denormalized counts self-heal nightly (04:00 WAT) and write only rows that have
              drifted. Run manually if something looks off.
            </p>
            {drift.isPending ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : driftRows.length === 0 ? (
              <p className="text-sm">
                <Badge variant="secondary">in sync</Badge>{" "}
                <span className="text-muted-foreground">Every counter matches its source.</span>
              </p>
            ) : (
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
                      <TableCell className="text-destructive text-right font-medium tabular-nums">
                        {formatNumber(off)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
