"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { FlagsTables } from "../components/flags-tables"
import { useFlagsScreen } from "../hooks/use-flags-screen"

export function FlagsScreen() {
  const { query, actions, countries } = useFlagsScreen()

  return (
    <>
      <PageHeader
        title="Feature flags"
        description="Turn features on or off, and choose who, which app builds and which countries get them."
      />
      <QueryView query={query} what="flags">
        {(groups) => (
          <FlagsTables
            groups={groups}
            countries={countries}
            onSetEnabled={actions.setEnabled}
            onSaveAvailability={actions.saveAvailability}
          />
        )}
      </QueryView>
    </>
  )
}
