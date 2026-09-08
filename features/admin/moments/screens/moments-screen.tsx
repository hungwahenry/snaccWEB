"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { MomentsView } from "@/features/admin/moments/components/moments-view"

export function MomentsScreen() {
  return (
    <>
      <PageHeader
        title="Moments"
        description="Everything posted to a tray, including what a report is holding."
      />
      <MomentsView />
    </>
  )
}
