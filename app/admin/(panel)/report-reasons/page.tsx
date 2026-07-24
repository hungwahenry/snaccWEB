"use client"

import { PageHeader } from "@/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ReasonsTable } from "@/features/admin/report-reasons/reasons-table"
import { useReasonMutations, useReasons } from "@/features/admin/report-reasons/use-report-reasons"

export default function ReportReasonsPage() {
  const query = useReasons()
  const mutations = useReasonMutations()

  return (
    <>
      <PageHeader title="Report reasons" description="The catalogue users pick from when flagging." />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-muted-foreground text-sm">Couldn&apos;t load reasons.</p>
      ) : (
        <ReasonsTable reasons={query.data} mutations={mutations} />
      )}
    </>
  )
}
