"use client"

import Link from "next/link"
import { DataPagination } from "@/components/data-pagination"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, handleOf } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import { ResolveDialog } from "./resolve-dialog"
import type { useResolveReport } from "./use-reports"
import type { AdminReport, ListReportsParams } from "./types"

const STATUS_VARIANT: Record<AdminReport["status"], "secondary" | "default" | "outline"> = {
  open: "secondary",
  actioned: "default",
  dismissed: "outline",
}

function targetLabel(target: AdminReport["target"]) {
  if (!target) return "—"
  if (target.type === "snacc") {
    return `${target.snacc.body?.slice(0, 40) || "media snacc"} · ${handleOf(target.snacc.author)}`
  }
  if (target.type === "user") {
    return `User ${handleOf(target.user)}`
  }
  if (target.type === "moment") {
    return `${target.moment.body?.slice(0, 40) || "photo moment"} · ${handleOf(target.moment.author)}`
  }
  return `${target.message.body?.slice(0, 40) || "message"} · ${handleOf(target.message.sender)}`
}

export function ReportsTable({
  data,
  params,
  onParams,
  resolve,
}: {
  data: Paginated<AdminReport>
  params: ListReportsParams
  onParams: (patch: Partial<ListReportsParams>) => void
  resolve: ReturnType<typeof useResolveReport>
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={params.status ?? "all"}
          onValueChange={(value) =>
            onParams({ status: !value || value === "all" ? undefined : (value as never), page: 1 })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="actioned">Actioned</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={params.targetType ?? "all"}
          onValueChange={(value) =>
            onParams({
              targetType: !value || value === "all" ? undefined : (value as never),
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Target" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All targets</SelectItem>
            <SelectItem value="snacc">Snaccs</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="message">Messages</SelectItem>
            <SelectItem value="moment">Moments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Target</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reported</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-10 text-center text-sm">
                No reports match these filters.
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="max-w-xs">
                  <Link
                    href={`/admin/reports/${report.id}`}
                    className="truncate text-sm font-medium underline-offset-4 hover:underline"
                  >
                    {targetLabel(report.target)}
                  </Link>
                  {report.detail && (
                    <p className="text-muted-foreground truncate text-xs">“{report.detail}”</p>
                  )}
                </TableCell>
                <TableCell className="text-sm">{report.reason.label}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {report.reporter.username ? `@${report.reporter.username}` : report.reporter.display_name}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDate(report.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  {report.status === "open" ? (
                    <ResolveDialog report={report} resolve={resolve} />
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      {report.reviewed_by?.username ? `@${report.reviewed_by.username}` : "resolved"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataPagination
        page={data.page}
        lastPage={data.last_page}
        total={data.total}
        onPage={(page) => onParams({ page })}
      />
    </div>
  )
}
