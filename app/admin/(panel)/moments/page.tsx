"use client"

import { PageHeader } from "@/components/page-header"
import { MomentsView } from "@/features/admin/moments/moments-view"

export default function MomentsPage() {
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
