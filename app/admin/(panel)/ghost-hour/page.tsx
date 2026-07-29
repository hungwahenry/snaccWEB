"use client"

import { PageHeader } from "@/components/page-header"
import { GhostHourPanel } from "@/features/admin/ghost-hour/ghost-hour-panel"

export default function GhostHourPage() {
  return (
    <>
      <PageHeader
        title="Ghost Hour"
        description="Open an anonymous window on demand — broadcasts a push to every device."
      />
      <GhostHourPanel />
    </>
  )
}
