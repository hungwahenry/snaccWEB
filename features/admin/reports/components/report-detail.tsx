"use client"

import { STATUS_VARIANT } from "../utils/status"
import { DetailHeader, Section } from "@/components/admin/detail"
import { UserInline } from "@/components/admin/user-inline"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/format"
import { ReportedContent } from "./reported-content"
import { ScanPanel } from "./scan-panel"
import { ResolveDialog } from "./resolve-dialog"
import type { useResolveReport } from "../hooks/use-reports"
import type { AdminReport, AdminReportDetail } from "../types"

const TARGET_LABEL = {
  snacc: "a snacc",
  user: "an account",
  message: "a ghost message",
  moment: "a moment",
} as const

function Filing({ report }: { report: AdminReport }) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{report.reason.label}</span>
          <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(report.created_at)}
        </span>
      </div>
      {report.reporter ? (
        <UserInline user={report.reporter} size="sm" />
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Automatic check</Badge>
          {report.scan?.category ? (
            <span className="font-mono text-xs text-muted-foreground">
              {report.scan.category} {report.scan.score?.toFixed(3)}
            </span>
          ) : null}
        </div>
      )}
      {report.detail ? (
        <p className="text-sm text-pretty text-muted-foreground">
          “{report.detail}”
        </p>
      ) : null}
      {report.resolution_note ? (
        <p className="text-xs text-muted-foreground">
          Resolution note: {report.resolution_note}
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
  const filings = [report, ...report.siblings]
  const open = filings.filter((each) => each.status === "open").length

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={report.reason.label}
        badges={
          <Badge variant={STATUS_VARIANT[report.status]}>{report.status}</Badge>
        }
        subtitle={
          report.target
            ? `Filed against ${TARGET_LABEL[report.target.type]}.`
            : "The reported thing no longer exists."
        }
        meta={
          <>
            <span>Reported {formatDate(report.created_at)}</span>
            {filings.length > 1 ? (
              <span>{filings.length} filings on this target</span>
            ) : null}
            {report.reviewed_by ? (
              <span>
                Resolved by {report.reviewed_by.username ?? "an admin"}
                {report.reviewed_at
                  ? ` on ${formatDate(report.reviewed_at)}`
                  : ""}
              </span>
            ) : null}
          </>
        }
        actions={
          open > 0 ? <ResolveDialog report={report} resolve={resolve} /> : null
        }
      />

      <ReportedContent report={report} />

      {report.scan ? <ScanPanel scan={report.scan} /> : null}

      <Section
        title={
          filings.length === 1 ? "The report" : `${filings.length} reports`
        }
        description={
          open > 0
            ? `Resolving acts on the target and closes all ${open} open ${open === 1 ? "report" : "reports"} at once.`
            : undefined
        }
      >
        <div className="divide-y rounded-lg border">
          {filings.map((filing) => (
            <Filing key={filing.id} report={filing} />
          ))}
        </div>
      </Section>
    </div>
  )
}
