"use client"

import { Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { AnnouncementDialog } from "../components/announcement-dialog"
import { AnnouncementsTable } from "../components/announcements-table"
import { useAnnouncementsScreen } from "../hooks/use-announcements-screen"

export function AnnouncementsScreen() {
  const { list, query, campuses, actions } = useAnnouncementsScreen()

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Send a notice to every campus, or to one."
        action={
          <CanAct permission="announcements.write">
            <AnnouncementDialog
              campuses={campuses.options}
              trigger={
                <Button size="sm">
                  <Megaphone />
                  New announcement
                </Button>
              }
              onSubmit={actions.send}
            />
          </CanAct>
        }
      />
      <AnnouncementsTable
        query={query}
        acronyms={campuses.acronyms}
        onPageChange={list.setPage}
        onDelete={actions.remove}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search titles and messages"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
