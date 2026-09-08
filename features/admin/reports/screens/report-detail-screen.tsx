"use client"

import { DetailScreen } from "@/features/admin/shell/ui/detail-screen"
import { ReportDetail } from "@/features/admin/reports/components/report-detail"
import {
  useReport,
  useResolveReport,
} from "@/features/admin/reports/hooks/use-reports"

export function ReportDetailScreen({ id }: { id: string }) {
  const query = useReport(id)
  const resolve = useResolveReport()

  return (
    <DetailScreen
      backHref="/admin/reports"
      backLabel="Back to reports"
      missing="Couldn't load this report."
      query={query}
    >
      {(report) => <ReportDetail report={report} resolve={resolve} />}
    </DetailScreen>
  )
}
