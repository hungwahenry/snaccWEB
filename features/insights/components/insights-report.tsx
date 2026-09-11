import type { LucideIcon } from "lucide-react"
import {
  BookOpenIcon,
  EyeIcon,
  FootprintsIcon,
  TimerIcon,
  UserRoundPlusIcon,
  ZapIcon,
} from "lucide-react"
import type { ReactNode } from "react"
import { Eyebrow } from "@/components/ui/eyebrow"
import { compactCount, formatDuration, percent } from "@/lib/format"
import type { InsightsSummary } from "../types"
import { busiestHour, dailyBars, hourlyBars } from "../utils/charts"
import { BarChart } from "./bar-chart"
import { TopSnacc } from "./top-snacc"

export function InsightsReport({ summary }: { summary: InsightsSummary }) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Stat
          icon={EyeIcon}
          label="Views"
          value={compactCount(summary.views)}
        />
        <Stat
          icon={BookOpenIcon}
          label="Opened"
          value={percent(summary.open_rate)}
        />
        <Stat
          icon={TimerIcon}
          label="Average read"
          value={formatDuration(summary.dwell_seconds)}
        />
        <Stat
          icon={ZapIcon}
          label="Engaged"
          value={percent(summary.engagement_rate)}
        />
        <Stat
          icon={UserRoundPlusIcon}
          label="New followers"
          value={compactCount(summary.followers_gained)}
        />
        <Stat
          icon={FootprintsIcon}
          label="Profile visits"
          value={compactCount(summary.profile_visits)}
        />
      </div>

      <Panel
        label="Views a day"
        caption={`${compactCount(summary.views)} in this stretch`}
      >
        <BarChart bars={dailyBars(summary.series, (day) => day.views)} />
      </Panel>

      <Panel
        label="Followers a day"
        caption={`${compactCount(summary.followers_gained)} gained in this stretch`}
      >
        <BarChart
          bars={dailyBars(summary.series, (day) => day.followers)}
          accent
        />
      </Panel>

      <Panel label="When people read you" caption={busiestHour(summary.hours)}>
        <BarChart bars={hourlyBars(summary.hours)} />
      </Panel>

      {summary.top.length > 0 ? (
        <div className="flex flex-col gap-3">
          <Eyebrow>Your best snaccs</Eyebrow>
          <p className="-mt-1 text-[13px] leading-[18px] text-pretty text-muted-foreground">
            Ranked by how many of the people who saw one acted on it, not by how
            many saw it.
          </p>

          <div className="flex flex-col gap-2">
            {summary.top.map((snacc, place) => (
              <TopSnacc key={snacc.snacc_id} snacc={snacc} place={place + 1} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}

function Panel({
  label,
  caption,
  children,
}: {
  label: string
  caption: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <Eyebrow>{label}</Eyebrow>
        <p className="text-[13px] text-muted-foreground">{caption}</p>
      </div>
      <div className="rounded-2xl bg-card p-4">{children}</div>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex grow basis-[46%] flex-col gap-2 rounded-2xl bg-card p-4 sm:basis-[30%]">
      <Icon className="size-[18px] text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-extrabold tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
