"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatNaira, formatNumber } from "@/lib/format"
import { UserActions } from "./user-actions"
import type { useUserMutations } from "./use-users"
import type { AdminUserDetail } from "./types"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-muted-foreground text-xs">{label}</div>
        <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

export function UserDetail({
  user,
  actions,
}: {
  user: AdminUserDetail
  actions: ReturnType<typeof useUserMutations>
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={user.avatar_url} alt="" />
            <AvatarFallback>
              {(user.display_name || user.username || user.email).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{user.display_name ?? "—"}</h2>
              {user.role === "admin" ? (
                <Badge>admin</Badge>
              ) : (
                <Badge variant="outline">user</Badge>
              )}
              {user.suspended_at && <Badge variant="destructive">suspended</Badge>}
            </div>
            <p className="text-muted-foreground text-sm">
              {user.username ? `@${user.username} · ` : ""}
              {user.email}
            </p>
            {user.university && (
              <p className="text-muted-foreground text-sm">{user.university.name}</p>
            )}
          </div>
        </div>
        <UserActions user={user} actions={actions} />
      </div>

      {user.suspended_at && (
        <div className="border-destructive/40 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-sm">
          Suspended {formatDate(user.suspended_at)}
          {user.suspended_reason ? ` — ${user.suspended_reason}` : ""}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Balance" value={formatNaira(user.balance)} />
        <Stat label="Snaccs" value={formatNumber(user.snaccs_count)} />
        <Stat label="Followers" value={formatNumber(user.followers_count)} />
        <Stat label="Following" value={formatNumber(user.following_count)} />
        <Stat label="Views" value={formatNumber(user.total_views_received)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row label="Email verified" value={user.email_verified_at ? "Yes" : "No"} />
            <Row label="Profile completed" value={formatDate(user.completed_at)} />
            <Row label="Joined" value={formatDate(user.created_at)} />
            <Row label="Reactions" value={formatNumber(user.counts.reactions)} />
            <Row label="Reports filed" value={formatNumber(user.counts.reports_filed)} />
            <Row label="Reports against" value={formatNumber(user.counts.reports_against)} />
            <Row label="Active sessions" value={formatNumber(user.sessions.length)} />
            <Row label="Device tokens" value={formatNumber(user.counts.device_tokens)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payout account</CardTitle>
          </CardHeader>
          <CardContent>
            {user.payout_account ? (
              <div className="divide-y">
                <Row label="Bank" value={user.payout_account.bank_name} />
                <Row label="Account name" value={user.payout_account.account_name} />
                <Row label="Account" value={`•••• ${user.payout_account.account_last4}`} />
                <Row label="Linked" value={formatDate(user.payout_account.created_at)} />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No payout account linked.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          {user.recent_withdrawals.length === 0 ? (
            <p className="text-muted-foreground text-sm">No withdrawals.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.recent_withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="font-mono text-xs">{withdrawal.reference}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNaira(withdrawal.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{withdrawal.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(withdrawal.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reports against</CardTitle>
        </CardHeader>
        <CardContent>
          {user.reports_against.length === 0 ? (
            <p className="text-muted-foreground text-sm">No reports.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reason</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead>Filed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.reports_against.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.reason.label}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {report.detail ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(report.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
