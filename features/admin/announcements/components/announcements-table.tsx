"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo, type ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import type { Paginated } from "@/lib/api/types"
import { formatDate } from "@/lib/format"
import type { AdminAnnouncement } from "../types"
import { audienceLabel } from "../utils/announcement"

export function AnnouncementsTable({
  query,
  acronyms,
  toolbar,
  onPageChange,
  onDelete,
}: {
  query: UseQueryResult<Paginated<AdminAnnouncement>>
  acronyms: ReadonlyMap<string, string>
  toolbar: ReactNode
  onPageChange: (page: number) => void
  onDelete: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminAnnouncement>[]>(
    () => [
      {
        id: "announcement",
        header: "Announcement",
        className: "max-w-md whitespace-normal",
        cell: (announcement) => (
          <div className="min-w-0">
            <p className="font-medium">{announcement.title}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {announcement.message}
            </p>
          </div>
        ),
      },
      {
        id: "audience",
        header: "Sent to",
        cell: (announcement) => (
          <Badge variant={announcement.university_id ? "secondary" : "outline"}>
            {audienceLabel(announcement.university_id, acronyms)}
          </Badge>
        ),
      },
      {
        id: "sent",
        header: "Sent",
        className: "text-muted-foreground",
        cell: (announcement) => formatDate(announcement.created_at),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (announcement) => (
          <CanAct permission="announcements.delete">
            <ConfirmAction
              trigger={
                <Button variant="ghost" size="sm">
                  Delete
                </Button>
              }
              title="Delete this announcement?"
              description="It disappears from everyone's notifications. Pushes already sent cannot be taken back."
              confirmLabel="Delete announcement"
              onConfirm={() => onDelete(announcement.id)}
            />
          </CanAct>
        ),
      },
    ],
    [acronyms, onDelete]
  )

  return (
    <QueryTable
      query={query}
      what="announcements"
      columns={columns}
      rowKey={(announcement) => announcement.id}
      empty="No announcements yet."
      toolbar={toolbar}
      onPageChange={onPageChange}
    />
  )
}
