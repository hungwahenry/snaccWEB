"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import {
  ContentSection,
  ModerationSection,
} from "../components/activity-sections"
import { HeadlineStats } from "../components/headline-stats"
import {
  EarningsSection,
  WithdrawalsSection,
} from "../components/money-sections"
import {
  TopCampusesSection,
  TopReactionsSection,
} from "../components/top-sections"
import { TrendsSection } from "../components/trends-section"
import { useDashboardScreen } from "../hooks/use-dashboard-screen"

export function DashboardScreen() {
  const { query } = useDashboardScreen()

  return (
    <>
      <PageHeader title="Dashboard" description="Your platform at a glance." />
      <QueryView query={query} what="metrics">
        {(metrics) => (
          <div className="flex flex-col gap-6">
            {metrics.platform ? null : (
              <p className="text-sm text-pretty text-muted-foreground">
                These numbers cover your campuses. Platform money is not
                included.
              </p>
            )}

            <HeadlineStats metrics={metrics} />
            <TrendsSection series={metrics.series} />

            {metrics.money ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <WithdrawalsSection money={metrics.money} />
                <EarningsSection money={metrics.money} />
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <ContentSection content={metrics.content} />
              <ModerationSection
                moderation={metrics.moderation}
                follows={metrics.engagement.follows}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <TopCampusesSection
                campuses={metrics.campuses}
                top={metrics.top_campuses}
              />
              <TopReactionsSection reactions={metrics.top_reactions} />
            </div>
          </div>
        )}
      </QueryView>
    </>
  )
}
