"use client"

import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionButton } from "@/features/admin/shell/components/action-button"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import type { CampusImport } from "../types"
import { applyCount, applySummary } from "../utils/campus-imports"

export function ImportActions({
  run,
  onApply,
  onRecheck,
  onDiscard,
}: {
  run: CampusImport
  onApply: () => Promise<unknown>
  onRecheck: () => Promise<unknown>
  onDiscard: () => Promise<unknown>
}) {
  return (
    <>
      {run.status === "ready" ? (
        <CanAct permission="universities.import">
          <ConfirmAction
            trigger={<Button size="sm">Apply</Button>}
            tone="default"
            title="Apply this import?"
            description={applySummary(run.rows)}
            confirmLabel="Apply"
            disabled={applyCount(run.rows) === 0}
            onConfirm={onApply}
          />
        </CanAct>
      ) : null}
      {run.status === "failed" ? (
        <CanAct permission="universities.import">
          <ActionButton size="sm" onClick={onRecheck}>
            Check again
          </ActionButton>
        </CanAct>
      ) : null}
      {run.status === "ready" || run.status === "failed" ? (
        <CanAct permission="universities.import">
          <ConfirmAction
            trigger={
              <Button variant="ghost" size="sm">
                Discard
              </Button>
            }
            title="Discard this import?"
            description="Its rows and your decisions on them are thrown away. No campus changes."
            confirmLabel="Discard"
            onConfirm={onDiscard}
          />
        </CanAct>
      ) : null}
    </>
  )
}
