"use client"

import { STATUS_VARIANT } from "../utils/status"
import { TableFrame } from "@/components/data-table/table-frame"
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
import { formatDate } from "@/lib/format"
import type { Paginated } from "@/lib/api/types"
import { ReportTargetCell } from "./report-target-cell"
import { ResolveDialog } from "./resolve-dialog"
import type { useResolveReport } from "../hooks/use-reports"
import type { AdminReport, ListReportsParams } from "../types"

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
            onParams({
              status: !value || value === "all" ? undefined : (value as never),
              page: 1,
            })
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
              targetType:
                !value || value === "all" ? undefined : (value as never),
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

      <TableFrame
        page={data.page}
        perPage={data.per_page}
        total={data.total}
        onPageChange={(page) => onParams({ page })}
      >
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
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No reports match these filters.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="max-w-xs">
                    <ReportTargetCell report={report} />
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.reason.label}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.reporter
                      ? report.reporter.username
                        ? `@${report.reporter.username}`
                        : report.reporter.display_name
                      : "Snacc"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[report.status]}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(report.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    {report.status === "open" ? (
                      <ResolveDialog report={report} resolve={resolve} />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {report.reviewed_by?.username
                          ? `@${report.reviewed_by.username}`
                          : "resolved"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableFrame>
    </div>
  )
}
