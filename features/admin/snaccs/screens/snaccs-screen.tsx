"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { SnaccsTable } from "../components/snaccs-table"
import { useSnaccsScreen } from "../hooks/use-snaccs-screen"
import { STATE_OPTIONS } from "../utils/snaccs"

export function SnaccsScreen() {
  const { list, query, actions } = useSnaccsScreen()

  return (
    <>
      <PageHeader
        title="Snaccs"
        description="Review and moderate posted content."
      />
      <SnaccsTable
        query={query}
        onPageChange={list.setPage}
        actions={actions}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search snacc text…"
            />
            <OptionSelect
              label="Status"
              allLabel="All snaccs"
              value={list.values.state}
              onChange={(state) => list.setFilter({ state })}
              options={STATE_OPTIONS}
            />
          </TableToolbar>
        }
      />
    </>
  )
}
