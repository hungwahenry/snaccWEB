"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { BarRow } from "@/features/admin/shell/components/bar-row"
import {
  EmptyNote,
  Fact,
  Facts,
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { formatNumber, percent, shortDay } from "@/lib/format"
import type {
  AudienceMetrics,
  AudiencePoint,
  Cohort,
  PlatformMix,
  PushReach,
} from "../types"
import { CHART_MARGIN, COUNT_AXIS, DATE_AXIS, dateLabel } from "../utils/charts"
import {
  platformLabel,
  platformRows,
  RETENTION_WEEKS,
  retentionRows,
} from "../utils/dashboard"
import { ChartFrame } from "./chart-frame"

const ACTIVE_CONFIG = {
  dau: { label: "Daily", color: "var(--resnacc)" },
  wau: { label: "Weekly", color: "var(--premium)" },
  mau: { label: "Monthly", color: "var(--chart-2)" },
} satisfies ChartConfig

const RETURNING_CONFIG = {
  returning: { label: "Returning", color: "var(--resnacc)" },
  new_users: { label: "New", color: "var(--premium)" },
} satisfies ChartConfig

function ActiveChart({ series }: { series: AudiencePoint[] }) {
  return (
    <ChartContainer config={ACTIVE_CONFIG} className="h-64 w-full">
      <LineChart data={series} margin={CHART_MARGIN}>
        <CartesianGrid vertical={false} />
        <XAxis {...DATE_AXIS} />
        <YAxis {...COUNT_AXIS} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={dateLabel} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {(["mau", "wau", "dau"] as const).map((key) => (
          <Line
            key={key}
            dataKey={key}
            type="monotone"
            stroke={`var(--color-${key})`}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

function ReturningChart({ series }: { series: AudiencePoint[] }) {
  return (
    <ChartContainer config={RETURNING_CONFIG} className="h-64 w-full">
      <BarChart data={series} margin={CHART_MARGIN}>
        <CartesianGrid vertical={false} />
        <XAxis {...DATE_AXIS} />
        <YAxis {...COUNT_AXIS} />
        <ChartTooltip
          content={<ChartTooltipContent labelFormatter={dateLabel} />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="returning"
          stackId="active"
          fill="var(--color-returning)"
        />
        <Bar
          dataKey="new_users"
          stackId="active"
          fill="var(--color-new_users)"
          radius={[3, 3, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

export function AudienceSection({ audience }: { audience: AudienceMetrics }) {
  const { summary, series } = audience

  return (
    <Section
      title="Audience"
      description="Anyone who viewed, posted, liked, shared or sent a message, counted per Lagos day."
    >
      <StatGrid columns={4}>
        <Stat
          label="Active yesterday"
          value={formatNumber(summary.active_yesterday)}
        />
        <Stat
          label="Active this week"
          value={formatNumber(summary.weekly)}
          hint="last 7 days"
        />
        <Stat
          label="Active this month"
          value={formatNumber(summary.monthly)}
          hint="last 30 days"
        />
        <Stat
          label="Stickiness"
          value={percent(summary.stickiness)}
          hint="of the month's people, on a typical day"
        />
      </StatGrid>
      <div className="grid gap-3 lg:grid-cols-2">
        <ChartFrame title="Active people">
          <ActiveChart series={series} />
        </ChartFrame>
        <ChartFrame title="New and returning, per day">
          <ReturningChart series={series} />
        </ChartFrame>
      </div>
    </Section>
  )
}

const WEEKS = Array.from({ length: RETENTION_WEEKS }, (_, index) => index)

export function RetentionSection({ cohorts }: { cohorts: Cohort[] }) {
  return (
    <Section
      title="Who keeps coming back"
      description="Each row is the people who signed up that week. Each column is the share of them who were active that many weeks later."
    >
      {cohorts.length === 0 ? (
        <EmptyNote>Nobody signed up in the last 12 weeks.</EmptyNote>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] border-collapse text-xs tabular-nums">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-3 py-2 text-left font-medium">Signed up</th>
                <th className="px-3 py-2 text-right font-medium">People</th>
                {WEEKS.map((week) => (
                  <th key={week} className="px-1 py-2 text-center font-medium">
                    {week === 0 ? "Same week" : `+${week}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {retentionRows(cohorts).map((row) => (
                <tr key={row.week} className="border-t">
                  <td className="px-3 py-1.5 whitespace-nowrap">
                    Week of {shortDay(row.week)}
                  </td>
                  <td className="px-3 py-1.5 text-right">
                    {formatNumber(row.size)}
                  </td>
                  {row.cells.map((cell, index) => (
                    <td key={index} className="p-0.5">
                      {cell ? (
                        <div
                          className="rounded px-1 py-1.5 text-center"
                          style={{
                            backgroundColor: `color-mix(in oklch, var(--resnacc) ${Math.round(cell.fraction * 80)}%, transparent)`,
                          }}
                          title={`${formatNumber(cell.users)} people`}
                        >
                          {percent(cell.fraction)}
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  )
}

export function PlatformsSection({ platforms }: { platforms: PlatformMix[] }) {
  return (
    <Section
      title="Apps in use"
      description="The app each person last opened in the past 30 days."
    >
      {platforms.length === 0 ? (
        <EmptyNote>Nobody has opened the app lately.</EmptyNote>
      ) : (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
          {platformRows(platforms).map((platform) => (
            <div key={platform.platform} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium">{platform.label}</span>
                <span className="text-muted-foreground tabular-nums">
                  {formatNumber(platform.users)} · {percent(platform.fraction)}
                </span>
              </div>
              {platform.versions.map((row) => (
                <BarRow
                  key={row.version}
                  label={row.label}
                  value={formatNumber(row.users)}
                  fraction={row.fraction}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </Section>
  )
}

export function PushReachSection({ push }: { push: PushReach[] }) {
  return (
    <Section
      title="Push reach"
      description="People with notifications on, by device."
    >
      {push.length === 0 ? (
        <EmptyNote>No devices have notifications on.</EmptyNote>
      ) : (
        <Facts>
          {push.map((row) => (
            <Fact
              key={row.platform}
              label={platformLabel(row.platform)}
              value={formatNumber(row.users)}
            />
          ))}
        </Facts>
      )}
    </Section>
  )
}
