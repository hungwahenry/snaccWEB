"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { roomPath } from "@/features/admin/shell/routes"
import type { Paginated } from "@/lib/api/types"
import { formatNumber, timeAgo } from "@/lib/format"
import type { AdminRoom } from "../types"
import { KIND_LABELS, roomPlace } from "../utils/rooms"

export function RoomsTable({
  query,
  countryNames,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AdminRoom>>
  countryNames: ReadonlyMap<string, string>
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  const columns = useMemo<Column<AdminRoom>[]>(
    () => [
      {
        id: "room",
        header: "Room",
        className: "max-w-md whitespace-normal",
        cell: (room) => (
          <div className="flex min-w-0 flex-col gap-0.5">
            <Link
              href={roomPath(room.id)}
              className="font-medium hover:underline"
            >
              {room.name}
            </Link>
            <span className="text-xs text-pretty text-muted-foreground">
              {roomPlace(room, countryNames)}
            </span>
          </div>
        ),
      },
      {
        id: "kind",
        header: "Kind",
        hideBelow: "md",
        className: "text-sm text-muted-foreground",
        cell: (room) => KIND_LABELS[room.kind],
      },
      {
        id: "messages",
        header: "Messages",
        align: "end",
        hideBelow: "sm",
        className: "tabular-nums",
        cell: (room) => formatNumber(room.message_count),
      },
      {
        id: "last",
        header: "Last message",
        hideBelow: "md",
        className: "text-muted-foreground",
        cell: (room) =>
          room.last_message_at ? timeAgo(room.last_message_at) : "—",
      },
      {
        id: "state",
        header: "State",
        cell: (room) =>
          room.locked_at ? (
            <Badge variant="destructive">Locked</Badge>
          ) : (
            <Badge variant="outline">Open</Badge>
          ),
      },
      {
        id: "open",
        header: <HiddenHeader>Open</HiddenHeader>,
        align: "end",
        cell: (room) => (
          <Button
            variant="outline"
            size="sm"
            render={<Link href={roomPath(room.id)} />}
          >
            Open room
          </Button>
        ),
      },
    ],
    [countryNames]
  )

  return (
    <QueryTable
      query={query}
      what="rooms"
      columns={columns}
      rowKey={(room) => room.id}
      empty="No rooms match that. A room only exists once someone has opened chat there."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
