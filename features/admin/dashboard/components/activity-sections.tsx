import { Fact, Facts, Section } from "@/features/admin/shell/components/detail"
import { formatNumber } from "@/lib/format"
import type { DashboardMetrics } from "../types"

export function ContentSection({
  content,
}: {
  content: DashboardMetrics["content"]
}) {
  return (
    <Section title="Content">
      <Facts>
        <Fact label="Posts" value={formatNumber(content.snaccs)} />
        <Fact label="Comments" value={formatNumber(content.comments)} />
        <Fact label="Resnaccs" value={formatNumber(content.resnaccs)} />
        <Fact label="With image" value={formatNumber(content.with_image)} />
        <Fact label="With GIF" value={formatNumber(content.with_gif)} />
        <Fact label="Removed" value={formatNumber(content.deleted_snaccs)} />
      </Facts>
    </Section>
  )
}

export function ModerationSection({
  moderation,
  follows,
}: {
  moderation: DashboardMetrics["moderation"]
  follows: number
}) {
  return (
    <Section title="Moderation">
      <Facts>
        <Fact
          label="Open reports"
          value={formatNumber(moderation.open_reports)}
        />
        <Fact label="Actioned" value={formatNumber(moderation.actioned)} />
        <Fact label="Dismissed" value={formatNumber(moderation.dismissed)} />
        <Fact
          label="Filed in last 7 days"
          value={formatNumber(moderation.reports_7d)}
        />
        <Fact label="Follows" value={formatNumber(follows)} />
      </Facts>
    </Section>
  )
}
