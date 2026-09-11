"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { FlagsTables } from "../components/flags-tables"
import { useFlagsScreen } from "../hooks/use-flags-screen"

export function FlagsScreen() {
  const { query, actions } = useFlagsScreen()

  return (
    <>
      <PageHeader
        title="Feature flags"
        description="Turn features on or off, and choose which app builds get them."
      />
      <QueryView query={query} what="flags">
        {(groups) => (
          <FlagsTables
            groups={groups}
            onSetEnabled={actions.setEnabled}
            onSaveAvailability={actions.saveAvailability}
          />
        )}
      </QueryView>
    </>
  )
}
