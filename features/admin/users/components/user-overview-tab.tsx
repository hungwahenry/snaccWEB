import {
  Fact,
  Facts,
  Section,
  Stat,
  StatGrid,
} from "@/features/admin/shell/components/detail"
import { humanize } from "@/features/admin/shell/utils/format"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import type { AdminUserDetail } from "../types"

export function UserOverviewTab({ user }: { user: AdminUserDetail }) {
  const received = Object.entries(user.engagement.received)

  return (
    <div className="flex flex-col gap-6">
      <StatGrid columns={5}>
        <Stat label="Unclaimed earnings" value={formatNaira(user.balance)} />
        <Stat label="Snaccs" value={formatNumber(user.snaccs_count)} />
        <Stat label="Followers" value={formatNumber(user.followers_count)} />
        <Stat label="Following" value={formatNumber(user.following_count)} />
        <Stat label="Views" value={formatNumber(user.total_views_received)} />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Standing">
          <Facts>
            <Fact
              label="Snacc Score"
              value={formatNumber(user.engagement.score)}
            />
            <Fact
              label="Tier"
              value={
                user.engagement.tier ? humanize(user.engagement.tier) : "—"
              }
            />
            {received.map(([kind, count]) => (
              <Fact
                key={kind}
                label={`${humanize(kind)} received`}
                value={formatNumber(count)}
              />
            ))}
          </Facts>
        </Section>

        <Section title="Account">
          <Facts>
            <Fact
              label="Email confirmed"
              value={
                user.email_verified_at
                  ? formatDate(user.email_verified_at)
                  : "No"
              }
            />
            <Fact
              label="Profile finished"
              value={user.completed_at ? formatDate(user.completed_at) : "No"}
            />
            <Fact label="Joined" value={formatDate(user.created_at)} />
            <Fact
              label="Reactions given"
              value={formatNumber(user.counts.reactions)}
            />
            <Fact
              label="Reports they filed"
              value={formatNumber(user.counts.reports_filed)}
            />
            <Fact
              label="Reports against them"
              value={formatNumber(user.counts.reports_against)}
            />
            <Fact
              label="Signed-in devices"
              value={formatNumber(user.sessions.length)}
            />
            <Fact
              label="Push-enabled devices"
              value={formatNumber(user.counts.device_tokens)}
            />
          </Facts>
        </Section>
      </div>
    </div>
  )
}
