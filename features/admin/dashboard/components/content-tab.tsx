import Link from "next/link"
import { BarRow } from "@/features/admin/shell/components/bar-row"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { snaccPath } from "@/features/admin/shell/routes"
import { formatNumber } from "@/lib/format"
import type {
  ContentMetrics,
  DashboardMetrics,
  HashtagUse,
  TopPost,
} from "../types"
import { share } from "../utils/dashboard"
import { ContentSection } from "./activity-sections"
import { BreakdownChart } from "./breakdown-chart"
import { ChartFrame } from "./chart-frame"
import { TopReactionsSection } from "./top-sections"

function TopPostsSection({ posts }: { posts: TopPost[] }) {
  return (
    <Section title="Top posts" description="The most reacted-to this period.">
      {posts.length === 0 ? (
        <EmptyNote>No posts this period.</EmptyNote>
      ) : (
        <ul className="divide-y rounded-lg border">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-col gap-1 px-4 py-3">
              <Link
                href={snaccPath(post.id)}
                className="line-clamp-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                {post.body || "A post without text"}
              </Link>
              <p className="text-xs text-muted-foreground tabular-nums">
                {post.username ? `@${post.username} · ` : null}
                {formatNumber(post.reactions)} reactions ·{" "}
                {formatNumber(post.comments)} comments ·{" "}
                {formatNumber(post.views)} views
              </p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  )
}

function HashtagsSection({ hashtags }: { hashtags: HashtagUse[] }) {
  const most = hashtags[0]?.uses ?? 0

  return (
    <Section title="Top hashtags" description="Most used this period.">
      {hashtags.length === 0 ? (
        <EmptyNote>No hashtags this period.</EmptyNote>
      ) : (
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          {hashtags.map((row) => (
            <BarRow
              key={row.tag}
              label={`#${row.tag}`}
              value={formatNumber(row.uses)}
              fraction={share(row.uses, most)}
            />
          ))}
        </div>
      )}
    </Section>
  )
}

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
        <ContentSection
          content={metrics.content}
          follows={metrics.engagement.follows}
        />
        <TopReactionsSection reactions={metrics.top_reactions} />
      </div>
    </div>
  )
}
