"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { NotificationTypesView } from "@/features/admin/notification-types/components/notification-types-view"

export function NotificationTypesScreen() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="What every notification says, and how it reaches people."
      />
      <NotificationTypesView />
    </>
  )
}
