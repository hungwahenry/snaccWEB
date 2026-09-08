"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { Spinner } from "@/components/ui/spinner"
import { ReasonsTable } from "@/features/admin/report-reasons/components/reasons-table"
import {
  useReasonMutations,
  useReasons,
} from "@/features/admin/report-reasons/hooks/use-report-reasons"

export function ReportReasonsScreen() {
  const query = useReasons()
  const mutations = useReasonMutations()

  return (
    <>
      <PageHeader
        title="Report reasons"
        description="The catalogue users pick from when flagging."
      />
      {query.isPending ? (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      ) : query.isError || !query.data ? (
        <p className="text-sm text-muted-foreground">
          Couldn&apos;t load reasons.
        </p>
      ) : (
        <ReasonsTable reasons={query.data} mutations={mutations} />
      )}
    </>
  )
}
