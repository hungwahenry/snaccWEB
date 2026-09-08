"use client"

import { useReportsScreen } from "@/features/admin/reports/hooks/use-reports-screen"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ReportsTable } from "@/features/admin/reports/components/reports-table"
import { useResolveReport } from "@/features/admin/reports/hooks/use-reports"

export function ReportsScreen() {
  const { params, patch, query } = useReportsScreen()
  const resolve = useResolveReport()

  return (
    <>
      <PageHeader
        title="Reports"
        description="Triage flagged snaccs and users."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load reports.
        </p>
      ) : (
        <ReportsTable
          data={query.data}
          params={params}
          onParams={patch}
          resolve={resolve}
        />
      )}
    </>
  )
}
