"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import { Row, Stat } from "./user-detail-parts"
import type { AdminUserDetail } from "./types"

export function UserOverviewTab({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Unclaimed earnings" value={formatNaira(user.balance)} />
        <Stat label="Snaccs" value={formatNumber(user.snaccs_count)} />
        <Stat label="Followers" value={formatNumber(user.followers_count)} />
        <Stat label="Following" value={formatNumber(user.following_count)} />
        <Stat label="Views" value={formatNumber(user.total_views_received)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Standing</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row
              label="Snacc Score"
              value={formatNumber(user.engagement.score)}
            />
            <Row label="Tier" value={user.engagement.tier ?? "—"} />
            {Object.entries(user.engagement.received).map(([kind, count]) => (
              <Row
                key={kind}
                label={`${kind} received`}
                value={formatNumber(count)}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row
              label="Email verified"
              value={user.email_verified_at ? "Yes" : "No"}
            />
            <Row
              label="Profile completed"
              value={formatDate(user.completed_at)}
            />
            <Row label="Joined" value={formatDate(user.created_at)} />
            <Row
              label="Reactions made"
              value={formatNumber(user.counts.reactions)}
            />
            <Row
              label="Reports filed"
              value={formatNumber(user.counts.reports_filed)}
            />
            <Row
              label="Reports against"
              value={formatNumber(user.counts.reports_against)}
            />
            <Row
              label="Active sessions"
              value={formatNumber(user.sessions.length)}
            />
            <Row
              label="Device tokens"
              value={formatNumber(user.counts.device_tokens)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
