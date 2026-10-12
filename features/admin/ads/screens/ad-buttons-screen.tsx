"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { AdButtonDialog } from "../components/ad-button-dialog"
import { AdButtonsTable } from "../components/ad-buttons-table"
import { useAdButtonsScreen } from "../hooks/use-ad-buttons-screen"

export function AdButtonsScreen() {
  const { query, actions } = useAdButtonsScreen()

  return (
    <>
      <PageHeader
        title="Ad button labels"
        description="What the button under a promotion can say. Advertisers pick one when they pay."
        action={
          <CanAct permission="ads.policy">
            <AdButtonDialog
              trigger={
                <Button size="sm">
                  <Plus />
                  Add label
                </Button>
              }
              onSubmit={(draft) => actions.save(draft)}
            />
          </CanAct>
        }
      />
      <AdButtonsTable
        query={query}
        onSave={actions.save}
        onSetRetired={actions.setRetired}
      />
    </>
  )
}
