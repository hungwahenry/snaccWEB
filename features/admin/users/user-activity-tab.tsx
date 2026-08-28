"use client"

import Link from "next/link"
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
import { formatDate, formatNumber } from "@/lib/format"
import type { AdminUserDetail } from "./types"

export function UserActivityTab({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-col gap-6">
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
