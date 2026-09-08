"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { GhostHourPanel } from "@/features/admin/ghost-hour/components/ghost-hour-panel"

export function GhostHourScreen() {
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
