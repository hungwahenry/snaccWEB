"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { DetailHeader, Section } from "@/features/admin/shell/components/detail"
import { StatusBadge } from "@/features/admin/shell/components/status-badge"
import { UserCell } from "@/features/admin/shell/components/user-cell"
import { plural } from "@/features/admin/shell/utils/format"
import { formatDate } from "@/lib/format"
import type {
  AdminReport,
  AdminReportDetail,
  ReportTarget,
  ResolveDraft,
  SuspensionChoices,
} from "../types"
import { resolvedLine, targetSummary } from "../utils/reports"
import { countOpen, REPORT_STATUS } from "../utils/status"
import { ReportedContent } from "./reported-content"
import { ResolveDialog } from "./resolve-dialog"
import { ScanPanel } from "./scan-panel"

function Filing({ report }: { report: AdminReport }) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{report.reason.label}</span>
          <StatusBadge status={REPORT_STATUS[report.status]} />
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(report.created_at)}
        </span>
      </div>
      {report.reporter ? (
        <UserCell user={report.reporter} size="sm" />
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
  suspension,
  onResolve,
}: {
  report: AdminReportDetail
  suspension: SuspensionChoices
  onResolve: (target: ReportTarget, draft: ResolveDraft) => Promise<unknown>
}) {
  const filings = [report, ...report.siblings]
  const open = countOpen(filings)
  const resolved = resolvedLine(report)

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        title={report.reason.label}
        badges={<StatusBadge status={REPORT_STATUS[report.status]} />}
        subtitle={targetSummary(report.target)}
        meta={
          <>
            <span>Reported {formatDate(report.created_at)}</span>
            {filings.length > 1 ? (
              <span>{filings.length} filings on this target</span>
            ) : null}
            {resolved ? <span>{resolved}</span> : null}
          </>
        }
        actions={
          open > 0 ? (
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
          ) : null
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
            ? `Resolving acts on the target and closes all ${plural(open, "open report")} at once.`
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
