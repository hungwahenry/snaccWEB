"use client"

import Link from "next/link"
import { Section } from "@/components/admin/detail"
import { TableFrame } from "@/components/data-table/table-frame"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatNumber } from "@/lib/format"
import type { AdminUserDetail } from "../types"

function Nothing({ children }: { children: string }) {
  return (
    <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  )
}

export function UserActivityTab({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-col gap-6 pt-4">
      {user.top_engagers.length > 0 ? (
        <Section
          title="Who engages with them"
          description="Resnaccs and replies aimed at this user, counted off the posts themselves. A single account holding a large share is the shape rank farming takes."
        >
          <TableFrame>
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
          </TableFrame>
        </Section>
      ) : null}

      <Section title="Sessions and devices">
        {user.sessions.length === 0 ? (
          <Nothing>No active sessions.</Nothing>
        ) : (
          <TableFrame>
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
                      {formatDate(session.last_used_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableFrame>
        )}
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Linked accounts"
          description="Other accounts seen on the same device or IP."
        >
          {user.linked_accounts.length === 0 ? (
            <Nothing>Nothing shares this user&apos;s IP or device.</Nothing>
          ) : (
            <div className="divide-y rounded-lg border">
              {user.linked_accounts.map((linked) => (
                <div
                  key={linked.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <Link
                    href={`/admin/users/${linked.id}`}
                    className="truncate text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {linked.username ? `@${linked.username}` : linked.email}
                  </Link>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {linked.shared_device ? (
                      <Badge variant="destructive">same device</Badge>
                    ) : null}
                    {linked.shared_ip ? (
                      <Badge variant="secondary">same IP</Badge>
                    ) : null}
                    {linked.suspended ? (
                      <Badge variant="outline">suspended</Badge>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title="Reports against">
          {user.reports_against.length === 0 ? (
            <Nothing>No reports.</Nothing>
          ) : (
            <TableFrame>
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
                      <TableCell className="text-sm">
                        {report.reason.label}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {report.detail ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                        {formatDate(report.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableFrame>
          )}
        </Section>
      </div>
    </div>
  )
}
