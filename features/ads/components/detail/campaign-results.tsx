import { ChartColumnIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Eyebrow } from "@/components/ui/eyebrow"
import { BarChart } from "@/features/insights/components/bar-chart"
import {
  ChartPanel,
  StatCard,
} from "@/features/insights/components/insight-cards"
import { dailyBars } from "@/features/insights/utils/charts"
import { compactCount, formatNaira, shortDay } from "@/lib/format"
import type { CampaignDetail } from "../../types"
import {
  ENGAGEMENT_SECTION,
  ENGAGEMENT_STATS,
  everyDay,
  resultStats,
  RESULTS_CHART,
} from "../../utils/results"

export function CampaignResults({ campaign }: { campaign: CampaignDetail }) {
  const series = everyDay(campaign.days)

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {resultStats(campaign).map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value(campaign)}
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
              value={stat.value(campaign.engagement)}
            />
          ))}
        </div>
      </div>

      {series.length > 0 ? (
        <>
          <ChartPanel
            label={RESULTS_CHART}
            caption={`${compactCount(campaign.views_count)} so far`}
          >
            <BarChart bars={dailyBars(series, (day) => day.views)} />
          </ChartPanel>

          {campaign.campuses.length > 0 ? (
            <div className="flex flex-col gap-3">
              <Eyebrow>By campus</Eyebrow>
              <div className="overflow-hidden rounded-2xl bg-card">
                <table className="w-full text-sm tabular-nums">
                  <thead>
                    <tr className="text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 text-left font-semibold">
                        Campus
                      </th>
                      <th className="px-2 py-2.5 text-right font-semibold">
                        Views
                      </th>
                      <th className="px-4 py-2.5 text-right font-semibold">
                        Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.campuses.map((row) => (
                      <tr
                        key={row.university.id}
                        className="border-t border-border/60"
                      >
                        <td
                          className="max-w-0 truncate px-4 py-2.5 text-foreground"
                          title={row.university.name}
                        >
                          {row.university.acronym}
                        </td>
                        <td className="px-2 py-2.5 text-right text-foreground">
                          {compactCount(row.views)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-foreground">
                          {formatNaira(row.spent_kobo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <Eyebrow>Day by day</Eyebrow>
            <div className="overflow-hidden rounded-2xl bg-card">
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 text-left font-semibold">Day</th>
                    <th className="px-2 py-2.5 text-right font-semibold">
                      Views
                    </th>
                    {campaign.button ? (
                      <th className="px-2 py-2.5 text-right font-semibold">
                        Taps
                      </th>
                    ) : null}
                    <th className="px-4 py-2.5 text-right font-semibold">
                      Spent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...series].reverse().map((day) => (
                    <tr key={day.day} className="border-t border-border/60">
                      <td className="px-4 py-2.5 text-foreground">
                        {shortDay(day.day)}
                      </td>
                      <td className="px-2 py-2.5 text-right text-foreground">
                        {compactCount(day.views)}
                      </td>
                      {campaign.button ? (
                        <td className="px-2 py-2.5 text-right text-foreground">
                          {compactCount(day.clicks)}
                        </td>
                      ) : null}
                      <td className="px-4 py-2.5 text-right text-foreground">
                        {formatNaira(day.spent_kobo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          compact
          icon={ChartColumnIcon}
          title="No views yet"
          description="Numbers show up here once people start seeing it."
          className="rounded-2xl bg-card"
        />
      )}
    </>
  )
}
