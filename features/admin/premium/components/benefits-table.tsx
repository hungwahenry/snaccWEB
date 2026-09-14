"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ActionSwitch } from "@/features/admin/shell/components/action-switch"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import type { AdminBenefit, UpdateBenefitInput } from "../types"
import { BenefitDialog } from "./benefit-dialog"

export function BenefitsTable({
  query,
  onSave,
  onSetShown,
}: {
  query: UseQueryResult<AdminBenefit[]>
  onSave: (id: string, input: UpdateBenefitInput) => Promise<unknown>
  onSetShown: (id: string, enabled: boolean) => Promise<unknown>
}) {
  const columns = useMemo<Column<AdminBenefit>[]>(
    () => [
      {
        id: "heading",
        header: "Heading",
        className: "w-40 font-medium",
        cell: (benefit) => benefit.label,
      },
      {
        id: "line",
        header: "Line",
        className: "max-w-md whitespace-normal text-muted-foreground",
        cell: (benefit) => benefit.description,
      },
      {
        id: "icon",
        header: "Icon",
        className: "w-32 text-muted-foreground",
        cell: (benefit) => benefit.icon,
      },
      {
        id: "shown",
        header: "Shown",
        align: "end",
        className: "w-24",
        cell: (benefit) => (
          <CanAct permission="premium.write">
            <ActionSwitch
              checked={benefit.enabled}
              label={`Show ${benefit.label} on the paywall`}
              onChange={(enabled) => onSetShown(benefit.id, enabled)}
            />
          </CanAct>
        ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (benefit) => (
          <CanAct permission="premium.write">
            <BenefitDialog
              benefit={benefit}
              trigger={
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              }
              onSubmit={(input) => onSave(benefit.id, input)}
            />
          </CanAct>
        ),
      },
    ],
    [onSave, onSetShown]
  )

  return (
    <QueryTable
      query={query}
      what="the paywall"
      title="What the paywall says"
      description="The wording here is what the app shows on the Premium screen, in this order. Changing it takes effect without a release."
      columns={columns}
      rowKey={(benefit) => benefit.id}
      empty="No paywall lines yet."
    />
  )
}
