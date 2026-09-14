"use client"

import { PageHeader } from "@/features/admin/shell/components/page-header"
import { AppIconsTable } from "../components/app-icons-table"
import { useAppIconsScreen } from "../hooks/use-app-icons-screen"

export function AppIconsScreen() {
  const { query, actions, move } = useAppIconsScreen()

  return (
    <>
      <PageHeader
        title="App icons"
        description="The artwork ships inside the app, so this decides which icons the picker offers, in what order, and under what name. Turning one off stops it being offered — it does not change the icon on the phone of anyone already using it."
      />
      <AppIconsTable
        query={query}
        onMove={move}
        onRename={actions.rename}
        onSetEnabled={actions.setEnabled}
      />
    </>
  )
}
