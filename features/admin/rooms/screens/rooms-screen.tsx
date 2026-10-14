"use client"

import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { RoomsTable } from "../components/rooms-table"
import { useRoomsScreen } from "../hooks/use-rooms-screen"
import { KIND_OPTIONS, LOCK_OPTIONS } from "../utils/rooms"

export function RoomsScreen() {
  const { list, query, countryNames } = useRoomsScreen()

  return (
    <>
      <PageHeader
        title="Rooms"
        description="Country, campus and hangout chats. Lock a room during a raid, and review what the automatic check is holding."
      />
      <RoomsTable
        query={query}
        countryNames={countryNames}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search a country, campus or hangout…"
            />
            <OptionSelect
              label="Kind"
              allLabel="All rooms"
              value={list.values.kind}
              onChange={(kind) => list.setFilter({ kind })}
              options={KIND_OPTIONS}
            />
            <OptionSelect
              label="State"
              allLabel="Any"
              value={list.values.locked}
              onChange={(locked) => list.setFilter({ locked })}
              options={LOCK_OPTIONS}
            />
          </TableToolbar>
        }
      />
    </>
  )
}
