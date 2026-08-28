"use client"

import { PageHeader } from "@/components/page-header"
import { NotificationTypesView } from "@/features/admin/notification-types/notification-types-view"

export default function NotificationTypesPage() {
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
