"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import {
  HiddenHeader,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { QueryTable } from "@/features/admin/shell/components/query-table"
import { formatMoney } from "@/lib/money"
import type { EarnAmount } from "../types"
import { AmountDialog } from "./amount-dialog"

export function EarnAmountsTable({
  code,
  query,
  onSave,
}: {
  code: string
  query: UseQueryResult<EarnAmount[]>
  onSave: (key: string, amount: number | null) => Promise<unknown>
}) {
  const columns = useMemo<Column<EarnAmount>[]>(
    () => [
      {
        id: "act",
        header: "Act",
        cell: (earning) => (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{earning.label}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {earning.key}
            </span>
          </div>
        ),
      },
      {
        id: "amount",
        header: "Pays the author",
        align: "end",
        className: "tabular-nums",
        cell: (earning) =>
          earning.amount ? (
            formatMoney(earning.amount)
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        id: "actions",
        header: <HiddenHeader>Actions</HiddenHeader>,
        align: "end",
        cell: (earning) => (
          <CanAct permission="currencies.write">
            <AmountDialog
              title={`What ${earning.label} pays`}
              description="Paid to the author out of their campus fund each time it lands on their snacc. Empty earns nothing in this currency."
              amount={earning.amount}
              currency={code}
              optional
              trigger={
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              }
              onSubmit={(amount) => onSave(earning.key, amount)}
            />
          </CanAct>
        ),
      },
    ],
    [code, onSave]
  )

  return (
    <QueryTable
      query={query}
      what="earnings"
      title="What each act earns"
      description="Acts Snacc records itself. Each change prices new engagement only, never anyone's balance."
      columns={columns}
      rowKey={(earning) => earning.key}
      empty="No acts can earn."
    />
  )
}
