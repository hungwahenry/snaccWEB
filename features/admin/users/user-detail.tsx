"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
        <div className="text-xs text-muted-foreground">{label}</div>
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
              {(user.display_name || user.username || user.email)
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {user.display_name ?? "—"}
              </h2>
              {user.role === "admin" ? (
                <Badge>admin</Badge>
              ) : (
                <Badge variant="outline">user</Badge>
              )}
              {user.suspended_at && (
                <Badge variant="destructive">suspended</Badge>
              )}
              {user.posts_globally && <Badge>posts everywhere</Badge>}
              {user.earnings_paused_at && (
                <Badge variant="secondary">earnings paused</Badge>
              )}
              {user.payouts_blocked_at && (
                <Badge variant="secondary">payouts blocked</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {user.username ? `@${user.username} · ` : ""}
              {user.email}
            </p>
            {user.university && (
              <p className="text-sm text-muted-foreground">
                {user.university.name}
              </p>
            )}
          </div>
        </div>
        <UserActions user={user} actions={actions} />
      </div>

      {user.suspended_at && (
        <div className="space-y-1 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p>
            Suspended {formatDate(user.suspended_at)}
            {user.suspended_reason ? ` — ${user.suspended_reason.slug}` : ""}
            {user.suspended_until
              ? ` · lifts ${formatDate(user.suspended_until)}`
              : " · indefinitely"}
          </p>
          {user.suspended_note ? (
            <p className="opacity-80">{user.suspended_note}</p>
          ) : null}
        </div>
      )}

      {user.earnings_paused_at && (
        <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          Earnings paused {formatDate(user.earnings_paused_at)}
          {user.earnings_paused_reason
            ? ` — ${user.earnings_paused_reason}`
            : ""}
        </div>
      )}

      {user.payouts_blocked_at && (
        <div className="rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          Payouts blocked {formatDate(user.payouts_blocked_at)}
          {user.payouts_blocked_reason
            ? ` — ${user.payouts_blocked_reason}`
            : ""}
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
            <CardTitle className="text-base">Standing</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <Row
              label="Snacc Score"
              value={formatNumber(user.engagement.score)}
            />
            <Row label="Tier" value={user.engagement.tier ?? "—"} />
            <Row
              label="Reactions received"
              value={formatNumber(user.engagement.reactions_received)}
            />
            <Row
              label="Resnaccs received"
              value={formatNumber(user.engagement.resnaccs_received)}
            />
            <Row
              label="Comments received"
              value={formatNumber(user.engagement.comments_received)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Earnings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="divide-y">
              <Row label="Balance" value={formatNaira(user.earnings.balance)} />
              {user.earnings.by_type.map((entry) => (
                <Row
                  key={entry.type}
                  label={`${entry.type} · ${formatNumber(entry.events)}`}
                  value={formatNaira(entry.kobo)}
                />
              ))}
            </div>
            {user.earnings.top_boosters.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Top boosters
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Events</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.earnings.top_boosters.map((booster, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-sm">
                          {booster.username
                            ? `@${booster.username}`
                            : booster.email}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNumber(booster.events)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatNaira(booster.kobo)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {user.top_engagers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Who engages with them</CardTitle>
            <CardDescription>
              Resnaccs and replies aimed at this user, counted off the posts
              themselves. A single account holding a large share is the shape
              rank farming takes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Resnaccs</TableHead>
                  <TableHead className="text-right">Replies</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.top_engagers.map((engager, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">
                      {engager.username
                        ? `@${engager.username}`
                        : engager.email}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(engager.resnaccs)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNumber(engager.replies)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {engager.share >= 0.3 ? (
                        <Badge variant="destructive">
                          {Math.round(engager.share * 100)}%
                        </Badge>
                      ) : (
                        `${Math.round(engager.share * 100)}%`
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sessions &amp; devices</CardTitle>
        </CardHeader>
        <CardContent>
          {user.sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sessions.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Install</TableHead>
                  <TableHead>Last used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="text-sm">
                      {session.client_info ?? session.user_agent ?? "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {session.ip ?? "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {session.install_id
                        ? session.install_id.slice(0, 8)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {session.last_used_at
                        ? formatDate(session.last_used_at)
                        : "—"}
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
          <CardTitle className="text-base">Linked accounts</CardTitle>
        </CardHeader>
        <CardContent>
          {user.linked_accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No other accounts share this user&apos;s IP or device.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {user.linked_accounts.map((linked) => (
                <div
                  key={linked.id}
                  className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
                >
                  <Link
                    href={`/admin/users/${linked.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {linked.username ? `@${linked.username}` : linked.email}
                  </Link>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {linked.shared_device && (
                      <Badge variant="destructive">same device</Badge>
                    )}
                    {linked.shared_ip && (
                      <Badge variant="secondary">same IP</Badge>
                    )}
                    {linked.suspended && (
                      <Badge variant="outline">suspended</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payout account</CardTitle>
          </CardHeader>
          <CardContent>
            {user.payout_account ? (
              <div className="divide-y">
                <Row label="Bank" value={user.payout_account.bank_name} />
                <Row
                  label="Account name"
                  value={user.payout_account.account_name}
                />
                <Row
                  label="Account"
                  value={`•••• ${user.payout_account.account_last4}`}
                />
                <Row
                  label="Linked"
                  value={formatDate(user.payout_account.created_at)}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No payout account linked.
              </p>
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
            <p className="text-sm text-muted-foreground">No withdrawals.</p>
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
                    <TableCell className="font-mono text-xs">
                      {withdrawal.reference}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNaira(withdrawal.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{withdrawal.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
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
            <p className="text-sm text-muted-foreground">No reports.</p>
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
                    <TableCell className="text-sm text-muted-foreground">
                      {report.detail ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
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
