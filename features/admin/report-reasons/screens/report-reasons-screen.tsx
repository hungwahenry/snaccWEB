"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { ReasonsTable } from "../components/reasons-table"
import { useReportReasonsScreen } from "../hooks/use-report-reasons-screen"

export function ReportReasonsScreen() {
  const { query, actions } = useReportReasonsScreen()

  return (
    <>
      <PageHeader
        title="Report reasons"
        description="The catalogue users pick from when flagging."
      />
      <ReasonsTable
        query={query}
        onSave={actions.save}
        onRetire={actions.retire}
        onRestore={actions.restore}
      />
    </>
  )
}
