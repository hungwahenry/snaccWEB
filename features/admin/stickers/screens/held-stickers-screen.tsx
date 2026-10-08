"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { HeldStickersTable } from "../components/held-stickers-table"
import { useHeldStickersScreen } from "../hooks/use-held-stickers-screen"

export function HeldStickersScreen() {
  const { list, query, actions } = useHeldStickersScreen()

  return (
    <>
      <PageHeader
        title="Held stickers"
        description="Stickers people uploaded that the automatic check held back, oldest first. Only the person who made one can see it until you decide."
      />
      <HeldStickersTable
        query={query}
        filtered={list.filtered}
        onPageChange={list.setPage}
        onRelease={actions.release}
        onRemove={actions.remove}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Pack name or @username"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
