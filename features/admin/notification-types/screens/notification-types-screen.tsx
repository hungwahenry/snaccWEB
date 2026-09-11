"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SearchField } from "@/features/admin/shell/components/search-field"
import { TableToolbar } from "@/features/admin/shell/components/table-toolbar"
import { NotificationTypesTable } from "../components/notification-types-table"
import { useNotificationTypesScreen } from "../hooks/use-notification-types-screen"

export function NotificationTypesScreen() {
  const { list, query, actions } = useNotificationTypesScreen()

  return (
    <>
      <PageHeader
        title="Notifications"
        description="What every notification says, and how it reaches people."
      />
      <NotificationTypesTable
        query={query}
        onSave={actions.save}
        toolbar={
          <TableToolbar onReset={list.filtered ? list.reset : undefined}>
            <SearchField
              value={list.values.q}
              onChange={(q) => list.setFilter({ q })}
              placeholder="Key, label or wording…"
            />
          </TableToolbar>
        }
      />
    </>
  )
}
