"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { SuspensionsTable } from "../components/suspensions-table"
import { useSuspensionsScreen } from "../hooks/use-suspensions-screen"

export function SuspensionsScreen() {
  const { list, query } = useSuspensionsScreen()

  return (
    <>
      <PageHeader
        title="Suspensions"
        description="Who is suspended right now, why, and until when."
      />
      <SuspensionsTable
        query={query}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search by name, handle or email"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
