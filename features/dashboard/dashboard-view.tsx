"use client"

import { Area, AreaChart } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNaira, formatNumber } from "@/lib/format"
import type { DashboardMetrics, DashboardSeriesPoint } from "./index"

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? <CardContent className="text-muted-foreground text-xs">{hint}</CardContent> : null}
    </Card>
  )
}

function Trend({
  label,
  value,
  data,
  dataKey,
}: {
  label: string
  value: string
  data: DashboardSeriesPoint[]
  dataKey: keyof DashboardSeriesPoint
}) {
  const config = {
    [dataKey]: { label, color: "var(--resnacc)" },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-20 w-full">
          <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Area
              dataKey={dataKey as string}
              type="monotone"
              stroke={`var(--color-${dataKey as string})`}
              fill={`var(--color-${dataKey as string})`}
              fillOpacity={0.12}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

export function DashboardView({ metrics }: { metrics: DashboardMetrics }) {
  const sum = (key: keyof DashboardSeriesPoint) =>
    metrics.series.reduce((total, point) => total + (point[key] as number), 0)
  const activeToday = metrics.series.at(-1)?.active ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label="Users"
          value={formatNumber(metrics.users.total)}
          hint={`${formatNumber(metrics.users.verified)} verified · ${formatNumber(metrics.users.suspended)} suspended`}
        />
        <Kpi
          label="Posts"
          value={formatNumber(metrics.content.snaccs)}
          hint={`${formatNumber(metrics.content.comments)} comments · ${formatNumber(metrics.content.resnaccs)} resnaccs`}
        />
        <Kpi label="Reactions" value={formatNumber(metrics.engagement.reactions)} />
        <Kpi label="Views" value={formatNumber(metrics.engagement.views)} />
        <Kpi
          label="Wallet liability"
          value={formatNaira(metrics.money.wallet_liability)}
          hint="unpaid balances"
        />
        <Kpi
          label="Open reports"
          value={formatNumber(metrics.moderation.open_reports)}
          hint={`${formatNumber(metrics.moderation.reports_7d)} in last 7 days`}
        />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium">Last 14 days</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Trend
            label="Signups"
            value={formatNumber(sum("signups"))}
            data={metrics.series}
            dataKey="signups"
          />
          <Trend
            label="Snaccs posted"
            value={formatNumber(sum("snaccs"))}
            data={metrics.series}
            dataKey="snaccs"
          />
          <Trend
            label="Active today"
            value={formatNumber(activeToday)}
            data={metrics.series}
            dataKey="active"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.money.withdrawals_by_status.map((row) => (
                  <TableRow key={row.status}>
                    <TableCell className="capitalize">{row.status}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(row.count)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNaira(row.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Earnings</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row label="Total distributed" value={formatNaira(metrics.money.total_distributed)} />
            {metrics.money.earnings_by_type.map((row) => (
              <Row
                key={row.type}
                label={<span className="capitalize">From {row.type}s</span>}
                value={formatNaira(row.amount)}
              />
            ))}
            <Row
              label="Funded campuses"
              value={`${formatNumber(metrics.campuses.funded)} / ${formatNumber(metrics.campuses.total)}`}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Content</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row label="Posts" value={formatNumber(metrics.content.snaccs)} />
            <Row label="Comments" value={formatNumber(metrics.content.comments)} />
            <Row label="Resnaccs" value={formatNumber(metrics.content.resnaccs)} />
            <Row label="With image" value={formatNumber(metrics.content.with_image)} />
            <Row label="With GIF" value={formatNumber(metrics.content.with_gif)} />
            <Row label="Removed" value={formatNumber(metrics.content.deleted_snaccs)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Moderation</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row label="Open reports" value={formatNumber(metrics.moderation.open_reports)} />
            <Row label="Actioned" value={formatNumber(metrics.moderation.actioned)} />
            <Row label="Dismissed" value={formatNumber(metrics.moderation.dismissed)} />
            <Row label="Filed in last 7 days" value={formatNumber(metrics.moderation.reports_7d)} />
            <Row label="Follows" value={formatNumber(metrics.engagement.follows)} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top campuses</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.top_campuses.length === 0 ? (
              <p className="text-muted-foreground text-sm">No campuses with members yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campus</TableHead>
                    <TableHead className="text-right">Members</TableHead>
                    <TableHead className="text-right">Snaccs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.top_campuses.map((campus) => (
                    <TableRow key={campus.id}>
                      <TableCell>
                        <span className="font-medium">{campus.acronym}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{campus.name}</span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(campus.members)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(campus.snaccs)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top reactions</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.top_reactions.length === 0 ? (
              <p className="text-muted-foreground text-sm">No reactions yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {metrics.top_reactions.map((reaction) => (
                  <Badge key={reaction.emoji} variant="secondary" className="gap-1.5 text-sm">
                    <span>{reaction.emoji}</span>
                    <span className="tabular-nums">{formatNumber(reaction.count)}</span>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
