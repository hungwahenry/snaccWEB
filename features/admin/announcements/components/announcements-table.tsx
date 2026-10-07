"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo, type ReactNode } from "react"
import type { Column } from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { announcementPath } from "@/features/admin/shell/routes"
import { userHandle } from "@/features/admin/shell/utils/user"
import type { Paginated } from "@/lib/api/types"
import type { AdminAnnouncement } from "../types"
import { countOrDash, openedLabel, whenLabel } from "../utils/announcement"
import { audienceSummary } from "../utils/audience"
import { AnnouncementBadges } from "./announcement-badges"

export function AnnouncementsTable({
  query,
  acronyms,
  filtered,
  toolbar,
  onPageChange,
}: {
  query: UseQueryResult<Paginated<AdminAnnouncement>>
  acronyms: ReadonlyMap<string, string>
  filtered: boolean
  toolbar: ReactNode
  onPageChange: (page: number) => void
}) {
  const columns = useMemo<Column<AdminAnnouncement>[]>(
    () => [
      {
        id: "announcement",
        header: "Announcement",
        className: "min-w-64 max-w-md whitespace-normal",
        cell: (announcement) => (
          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="min-w-0">
              <Link
                href={announcementPath(announcement.id)}
                className="font-medium underline-offset-4 hover:underline"
              >
                {announcement.title}
              </Link>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {announcement.message}
              </p>
            </div>
            <AnnouncementBadges announcement={announcement} />
          </div>
        ),
      },
      {
        id: "who",
        header: "Who",
        className: "max-w-56 text-xs whitespace-normal",
        cell: (announcement) =>
          audienceSummary(announcement.audience, acronyms),
      },
      {
        id: "when",
        header: "When",
        className: "text-muted-foreground",
        cell: whenLabel,
      },
      {
        id: "reached",
        header: "Reached",
        align: "end",
        className: "tabular-nums",
        cell: (announcement) => countOrDash(announcement.recipients_count),
      },
      {
        id: "opened",
        header: "Opened",
        align: "end",
        className: "tabular-nums",
        cell: openedLabel,
      },
      {
        id: "by",
        header: "Sent by",
        className: "text-muted-foreground",
        cell: (announcement) =>
          announcement.created_by ? userHandle(announcement.created_by) : "—",
      },
    ],
    [acronyms]
  )

  return (
    <QueryTable
      query={query}
      what="announcements"
      columns={columns}
      rowKey={(announcement) => announcement.id}
      empty={
        filtered
          ? "No announcements match these filters."
          : "No announcements yet."
      }
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
