import { Eyebrow } from "@/components/ui/eyebrow"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartPanel,
  StatCard,
} from "@/features/insights/components/insight-cards"
import { QuotedSnaccSkeleton } from "@/features/snaccs/components/card/quote/quoted-snacc-skeleton"
import {
  ENGAGEMENT_SECTION,
  ENGAGEMENT_STATS,
  RESULT_STATS,
  RESULTS_CHART,
} from "../../utils/results"

export function PromotionSkeleton() {
  return (
    <div className="flex flex-col gap-7 px-5 pt-5 pb-10">
      <div className="flex flex-col gap-3 rounded-2xl bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-20 rounded-full bg-accent" />
          <Skeleton className="h-3 w-28 bg-accent" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="my-[3px] h-3.5 w-full bg-accent" />
          <Skeleton className="my-[3px] h-3.5 w-2/3 bg-accent" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2 w-full rounded-full bg-accent" />
          <Skeleton className="my-0.5 h-3 w-36 bg-accent" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Eyebrow>Manage</Eyebrow>
        <Skeleton className="h-12 rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="my-1 h-3 w-32" />
          <Skeleton className="h-14 rounded-full" />
          <Skeleton className="my-0.5 h-3 w-56" />
          <Skeleton className="h-12 rounded-full" />
        </div>
        <Skeleton className="h-12 rounded-full" />
      </div>

      <div className="flex flex-wrap gap-3">
        {RESULT_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={<Skeleton className="my-1 h-6 w-16 bg-accent" />}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <Eyebrow>{ENGAGEMENT_SECTION.title}</Eyebrow>
          <p className="text-[13px] leading-5 text-pretty text-muted-foreground">
            {ENGAGEMENT_SECTION.note}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {ENGAGEMENT_STATS.map((stat) => (
            <StatCard
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={<Skeleton className="my-1 h-6 w-16 bg-accent" />}
            />
          ))}
        </div>
      </div>

      <ChartPanel
        label={RESULTS_CHART}
        caption={<Skeleton className="my-[3px] h-3.5 w-24" />}
      >
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[108px] rounded-lg bg-accent" />
          <div className="h-[15px]" />
        </div>
      </ChartPanel>

      <div className="flex flex-col gap-3">
        <Eyebrow>Snacc</Eyebrow>
        <div className="rounded-2xl border border-border">
          <QuotedSnaccSkeleton />
        </div>
      </div>
    </div>
  )
}
