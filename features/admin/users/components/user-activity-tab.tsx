import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { EmptyNote, Section } from "@/features/admin/shell/components/detail"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { reportPath, userPath } from "@/features/admin/shell/routes"
import { shortId } from "@/features/admin/shell/utils/format"
import { formatDate, formatNumber, percent } from "@/lib/format"
import type { AdminUserDetail, UserEngager, UserSession } from "../types"
import { DOMINANT_SHARE } from "../utils/users"

type ReportAgainst = AdminUserDetail["reports_against"][number]

const ENGAGERS: Column<UserEngager>[] = [
  {
    id: "account",
    header: "Account",
    cell: (engager) =>
      engager.username ? `@${engager.username}` : engager.email,
  },
  {
    id: "resnaccs",
    header: "Resnaccs",
    align: "end",
    className: "tabular-nums",
    cell: (engager) => formatNumber(engager.resnaccs),
  },
  {
    id: "replies",
    header: "Replies",
    align: "end",
    className: "tabular-nums",
    cell: (engager) => formatNumber(engager.replies),
  },
  {
    id: "share",
    header: "Share",
    align: "end",
    className: "tabular-nums",
    cell: (engager) =>
      engager.share >= DOMINANT_SHARE ? (
        <Badge variant="destructive">{percent(engager.share)}</Badge>
      ) : (
        percent(engager.share)
      ),
  },
]

const SESSIONS: Column<UserSession>[] = [
  {
    id: "device",
    header: "Device",
    className: "max-w-xs truncate",
    cell: (session) => session.client_info ?? session.user_agent ?? "—",
  },
  {
    id: "ip",
    header: "IP address",
    className: "font-mono text-xs",
    cell: (session) => session.ip ?? "—",
  },
  {
    id: "install",
    header: "Install",
    className: "font-mono text-xs",
    cell: (session) => (session.install_id ? shortId(session.install_id) : "—"),
  },
  {
    id: "used",
    header: "Last used",
    className: "text-muted-foreground",
    cell: (session) => formatDate(session.last_used_at),
  },
]

const REPORTS: Column<ReportAgainst>[] = [
  {
    id: "reason",
    header: "Reason",
    cell: (report) => (
      <Link
        href={reportPath(report.id)}
        className="underline-offset-4 hover:underline"
      >
        {report.reason.label}
      </Link>
    ),
  },
  {
    id: "detail",
    header: "What they said",
    className: "max-w-xs whitespace-normal text-muted-foreground",
    cell: (report) => report.detail ?? "—",
  },
  {
    id: "filed",
    header: "Filed",
    className: "text-muted-foreground",
    cell: (report) => formatDate(report.created_at),
  },
]

export function UserActivityTab({ user }: { user: AdminUserDetail }) {
  return (
    <div className="flex flex-col gap-6">
      {user.top_engagers.length > 0 ? (
        <TableFrame
          title="Who engages with them"
          description="Resnaccs and replies aimed at this account. One account holding a large share is the shape farming takes."
        >
          <DataTable
            columns={ENGAGERS}
            rows={user.top_engagers}
            rowKey={(engager) => engager.email}
            empty=""
          />
        </TableFrame>
      ) : null}

      <Section title="Signed-in devices">
        {user.sessions.length === 0 ? (
          <EmptyNote>Not signed in anywhere.</EmptyNote>
        ) : (
          <TableFrame>
            <DataTable
              columns={SESSIONS}
              rows={user.sessions}
              rowKey={(session) => session.id}
              empty=""
            />
          </TableFrame>
        )}
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          title="Linked accounts"
          description="Other accounts seen on the same device or IP address."
        >
          {user.linked_accounts.length === 0 ? (
            <EmptyNote>
              Nothing shares this account&apos;s device or IP.
            </EmptyNote>
          ) : (
            <ul className="divide-y rounded-lg border">
              {user.linked_accounts.map((linked) => (
                <li
                  key={linked.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <Link
                    href={userPath(linked.id)}
                    className="truncate text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {linked.username ? `@${linked.username}` : linked.email}
                  </Link>
                  <span className="flex flex-wrap items-center gap-1.5">
                    {linked.shared_device ? (
                      <Badge variant="destructive">Same device</Badge>
                    ) : null}
                    {linked.shared_ip ? (
                      <Badge variant="secondary">Same IP</Badge>
                    ) : null}
                    {linked.suspended ? (
                      <Badge variant="outline">Suspended</Badge>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Reports against them">
          {user.reports_against.length === 0 ? (
            <EmptyNote>Nobody has reported them.</EmptyNote>
          ) : (
            <TableFrame>
              <DataTable
                columns={REPORTS}
                rows={user.reports_against}
                rowKey={(report) => report.id}
                empty=""
              />
            </TableFrame>
          )}
        </Section>
      </div>
    </div>
  )
}
