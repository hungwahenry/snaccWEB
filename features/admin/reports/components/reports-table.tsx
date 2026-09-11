"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import type {
  AdminReport,
  ReportTarget,
  ResolveDraft,
  SuspensionChoices,
} from "../types"
import { reporterName, reviewerName } from "../utils/reports"
import { REPORT_STATUS } from "../utils/status"
import { ReportTargetCell } from "./report-target-cell"
import { ResolveDialog } from "./resolve-dialog"

export function ReportsTable({
  query,
  toolbar,
  onPageChange,
  suspension,
  onResolve,
}: {
  query: UseQueryResult<Paginated<AdminReport>>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  suspension: SuspensionChoices
  onResolve: (target: ReportTarget, draft: ResolveDraft) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminReport>[]>(
    () => [
      {
        id: "target",
        header: "Target",
        className: "max-w-xs",
        cell: (report) => <ReportTargetCell report={report} />,
      },
      {
        id: "reason",
        header: "Reason",
        cell: (report) => report.reason.label,
      },
      {
        id: "reporter",
        header: "Reporter",
        className: "text-muted-foreground",
        cell: (report) => reporterName(report),
      },
      {
        id: "status",
        header: "Status",
        cell: (report) => <StatusBadge status={REPORT_STATUS[report.status]} />,
      },
      {
        id: "reported",
        header: "Reported",
        className: "text-muted-foreground",
        cell: (report) => formatDate(report.created_at),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (report) =>
          report.status === "open" ? (
            <CanAct permission="reports.resolve">
              <ResolveDialog
                report={report}
                suspension={suspension}
                trigger={
                  <Button variant="outline" size="sm">
                    Resolve
                  </Button>
                }
                onSubmit={(draft) => onResolve(report.target, draft)}
              />
            </CanAct>
          ) : (
            <span className="text-xs text-muted-foreground">
              {reviewerName(report)}
            </span>
          ),
      },
    ],
    [suspension, onResolve]
  )

  return (
    <QueryTable
      query={query}
      what="reports"
      columns={columns}
      rowKey={(report) => report.id}
      empty="No reports match these filters."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
