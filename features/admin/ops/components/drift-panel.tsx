"use client"

import type { UseQueryResult } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CanAct } from "@/features/admin/auth/containers/can-act"
import { ConfirmAction } from "@/features/admin/shell/components/confirm-action"
import {
  DataTable,
  type Column,
} from "@/features/admin/shell/components/data-table"
import { Section } from "@/features/admin/shell/components/detail"
import { QueryView } from "@/features/admin/shell/components/query-view"
import { TableFrame } from "@/features/admin/shell/components/table-frame"
import { formatNumber } from "@/lib/format"
import type { DriftRow, OpsDrift } from "../types"
import { driftRows } from "../utils/ops"

const COLUMNS: Column<DriftRow>[] = [
  {
    id: "counter",
    header: "Number",
    cell: (row) => (
      <span className="flex flex-wrap items-center gap-2">
        {row.label}
        {row.repairable ? null : (
          <Badge variant="outline">Repair does not touch this</Badge>
        )}
      </span>
    ),
  },
  {
    id: "off",
    header: "Rows off",
    align: "end",
    className: "font-medium text-destructive tabular-nums",
    cell: (row) => formatNumber(row.off),
  },
]

export function DriftPanel({
  query,
  onRepair,
}: {
  query: UseQueryResult<OpsDrift>
  onRepair: () => Promise<unknown>
}) {
  return (
    <Section
      title="Drift"
      description="A check at 04:00 WAT each night reads these and raises an alarm if any is above zero. Nothing repairs them on a schedule, because a number that heals itself overnight hides the bug that moved it. Repair by hand once you know what did."
      action={
        <CanAct permission="ops.run">
          <ConfirmAction
            trigger={
              <Button variant="outline" size="sm">
                Repair now
              </Button>
            }
            title="Rewrite these numbers from their source?"
            description="Every counter, score and wallet balance is worked out again and overwritten. Do this once you know what moved them, because repairing first throws away the evidence."
            confirmLabel="Repair now"
            onConfirm={() => onRepair()}
          />
        </CanAct>
      }
    >
      <QueryView query={query} what="the drift check">
        {(drift) => {
          const rows = driftRows(drift)

          return rows.length === 0 ? (
            <p className="flex flex-wrap items-center gap-2 rounded-lg border px-4 py-3 text-sm">
              <Badge variant="secondary">In step</Badge>
              <span className="text-muted-foreground">
                Every counter, score and balance matches its source.
              </span>
            </p>
          ) : (
            <TableFrame>
              <DataTable
                columns={COLUMNS}
                rows={rows}
                rowKey={(row) => row.key}
                empty=""
              />
            </TableFrame>
          )
        }}
      </QueryView>
    </Section>
  )
}
