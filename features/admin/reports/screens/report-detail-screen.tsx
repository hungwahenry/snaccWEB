"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { REPORTS_PATH } from "@/features/admin/shell/routes"
import { ReportDetail } from "../components/report-detail"
import { useReportDetailScreen } from "../hooks/use-report-detail-screen"

export function ReportDetailScreen({ id }: { id: string }) {
  const { query, actions, suspension } = useReportDetailScreen(id)

  return (
    <>
      <BackLink href={REPORTS_PATH} label="Back to reports" />
      <QueryView query={query} what="this report">
        {(report) => (
          <ReportDetail
            report={report}
            suspension={suspension}
            onResolve={actions.resolve}
          />
        )}
      </QueryView>
    </>
  )
}
