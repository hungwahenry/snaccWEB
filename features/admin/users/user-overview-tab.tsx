"use client"

import { Fact, Facts, Section, Stat, StatGrid } from "@/components/admin/detail"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import type { AdminUserDetail } from "./types"

export function UserOverviewTab({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-col gap-6 pt-4">
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
            <Fact label="Tier" value={user.engagement.tier ?? "—"} />
            {Object.entries(user.engagement.received).map(([kind, count]) => (
              <Fact
                key={kind}
                label={`${kind} received`}
                value={formatNumber(count)}
              />
            ))}
          </Facts>
        </Section>

        <Section title="Account">
          <Facts>
            <Fact
              label="Email verified"
              value={user.email_verified_at ? "Yes" : "No"}
            />
            <Fact
              label="Profile completed"
              value={formatDate(user.completed_at)}
            />
            <Fact label="Joined" value={formatDate(user.created_at)} />
            <Fact
              label="Reactions made"
              value={formatNumber(user.counts.reactions)}
            />
            <Fact
              label="Reports filed"
              value={formatNumber(user.counts.reports_filed)}
            />
            <Fact
              label="Reports against"
              value={formatNumber(user.counts.reports_against)}
            />
            <Fact
              label="Active sessions"
              value={formatNumber(user.sessions.length)}
            />
            <Fact
              label="Device tokens"
              value={formatNumber(user.counts.device_tokens)}
            />
          </Facts>
        </Section>
      </div>
    </div>
  )
}
