import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BarRow } from "@/features/admin/shell/components/bar-row"
import {
  EmptyNote,
  Fact,
  Facts,
  Section,
} from "@/features/admin/shell/components/detail"
import { snaccPath } from "@/features/admin/shell/routes"
import { formatNumber } from "@/lib/format"
import type {
  DashboardMetrics,
  HashtagUse,
  TopPost,
  TopReaction,
} from "../types"
import { withBarFractions } from "../utils/dashboard"

export function TopPostsSection({ posts }: { posts: TopPost[] }) {
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

export function HashtagsSection({ hashtags }: { hashtags: HashtagUse[] }) {
  return (
    <Section title="Top hashtags" description="Most used this period.">
      {hashtags.length === 0 ? (
        <EmptyNote>No hashtags this period.</EmptyNote>
      ) : (
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          {withBarFractions(hashtags, (row) => row.uses).map((row) => (
            <BarRow
              key={row.tag}
              label={`#${row.tag}`}
              value={formatNumber(row.uses)}
              fraction={row.fraction}
            />
          ))}
        </div>
      )}
    </Section>
  )
}

export function AllTimeContentSection({
  content,
  follows,
}: {
  content: DashboardMetrics["content"]
  follows: number
}) {
  return (
    <Section title="All-time content">
      <Facts>
        <Fact label="Posts" value={formatNumber(content.snaccs)} />
        <Fact label="Comments" value={formatNumber(content.comments)} />
        <Fact label="Resnaccs" value={formatNumber(content.resnaccs)} />
        <Fact label="With image" value={formatNumber(content.with_image)} />
        <Fact label="With GIF" value={formatNumber(content.with_gif)} />
        <Fact label="Removed" value={formatNumber(content.deleted_snaccs)} />
        <Fact label="Follows" value={formatNumber(follows)} />
      </Facts>
    </Section>
  )
}

export function TopReactionsSection({
  reactions,
}: {
  reactions: TopReaction[]
}) {
  return (
    <Section title="Top reactions">
      {reactions.length === 0 ? (
        <EmptyNote>No reactions yet.</EmptyNote>
      ) : (
        <div className="flex flex-wrap gap-2 rounded-lg border p-4">
          {reactions.map((reaction) => (
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
  )
}
