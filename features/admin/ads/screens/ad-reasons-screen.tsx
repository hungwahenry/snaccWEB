"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { AdReasonDialog } from "../components/ad-reason-dialog"
import { AdReasonsTable } from "../components/ad-reasons-table"
import { useAdReasonsScreen } from "../hooks/use-ad-reasons-screen"

export function AdReasonsScreen() {
  const { query, actions } = useAdReasonsScreen()

  return (
    <>
      <PageHeader
        title="Ad rejection reasons"
        description="Why a promotion can be turned down. The advertiser reads the wording, and the ones marked not allowed are listed to advertisers before they pay."
        action={
          <CanAct permission="ads.policy">
            <AdReasonDialog
              trigger={
                <Button size="sm">
                  <Plus />
                  Add reason
                </Button>
              }
              onSubmit={(draft) => actions.save(draft)}
            />
          </CanAct>
        }
      />
      <AdReasonsTable
        query={query}
        onSave={actions.save}
        onSetRetired={actions.setRetired}
      />
    </>
  )
}
