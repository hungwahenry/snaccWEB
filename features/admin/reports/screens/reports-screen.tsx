"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { ReportsTable } from "../components/reports-table"
import { useReportsScreen } from "../hooks/use-reports-screen"
import { STATUS_OPTIONS, TARGET_OPTIONS } from "../utils/status"

export function ReportsScreen() {
  const { list, query, actions, suspension, permissions } = useReportsScreen()

  return (
    <>
      <PageHeader
        title="Reports"
        description="Everything people have flagged, newest first. Open one to see what was reported and act on it."
      />
      <ReportsTable
        query={query}
        onPageChange={list.setPage}
        suspension={suspension}
        permissions={permissions}
        onResolve={actions.resolve}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search usernames, reasons, notes or snacc text…"
            />
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
