"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { ConfigTables } from "../components/config-tables"
import { useConfigScreen } from "../hooks/use-config-screen"

export function ConfigScreen() {
  const { query, actions } = useConfigScreen()

  return (
    <>
      <PageHeader
        title="Config"
        description="The numbers and switches the app runs on. A change reaches the apps within about 30 seconds."
      />
      <QueryView query={query} what="config">
        {(groups) => <ConfigTables groups={groups} onSave={actions.save} />}
      </QueryView>
    </>
  )
}
