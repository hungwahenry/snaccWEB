"use client"

import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ReportDetail } from "@/features/admin/reports/report-detail"
import {
  useReport,
  useResolveReport,
} from "@/features/admin/reports/use-reports"

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const query = useReport(id)
  const resolve = useResolveReport()

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mb-4 w-fit"
        render={<Link href="/admin/reports" />}
      >
        ← Back to reports
      </Button>
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load this report.
        </p>
      ) : (
        <ReportDetail report={query.data} resolve={resolve} />
      )}
    </>
  )
}
