"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { NamedIcon } from "@/lib/icons/named-icon"
import type { AdminTier, TierDraft } from "../types"
import { thresholdLabel } from "../utils/tier"
import { TierDialog } from "./tier-dialog"

export function TiersTable({
  query,
  onSave,
  onDelete,
}: {
  query: UseQueryResult<AdminTier[]>
  onSave: (draft: TierDraft, id: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminTier>[]>(
    () => [
      {
        id: "tier",
        header: "Tier",
        cell: (tier) => (
          <span className="inline-flex items-center gap-2 font-medium">
            <NamedIcon
              name={tier.icon}
              color={tier.color}
              className="size-4 shrink-0"
            />
            {tier.label || tier.key}
            {tier.label ? (
              <span className="font-mono text-xs font-normal text-muted-foreground">
                {tier.key}
              </span>
            ) : null}
          </span>
        ),
      },
      {
        id: "from",
        header: "Starts at",
        cell: (tier) => thresholdLabel(tier.min_score),
      },
      {
        id: "position",
        header: "Position",
        align: "end",
        className: "tabular-nums",
        cell: (tier) => tier.position,
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (tier) => (
          <div className="flex justify-end gap-2">
            <CanAct permission="score_tiers.write">
              <TierDialog
                tier={tier}
                trigger={
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                }
                onSubmit={(draft) => onSave(draft, tier.id)}
              />
            </CanAct>
            <CanAct permission="score_tiers.delete">
              <ConfirmAction
                trigger={
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                }
                title={`Delete ${tier.label || tier.key}?`}
                description="Everyone on the ladder is moved to their new rung straight away, so people can change tier the moment you confirm."
                confirmLabel="Delete tier"
                onConfirm={() => onDelete(tier.id)}
              />
            </CanAct>
          </div>
        ),
      },
    ],
    [onSave, onDelete]
  )

  return (
    <QueryTable
      query={query}
      what="tiers"
      columns={columns}
      rowKey={(tier) => tier.id}
      empty="No tiers yet. Add one that starts at 0 so every account has a tier."
    />
  )
}
