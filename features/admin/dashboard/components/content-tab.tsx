import type { ContentMetrics, DashboardMetrics } from "../types"
import { BreakdownChart } from "./breakdown-chart"
import { ChartFrame } from "./chart-frame"
import {
  AllTimeContentSection,
  HashtagsSection,
  TopPostsSection,
  TopReactionsSection,
} from "./content-sections"

export function ContentTab({
  content,
  metrics,
}: {
  content: ContentMetrics
  metrics: DashboardMetrics
}) {
  return (
    <div className="flex flex-col gap-6">
      <ChartFrame
        title="Posted per day"
        description="Clips and polls are counted apart from other posts."
      >
        <BreakdownChart breakdown={content.posted} />
      </ChartFrame>
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartFrame title="Interactions per day">
          <BreakdownChart breakdown={content.interactions} variant="lines" />
        </ChartFrame>
        <ChartFrame title="Post views per day">
          <BreakdownChart breakdown={content.views} variant="lines" />
        </ChartFrame>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TopPostsSection posts={content.top_posts} />
        <HashtagsSection hashtags={content.hashtags} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <AllTimeContentSection
          content={metrics.content}
          follows={metrics.engagement.follows}
        />
        <TopReactionsSection reactions={metrics.top_reactions} />
      </div>
    </div>
  )
}
