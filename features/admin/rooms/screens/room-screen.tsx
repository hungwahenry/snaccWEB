"use client"

import { BackLink } from "@/features/admin/shell/components/back-link"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { ROOMS_PATH } from "@/features/admin/shell/routes"
import { RoomHeader } from "../components/room-header"
import { RoomMessagesTable } from "../components/room-messages-table"
import { useRoomScreen } from "../hooks/use-room-screen"
import { HELD_OPTIONS } from "../utils/rooms"

export function RoomScreen({ id }: { id: string }) {
  const { room, list, messages, actions, countryNames } = useRoomScreen(id)

  return (
    <>
      <BackLink href={ROOMS_PATH} label="Back to rooms" />
      <QueryView query={room} what="this room">
        {(room) => (
          <div className="flex flex-col gap-6">
            <RoomHeader
              room={room}
              countryNames={countryNames}
              onLock={actions.lock}
              onUnlock={actions.unlock}
            />
            <RoomMessagesTable
              query={messages}
              onPageChange={list.setPage}
              onRelease={actions.release}
              onRemove={actions.remove}
              toolbar={
                <TableToolbar onReset={list.filtered ? list.reset : undefined}>
                  <SearchField
                    value={list.values.q}
                    onChange={(q) => list.setFilter({ q })}
                    placeholder="Search message text…"
                  />
                  <OptionSelect
                    label="Held"
                    allLabel="All messages"
                    value={list.values.held}
                    onChange={(held) => list.setFilter({ held })}
                    options={HELD_OPTIONS}
                  />
                </TableToolbar>
              }
            />
          </div>
        )}
      </QueryView>
    </>
  )
}
