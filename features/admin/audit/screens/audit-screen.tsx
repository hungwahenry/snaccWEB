"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { AuditTable } from "../components/audit-table"
import { useAuditScreen } from "../hooks/use-audit-screen"

export function AuditScreen() {
  const { list, query, actions } = useAuditScreen()

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Every admin action, with what it changed."
      />
      <AuditTable
        query={query}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search actions, ids or admin emails"
            />
            <OptionSelect
              label="Action"
              value={list.values.action}
              onChange={(action) => list.setFilter({ action })}
              options={actions.options}
              allLabel="Every action"
              disabled={actions.loading}
              className="w-56"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
