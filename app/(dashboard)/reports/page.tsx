"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ReportsTable } from "@/features/reports/reports-table"
import { useReports, useResolveReport } from "@/features/reports/use-reports"
import type { ListReportsParams } from "@/features/reports/types"

export default function ReportsPage() {
  const [params, setParams] = useState<ListReportsParams>({ page: 1, perPage: 20, status: "open" })
  const query = useReports(params)
  const resolve = useResolveReport()

  function patch(next: Partial<ListReportsParams>) {
    setParams((prev) => ({ ...prev, ...next }))
  }

  return (
    <>
      <PageHeader title="Reports" description="Triage flagged snaccs and users." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load reports.</p>
      ) : (
        <ReportsTable data={query.data} params={params} onParams={patch} resolve={resolve} />
      )}
    </>
  )
}
