"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { GhostHourPanel } from "../components/ghost-hour-panel"
import { useGhostHourScreen } from "../hooks/use-ghost-hour-screen"

export function GhostHourScreen() {
  const { query, remaining, actions } = useGhostHourScreen()

  return (
    <>
      <PageHeader
        title="Ghost Hour"
        description="Open an anonymous window on demand — broadcasts a push to every device."
      />
      <QueryView query={query} what="Ghost Hour state">
        {(state) => (
          <GhostHourPanel
            state={state}
            remaining={remaining}
            onOpen={actions.open}
            onClose={actions.close}
          />
        )}
      </QueryView>
    </>
  )
}
