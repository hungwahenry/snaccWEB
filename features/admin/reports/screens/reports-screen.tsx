"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { ReportsTable } from "../components/reports-table"
import { useReportsScreen } from "../hooks/use-reports-screen"
import { STATUS_OPTIONS, TARGET_OPTIONS } from "../utils/status"

export function ReportsScreen() {
  const { list, query, actions, suspension } = useReportsScreen()

  return (
    <>
      <PageHeader
        title="Reports"
        description="Triage flagged snaccs and users."
      />
      <ReportsTable
        query={query}
        onPageChange={list.setPage}
        suspension={suspension}
        onResolve={actions.resolve}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <OptionSelect
              label="Status"
              value={list.values.status}
              onChange={(status) => list.setFilter({ status })}
              options={STATUS_OPTIONS}
            />
            <OptionSelect
              label="Target"
              allLabel="All targets"
              value={list.values.target}
              onChange={(target) => list.setFilter({ target })}
              options={TARGET_OPTIONS}
            />
          </TableToolbar>
        }
      />
    </>
  )
}
