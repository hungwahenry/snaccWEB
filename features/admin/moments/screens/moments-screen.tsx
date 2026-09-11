"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { MomentsTable } from "../components/moments-table"
import { useMomentsScreen } from "../hooks/use-moments-screen"
import { DELETED_OPTIONS, HELD_OPTIONS } from "../utils/moments"

export function MomentsScreen() {
  const { list, query, actions } = useMomentsScreen()

  return (
    <>
      <PageHeader
        title="Moments"
        description="Everything posted to a tray, including what a report is holding."
      />
      <MomentsTable
        query={query}
        onPageChange={list.setPage}
        onRelease={actions.release}
        onRemove={actions.remove}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Caption text…"
            />
            <OptionSelect
              label="Held"
              allLabel="Any"
              value={list.values.held}
              onChange={(held) => list.setFilter({ held })}
              options={HELD_OPTIONS}
            />
            <OptionSelect
              label="Removed"
              allLabel="All"
              value={list.values.deleted}
              onChange={(deleted) => list.setFilter({ deleted })}
              options={DELETED_OPTIONS}
            />
          </TableToolbar>
        }
      />
    </>
  )
}
