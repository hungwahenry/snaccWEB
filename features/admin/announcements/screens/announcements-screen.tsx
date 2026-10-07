"use client"

import { Megaphone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { OptionSelect } from "@/features/admin/shell/components/option-select"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { NEW_ANNOUNCEMENT_PATH } from "@/features/admin/shell/routes"
import { AnnouncementsTable } from "../components/announcements-table"
import { useAnnouncementsScreen } from "../hooks/use-announcements-screen"
import { STATUS_OPTIONS } from "../utils/announcement"

export function AnnouncementsScreen() {
  const { list, query, campuses } = useAnnouncementsScreen()

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Notices that land in people's notifications, with a push if you want one."
        action={
          <CanAct permission="announcements.write">
            <Button size="sm" render={<Link href={NEW_ANNOUNCEMENT_PATH} />}>
              <Megaphone />
              New announcement
            </Button>
          </CanAct>
        }
      />
      <AnnouncementsTable
        query={query}
        acronyms={campuses.acronyms}
        filtered={list.filtered}
        onPageChange={list.setPage}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Search titles and messages"
            />
            <OptionSelect
              label="Status"
              allLabel="All"
              value={list.values.status}
              onChange={(status) => list.setFilter({ status })}
              options={STATUS_OPTIONS}
            />
          </TableToolbar>
        }
      />
    </>
  )
}
