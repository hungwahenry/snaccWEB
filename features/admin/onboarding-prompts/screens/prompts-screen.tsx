"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { PromptDialog } from "../components/prompt-dialog"
import { PromptsTable } from "../components/prompts-table"
import { usePromptsScreen } from "../hooks/use-prompts-screen"

export function PromptsScreen() {
  const { query, actions } = usePromptsScreen()

  return (
    <>
      <PageHeader
        title="Onboarding prompts"
        description="Starter chips shown on the first-post screen."
        action={
          <CanAct permission="onboarding_prompts.write">
            <PromptDialog
              trigger={
                <Button size="sm">
                  <Plus />
                  Add prompt
                </Button>
              }
              onSubmit={(draft) => actions.save(draft)}
            />
          </CanAct>
        }
      />
      <PromptsTable
        query={query}
        onSave={actions.save}
        onDelete={actions.remove}
      />
    </>
  )
}
