"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { PageHeader } from "@/features/admin/shell/components/page-header"
import { TierDialog } from "../components/tier-dialog"
import { TiersTable } from "../components/tiers-table"
import { useScoreTiersScreen } from "../hooks/use-score-tiers-screen"
import { hasFloor } from "../utils/tier"

export function ScoreTiersScreen() {
  const { query, actions } = useScoreTiersScreen()
  const noFloor = query.data !== undefined && !hasFloor(query.data)

  return (
    <>
      <PageHeader
        title="Snacc Score tiers"
        description="The ladder: each rung starts at a score. Names, thresholds, icons and colours are all edited here, and everyone is moved onto the right rung when you save."
        action={
          <CanAct permission="score_tiers.write">
            <TierDialog
              trigger={
                <Button size="sm">
                  <Plus />
                  Add tier
                </Button>
              }
              onSubmit={(draft) => actions.save(draft)}
            />
          </CanAct>
        }
      />
      {noFloor && query.data.length > 0 ? (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-destructive/40 px-4 py-3 text-sm text-destructive"
        >
          No tier starts at 0, so anyone below the lowest rung has no tier.
        </p>
      ) : null}
      <TiersTable
        query={query}
        onSave={actions.save}
        onDelete={actions.remove}
      />
    </>
  )
}
