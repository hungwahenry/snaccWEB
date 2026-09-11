"use client"

import { Egg } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { EggDialog } from "../components/egg-dialog"
import { EggsTable } from "../components/eggs-table"
import { useEggsScreen } from "../hooks/use-eggs-screen"

export function EggsScreen() {
  const { query, actions } = useEggsScreen()

  return (
    <>
      <PageHeader
        title="Easter eggs"
        description="Hidden discoveries and what sets them off. A trigger reaches every phone on its next refresh, so a new egg here goes live without an app release."
        action={
          <CanAct permission="easter_eggs.write">
            <EggDialog
              trigger={
                <Button size="sm">
                  <Egg />
                  Hide an egg
                </Button>
              }
              onSubmit={(draft) => actions.save(draft)}
            />
          </CanAct>
        }
      />
      <EggsTable
        query={query}
        onSave={actions.save}
        onDelete={actions.remove}
        onUploadArt={actions.uploadArt}
        onRemoveArt={actions.removeArt}
      />
    </>
  )
}
