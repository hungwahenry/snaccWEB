"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { SuspensionReasonDialog } from "../components/suspension-reason-dialog"
import { SuspensionReasonsTable } from "../components/suspension-reasons-table"
import { useSuspensionReasonsScreen } from "../hooks/use-suspension-reasons-screen"

export function SuspensionReasonsScreen() {
  const { query, actions } = useSuspensionReasonsScreen()

  return (
    <>
      <PageHeader
        title="Suspension reasons"
        description="The wording a suspended person reads on the only screen they can still reach."
        action={
          <CanAct permission="suspension_reasons.write">
            <SuspensionReasonDialog
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
      <SuspensionReasonsTable
        query={query}
        onSave={actions.save}
        onSetRetired={actions.setRetired}
      />
    </>
  )
}
