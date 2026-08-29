"use client"

import { Area, AreaChart } from "recharts"
import { Fact, Facts, Section, Stat, StatGrid } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { Badge } from "@/components/ui/badge"
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
    <div className="flex flex-col gap-2 rounded-lg border px-4 py-3">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums">{value}</p>
      </div>
      <ChartContainer config={config} className="h-20 w-full">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
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
    </div>
  )
}

export function DashboardView({ metrics }: { metrics: DashboardMetrics }) {
  const sum = (key: keyof DashboardSeriesPoint) =>
    metrics.series.reduce((total, point) => total + (point[key] as number), 0)
  const activeToday = metrics.series.at(-1)?.active ?? 0
  const money = metrics.money

  return (
    <div className="flex flex-col gap-6">
      {metrics.platform ? null : (
        <p className="text-sm text-pretty text-muted-foreground">
          These numbers cover your campuses. Platform money is not included.
        </p>
      )}

      <StatGrid columns={3}>
        <Stat
          label="Users"
          value={formatNumber(metrics.users.total)}
          hint={`${formatNumber(metrics.users.verified)} verified · ${formatNumber(metrics.users.suspended)} suspended`}
        />
        <Stat
          label="Posts"
          value={formatNumber(metrics.content.snaccs)}
          hint={`${formatNumber(metrics.content.comments)} comments · ${formatNumber(metrics.content.resnaccs)} resnaccs`}
        />
        <Stat
          label="Reactions"
          value={formatNumber(metrics.engagement.reactions)}
        />
        <Stat label="Views" value={formatNumber(metrics.engagement.views)} />
        {money ? (
          <Stat
            label="Wallet liability"
            value={formatNaira(money.wallet_liability)}
            hint="unpaid balances"
          />
        ) : null}
        <Stat
          label="Open reports"
          value={formatNumber(metrics.moderation.open_reports)}
          hint={`${formatNumber(metrics.moderation.reports_7d)} in last 7 days`}
        />
      </StatGrid>

      <Section title="Last 14 days">
        <div className="grid gap-3 sm:grid-cols-3">
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
      </Section>

      {money ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Withdrawals">
            <TableFrame>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {money.withdrawals_by_status.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="py-8 text-center text-sm text-muted-foreground"
                      >
                        No withdrawals yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    money.withdrawals_by_status.map((row) => (
                      <TableRow key={row.status}>
                        <TableCell className="capitalize">
                          {row.status}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNumber(row.count)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNaira(row.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableFrame>
          </Section>

          <Section title="Earnings">
            <Facts>
              <Fact
                label="Total distributed"
                value={formatNaira(money.total_distributed)}
              />
              {money.earnings_by_type.map((row) => (
                <Fact
                  key={row.type}
                  label={<span className="capitalize">From {row.type}s</span>}
                  value={formatNaira(row.amount)}
                />
              ))}
            </Facts>
          </Section>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Content">
          <Facts>
            <Fact label="Posts" value={formatNumber(metrics.content.snaccs)} />
            <Fact
              label="Comments"
              value={formatNumber(metrics.content.comments)}
            />
            <Fact
              label="Resnaccs"
              value={formatNumber(metrics.content.resnaccs)}
            />
            <Fact
              label="With image"
              value={formatNumber(metrics.content.with_image)}
            />
            <Fact
              label="With GIF"
              value={formatNumber(metrics.content.with_gif)}
            />
            <Fact
              label="Removed"
              value={formatNumber(metrics.content.deleted_snaccs)}
            />
          </Facts>
        </Section>

        <Section title="Moderation">
          <Facts>
            <Fact
              label="Open reports"
              value={formatNumber(metrics.moderation.open_reports)}
            />
            <Fact
              label="Actioned"
              value={formatNumber(metrics.moderation.actioned)}
            />
            <Fact
              label="Dismissed"
              value={formatNumber(metrics.moderation.dismissed)}
            />
            <Fact
              label="Filed in last 7 days"
              value={formatNumber(metrics.moderation.reports_7d)}
            />
            <Fact
              label="Follows"
              value={formatNumber(metrics.engagement.follows)}
            />
          </Facts>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Top campuses"
          description={`${formatNumber(metrics.campuses.funded)} of ${formatNumber(metrics.campuses.total)} funded`}
        >
          <TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campus</TableHead>
                  <TableHead className="text-right">Members</TableHead>
                  <TableHead className="text-right">Snaccs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.top_campuses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No campuses with members yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  metrics.top_campuses.map((campus) => (
                    <TableRow key={campus.id}>
                      <TableCell>
                        <span className="font-medium">{campus.acronym}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {campus.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(campus.members)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatNumber(campus.snaccs)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableFrame>
        </Section>

        <Section title="Top reactions">
          {metrics.top_reactions.length === 0 ? (
            <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
              No reactions yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 rounded-lg border p-4">
              {metrics.top_reactions.map((reaction) => (
                <Badge
                  key={reaction.emoji}
                  variant="secondary"
                  className="gap-1.5 text-sm"
                >
                  <span>{reaction.emoji}</span>
                  <span className="tabular-nums">
                    {formatNumber(reaction.count)}
                  </span>
                </Badge>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}
