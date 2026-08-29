"use client"

import { use } from "react"
import { DetailScreen } from "@/components/admin/detail-screen"
import { ReportDetail } from "@/features/admin/reports/components/report-detail"
import {
  useReport,
  useResolveReport,
} from "@/features/admin/reports/hooks/use-reports"

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
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
