"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, handleOf } from "@/lib/format"
import type { useResolveReport } from "./use-reports"
import { ReportedContent } from "./reported-content"
import { ResolveDialog } from "./resolve-dialog"
import type { AdminReport, AdminReportDetail } from "./types"

const STATUS_VARIANT: Record<
  AdminReport["status"],
  "secondary" | "default" | "outline"
> = {
  open: "secondary",
  actioned: "default",
  dismissed: "outline",
}

function Filing({ report }: { report: AdminReport }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">{report.reason.label}</span>
        <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
        <span className="text-xs text-muted-foreground">
          {handleOf(report.reporter)} · {formatDate(report.created_at)}
        </span>
      </div>
      {report.detail ? (
        <p className="text-sm text-muted-foreground">“{report.detail}”</p>
      ) : null}
      {report.resolution_note ? (
        <p className="text-xs text-muted-foreground">
          Note: {report.resolution_note}
        </p>
      ) : null}
    </div>
  )
}

export function ReportDetail({
  report,
  resolve,
}: {
  report: AdminReportDetail
  resolve: ReturnType<typeof useResolveReport>
}) {
  const open = [report, ...report.siblings].filter(
    (each) => each.status === "open"
  ).length

  return (
    <div className="flex flex-col gap-4">
      <ReportedContent report={report} />

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">
            {report.siblings.length > 0
              ? `${report.siblings.length + 1} reports on this target`
              : "The report"}
          </CardTitle>
          {open > 0 ? (
            <ResolveDialog report={report} resolve={resolve} />
          ) : null}
        </CardHeader>
        <CardContent>
          <Filing report={report} />
          {report.siblings.map((sibling) => (
            <Filing key={sibling.id} report={sibling} />
          ))}
          {open > 0 ? (
            <p className="pt-3 text-xs text-muted-foreground">
              Resolving acts on the target and closes all {open} open{" "}
              {open === 1 ? "report" : "reports"} at once.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {report.reviewed_by ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Resolved by {handleOf(report.reviewed_by)}
            {report.reviewed_at ? ` on ${formatDate(report.reviewed_at)}` : ""}.
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
