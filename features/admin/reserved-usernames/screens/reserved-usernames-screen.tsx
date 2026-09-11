"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { ReservedUsernamesTable } from "../components/reserved-usernames-table"
import { useReservedUsernamesScreen } from "../hooks/use-reserved-usernames-screen"

export function ReservedUsernamesScreen() {
  const { list, query, shown, actions } = useReservedUsernamesScreen()

  return (
    <>
      <PageHeader
        title="Reserved usernames"
        description="Names nobody may take. A username is also a profile URL and the way somebody is believed, so routes and Snacc's own names are held back. This table is what is enforced."
      />
      <QueryView query={query} what="held names">
        {(names) => (
          <ReservedUsernamesTable
            names={shown}
            total={names.length}
            onHold={actions.hold}
            onRelease={actions.release}
            toolbar={
              <TableToolbar onReset={list.filtered ? list.reset : undefined}>
                <SearchField
                  value={list.values.q}
                  onChange={(q) => list.setFilter({ q })}
                  placeholder="Filter"
                />
              </TableToolbar>
            }
          />
        )}
      </QueryView>
    </>
  )
}
