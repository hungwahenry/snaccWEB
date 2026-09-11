"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { EngagementTables } from "../components/engagement-tables"
import { useEngagementScreen } from "../hooks/use-engagement-screen"

export function EngagementScreen() {
  const { query, actions } = useEngagementScreen()

  return (
    <>
      <PageHeader
        title="Engagement weights"
        description="What each act on a snacc is worth: to Snacc Score, to the feed, and in kobo. One catalog, so they can never disagree. Changes apply within about 30 seconds."
      />
      <QueryView query={query} what="the catalog">
        {(groups) => (
          <EngagementTables
            groups={groups}
            onReprice={actions.reprice}
            onReset={actions.reset}
            onSetEnabled={actions.setEnabled}
          />
        )}
      </QueryView>
    </>
  )
}
